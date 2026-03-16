// ============================================
// Smart Card Recommendation Engine
// ============================================

import { userCards, industryCards } from '../data/cards.js';

/**
 * Calculate effective savings for a card on a given transaction
 */
function calculateSavings(card, category, amount) {
  const rewardRule = card.rewards[category] || card.rewards.default || card.rewards['default'];
  if (!rewardRule) return { savings: 0, label: 'No applicable reward', type: 'none', rate: 0 };

  let savings = 0;
  let label = rewardRule.label;
  let type = rewardRule.type;
  let rate = rewardRule.rate;

  if (amount < (rewardRule.minTxn || 0)) {
    return { savings: 0, label: `Min transaction ₹${rewardRule.minTxn} required`, type: 'ineligible', rate: 0 };
  }

  switch (rewardRule.type) {
    case 'cashback':
      savings = (amount * rewardRule.rate) / 100;
      if (rewardRule.cap && savings > rewardRule.cap) {
        savings = rewardRule.cap;
      }
      break;

    case 'points':
      // Assume 1 reward point ≈ ₹0.50 value (industry avg for HDFC/SBI/ICICI)
      const pointValue = rewardRule.pointValue || 0.5;
      const basePoints = Math.floor(amount / 150); // typically 1 point per ₹150
      const multipliedPoints = basePoints * rewardRule.rate;
      savings = multipliedPoints * pointValue;
      break;

    case 'surcharge_waiver':
      // Fuel surcharge saving
      savings = (amount * rewardRule.rate) / 100;
      if (rewardRule.cap && savings > rewardRule.cap) {
        savings = rewardRule.cap;
      }
      break;

    default:
      savings = 0;
  }

  // Add Dineout discount if applicable
  if (rewardRule.dineoutDiscount && category === 'dining') {
    const dineoutSaving = (amount * rewardRule.dineoutDiscount) / 100;
    savings += dineoutSaving;
    label += ` + ${rewardRule.dineoutDiscount}% Dineout`;
  }

  return {
    savings: Math.round(savings * 100) / 100,
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
  } else if (rewardRule.type === 'points') {
    const pointValue = 0.5;
    const basePoints = Math.floor(amount / 100);
    savings = basePoints * rewardRule.rate * pointValue;
  }

  return {
    savings: Math.round(savings * 100) / 100,
    label: rewardRule.label,
    rate: rewardRule.rate,
    cap: rewardRule.cap
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

    return {
      card,
      ...result,
      credCashback: Math.round(credSaving),
      totalSavings: Math.round((result.savings + credSaving) * 100) / 100,
      reasoning: buildReasoning(card, result, merchantCategory, amount)
    };
  });

  // Sort by total savings, descending
  userResults.sort((a, b) => b.totalSavings - a.totalSavings);

  // 2. Find the best industry card for this category
  const industryResults = industryCards
    .filter(card => card.bestFor.includes(merchantCategory))
    .map(card => {
      const result = calculateIndustrySavings(card, merchantCategory, amount);
      return {
        card,
        ...result,
        reasoning: `${card.name} offers ${result.label}. Annual fee: ₹${card.annualFee}.`
      };
    })
    .sort((a, b) => b.savings - a.savings);

  const bestIndustry = industryResults[0] || null;

  // 3. Determine if industry card beats user's best
  const userBest = userResults[0];
  const industryBeatUser = bestIndustry && bestIndustry.savings > userBest.totalSavings;

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
