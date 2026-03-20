// ============================================
// Smart Card Recommendation Engine
// ============================================

import { userCards, industryCards } from '../data/cards.js';

/**
 * Calculate effective savings for a card on a given transaction
 */
function calculateSavings(card, category, amount) {
  const rewardRule = card.rewards[category] || card.rewards.default || card.rewards['default'];
  if (!rewardRule) return { fixedSavings: 0, estimatedSavings: 0, totalSavings: 0, label: 'No applicable reward', type: 'none', rate: 0 };

  let fixedSavings = 0;
  let estimatedSavings = 0;
  let label = rewardRule.label;
  let type = rewardRule.type;
  let rate = rewardRule.rate;

  if (amount < (rewardRule.minTxn || 0)) {
    return { fixedSavings: 0, estimatedSavings: 0, totalSavings: 0, label: `Min transaction ₹${rewardRule.minTxn} required`, type: 'ineligible', rate: 0 };
  }

  let baseSavings = 0;
  switch (rewardRule.type) {
    case 'cashback':
      baseSavings = (amount * rewardRule.rate) / 100;
      if (rewardRule.cap && baseSavings > rewardRule.cap) {
        baseSavings = rewardRule.cap;
      }
      fixedSavings = baseSavings;
      break;

    case 'points':
      const pointValue = rewardRule.pointValue || 0.5;
      const basePoints = Math.floor(amount / (rewardRule.spendBase || 150));
      const multipliedPoints = basePoints * rewardRule.rate;
      baseSavings = multipliedPoints * pointValue;
      fixedSavings = baseSavings;
      break;

    case 'surcharge_waiver':
      baseSavings = (amount * rewardRule.rate) / 100;
      if (rewardRule.cap && baseSavings > rewardRule.cap) {
        baseSavings = rewardRule.cap;
      }
      fixedSavings = baseSavings;
      break;

    default:
      fixedSavings = 0;
  }

  // Add Dineout discount as ESTIMATED (since it depends on merchant integration/eligibility)
  if (rewardRule.dineoutDiscount && category === 'dining') {
    estimatedSavings = (amount * rewardRule.dineoutDiscount) / 100;
  }

  return {
    fixedSavings: Math.round(fixedSavings * 100) / 100,
    estimatedSavings: Math.round(estimatedSavings * 100) / 100,
    totalSavings: Math.round((fixedSavings + estimatedSavings) * 100) / 100,
    label,
    type,
    rate,
    cap: rewardRule.cap,
    dineoutDiscount: rewardRule.dineoutDiscount
  };
}

/**
 * Calculate savings for an industry card
 */
function calculateIndustrySavings(card, category, amount) {
  const rewardRule = card.rewards[category] || card.rewards.default;
  if (!rewardRule) return { savings: 0, label: 'N/A', rate: 0 };

  let savings = 0;

  if (rewardRule.isPercentOff) {
    // Special case: percentage discount (like EazyDiner)
    savings = (amount * Math.min(rewardRule.rate, 30)) / 100; // Cap at reasonable 30%
  } else if (rewardRule.type === 'cashback') {
    savings = (amount * rewardRule.rate) / 100;
    if (rewardRule.cap && savings > rewardRule.cap) {
      savings = rewardRule.cap;
    }
    const pointsValue = POINT_VALUES[card.bank] || 0.25;
    const basePoints = Math.floor(amount / (rewardRule.spendBase || 100)); // Default to per ₹100
    savings = basePoints * rewardRule.rate * pointsValue;
  }

  // Symmetric Dineout logic: If category is dining and card rule has a discount
  if (rewardRule.dineoutDiscount && category === 'dining') {
    const dineoutSaving = (amount * rewardRule.dineoutDiscount) / 100;
    savings += dineoutSaving;
  }

  return {
    savings: Math.round(savings * 100) / 100,
    label: rewardRule.label,
    rate: rewardRule.rate,
    cap: rewardRule.cap,
    dineoutDiscount: rewardRule.dineoutDiscount
  };
}

/**
 * Main recommendation function
 * Returns ranked user cards + industry best suggestion
 */
export function getRecommendations(merchantCategory, amount, credCashback = 0) {
  // 1. Calculate savings for each user card
  const userResults = userCards.map(card => {
    const result = calculateSavings(card, merchantCategory, amount);
    const credSaving = (amount * credCashback) / 100;

    // CRED Cashback is FIXED (guaranteed by our app)
    const finalFixed = Math.round(result.fixedSavings + credSaving);
    const finalEstimated = result.estimatedSavings;
    const finalTotal = finalFixed + finalEstimated;

    return {
      card,
      ...result,
      fixedSavings: finalFixed,
      estimatedSavings: finalEstimated,
      totalSavings: finalTotal,
      credCashback: Math.round(credSaving),
      reasoning: buildReasoning(card, result, merchantCategory, amount)
    };
  });

  // Sort: First by total savings, but if close, favor higher fixed savings
  userResults.sort((a, b) => {
    if (Math.abs(b.totalSavings - a.totalSavings) < 1) {
      return b.fixedSavings - a.fixedSavings;
    }
    return b.totalSavings - a.totalSavings;
  });

  // 2. Find the best industry card for this category
  const industryResults = industryCards
    .filter(card => card.bestFor.includes(merchantCategory))
    .map(card => {
      // Small helper for industry split logic (symmetric to user cards)
      const rewardRule = card.rewards[merchantCategory] || card.rewards.default;
      let fixed = 0;
      let estimated = 0;
      
      if (rewardRule.type === 'cashback') {
        fixed = (amount * rewardRule.rate) / 100;
        if (rewardRule.cap && fixed > rewardRule.cap) fixed = rewardRule.cap;
      } else if (rewardRule.type === 'points') {
        const pv = POINT_VALUES[card.bank] || 0.25;
        fixed = Math.floor(amount / (rewardRule.spendBase || 100)) * rewardRule.rate * pv;
      }

      if (rewardRule.dineoutDiscount && merchantCategory === 'dining') {
        estimated = (amount * rewardRule.dineoutDiscount) / 100;
      }

      const credSaving = (amount * credCashback) / 100;
      const finalFixed = Math.round(fixed + credSaving);
      const finalTotal = finalFixed + estimated;

      return {
        card,
        fixedSavings: finalFixed,
        estimatedSavings: estimated,
        totalSavings: finalTotal,
        label: rewardRule.label,
        reasoning: `${rewardRule.label} ${estimated > 0 ? `+ ${rewardRule.dineoutDiscount}% Dineout` : ''}`
      };
    })
    .sort((a, b) => b.totalSavings - a.totalSavings);

  const bestIndustry = industryResults[0] || null;

  // 3. Determine if industry card beats user's best
  const userBest = userResults[0];
  const industryBeatUser = bestIndustry && bestIndustry.totalSavings > userBest.totalSavings;

  return {
    userCards: userResults,
    bestUserCard: userBest,
    industryBest: bestIndustry,
    industryBeatUser,
    maxSavings: userBest.totalSavings,
    category: merchantCategory,
    amount
  };
}

/**
 * Build human-readable reasoning
 */
function buildReasoning(card, result, category, amount) {
  const parts = [];

  if (result.type === 'cashback') {
    parts.push(`${result.rate}% cashback = ₹${result.savings}`);
  } else if (result.type === 'points') {
    parts.push(`${result.rate}X reward points ≈ ₹${result.savings} value`);
  } else if (result.type === 'surcharge_waiver') {
    parts.push(`${result.rate}% surcharge waiver = ₹${result.savings}`);
  } else if (result.type === 'ineligible') {
    parts.push(result.label);
  }

  if (result.cap) {
    parts.push(`Monthly cap: ₹${result.cap}`);
  }

  if (result.dineoutDiscount) {
    parts.push(`+${result.dineoutDiscount}% Dineout discount on eligible restaurants`);
  }

  return parts.join(' • ');
}

/**
 * Get a quick summary text for the best recommendation
 */
export function getQuickSummary(recommendations) {
  const best = recommendations.bestUserCard;
  if (!best || best.totalSavings === 0) {
    return 'No significant savings available for this transaction.';
  }
  return `Use your ${best.card.bank} ${best.card.name} to save ₹${best.totalSavings} on this transaction.`;
}
