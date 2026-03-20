// ============================================
// UPI PIN Entry Screen
// ============================================

import { merchants } from '../data/merchants.js';
import { logFunnelEvent } from '../api.js';

export function renderUpiPin(app, navigate, params) {
  logFunnelEvent('upi_pin_viewed');
  const merchant = merchants.find(m => m.id === params.merchantId);
  const amount = params.amount || 0;
  const pin = [];
  const maxPinLength = 6;

  const screen = document.createElement('div');
  screen.className = 'screen upi-screen';
  screen.id = 'upi-pin-screen';

  function render() {
    screen.innerHTML = `
      <div class="upi-header">
        <div class="upi-logo-container">
          <span class="upi-logo-text">UPI</span>
          <span class="upi-bank-name">Punjab National Bank</span>
        </div>
        <button class="upi-close-btn" id="upi-close">✕</button>
      </div>

      <div class="upi-payment-hero">
        <div class="upi-hero-left">
          <div class="upi-hero-label">Pay ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div class="upi-hero-to">To ${merchant ? merchant.name : 'Merchant'}</div>
        </div>
        <div class="upi-hero-right">
          <div class="upi-hero-icon-stack">
            <span>₹</span>
            <div class="upi-user-icon">👤</div>
          </div>
        </div>
      </div>

      <div class="upi-pin-section">
        <div class="upi-pin-label">Enter your PIN</div>
        <div class="upi-pin-dots">
          ${Array(maxPinLength).fill(0).map((_, i) => `
            <div class="upi-pin-dot ${pin.length > i ? 'filled' : ''}"></div>
          `).join('')}
        </div>
        <div class="upi-pin-warning">
          <span class="warning-icon">ⓘ</span>
          Never enter your UPI PIN to receive money
        </div>
      </div>

      <div class="upi-numpad">
        <div class="upi-numpad-grid">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
            <button class="upi-key" data-key="${num}">${num}</button>
          `).join('')}
          <button class="upi-key upi-key-back" data-key="back">⌫</button>
          <button class="upi-key" data-key="0">0</button>
          <button class="upi-key upi-key-pay" id="upi-pay-btn" ${pin.length === maxPinLength ? '' : 'disabled'}>Pay</button>
        </div>
      </div>
    `;

    // Re-attach listeners after innerHTML update
    attachListeners();
  }

  function attachListeners() {
    document.getElementById('upi-close')?.addEventListener('click', () => {
      navigate('transaction', { 
        merchantId: params.merchantId, 
        amount: params.amount, 
        transactionId: params.transactionId 
      });
    });

    screen.querySelectorAll('.upi-key').forEach(key => {
      key.addEventListener('click', () => {
        const val = key.dataset.key;
        if (val === 'back') {
          if (pin.length > 0) {
            pin.pop();
            render();
          }
        } else if (!isNaN(val)) {
          if (pin.length < maxPinLength) {
            pin.push(val);
            render();
          }
        }
      });
    });

    document.getElementById('upi-pay-btn')?.addEventListener('click', () => {
      if (pin.length === maxPinLength) {
        navigate('success', {
          ...params,
          merchantName: merchant ? merchant.name : 'Merchant',
          category: merchant ? merchant.category : 'general',
          cardId: 'upi',
          cardName: 'UPI Payment',
          cardBank: 'Punjab National Bank',
          cardLast4: 'UPI',
          savings: 0 // UPI usually doesn't show split savings in this mock
        });
      }
    });
  }

  app.innerHTML = '';
  app.appendChild(screen);
  render();
}
