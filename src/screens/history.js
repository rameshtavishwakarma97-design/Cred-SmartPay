// ============================================
// Transaction History Screen
// ============================================

import { getTransactions, getTransactionStats } from '../api.js';

export function renderHistory(app, navigate) {
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'history-screen';

  screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" id="history-back">←</button>
      <span class="header-title">Transaction History</span>
      <div class="header-action"></div>
    </div>
    <div id="history-content" style="padding: 0 0 32px;">
      <div style="text-align: center; padding: 60px 24px; color: var(--text-tertiary);">Loading...</div>
    </div>
    <div class="bottom-nav">
      <button class="nav-item" id="nav-home"><span class="nav-icon">🏠</span><span class="nav-label">Home</span></button>
      <button class="nav-item" id="nav-pay"><span class="nav-icon">🧠</span><span class="nav-label">Recommend</span></button>
      <button class="nav-item active" id="nav-history"><span class="nav-icon">📊</span><span class="nav-label">History</span></button>
      <button class="nav-item" id="nav-rewards"><span class="nav-icon">🎯</span><span class="nav-label">Rewards</span></button>
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  document.getElementById('history-back')?.addEventListener('click', () => navigate('home'));
  document.getElementById('nav-home')?.addEventListener('click', () => navigate('home'));
  document.getElementById('nav-pay')?.addEventListener('click', () => navigate('merchants'));

  loadHistory();
}

async function loadHistory() {
  const content = document.getElementById('history-content');
  if (!content) return;

  try {
    const [txnData, statsData] = await Promise.all([
      getTransactions(1, {}),
      getTransactionStats()
    ]);

    const stats = statsData.thisMonth;
    const allTime = statsData.allTime;
    const transactions = txnData.transactions;
    const breakdown = statsData.categoryBreakdown;

    content.innerHTML = `
      <!-- Monthly Stats Hero -->
      <div class="stagger-1" style="padding: 20px 24px;">
        <div style="display: flex; gap: 12px;">
          <div style="flex: 1; padding: 16px; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid rgba(255,255,255,0.04);">
            <div style="font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-tertiary); margin-bottom: 6px;">This Month Spent</div>
            <div style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 800;">₹${formatNum(stats.total_spent)}</div>
            <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 4px;">${stats.transaction_count} transactions</div>
          </div>
          <div style="flex: 1; padding: 16px; background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(132,204,22,0.05)); border-radius: var(--radius-xl); border: 1px solid rgba(16,185,129,0.12);">
            <div style="font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--park-green); margin-bottom: 6px;">This Month Saved</div>
            <div style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; color: var(--park-green);">₹${formatNum(stats.total_savings)}</div>
            <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 4px;">via Smart Pay 🧠</div>
          </div>
        </div>
      </div>

      <!-- All-time stats -->
      <div class="stagger-2" style="padding: 0 24px 16px;">
        <div style="padding: 14px 16px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.04); display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.75rem; color: var(--text-secondary);">All-time savings</div>
          <div style="font-family: var(--font-display); font-weight: 700; color: var(--park-green); font-size: 0.9rem;">₹${formatNum(allTime.total_savings)} across ${allTime.transaction_count} txns</div>
        </div>
      </div>

      ${breakdown.length > 0 ? `
        <!-- Category Breakdown -->
        <div class="section-header stagger-2">
          <span class="section-title">Spending by Category</span>
        </div>
        <div class="screen-padding stagger-2" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px;">
          ${breakdown.map(cat => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.04);">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1rem;">${getCategoryEmoji(cat.category)}</span>
                <div>
                  <div style="font-size: 0.8rem; font-weight: 600; text-transform: capitalize;">${cat.category.replace('_', ' ')}</div>
                  <div style="font-size: 0.65rem; color: var(--text-tertiary);">${cat.count} transactions</div>
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.85rem;">₹${formatNum(cat.total)}</div>
                <div style="font-size: 0.6rem; color: var(--park-green);">₹${formatNum(cat.savings)} saved</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Transactions List -->
      <div class="section-header stagger-3">
        <span class="section-title">Recent Transactions</span>
      </div>

      <div class="screen-padding stagger-3" style="display: flex; flex-direction: column; gap: 8px;">
        ${transactions.length === 0 ? `
          <div style="text-align: center; padding: 48px 20px;">
            <div style="font-size: 2.5rem; margin-bottom: 12px;">📋</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 4px;">No transactions yet</div>
            <div style="font-size: 0.75rem; color: var(--text-tertiary);">Make a payment to see your history here</div>
          </div>
        ` : transactions.map(t => `
          <div style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.04);">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: var(--bg-elevated); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              ${getCategoryEmoji(t.category)}
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 0.85rem;">${t.merchant_name || t.merchant_id}</div>
              <div style="font-size: 0.65rem; color: var(--text-tertiary);">
                ${formatDate(t.created_at)}
                ${t.status === 'pending' ? ' • <span style="color:var(--orange-sunshine); font-weight:600;">Pending</span>' : ''}
                ${t.status === 'cancelled' ? ' • <span style="color:var(--error); font-weight:600;">Cancelled</span>' : ''}
                ${t.status === 'completed' && t.card_id ? ` • ${t.card_id}` : ''}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.9rem;">₹${formatNum(t.amount)}</div>
              ${t.savings > 0 ? `<div style="font-size: 0.6rem; color: var(--park-green); font-weight: 500;">₹${formatNum(t.savings)} saved</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    content.innerHTML = `
      <div style="text-align: center; padding: 60px 24px;">
        <div style="font-size: 2rem; margin-bottom: 12px;">⚠️</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Could not load history</div>
        <div style="font-size: 0.72rem; color: var(--text-tertiary);">${err.message}</div>
      </div>
    `;
  }
}

function formatNum(n) {
  return (parseFloat(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  // Fix SQLite timestamp format (YYYY-MM-DD HH:MM:SS) for JS Date parser
  const isoStr = dateStr.replace(' ', 'T').concat('Z');
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getCategoryEmoji(cat) {
  const map = { dining: '🍕', online_shopping: '🛒', grocery: '🥦', fuel: '⛽', travel: '✈️', movies: '🎬', utility: '💡', insurance: '🛡️', education: '📚', general: '💫' };
  return map[cat] || '💳';
}
