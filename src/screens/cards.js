// ============================================
// Cards Screen — Detailed Wallet View (Enhanced)
// ============================================

import { getProfile } from '../api.js';

export function renderCards(app, navigate) {
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'cards-screen';

  screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" id="cards-back">←</button>
      <span class="header-title">My Cards</span>
      <div class="header-action"></div>
    </div>
    <div id="cards-content" class="screen-padding" style="padding-top: 20px; padding-bottom: 100px;">
      <div style="text-align: center; padding: 60px 24px; color: var(--text-tertiary);">Loading your wallet...</div>
    </div>
    <div class="bottom-nav">
      <button class="nav-item active" id="nav-home"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></button>
      <button class="nav-item" id="nav-pay"><span class="nav-icon">🧠</span><span class="nav-label">Recommend</span></button>
      <button class="nav-item" id="nav-history"><span class="nav-icon">📊</span><span class="nav-label">History</span></button>
      <button class="nav-item" id="nav-rewards"><span class="nav-icon">🎯</span><span class="nav-label">Rewards</span></button>
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  document.getElementById('cards-back')?.addEventListener('click', () => navigate('home'));
  document.getElementById('nav-home')?.addEventListener('click', () => navigate('home'));
  document.getElementById('nav-pay')?.addEventListener('click', () => navigate('merchants'));
  document.getElementById('nav-history')?.addEventListener('click', () => navigate('history'));

  loadCards();
}

function getTierLabel(tier) {
  const labels = {
    'entry': 'Entry',
    'standard': 'Standard',
    'premium': 'Premium',
    'super_premium': 'Super Premium',
  };
  return labels[tier] || (tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'Standard');
}

function getTierColor(tier) {
  const colors = {
    'entry': '#8b8b8b',
    'standard': '#64b5f6',
    'premium': '#ba68c8',
    'super_premium': '#ffd700',
  };
  return colors[tier] || '#64b5f6';
}

function getRewardIcon(type) {
  const icons = {
    'cashback': '💰',
    'points': '⭐',
    'discount': '🏷️',
    'surcharge_waiver': '⛽',
    'voucher': '🎟️',
  };
  return icons[type] || '•';
}

function renderRewardItem(key, details) {
  if (!details) return '';
  const icon = getRewardIcon(details.type);
  const rateStr = details.rate > 0
    ? `<strong style="color: var(--accent-green, #4caf50); font-size: 0.85rem;">${details.type === 'points' ? details.rate + 'X' : details.rate + '%'}</strong> `
    : '';
  const capStr = details.cap
    ? `<span style="color: var(--text-tertiary); font-size: 0.65rem;"> • Max ₹${details.cap.toLocaleString('en-IN')}${details.capUnit === 'per_month' ? '/mo' : '/cycle'}</span>`
    : '';
  const noteStr = details.note
    ? `<div style="font-size: 0.62rem; color: var(--text-tertiary); margin-top: 2px; font-style: italic;">${details.note}</div>`
    : '';
  return `
    <div style="display: flex; gap: 8px; align-items: flex-start; padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
      <span style="font-size: 0.9rem; margin-top: 1px;">${icon}</span>
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
          ${rateStr}${details.label || key.replace(/_/g, ' ')}${capStr}
        </div>
        ${noteStr}
      </div>
    </div>
  `;
}

async function loadCards() {
  const content = document.getElementById('cards-content');
  if (!content) return;

  try {
    const data = await getProfile();
    const cards = data.cards || [];

    if (cards.length === 0) {
      content.innerHTML = `
        <div style="text-align: center; padding: 48px 20px;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">💳</div>
          <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 4px;">No cards found</div>
          <div style="font-size: 0.75rem; color: var(--text-tertiary);">Your wallet is empty.</div>
        </div>
      `;
      return;
    }

    // Build HTML per card
    const cardHTMLs = cards.map((c, i) => {
      const tier = c.tier || 'standard';
      const tierLabel = getTierLabel(tier);
      const tierColor = getTierColor(tier);
      const annualFee = c.annual_fee || 0;
      const rewards = c.rewards || {};
      const bestFor = c.best_for || [];

      // Sort rewards: exclude 0-rate if possible, sort higher rate first
      const rewardEntries = Object.entries(rewards)
        .filter(([, d]) => d && d.rate > 0)
        .sort(([, a], [, b]) => b.rate - a.rate);

      const rewardsHTML = rewardEntries.length > 0
        ? rewardEntries.map(([key, details]) => renderRewardItem(key, details)).join('')
        : '<div style="font-size:0.75rem; color: var(--text-tertiary); padding: 8px 0;">No reward data available</div>';

      const bestForHTML = bestFor.length > 0
        ? `<div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 14px;">
            ${bestFor.map(bf => `
              <span style="background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.25); color: #b39ddb; padding: 3px 8px; border-radius: 12px; font-size: 0.63rem; text-transform: capitalize; letter-spacing: 0.02em;">
                ${bf.replace(/_/g, ' ')}
              </span>
            `).join('')}
          </div>`
        : '';

      const cardGradient = `card-gradient-${(i % 5) + 1}`;

      return `
        <div class="stagger-${(i % 5) + 1}">
          <!-- Visual Card -->
          <div class="credit-card ${cardGradient}" style="margin: 0 0 12px; width: 100%; height: 168px; box-sizing: border-box;">
            <div class="card-bank">${c.bank || 'Bank'}</div>
            <div class="card-number" style="margin-top: 32px;">•••• •••• •••• ${c.last4}</div>
            <div class="card-bottom">
              <div><div class="card-name">${data.user.name || 'User'}</div></div>
              <div class="card-network">${c.network || 'Visa'}</div>
            </div>
          </div>

          <!-- Detail Panel -->
          <div style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.05); padding: 16px;">
            
            <!-- Card title row -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
              <div>
                <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px;">${c.full_name || c.nickname}</div>
                <span style="font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: ${tierColor}; background: ${tierColor}20; padding: 2px 7px; border-radius: 4px; border: 1px solid ${tierColor}40;">
                  ${tierLabel}
                </span>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-bottom: 2px;">Annual Fee</div>
                <div style="font-weight: 700; font-family: var(--font-display); font-size: 1rem; color: ${annualFee === 0 ? '#4caf50' : 'var(--text-primary)'};">
                  ${annualFee === 0 ? 'FREE' : '₹' + annualFee.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <!-- Rewards section -->
            <div style="border-top: 1px solid rgba(255,255,255,0.07); padding-top: 12px;">
              <div style="font-size: 0.68rem; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">Reward Structure</div>
              ${rewardsHTML}
            </div>

            ${bestForHTML}
          </div>
        </div>
      `;
    });

    content.innerHTML = `
      <div style="margin-bottom: 20px;">
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px;">Active cards in wallet</div>
        <div style="font-family: var(--font-display); font-size: 2rem; font-weight: 800;">${cards.length}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${cardHTMLs.join('')}
      </div>
    `;

  } catch (err) {
    content.innerHTML = `
      <div style="text-align: center; padding: 60px 24px;">
        <div style="font-size: 2rem; margin-bottom: 12px;">⚠️</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Could not load wallet</div>
        <div style="font-size: 0.72rem; color: var(--text-tertiary);">${err.message}</div>
      </div>
    `;
  }
}
