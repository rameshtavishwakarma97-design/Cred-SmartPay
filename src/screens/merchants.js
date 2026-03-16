// ============================================
// Merchant Selection Screen
// ============================================

import { merchants, categories } from '../data/merchants.js';

export function renderMerchants(app, navigate) {
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'merchants-screen';

  screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" id="merchants-back">←</button>
      <span class="header-title">CRED Recommend</span>
      <div class="header-action"></div>
    </div>

    <!-- Search -->
    <div class="search-bar stagger-1">
      <span class="search-icon">🔍</span>
      <input type="text" id="merchant-search" placeholder="Search merchants..." autocomplete="off" />
    </div>

    <!-- Category Pills -->
    <div class="pill-row stagger-2" id="category-pills">
      ${categories.map((cat, i) => `
        <button class="pill ${i === 0 ? 'active' : ''}" data-category="${cat.id}">
          ${cat.emoji} ${cat.label}
        </button>
      `).join('')}
    </div>

    <!-- Featured Merchants -->
    <div class="section-header stagger-3">
      <span class="section-title">Popular Merchants</span>
    </div>

    <div class="screen-padding stagger-3" id="merchant-grid" style="display: flex; flex-direction: column; gap: 10px; padding-bottom: 32px;">
      ${renderMerchantList(merchants)}
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  // Back button
  document.getElementById('merchants-back')?.addEventListener('click', () => navigate('home'));

  // Category filtering
  let activeCategory = 'all';
  document.getElementById('category-pills')?.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (!pill) return;

    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeCategory = pill.dataset.category;

    filterMerchants(activeCategory, document.getElementById('merchant-search')?.value || '');
  });

  // Search filtering
  document.getElementById('merchant-search')?.addEventListener('input', (e) => {
    filterMerchants(activeCategory, e.target.value);
  });

  // Merchant click
  document.getElementById('merchant-grid')?.addEventListener('click', (e) => {
    const tile = e.target.closest('.merchant-tile');
    if (!tile) return;

    tile.style.transform = 'scale(0.97)';
    setTimeout(() => {
      const merchantId = tile.dataset.merchantId;
      navigate('transaction', { merchantId });
    }, 150);
  });
}

function filterMerchants(category, search) {
  let filtered = merchants;

  if (category !== 'all') {
    filtered = filtered.filter(m => m.category === category);
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.categoryLabel.toLowerCase().includes(q)
    );
  }

  const grid = document.getElementById('merchant-grid');
  if (grid) {
    grid.innerHTML = filtered.length
      ? renderMerchantList(filtered)
      : `<div style="text-align: center; padding: 48px 20px; color: var(--text-tertiary); font-size: 0.85rem;">No merchants found</div>`;
  }
}

function renderMerchantList(list) {
  return list.map(m => `
    <div class="merchant-tile" data-merchant-id="${m.id}">
      <div class="merchant-logo" style="background: ${m.bgColor}22;">
        <span>${m.emoji}</span>
      </div>
      <div class="merchant-info">
        <div class="merchant-name">${m.name}</div>
        <div class="merchant-category">${m.categoryLabel}</div>
        ${m.credOffer ? `<div class="merchant-offer" style="margin-top: 4px; display: inline-block;">${m.credOffer}</div>` : ''}
      </div>
      <div class="merchant-arrow">›</div>
    </div>
  `).join('');
}
