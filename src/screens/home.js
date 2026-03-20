// ============================================
// Home Screen — Card wallet + Quick Actions
// ============================================

import { clearToken, getUser, getTransactions, getProfile, logFunnelEvent } from '../api.js';

export function renderHome(app, navigate) {
  logFunnelEvent('home_viewed');
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'home-screen';

  screen.innerHTML = `
    <!-- Header -->
    <div style="padding: 24px 24px 12px; display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary);">
      <div>
        <div style="display: flex; align-items: baseline; gap: 8px;">
          <span style="font-size: 1.1rem; color: var(--text-primary); font-weight: 700; letter-spacing: -0.02em;">explore</span>
          <span style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; letter-spacing: -0.01em; color: var(--text-primary); text-transform: uppercase;">CRED</span>
          <span class="new-badge-nudge">SMART PAY ⚡</span>
        </div>
        <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 4px; letter-spacing: 0.05em;">Best card recommendations inside 🧠</div>
      </div>
      <div id="profile-btn" style="width: 40px; height: 40px; border-radius: 50%; background: #000000; border: 1.5px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 14c-3.314 0-6 2.686-6 6v1h12v-1c0-3.314-2.686-6-6-6z" />
          <circle cx="12" cy="8" r="4" />
          <path d="M7 6.5s1-1.5 5-1.5 5 1.5 5 1.5M7 6.5v1M17 6.5v1" />
        </svg>
      </div>
    </div>

    <!-- PENDING PAYMENTS Section (Dynamic) -->
    <div id="pending-requests-section" style="display: none; padding: 0 24px 20px;">
      <div class="section-group-title" style="margin-bottom: 12px; color: var(--orange-sunshine);">PENDING PAYMENTS</div>
      <div id="pending-requests-container" style="display: flex; flex-direction: column; gap: 12px;"></div>
    </div>

    <!-- CARDS Section (Dynamic) -->
    <div class="section-group stagger-1">
      <div class="section-group-title">YOUR CARDS</div>
      <div id="card-carousel" class="card-carousel" style="padding-left: 0; padding-right: 0; margin-left: -24px; margin-right: -24px;">
        <div style="padding: 0 24px; color: var(--text-tertiary); font-size: 0.8rem;">Loading cards...</div>
      </div>
    </div>

    <!-- POPULAR Section -->
    <div class="section-group stagger-1">
      <div class="section-group-title">POPULAR</div>
      <div class="grid-4">
        <div class="icon-item" id="qa-scan">
          <div class="circular-icon">📷</div>
          <div class="icon-label">SCAN<br>& PAY</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">👤</div>
          <div class="icon-label">PAY<br>CONTACTS</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">🏦</div>
          <div class="icon-label">BANK<br>ACCOUNTS</div>
        </div>
        <div class="icon-item nudge-highlight" id="nav-smartpay">
          <div class="circular-icon" style="background: radial-gradient(circle at center, #2A1A2A 0%, #1A1A1A 100%);">🧠</div>
          <div class="icon-label">SmartPay</div>
        </div>
      </div>
    </div>

    <!-- Banner -->
    <div class="mint-card stagger-2">
      <div class="mint-info">
        <div class="mint-icon">💎</div>
        <div>
          <div class="mint-text-title">CRED mint</div>
          <div class="mint-text-desc">invest and earn up to 9% p.a.</div>
        </div>
      </div>
      <div style="color: var(--text-tertiary);">›</div>
    </div>

    <!-- MONEY MATTERS Section -->
    <div class="section-group stagger-3">
      <div class="section-group-title">MONEY MATTERS</div>
      <div class="grid-4">
        <div class="icon-item">
          <div class="circular-icon">📊</div>
          <div class="icon-label">CREDIT<br>SCORE</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">📈</div>
          <div class="icon-label">INVEST</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">💰</div>
          <div class="icon-label">CASH</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">🧪</div>
          <div class="icon-label">MINT</div>
        </div>
      </div>
    </div>

    <!-- BILLS Section -->
    <div class="section-group stagger-4">
      <div class="section-group-title">BILLS</div>
      <div class="grid-4">
        <div class="icon-item">
          <div class="circular-icon">💡</div>
          <div class="icon-label">ELECTRICITY</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">📱</div>
          <div class="icon-label">MOBILE</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">📡</div>
          <div class="icon-label">DTH</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">➕</div>
          <div class="icon-label">VIEW ALL</div>
        </div>
      </div>
    </div>

    <!-- RECENT ACTIVITY Section (Dynamic) -->
    <div class="section-group stagger-5" style="margin-top: 24px;">
      <div class="section-group-title">RECENT ACTIVITY</div>
      <div id="recent-activity-container" style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
        <div style="padding: 12px; color: var(--text-tertiary); font-size: 0.8rem;">Loading activity...</div>
      </div>
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  // Nudge Highlight Animation (first 2 seconds)
  const smartPayNudge = screen.querySelector('#nav-smartpay');
  if (smartPayNudge) {
    setTimeout(() => {
      smartPayNudge.classList.add('active');
      setTimeout(() => {
        smartPayNudge.classList.remove('active');
        // Add a permanent subtle glow instead? No, user just said 1-2 seconds.
      }, 2000);
    }, 500);
  }

  // Event listeners
  document.getElementById('qa-scan')?.addEventListener('click', () => navigate('merchants'));
  document.getElementById('nav-smartpay')?.addEventListener('click', () => navigate('merchants', { isSimulation: true }));
  document.getElementById('profile-btn')?.addEventListener('click', () => {
    // Custom Logout Modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.zIndex = '1000';

    modalOverlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Logout</h2>
        </div>
        <div class="modal-body">
          <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">Are you sure you want to log out of your CRED Smart Pay account?</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-secondary" id="logout-cancel">Cancel</button>
          <button class="modal-btn modal-btn-danger" id="logout-confirm">Logout</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    document.getElementById('logout-cancel')?.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      setTimeout(() => modalOverlay.remove(), 300);
    });

    document.getElementById('logout-confirm')?.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      setTimeout(() => {
        modalOverlay.remove();
        clearToken();
        navigate('login');
      }, 300);
    });

    // Trigger entry animation
    requestAnimationFrame(() => {
      modalOverlay.classList.add('active');
    });
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
