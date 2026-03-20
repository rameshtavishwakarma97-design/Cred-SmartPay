// ============================================
// Transaction Amount Screen
// ============================================

import { merchants } from '../data/merchants.js';
import { updateTransactionStatus, logFunnelEvent, getSmartRecommendation } from '../api.js';
import { showModal } from '../components/modal.js';

export function renderTransaction(app, navigate, params) {
  logFunnelEvent('amount_page_viewed', { merchantId: params.merchantId, amount: params.amount });
  const merchant = merchants.find(m => m.id === params.merchantId);
  if (!merchant) { navigate('merchants'); return; }

  let amount = params.amount ? params.amount.toString() : '';
  let paymentMethod = 'smartpay';
  if (params.forceUpi) paymentMethod = 'upi';
  if (params.forceSmartPay) paymentMethod = 'smartpay';

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'transaction-screen';

  screen.innerHTML = `
    ${params.isSimulation ? `
      <div style="background: var(--orange-sunshine); color: #000; text-align: center; padding: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
        Simulation Mode 🧠 — Discovery Only
      </div>
    ` : ''}
    <div class="screen-header">
      <button class="back-btn" id="txn-back">←</button>
      <span class="header-title">Enter Amount</span>
      <div class="header-action"></div>
    </div>

    <!-- Merchant Header -->
    <div class="merchant-header stagger-1">
      <div class="mh-logo" style="background: ${merchant.bgColor}22;">
        <span>${merchant.emoji}</span>
      </div>
      <div>
        <div class="mh-name">${merchant.name}</div>
        <div class="mh-category">${params.subCategoryLabel || merchant.categoryLabel}</div>
      </div>
    </div>

    ${merchant.credOffer ? `
      <div class="stagger-2" style="margin: 12px 24px 0; display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(16,185,129,0.08); border-radius: var(--radius-lg); border: 1px solid rgba(16,185,129,0.12);">
        <span style="font-size: 0.9rem;">🎉</span>
        <span style="font-size: 0.72rem; color: var(--park-green); font-weight: 500;">${merchant.credOffer}</span>
      </div>
    ` : ''}

    <!-- Amount Display -->
    <div class="amount-display stagger-2">
      <span class="currency">₹</span>
      <span class="amount-value ${amount ? '' : 'empty'}" id="amount-display">${amount ? formatAmount(amount) : '0'}</span>
    </div>

    <!-- Smart Pay hint -->
    <div class="stagger-3" style="text-align: center; margin-bottom: 20px;">
      <div style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--bg-card); border-radius: var(--radius-full); border: 1px solid rgba(255,255,255,0.06);">
        <span style="font-size: 0.8rem;">🧠</span>
        <span style="font-size: 0.7rem; color: var(--text-secondary);">Smart Pay will find your best card</span>
      </div>
    </div>

    <!-- Numpad -->
    ${params.transactionId ? `
      <div class="stagger-4" style="text-align: center; margin: 20px 0; color: var(--text-tertiary); font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Amount locked by merchant
      </div>
    ` : `
      <div class="numpad stagger-4" id="numpad">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, '⌫'].map(key => `
          <button class="numpad-key ${key === '⌫' ? 'numpad-delete' : ''}" data-key="${key}">${key}</button>
        `).join('')}
      </div>
    `}

    <!-- Payment Method Selector -->
    <div class="stagger-3" style="margin: 0 24px 20px;">
      <div class="payment-selector">
        <button class="selector-item ${paymentMethod === 'smartpay' ? 'active' : ''} ${params.forceUpi ? 'disabled' : ''}" id="sel-smartpay" ${params.forceUpi ? 'disabled' : ''}>
          <span class="sel-icon">🧠</span>
          <span class="sel-text">Smart Pay</span>
        </button>
        <button class="selector-item ${paymentMethod === 'upi' ? 'active' : ''} ${params.forceSmartPay ? 'disabled' : ''}" id="sel-upi" ${params.forceSmartPay ? 'disabled' : ''}>
          <span class="sel-icon">📱</span>
          <span class="sel-text">UPI</span>
        </button>
      </div>
    </div>

    <!-- Smart Pay Button -->
    <div style="padding: 0 24px 32px; margin-top: 12px;">
      <button class="neo-btn neo-btn-accent neo-btn-full" id="smart-pay-btn" ${amount ? '' : 'disabled'}>
        🧠 Smart Pay — Find Best Card
      </button>
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  const display = document.getElementById('amount-display');
  const payBtn = document.getElementById('smart-pay-btn');

  // Numpad logic
  document.getElementById('numpad')?.addEventListener('click', (e) => {
    const key = e.target.closest('.numpad-key');
    if (!key) return;

    const val = key.dataset.key;

    if (val === '⌫') {
      amount = amount.slice(0, -1);
    } else if (val === '.') {
      if (!amount.includes('.') && amount.length > 0) amount += '.';
    } else {
      if (amount.length < 8) {
        // Prevent leading zeros
        if (amount === '0' && val !== '.') amount = '';
        amount += val;
      }
    }

    // Update display
    if (amount && parseFloat(amount) > 0) {
      display.textContent = formatAmount(amount);
      display.classList.remove('empty');
      payBtn.disabled = false;
    } else {
      display.textContent = '0';
      display.classList.add('empty');
      payBtn.disabled = true;
    }

    // Quick haptic-like feedback
    key.style.background = 'var(--bg-elevated)';
    setTimeout(() => { key.style.background = 'transparent'; }, 100);
  });

  // Selector logic
  const selSmartPay = document.getElementById('sel-smartpay');
  const selUpi = document.getElementById('sel-upi');

  function updateMethod(method) {
    if (params.forceUpi && method === 'smartpay') return;
    if (params.forceSmartPay && method === 'upi') return;
    paymentMethod = method;
    if (method === 'smartpay') {
      selSmartPay.classList.add('active');
      selUpi.classList.remove('active');
      payBtn.textContent = '🧠 Smart Pay — Find Best Card';
      payBtn.className = 'neo-btn neo-btn-accent neo-btn-full';
    } else {
      selUpi.classList.add('active');
      selSmartPay.classList.remove('active');
      payBtn.textContent = 'Pay via UPI';
      payBtn.className = 'neo-btn neo-btn-primary neo-btn-full';
    }
  }

  // Initial UI state setup
  updateMethod(paymentMethod);

  selSmartPay?.addEventListener('click', () => updateMethod('smartpay'));

  if (params.isSimulation) {
    selUpi.style.opacity = '0.5';
    selUpi.style.pointerEvents = 'none';
    const upiLabel = selUpi.querySelector('.nav-label');
    if (upiLabel) upiLabel.textContent = 'UPI (Disabled)';
  } else {
    selUpi?.addEventListener('click', () => updateMethod('upi'));
  }

  // Smart Pay button
  payBtn?.addEventListener('click', async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    payBtn.innerHTML = `<span>⏳</span> Processing...`;

    let potentialSavings = 0;
    try {
      const reco = await getSmartRecommendation(
        merchant.id,
        merchant.name,
        params.category || merchant.category,
        parseFloat(amount),
        merchant.credCashback || 0,
        params.mcc
      );
      if (reco && reco.bestUserCard) {
        potentialSavings = reco.bestUserCard.totalSavings || 0;
      }
      console.log('DEBUG: Potential savings found:', potentialSavings);
    } catch (e) {
      console.warn('Failed to pre-fetch potential savings:', e.message);
    }

    if (paymentMethod === 'smartpay') {
      navigate('recommendation', {
        transactionId: params.transactionId,
        merchantId: merchant.id,
        amount: parseFloat(amount),
        potentialSavings,
        isSimulation: params.isSimulation,
        category: params.category || merchant.category,
        subCategory: params.subCategory,
        subCategoryLabel: params.subCategoryLabel,
        mcc: params.mcc
      });
    } else {
      navigate('upi_pin', {
        transactionId: params.transactionId,
        merchantId: merchant.id,
        amount: parseFloat(amount),
        potentialSavings,
        isSimulation: params.isSimulation,
        category: params.category || merchant.category,
        subCategory: params.subCategory,
        subCategoryLabel: params.subCategoryLabel,
        mcc: params.mcc
      });
    }
  });

  // Back
  document.getElementById('txn-back')?.addEventListener('click', async () => {
    if (params.transactionId) {
      // Merchant-initiated flow: ask before cancelling
      const result = await showModal({
        title: 'Cancel Payment?',
        desc: `Are you sure you want to cancel the payment to ${merchant.name}? You can dismiss it entirely or pay later from your home screen.`,
        icon: '⚠️',
        confirmText: 'Yes, Cancel',
        neutralText: 'Pay Later',
        cancelText: null,
        danger: true
      });

      if (result === 'cancel') return; // User chose to stay

      if (result === 'confirm') {
        try {
          await updateTransactionStatus(params.transactionId, 'cancelled');
        } catch (e) {
          console.error('Failed to cancel txn:', e);
        }
      }
      // If 'neutral' (Pay Later), we just navigate home without changing status (remains pending)
    }
    navigate('home');
  });
}

function formatAmount(val) {
  const num = parseFloat(val);
  if (isNaN(num)) return '0';

  if (val.includes('.')) {
    const parts = val.split('.');
    const intPart = parseInt(parts[0]).toLocaleString('en-IN');
    return intPart + '.' + (parts[1] || '');
  }

  return parseInt(val).toLocaleString('en-IN');
}
