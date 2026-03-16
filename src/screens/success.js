// ============================================
// Payment Success Screen (v2 — persists to DB)
// ============================================

import { recordTransaction, updateTransactionStatus } from '../api.js';

export function renderSuccess(app, navigate, params) {
  const amount = params.amount;
  const savings = params.savings;
  const cardName = params.cardName || 'Card';
  const cardBank = params.cardBank || '';
  const cardLast4 = params.cardLast4 || '----';
  const merchantName = params.merchantName || params.merchantId || 'Merchant';
  const txnId = generateTxnId();

  // Persist to DB
  let savePromise = Promise.resolve();
  if (params.transactionId) {
    savePromise = updateTransactionStatus(params.transactionId, 'completed', {
      card_id: params.cardId,
      savings: savings,
      offer_id: params.offerId
    }).catch(err => console.log('Failed to update txn:', err.message));
  } else {
    savePromise = recordTransaction({
      card_id: params.cardId,
      merchant_id: params.merchantId,
      merchant_name: merchantName,
      category: params.category || 'general',
      amount: amount,
      savings: savings,
      offer_id: params.offerId
    }).catch(err => console.log('Failed to record transaction:', err.message));
  }

  const screen = document.createElement('div');
  screen.className = 'success-screen';
  screen.id = 'success-screen';

  screen.innerHTML = `
    <div class="confetti-container" id="confetti-container"></div>

    <div class="success-checkmark stagger-1">✓</div>
    <div class="success-amount stagger-2">₹${amount.toLocaleString('en-IN')}</div>
    <div class="success-subtitle stagger-2">Paid to ${merchantName}</div>

    ${savings > 0 ? `
      <div class="success-savings-badge stagger-3">
        <span class="badge-icon">🧠</span>
        <span class="badge-text">You saved ₹${savings} with Smart Pay!</span>
      </div>
    ` : ''}

    <div class="stagger-4" style="width: 100%; max-width: 360px;">
      <div class="txn-summary" style="margin: 0 0 24px;">
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-tertiary);">Transaction Receipt</div>
        </div>
        <div class="txn-row">
          <span class="txn-label">Merchant</span>
          <span class="txn-value">${merchantName}</span>
        </div>
        <div class="txn-row">
          <span class="txn-label">Card Used</span>
          <span class="txn-value">${cardBank} ${cardName}</span>
        </div>
        <div class="txn-row">
          <span class="txn-label">Card Number</span>
          <span class="txn-value">•••• ${cardLast4}</span>
        </div>
        <div class="txn-row">
          <span class="txn-label">Amount</span>
          <span class="txn-value">₹${amount.toLocaleString('en-IN')}</span>
        </div>
        ${savings > 0 ? `
          <div class="txn-row">
            <span class="txn-label">Savings Earned</span>
            <span class="txn-value savings">₹${savings}</span>
          </div>
        ` : ''}
        <div class="txn-row">
          <span class="txn-label">Transaction ID</span>
          <span class="txn-value" style="font-size: 0.7rem; font-family: monospace; color: var(--text-tertiary);">${txnId}</span>
        </div>
        <div class="txn-row">
          <span class="txn-label">Date & Time</span>
          <span class="txn-value" style="font-size: 0.75rem;">${new Date().toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>

    <div class="stagger-5" style="width: 100%; max-width: 360px; margin-bottom: 24px;">
      <div style="padding: 16px 20px; background: linear-gradient(135deg, rgba(212,168,83,0.1) 0%, rgba(255,107,44,0.06) 100%); border: 1px solid rgba(212,168,83,0.15); border-radius: var(--radius-xl); display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 1.5rem;">🪙</span>
        <div>
          <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; color: var(--manna-gold);">+${Math.floor(amount / 10)} CRED coins earned</div>
          <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px;">Use coins for exclusive rewards</div>
        </div>
      </div>
    </div>

    <div style="width: 100%; max-width: 360px; display: flex; gap: 12px;">
      <button class="neo-btn neo-btn-secondary" id="view-history-btn" style="flex: 1;">📊 History</button>
      <button class="neo-btn neo-btn-primary" id="done-btn" style="flex: 2;">Done</button>
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  createConfetti();

  document.getElementById('done-btn')?.addEventListener('click', async () => {
    await savePromise;
    navigate('home');
  });
  document.getElementById('view-history-btn')?.addEventListener('click', async () => {
    await savePromise;
    navigate('history');
  });
}

function generateTxnId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'TXN';
  for (let i = 0; i < 10; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

function createConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  const colors = ['#FF6B2C', '#8B5CF6', '#10B981', '#EC4899', '#F59E0B', '#3B82F6', '#D4A853', '#84CC16'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.animationDuration = (2 + Math.random() * 2) + 's';
    piece.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);
  }
  setTimeout(() => { container.innerHTML = ''; }, 5000);
}
