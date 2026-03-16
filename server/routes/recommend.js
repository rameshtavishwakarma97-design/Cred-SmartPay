// ============================================
// Server-Side Recommendation Engine (Enhanced)
// ============================================

import { Router } from 'express';
import { authMiddleware } from './auth.js';
import { getDb } from '../db.js';

const router = Router();

// Point valuation table (₹ per reward point, per bank)
const POINT_VALUES = {
  'HDFC Bank': 0.50,
  'SBI Card': 0.25,
  'ICICI Bank': 0.25,
  'Axis Bank': 0.20,
  'Amex': 0.50,
  'RBL Bank': 0.25,
  'YES Bank': 1.00,
  'HSBC': 0.25,
  'IDFC FIRST': 0.25,
  'IndusInd Bank': 0.25,
  'default': 0.25
};

// POST /api/recommend — Smart recommendation with cap tracking + offers
router.post('/', authMiddleware, (req, res) => {
  const { merchant_id, merchant_name, category, amount, cred_cashback } = req.body;

  if (!category || !amount) {
    return res.status(400).json({ error: 'category and amount required' });
  }

  const db = getDb();
  const txnAmount = parseFloat(amount);

  // 1. Get user's cards
  const userCardLinks = db.prepare('SELECT * FROM user_cards WHERE user_id = ?').all(req.userId);
  const allCards = db.prepare('SELECT * FROM cards').all();

  const userCardDetails = userCardLinks.map(uc => {
    const cardData = allCards.find(c => c.id === uc.card_id);
    if (!cardData) return null;
    return {
      ...uc,
      cardData: {
        ...cardData,
        rewards: JSON.parse(cardData.rewards),
        best_for: JSON.parse(cardData.best_for || '[]')
      }
    };
  }).filter(Boolean);

  // 2. Get this month's cap usage per card
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const capUsage = db.prepare(`
    SELECT card_id, category, SUM(savings) as used_savings, COUNT(*) as txn_count
    FROM transactions
    WHERE user_id = ? AND created_at >= ?
    GROUP BY card_id, category
  `).all(req.userId, monthStart.toISOString());

  // 3. Get active offers for this transaction
  const activeOffers = db.prepare(`
    SELECT * FROM offers
    WHERE is_active = 1
      AND (end_date IS NULL OR end_date >= datetime('now'))
      AND (start_date IS NULL OR start_date <= datetime('now'))
      AND (min_amount IS NULL OR min_amount <= ?)
      AND (
        (category = ? OR category IS NULL)
        AND (merchant_id = ? OR merchant_id IS NULL)
      )
  `).all(txnAmount, category, merchant_id || '');

  // Filter offers by user usage limits
  const applicableOffers = activeOffers.filter(offer => {
    if (!offer.max_uses_per_user) return true;
    const usage = db.prepare('SELECT COUNT(*) as c FROM offer_usage WHERE user_id = ? AND offer_id = ?').get(req.userId, offer.id);
    return usage.c < offer.max_uses_per_user;
  });

  // 4. Calculate savings for each user card
  const userResults = userCardDetails.map(uc => {
    const card = uc.cardData;
    const rewards = card.rewards;
    const rewardRule = rewards[category] || rewards.default;

    if (!rewardRule) {
      return { card: uc, savings: 0, label: 'No applicable reward', totalSavings: 0, reasoning: 'No reward rule', breakdown: [] };
    }

    const breakdown = [];
    let cardSavings = 0;

    // Base reward calculation
    const baseSavings = calculateBaseSavings(rewardRule, txnAmount, card.bank);

    // Check monthly cap
    const existingCapUsage = capUsage.find(cu => cu.card_id === uc.card_id && cu.category === category);
    let cappedSavings = baseSavings.savings;

    if (rewardRule.cap) {
      const alreadyUsed = existingCapUsage ? existingCapUsage.used_savings : 0;
      const remaining = Math.max(0, rewardRule.cap - alreadyUsed);
      if (cappedSavings > remaining) {
        cappedSavings = remaining;
        breakdown.push({
          type: 'cap_warning',
          text: `Monthly cap: ₹${rewardRule.cap} (₹${Math.round(alreadyUsed)} already used, ₹${Math.round(remaining)} remaining)`,
          value: -1 * (baseSavings.savings - remaining)
        });
      }
    }

    cardSavings = cappedSavings;
    breakdown.push({ type: 'base_reward', text: baseSavings.label, value: cappedSavings });

    // Applicable offers for this specific card
    const cardOffers = applicableOffers.filter(o => !o.card_id || o.card_id === uc.card_id);

    // Find the single best offer (don't stack them)
    let bestOffer = null;
    let bestOfferSavings = 0;
    
    for (const offer of cardOffers) {
      const offerSavings = calculateOfferSavings(offer, txnAmount);
      if (offerSavings > bestOfferSavings) {
        bestOffer = offer;
        bestOfferSavings = offerSavings;
      }
    }

    // Calculate potential Dineout discount
    let dineoutSavings = 0;
    if (rewardRule.dineoutDiscount && category === 'dining') {
      dineoutSavings = (txnAmount * rewardRule.dineoutDiscount) / 100;
      
      // If Dineout is better than the best offer, apply Dineout instead
      if (dineoutSavings > bestOfferSavings) {
        cardSavings += dineoutSavings;
        breakdown.push({ type: 'dineout', text: `${rewardRule.dineoutDiscount}% Dineout discount`, value: dineoutSavings });
        bestOffer = null; // Do not apply offer
      } else if (dineoutSavings > 0 && bestOfferSavings === 0) {
        cardSavings += dineoutSavings;
        breakdown.push({ type: 'dineout', text: `${rewardRule.dineoutDiscount}% Dineout discount`, value: dineoutSavings });
      }
    }
    
    // Apply the best offer if it beat Dineout or if there was no Dineout
    if (bestOffer && bestOfferSavings > 0) {
      cardSavings += bestOfferSavings;
      breakdown.push({
        type: 'offer',
        text: bestOffer.title,
        value: bestOfferSavings,
        offer_id: bestOffer.id,
        is_expiring: bestOffer.end_date && new Date(bestOffer.end_date) - new Date() < 3 * 24 * 60 * 60 * 1000
      });
    }

    // CRED cashback
    const credSaving = cred_cashback ? (txnAmount * cred_cashback) / 100 : 0;
    if (credSaving > 0) {
      cardSavings += credSaving;
      breakdown.push({ type: 'cred_cashback', text: `CRED cashback ${cred_cashback}%`, value: credSaving });
    }

    return {
      card: {
        id: uc.card_id,
        name: card.name,
        bank: card.bank,
        network: card.network,
        last4: uc.last4,
        nickname: uc.nickname,
        tier: card.tier,
        color: getCardColor(card.bank)
      },
      savings: Math.round(cappedSavings * 100) / 100,
      credCashback: Math.round(credSaving),
      totalSavings: Math.round(cardSavings * 100) / 100,
      label: rewardRule.label,
      breakdown,
      reasoning: buildReasoning(breakdown)
    };
  });

  // Sort by total savings
  userResults.sort((a, b) => b.totalSavings - a.totalSavings);

  // 5. Find industry best cards
  const industryCards = allCards
    .filter(c => {
      const bestFor = JSON.parse(c.best_for || '[]');
      return bestFor.includes(category) && !userCardLinks.find(uc => uc.card_id === c.id);
    })
    .map(c => {
      const rewards = JSON.parse(c.rewards);
      const rule = rewards[category] || rewards.default;
      if (!rule) return null;

      const savings = calculateBaseSavings(rule, txnAmount, c.bank);
      return {
        card: { id: c.id, name: c.name, bank: c.bank, network: c.network, tier: c.tier, annualFee: c.annual_fee },
        savings: savings.savings,
        label: rule.label,
        reasoning: `${c.name} offers ${savings.label}. Annual fee: ₹${c.annual_fee}.`
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.savings - a.savings);

  const bestIndustry = industryCards[0] || null;
  const bestUser = userResults[0] || null;
  const industryBeatUser = bestIndustry && bestUser && bestIndustry.savings > bestUser.totalSavings;

  res.json({
    userCards: userResults,
    bestUserCard: bestUser,
    industryBest: bestIndustry,
    industryTopCards: industryCards.slice(0, 3),
    industryBeatUser,
    activeOffers: applicableOffers.length,
    category,
    amount: txnAmount
  });
});

function calculateBaseSavings(rule, amount, bank) {
  let savings = 0;
  let label = rule.label || '';

  switch (rule.type) {
    case 'cashback':
      if (rule.isPercentOff) {
        // Optimistic / Best-case scenario representation for "up to X%"
        savings = (amount * Math.min(rule.rate, 30)) / 100;
        if (rule.cap && savings > rule.cap) savings = rule.cap;
        label = `Up to ${rule.rate}% cashback ≈ ₹${Math.round(savings)}`;
      } else {
        savings = (amount * rule.rate) / 100;
        if (rule.cap && savings > rule.cap) savings = rule.cap;
        label = `${rule.rate}% cashback = ₹${Math.round(savings)}`;
      }
      break;

    case 'points': {
      const pointValue = rule.pointValue || POINT_VALUES[bank] || POINT_VALUES.default;
      const baseUnit = rule.rate >= 5 ? 100 : 150;
      const basePoints = Math.floor(amount / baseUnit);
      const multipliedPoints = basePoints * rule.rate;
      savings = multipliedPoints * pointValue;
      label = `${rule.rate}X reward points ≈ ₹${Math.round(savings)} value`;
      break;
    }

    case 'surcharge_waiver':
      savings = (amount * rule.rate) / 100;
      if (rule.cap && savings > rule.cap) savings = rule.cap;
      label = `${rule.rate}% surcharge waiver = ₹${Math.round(savings)}`;
      break;

    default:
      savings = 0;
  }

  return { savings: Math.round(savings * 100) / 100, label };
}

function calculateOfferSavings(offer, amount) {
  let savings = 0;
  if (offer.discount_type === 'percentage' || offer.discount_type === 'cashback_percentage') {
    savings = (amount * offer.discount_value) / 100;
    if (offer.max_discount && savings > offer.max_discount) savings = offer.max_discount;
  } else if (offer.discount_type === 'flat') {
    savings = offer.discount_value;
  }
  return Math.round(savings * 100) / 100;
}

function buildReasoning(breakdown) {
  return breakdown
    .filter(b => b.type !== 'cap_warning')
    .map(b => b.text)
    .join(' • ');
}

function getCardColor(bank) {
  const colors = {
    'HDFC Bank': '#0f3460',
    'SBI Card': '#11998e',
    'ICICI Bank': '#333333',
    'Axis Bank': '#4a0000',
    'Amex': '#1f1f2e',
    'YES Bank': '#0056a8',
    'HSBC': '#db0011',
    'RBL Bank': '#4b286d',
    'IDFC FIRST': '#9c1e24',
    'IndusInd Bank': '#1b4e8f'
  };
  return colors[bank] || '#333333';
}

export default router;
