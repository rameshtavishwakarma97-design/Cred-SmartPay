// ============================================
// Home Screen — Card wallet + Quick Actions
// ============================================

import { clearToken, getUser, getTransactions, getProfile } from '../api.js';

export function renderHome(app, navigate) {
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'home-screen';

  screen.innerHTML = `
    <!-- Header -->
    <div style="padding: 20px 24px 8px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em;">
          smart<span style="color: var(--orange-sunshine);">pay</span>
        </div>
        <div style="font-size: 0.7rem; color: var(--text-tertiary); margin-top: 2px;">by CRED</div>
      </div>
      <div style="display: flex; gap: 12px; align-items: center;">
        <div style="width: 36px; height: 36px; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 1rem; cursor: pointer;">🔔</div>
        <div id="profile-btn" style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--poli-purple), var(--orange-sunshine)); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; cursor: pointer;">${(getUser()?.name || 'SM').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</div>
      </div>
    </div>

    <!-- CRED Score Banner -->
    <div class="stagger-1" style="margin: 16px 24px; padding: 16px 20px; background: linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(255,107,44,0.08) 100%); border: 1px solid rgba(139,92,246,0.15); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: space-between;">
      <div>
        <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-tertiary); margin-bottom: 4px;">CRED Score</div>
        <div style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800;">812</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 0.65rem; color: var(--park-green); font-weight: 600;">↑ +12 this month</div>
        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 4px;">Excellent</div>
      </div>
    </div>

    <!-- Pending Requests Section (Hidden by default) -->
    <div id="pending-requests-section" style="display: none;">
      <div class="section-header stagger-1">
        <span class="section-title" style="color: var(--orange-sunshine);">Action Required</span>
      </div>
      <div class="screen-padding stagger-1" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;" id="pending-requests-container">
        <!-- Pending items injected here -->
      </div>
    </div>

    <!-- My Cards Section -->
    <div class="section-header stagger-2">
      <span class="section-title">My Cards</span>
      <span class="section-action" id="view-all-cards" style="cursor:pointer">View Details →</span>
    </div>

    <div class="card-carousel stagger-2" id="card-carousel" style="min-height: 180px;">
      <div style="padding: 24px; color: var(--text-tertiary); font-size: 0.8rem;">Loading cards...</div>
    </div>

    <!-- Quick Actions -->
    <div class="section-header stagger-3">
      <span class="section-title">Quick Actions</span>
    </div>

    <div class="quick-actions stagger-3">
      <div class="quick-action" id="qa-scan">
        <div class="qa-icon">📷</div>
        <div class="qa-label">Scan & Pay</div>
      </div>
      <div class="quick-action" id="qa-merchant">
        <div class="qa-icon" style="background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2);">🏪</div>
        <div class="qa-label">Recommend</div>
      </div>
      <div class="quick-action" id="qa-bills">
        <div class="qa-icon">📄</div>
        <div class="qa-label">Bill Pay</div>
      </div>
      <div class="quick-action" id="qa-rewards">
        <div class="qa-icon">🎁</div>
        <div class="qa-label">Rewards</div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="section-header stagger-4">
      <span class="section-title">Recent Activity</span>
      <span class="section-action" id="view-all-txns">View All →</span>
    </div>

    <div class="screen-padding stagger-4" style="display: flex; flex-direction: column; gap: 8px; padding-bottom: 24px;" id="recent-activity-container">
      <div style="padding: 16px; text-align: center; color: var(--text-tertiary); font-size: 0.8rem;">Loading activity...</div>
    </div>

    <!-- Smart Pay Promo -->
    <div class="stagger-5 screen-padding" style="padding-bottom: 32px;">
      <div style="padding: 20px; background: linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(132,204,22,0.06) 100%); border: 1px solid rgba(16,185,129,0.15); border-radius: var(--radius-xl);">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 1.2rem;">🧠</span>
          <span style="font-family: var(--font-display); font-weight: 700; font-size: 0.85rem;">Smart Pay Intelligence</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.6;">
          Pay any merchant and our AI recommends the best card from your wallet for maximum savings. We also suggest the best card in the industry if there's a better option.
        </div>
      </div>
    </div>

    <!-- Bottom Nav -->
    <div class="bottom-nav">
      <button class="nav-item active" id="nav-home">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">Home</span>
      </button>
      <button class="nav-item" id="nav-pay"><span class="nav-icon">🧠</span><span class="nav-label">Recommend</span></button>
      <button class="nav-item" id="nav-history">
        <span class="nav-icon">📊</span>
        <span class="nav-label">History</span>
      </button>
      <button class="nav-item" id="nav-rewards">
        <span class="nav-icon">🎯</span>
        <span class="nav-label">Rewards</span>
      </button>
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  // Event listeners
  document.getElementById('qa-merchant')?.addEventListener('click', () => navigate('merchants'));
  document.getElementById('qa-scan')?.addEventListener('click', () => navigate('merchants'));
  document.getElementById('nav-pay')?.addEventListener('click', () => navigate('merchants'));
  document.getElementById('nav-history')?.addEventListener('click', () => navigate('history'));
  document.getElementById('view-all-txns')?.addEventListener('click', () => navigate('history'));
  document.getElementById('view-all-cards')?.addEventListener('click', () => navigate('cards'));
  document.getElementById('profile-btn')?.addEventListener('click', () => {
    if (confirm('Logout?')) { clearToken(); navigate('login'); }
  });

  // Fetch pending requests
  getTransactions(1, { status: 'pending' }).then(res => {
    const pendingTxns = res.transactions || [];
    if (pendingTxns.length > 0) {
      const container = document.getElementById('pending-requests-container');
      const section = document.getElementById('pending-requests-section');
      
      container.innerHTML = pendingTxns.map(t => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: linear-gradient(to right, rgba(234,88,12,0.1), transparent); border-radius: var(--radius-lg); border: 1px solid rgba(234,88,12,0.2);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(234,88,12,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">🔔</div>
            <div>
              <div style="font-size: 0.85rem; font-weight: 600;">${t.merchant_name || t.merchant_id}</div>
              <div style="font-size: 0.65rem; color: var(--text-tertiary);">Payment Request</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-display); font-weight: 800; font-size: 1rem; margin-bottom: 6px;">₹${(t.amount).toLocaleString('en-IN')}</div>
            <button class="neo-btn" id="resume-txn-${t.id}" style="padding: 6px 16px; font-size: 0.7rem; background: var(--orange-sunshine);">Pay Now</button>
          </div>
        </div>
      `).join('');
      
      section.style.display = 'block';
      
      pendingTxns.forEach(t => {
        document.getElementById(`resume-txn-${t.id}`)?.addEventListener('click', () => {
          navigate('transaction', {
            transactionId: t.id,
            merchantId: t.merchant_id,
            amount: t.amount,
            category: t.category
          });
        });
      });
    }
  }).catch(e => console.error('Failed to fetch pending requests', e));

  // Hydrate user profile cards
  getProfile().then(data => {
    const cards = data.cards || [];
    const container = document.getElementById('card-carousel');
    if (!container) return;
    
    if (cards.length === 0) {
      container.innerHTML = '<div style="padding: 24px; color: var(--text-tertiary); font-size: 0.8rem;">No cards mapped</div>';
      return;
    }
    
    container.innerHTML = cards.map(c => `
      <div class="credit-card ${c.gradient || 'bg-gradient-to-br from-gray-800 to-gray-900'}" data-card-id="${c.card_id}">
        <div class="card-bank">${c.bank || 'Bank'}</div>
        <div class="card-number">•••• •••• •••• ${c.last4}</div>
        <div class="card-bottom">
          <div>
            <div class="card-name">${data.user.name || 'User'}</div>
          </div>
          <div class="card-network">${c.network || 'Visa'}</div>
        </div>
      </div>
    `).join('');
  }).catch(e => console.error('Failed to load profile cards', e));

  // Hydrate recent activity
  getTransactions(1).then(data => {
    const txns = (data.transactions || []).filter(t => t.status === 'completed').slice(0, 3);
    const container = document.getElementById('recent-activity-container');
    if (!container) return;

    if (txns.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px 16px; color: var(--text-tertiary); font-size: 0.8rem;">
          No recent transactions
        </div>
      `;
      return;
    }

    container.innerHTML = txns.map(t => {
      const emojiMap = { dining: '🍕', online_shopping: '🛒', grocery: '🥦', fuel: '⛽', travel: '✈️', movies: '🎬', utility: '💡', insurance: '🛡️', education: '📚', general: '💫' };
      const emoji = emojiMap[t.category] || '💳';
      
      let dateText = 'Just now';
      if (t.created_at) {
        const d = new Date(t.created_at);
        dateText = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      }

      return `
        <div style="display: flex; align-items: center; gap: 14px; padding: 14px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.04);">
          <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: var(--bg-elevated); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">${emoji}</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.85rem;">${t.merchant_name || t.merchant_id}</div>
            <div style="font-size: 0.7rem; color: var(--text-tertiary);">${dateText}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.9rem;">₹${(t.amount || 0).toLocaleString('en-IN')}</div>
            ${t.savings > 0 ? `<div style="font-size: 0.6rem; color: var(--park-green); font-weight: 500;">₹${(t.savings).toLocaleString('en-IN')} saved</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }).catch(e => console.error('Failed to load recent txns', e));
}
