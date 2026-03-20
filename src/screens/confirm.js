// ============================================
// Payment Confirmation Screen (v2 — uses params)
// ============================================

import { merchants } from '../data/merchants.js';

export function renderConfirm(app, navigate, params) {
  const merchant = merchants.find(m => m.id === params.merchantId);
  if (!merchant) { navigate('home'); return; }

  const amount = params.amount;
  const savings = params.savings;
  const cardName = params.cardName || 'Card';
  const cardBank = params.cardBank || '';
  const cardLast4 = params.cardLast4 || '----';

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'confirm-screen';

  screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" id="confirm-back">←</button>
      <span class="header-title">Confirm Payment</span>
      <div class="header-action"></div>
    </div>

    <!-- Merchant + Amount Hero -->
    <div class="stagger-1" style="text-align: center; padding: 32px 24px 24px;">
      <div style="width: 72px; height: 72px; border-radius: var(--radius-xl); background: ${merchant.bgColor}22; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 16px;">${merchant.emoji}</div>
      <div style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; margin-bottom: 4px;">Paying ${merchant.name}</div>
      <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em;">₹${amount.toLocaleString('en-IN')}</div>
    </div>

    <!-- Transaction Details -->
    <div class="txn-summary stagger-2">
      <div class="txn-row">
        <span class="txn-label">Merchant</span>
        <span class="txn-value">${merchant.name}</span>
      </div>
      <div class="txn-row">
        <span class="txn-label">Category</span>
        <span class="txn-value">${merchant.categoryLabel}</span>
      </div>
      <div class="txn-row">
        <span class="txn-label">Amount</span>
        <span class="txn-value">₹${amount.toLocaleString('en-IN')}</span>
      </div>
      <div class="txn-row">
        <span class="txn-label">Paying with</span>
        <span class="txn-value">${cardBank} ${cardName}</span>
      </div>
      <div class="txn-row">
        <span class="txn-label">Card</span>
        <span class="txn-value">•••• ${cardLast4}</span>
      </div>
      ${savings > 0 ? `
        <div class="txn-row">
          <span class="txn-label">Estimated Savings</span>
          <span class="txn-value savings">-₹${savings}</span>
        </div>
        <div class="txn-row">
          <span class="txn-label" style="font-weight: 600; color: var(--text-primary);">Effective Amount</span>
          <span class="txn-value" style="font-weight: 700; font-family: var(--font-display); font-size: 1rem;">₹${(amount - savings).toLocaleString('en-IN')}</span>
        </div>
      ` : ''}
    </div>

    ${savings > 0 ? `
      <div class="stagger-3" style="margin: 16px 24px; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.15); border-radius: var(--radius-full);">
          <span>🧠</span>
          <span style="font-size: 0.75rem; font-weight: 600; color: var(--park-green);">Smart Pay saving you ₹${savings}</span>
        </div>
      </div>
    ` : ''}

    <!-- Swipe to Pay -->
    <div class="stagger-4" style="padding: 24px 24px 40px;">
      <div class="swipe-track" id="swipe-track">
        <div class="swipe-fill" id="swipe-fill"></div>
        <div class="swipe-label">Swipe to Pay →</div>
        <div class="swipe-thumb" id="swipe-thumb">→</div>
      </div>
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  setupSwipeToPay(navigate, params, merchant);

  document.getElementById('confirm-back')?.addEventListener('click', () => {
    navigate('recommendation', { merchantId: merchant.id, amount, transactionId: params.transactionId });
  });
}

function setupSwipeToPay(navigate, params, merchant) {
  const track = document.getElementById('swipe-track');
  const thumb = document.getElementById('swipe-thumb');
  const fill = document.getElementById('swipe-fill');
  if (!track || !thumb || !fill) return;

  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  const thumbWidth = 52;
  const padding = 4;

  function getMaxX() { return track.offsetWidth - thumbWidth - padding * 2; }

  function handleStart(e) {
    isDragging = true;
    startX = (e.touches ? e.touches[0].clientX : e.clientX) - currentX;
    thumb.style.transition = 'none';
    fill.style.transition = 'none';
  }

  function handleMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    const maxX = getMaxX();
    currentX = Math.max(0, Math.min(x, maxX));
    thumb.style.left = (currentX + padding) + 'px';
    fill.style.width = (currentX + thumbWidth + padding) + 'px';
  }

  function handleEnd() {
    if (!isDragging) return;
    isDragging = false;
    thumb.style.transition = 'left 300ms ease';
    fill.style.transition = 'width 300ms ease';

    const maxX = getMaxX();
    if (currentX >= maxX * 0.85) {
      currentX = maxX;
      thumb.style.left = (maxX + padding) + 'px';
      fill.style.width = '100%';
      setTimeout(() => {
        navigate('success', {
          ...params,
          merchantName: merchant.name,
          category: merchant.category
        });
      }, 400);
    } else {
      currentX = 0;
      thumb.style.left = padding + 'px';
      fill.style.width = '0px';
    }
  }

  thumb.addEventListener('touchstart', handleStart, { passive: true });
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('touchend', handleEnd);
  thumb.addEventListener('mousedown', handleStart);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', handleEnd);
}
