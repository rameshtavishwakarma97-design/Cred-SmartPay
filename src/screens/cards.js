// ============================================
// Cards Screen — Detailed Wallet View (Enhanced)
// ============================================

import { getProfile, getCards, addUserCard, deleteUserCard } from '../api.js';

export function renderCards(app, navigate) {
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'cards-screen';

  screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" id="cards-back">←</button>
      <span class="header-title">My Cards</span>
      <div class="header-action">
        <button id="add-card-btn" style="background: none; border: none; font-size: 1.5rem; color: var(--orange-sunshine); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">+</button>
      </div>
    </div>
    <div id="cards-content" class="screen-padding" style="padding-top: 20px; padding-bottom: 100px;">
      <div style="text-align: center; padding: 60px 24px; color: var(--text-tertiary);">Loading your wallet...</div>
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  document.getElementById('cards-back')?.addEventListener('click', () => navigate('home'));

  document.getElementById('add-card-btn')?.addEventListener('click', () => showAddCardModal(loadCards));

  loadCards();
}

async function showAddCardModal(onSuccess) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.style.zIndex = '1000';
  
  modalOverlay.innerHTML = `
    <div class="modal" style="max-height: 80vh; display: flex; flex-direction: column;">
      <div class="modal-header">
        <h2 class="modal-title">Add New Card</h2>
      </div>
      <div class="modal-body" style="overflow-y: auto; flex: 1;">
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Select Card Template</label>
          <select id="card-template-select" style="width: 100%; background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 12px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem; appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right%2012px%20top%2050%25; background-size: 10px%20auto;">
            <option value="" disabled selected>Choose a card...</option>
          </select>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Last 4 Digits</label>
          <input type="text" id="new-card-last4" maxlength="4" placeholder="4821" style="width: 100%; background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 12px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem;">
        </div>

        <div style="margin-bottom: 5px;">
          <label style="display: block; font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Nickname (Optional)</label>
          <input type="text" id="new-card-nickname" placeholder="Primary Shopping Card" style="width: 100%; background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 12px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem;">
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-secondary" id="add-card-cancel">Cancel</button>
        <button class="modal-btn modal-btn-primary" id="add-card-confirm" disabled style="opacity: 0.5;">Add Card</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modalOverlay);
  
  let selectedTemplateId = null;

  try {
    const { cards } = await getCards();
    const select = document.getElementById('card-template-select');
    
    // Group cards by bank for better organization
    const grouped = cards.reduce((acc, c) => {
      if (!acc[c.bank]) acc[c.bank] = [];
      acc[c.bank].push(c);
      return acc;
    }, {});

    select.innerHTML = '<option value="" disabled selected>Choose a card...</option>' + 
      Object.entries(grouped).map(([bank, bankCards]) => `
        <optgroup label="${bank}">
          ${bankCards.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        </optgroup>
      `).join('');

    select.addEventListener('change', (e) => {
      selectedTemplateId = e.target.value;
      checkInputs();
    });
  } catch (err) {
    console.error('Failed to load card templates', err);
  }

  const last4Input = document.getElementById('new-card-last4');
  const confirmBtn = document.getElementById('add-card-confirm');

  const checkInputs = () => {
    const isReady = selectedTemplateId && last4Input.value.length === 4;
    confirmBtn.disabled = !isReady;
    confirmBtn.style.opacity = isReady ? '1' : '0.5';
  };

  last4Input.addEventListener('input', checkInputs);

  document.getElementById('add-card-cancel')?.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    setTimeout(() => modalOverlay.remove(), 300);
  });

  document.getElementById('add-card-confirm')?.addEventListener('click', async () => {
    const last4 = last4Input.value;
    const nickname = document.getElementById('new-card-nickname').value;
    
    confirmBtn.disabled = true;
    confirmBtn.innerText = 'Adding...';

    try {
      await addUserCard({ card_id: selectedTemplateId, last4, nickname });
      modalOverlay.classList.remove('active');
      setTimeout(() => {
        modalOverlay.remove();
        onSuccess();
      }, 300);
    } catch (err) {
      alert('Failed to add card: ' + err.message);
      confirmBtn.disabled = false;
      confirmBtn.innerText = 'Add Card';
    }
  });

  requestAnimationFrame(() => modalOverlay.classList.add('active'));
}

async function showDeleteConfirmModal(userCardId, cardName, onSuccess) {
  const modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.style.zIndex = '1000';
  
  modalOverlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Remove Card</h2>
      </div>
      <div class="modal-body">
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">Are you sure you want to remove <strong>${cardName}</strong> from your wallet?</p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-secondary" id="delete-cancel">Cancel</button>
        <button class="modal-btn modal-btn-danger" id="delete-confirm">Remove</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modalOverlay);
  
  document.getElementById('delete-cancel')?.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
    setTimeout(() => modalOverlay.remove(), 300);
  });
  
  document.getElementById('delete-confirm')?.addEventListener('click', async () => {
    try {
      await deleteUserCard(userCardId);
      modalOverlay.classList.remove('active');
      setTimeout(() => {
        modalOverlay.remove();
        onSuccess();
      }, 300);
    } catch (err) {
      alert('Failed to delete card: ' + err.message);
    }
  });
  
  requestAnimationFrame(() => modalOverlay.classList.add('active'));
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
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                <div style="text-align: right;">
                  <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-bottom: 2px;">Annual Fee</div>
                  <div style="font-weight: 700; font-family: var(--font-display); font-size: 1rem; color: ${annualFee === 0 ? '#4caf50' : 'var(--text-primary)'};">
                    ${annualFee === 0 ? 'FREE' : '₹' + annualFee.toLocaleString('en-IN')}
                  </div>
                </div>
                <button class="delete-card-btn" data-id="${c.user_card_id}" data-name="${c.full_name || c.nickname}" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: var(--error); border-radius: 6px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 150ms ease;">
                  <span style="font-size: 1rem;">🗑️</span>
                </button>
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

    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const name = e.currentTarget.dataset.name;
        showDeleteConfirmModal(id, name, loadCards);
      });
    });

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
