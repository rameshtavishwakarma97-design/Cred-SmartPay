// ============================================
// Recommendation Screen — v2 with Backend API
// ============================================

import { merchants } from '../data/merchants.js';
import { getSmartRecommendation, logFunnelEvent, updateRecommendationSelection } from '../api.js';
import { getRecommendations } from '../engine/recommender.js';

export function renderRecommendation(app, navigate, params) {
  logFunnelEvent('recommendation_shown', { merchantId: params.merchantId, amount: params.amount });
  const merchant = merchants.find(m => m.id === params.merchantId);
  if (!merchant) { navigate('merchants'); return; }

  const amount = params.amount;

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'recommendation-screen';

  // Show loading state
  screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" id="reco-back">←</button>
      <span class="header-title">🧠 Smart Recommendation</span>
      <div class="header-action"></div>
    </div>
    <div style="text-align: center; padding: 80px 24px;">
      <div style="font-size: 2.5rem; margin-bottom: 16px;" class="shimmer">🧠</div>
      <div style="font-family: var(--font-display); font-weight: 700; font-size: 1rem; margin-bottom: 8px;">Finding best value for you</div>
      <div style="font-size: 0.75rem; color: var(--text-tertiary);">Checking offers, caps, and savings</div>
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  document.getElementById('reco-back')?.addEventListener('click', () => {
    navigate('transaction', { merchantId: merchant.id, amount: params.amount, transactionId: params.transactionId });
  });

  // Try server-side recommendation first, fallback to local
  loadRecommendation(screen, navigate, merchant, amount, params);
}

async function loadRecommendation(screen, navigate, merchant, amount, params) {
  let reco;
  let useServer = false;

  // Artificial delay for premium feel
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    reco = await getSmartRecommendation(
      merchant.id, merchant.name, merchant.category, amount, merchant.credCashback || 0
    );
    useServer = true;
  } catch (err) {
    // Fallback to local engine
    console.log('Server unavailable, using local engine:', err.message);
    const localReco = getRecommendations(merchant.category, amount, merchant.credCashback || 0);
    reco = {
      userCards: localReco.userCards,
      bestUserCard: localReco.bestUserCard,
      industryBest: localReco.industryBest,
      industryBeatUser: localReco.industryBeatUser,
      activeOffers: 0
    };
  }

  // Guard: if no cards found, show error state with working back button
  if (!reco || !reco.bestUserCard || !reco.userCards || reco.userCards.length === 0) {
    screen.innerHTML = `
      <div class="screen-header">
        <button class="back-btn" id="reco-back">←</button>
        <span class="header-title">🧠 Smart Recommendation</span>
        <div class="header-action"></div>
      </div>
      <div style="text-align: center; padding: 80px 24px;">
        <div style="font-size: 2.5rem; margin-bottom: 16px;">🃏</div>
        <div style="font-family: var(--font-display); font-weight: 700; font-size: 1rem; margin-bottom: 8px;">No cards available</div>
        <div style="font-size: 0.75rem; color: var(--text-tertiary);">Add cards to your wallet to get recommendations</div>
      </div>
    `;
    screen.querySelector('#reco-back')?.addEventListener('click', () => {
      navigate('transaction', { merchantId: merchant.id, amount: params.amount, transactionId: params.transactionId });
    });
    return;
  }

  const maxBar = Math.max(...reco.userCards.map(r => r.totalSavings), 1);

  screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" id="reco-back">←</button>
      <span class="header-title">🧠 Smart Recommendation</span>
      <div class="header-action"></div>
    </div>

    <!-- Transaction Context -->
    <div class="stagger-1" style="margin: 0 24px 16px; padding: 16px 20px; background: var(--bg-card); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.04);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: ${merchant.bgColor}22; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">${merchant.emoji}</div>
        <div>
          <div style="font-weight: 600; font-size: 0.9rem;">${merchant.name}</div>
          <div style="font-size: 0.7rem; color: var(--text-secondary);">${merchant.categoryLabel}</div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 800;">₹${amount.toLocaleString('en-IN')}</div>
        ${reco.activeOffers > 0 ? `<div style="font-size: 0.6rem; color: var(--orange-sunshine); font-weight: 600;">${reco.activeOffers} offers active</div>` : ''}
      </div>
    </div>

    ${useServer ? `<div style="margin: 0 24px 12px; display: inline-flex; align-items: center; gap: 4px; font-size: 0.6rem; color: var(--poli-purple);">⚡ Powered by Smart Pay Engine</div>` : ''}

    <!-- Best Card from Wallet -->
    <div class="section-header stagger-2">
      <span class="section-title">Best from Your Wallet</span>
      <span class="reco-badge badge-best" style="padding: 4px 10px; border-radius: 9999px; font-size: 0.6rem; font-weight: 700;">✦ RECOMMENDED</span>
    </div>

    <div class="screen-padding stagger-2">
      <div class="reco-card best">
        <div class="reco-header">
          <div class="mini-card">
            <div class="mini-card-icon" style="background: ${reco.bestUserCard.card.color || '#333'};">${(reco.bestUserCard.card.network || 'V').charAt(0)}</div>
            <div class="mini-card-info">
              <div class="mini-card-name">${reco.bestUserCard.card.bank || ''} ${reco.bestUserCard.card.name || ''}</div>
              <div class="mini-card-bank">•••• ${reco.bestUserCard.card.last4 || ''}</div>
            </div>
          </div>
        </div>
        <div class="reco-savings">₹${reco.bestUserCard.totalSavings} saved</div>
        <div style="display: flex; gap: 16px; margin: 8px 0 12px;">
          <div style="background: rgba(30,215,96,0.06); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid rgba(30,215,96,0.15); flex: 1;">
            <div style="font-size: 0.6rem; color: var(--park-green); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 2px;">Fixed (Guaranteed)</div>
            <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--park-green);">₹${reco.bestUserCard.fixedSavings}</div>
          </div>
          ${reco.bestUserCard.estimatedSavings > 0 ? `
            <div style="background: rgba(255,107,44,0.06); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid rgba(255,107,44,0.15); flex: 1;">
              <div style="font-size: 0.6rem; color: var(--orange-sunshine); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 2px;">Estimated (Upto)</div>
              <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--orange-sunshine);">₹${reco.bestUserCard.estimatedSavings}</div>
            </div>
          ` : ''}
        </div>
        <div class="reco-breakdown">
          ${renderBreakdown(reco.bestUserCard)}
        </div>
        <div class="savings-bar-container"><div class="savings-bar-bg"><div class="savings-bar-fill" style="width: 0%;" data-target="100"></div></div></div>
      </div>
    </div>

    <!-- All Cards Comparison -->
    <div class="section-header stagger-3">
      <span class="section-title">All Your Cards</span>
    </div>

    <div class="screen-padding stagger-3" style="display: flex; flex-direction: column; gap: 10px;">
      ${reco.userCards.slice(1).map((r, i) => `
        <div class="reco-card" data-card-id="${r.card.id}">
          <div class="reco-header">
            <div class="mini-card">
              <div class="mini-card-icon" style="background: ${r.card.color || '#333'};">${(r.card.network || 'V').charAt(0)}</div>
              <div class="mini-card-info">
                <div class="mini-card-name">${r.card.bank || ''} ${r.card.name || ''}</div>
                <div class="mini-card-bank">•••• ${r.card.last4 || ''}</div>
              </div>
            </div>
            <span class="reco-badge badge-rank">#${i + 2}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <div>
               <div style="display: flex; align-items: baseline; gap: 8px;">
                <span style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">₹${r.totalSavings}</span>
                <span style="font-size: 0.7rem; color: var(--text-tertiary);">saved</span>
                ${r.totalSavings < reco.bestUserCard.totalSavings ? `<span style="font-size: 0.65rem; color: var(--error);">₹${(reco.bestUserCard.totalSavings - r.totalSavings).toFixed(0)} less</span>` : ''}
              </div>
              <div style="display: flex; gap: 12px; margin-top: 6px;">
                <span style="font-size: 0.65rem; color: var(--park-green); background: rgba(30,215,96,0.08); padding: 2px 6px; border-radius: 4px; font-weight: 600;">Fixed: ₹${r.fixedSavings}</span>
                ${r.estimatedSavings > 0 ? `<span style="font-size: 0.65rem; color: var(--orange-sunshine); background: rgba(255,107,44,0.08); padding: 2px 6px; border-radius: 4px; font-weight: 600;">Est: ₹${r.estimatedSavings}</span>` : ''}
              </div>
            </div>
          </div>

          <div class="reco-breakdown" style="font-size: 0.7rem; margin-top: 10px;">${r.label || r.reasoning || ''}</div>
          ${renderCapWarning(r)}
          <div class="savings-bar-container" style="margin-top: 12px;"><div class="savings-bar-bg"><div class="savings-bar-fill" style="width: 0%;" data-target="${maxBar > 0 ? Math.round((r.totalSavings / maxBar) * 100) : 0}"></div></div></div>
        </div>
      `).join('')}
    </div>

    <!-- Industry Best -->
    ${reco.industryBest ? `
      <div class="divider stagger-4"></div>
      <div class="section-header stagger-4">
        <span class="section-title">Best in Industry</span>
        <span class="reco-badge badge-industry" style="padding: 4px 10px; border-radius: 9999px; font-size: 0.6rem; font-weight: 700;">🏆 UPGRADE TIP</span>
      </div>
      <div class="screen-padding stagger-4" style="padding-bottom: 24px;">
        <div class="reco-card industry">
          <div class="reco-header">
            <div>
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.95rem;">${reco.industryBest.card.name}</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px;">${reco.industryBest.card.bank} • ${reco.industryBest.card.network}</div>
            </div>
            ${reco.industryBeatUser ? `<span style="font-size: 0.6rem; font-weight: 700; color: var(--orange-sunshine); background: rgba(255,107,44,0.12); padding: 4px 10px; border-radius: 9999px;">BEATS YOUR BEST</span>` : ''}
          </div>
          <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--orange-sunshine); margin: 8px 0;">₹${reco.industryBest.totalSavings} saved</div>
          <div style="display: flex; gap: 12px; margin-bottom: 12px;">
            <span style="font-size: 0.65rem; color: var(--park-green); background: rgba(30,215,96,0.08); padding: 2px 8px; border-radius: 4px; font-weight: 700;">Fixed: ₹${reco.industryBest.fixedSavings}</span>
            ${reco.industryBest.estimatedSavings > 0 ? `<span style="font-size: 0.65rem; color: var(--orange-sunshine); background: rgba(255,107,44,0.08); padding: 2px 8px; border-radius: 4px; font-weight: 700;">Est: ₹${reco.industryBest.estimatedSavings}</span>` : ''}
          </div>
          <div class="reco-breakdown"><div>✨ <span>${reco.industryBest.reasoning || reco.industryBest.label}</span></div></div>
          ${reco.industryBest.card.annualFee ? `<div style="margin-top: 8px; font-size: 0.65rem; color: var(--text-tertiary);">Annual fee: ₹${reco.industryBest.card.annualFee}</div>` : ''}
          ${reco.industryBeatUser ? `
            <div style="margin-top: 14px; padding: 10px 14px; background: rgba(255,107,44,0.06); border-radius: var(--radius-md); font-size: 0.72rem; color: var(--text-secondary); line-height: 1.6;">
              💡 <span style="color: var(--orange-sunshine); font-weight: 600;">Consider getting this card</span> — save <span style="color: var(--orange-sunshine); font-weight: 700;">₹${(reco.industryBest.totalSavings - reco.bestUserCard.totalSavings).toFixed(0)} more</span> per transaction.
            </div>
          ` : `
            <div style="margin-top: 14px; padding: 10px 14px; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); font-size: 0.72rem; color: var(--text-secondary); line-height: 1.6;">
              ✅ Your <strong>${reco.bestUserCard.card.name}</strong> card already gives competitive savings!
            </div>
          `}
        </div>
      </div>
    ` : ''}

    <!-- Pay Button -->
    <div style="padding: 12px 24px 32px;">
      <button class="neo-btn neo-btn-primary neo-btn-full" id="proceed-pay-btn">
        Pay ₹${amount.toLocaleString('en-IN')} with ${reco.bestUserCard.card.name}
      </button>
    </div>
  `;

  // Animate bars
  requestAnimationFrame(() => {
    setTimeout(() => {
      screen.querySelectorAll('.savings-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 300);
  });

  // Back button
  screen.querySelector('#reco-back')?.addEventListener('click', () => {
    navigate('transaction', { merchantId: merchant.id, amount: params.amount, transactionId: params.transactionId });
  });

  // Proceed to confirm
  let selectedCard = reco.bestUserCard;

  screen.querySelector('#proceed-pay-btn')?.addEventListener('click', () => {
    // Analytics: Log selection
    updateRecommendationSelection(reco.impressionId, selectedCard.card.id);
    
    navigate('confirm', {
      transactionId: params.transactionId,
      merchantId: merchant.id,
      amount,
      cardId: selectedCard.card.id,
      cardName: selectedCard.card.name,
      cardBank: selectedCard.card.bank,
      cardLast4: selectedCard.card.last4,
      savings: selectedCard.totalSavings,
      potentialSavings: reco.bestUserCard.totalSavings
    });
  });

  // Allow clicking other cards
  screen.querySelectorAll('.reco-card[data-card-id]').forEach(cardEl => {
    cardEl.style.cursor = 'pointer';
    cardEl.addEventListener('click', () => {
      const cardId = cardEl.dataset.cardId;
      const sel = reco.userCards.find(r => r.card.id === cardId);
      if (sel) {
        selectedCard = sel;
        const btn = screen.querySelector('#proceed-pay-btn');
        if (btn) btn.textContent = `Pay ₹${amount.toLocaleString('en-IN')} with ${sel.card.name}`;
        screen.querySelectorAll('.reco-card').forEach(c => c.style.borderColor = 'rgba(255,255,255,0.06)');
        cardEl.style.borderColor = 'var(--poli-purple)';
      }
    });
  });
}

function renderBreakdown(result) {
  if (result.breakdown && result.breakdown.length > 0) {
    return result.breakdown.map(b => {
      const icon = b.type === 'cred_cashback' ? '🎁' : b.type === 'offer' ? '🔥' : b.type === 'dineout' ? '🍽️' : '💳';
      const expiringBadge = b.is_expiring ? ' <span style="color: var(--error); font-size: 0.55rem; font-weight: 700;">EXPIRING SOON</span>' : '';
      return `<div>${icon} <span>${b.text}: ₹${Math.round(b.value)}</span>${expiringBadge}</div>`;
    }).join('');
  }
  return result.reasoning ? `<div>💳 <span>${result.reasoning}</span></div>` : '';
}

function renderCapWarning(result) {
  if (!result.breakdown) return '';
  const warning = result.breakdown.find(b => b.type === 'cap_warning');
  if (!warning) return '';
  return `<div style="margin-top: 6px; padding: 6px 10px; background: rgba(239,68,68,0.06); border-radius: var(--radius-sm); font-size: 0.65rem; color: var(--warning);">⚠️ ${warning.text}</div>`;
}
