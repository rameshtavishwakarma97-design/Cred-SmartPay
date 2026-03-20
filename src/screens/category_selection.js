// ============================================
// Category Selection Screen
// ============================================

import { merchants } from '../data/merchants.js';

export function renderCategorySelection(app, navigate, params) {
    const merchant = merchants.find(m => m.id === params.merchantId);
    if (!merchant || !merchant.subCategories) {
        navigate('transaction', params);
        return;
    }

    const screen = document.createElement('div');
    screen.className = 'screen';
    screen.id = 'category-selection-screen';

    screen.innerHTML = `
    <div class="screen-header">
      <button class="back-btn" id="cat-back">←</button>
      <span class="header-title">Select Category</span>
      <div class="header-action"></div>
    </div>

    <div style="padding: 24px;">
      <div style="display:flex; align-items:center; gap:12px; margin-bottom: 8px;">
        <div style="width: 40px; height: 40px; border-radius: 10px; background: ${merchant.bgColor}22; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
          ${merchant.emoji}
        </div>
        <div style="font-size: 1.2rem; font-weight: 700;">${merchant.name}</div>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.4;">
        Amazon transactions vary by category. Select the best match for accurate reward recommendations.
      </div>

      <div class="category-list" style="display: flex; flex-direction: column; gap: 12px;">
        ${merchant.subCategories.map(cat => `
          <div class="neo-card category-item" data-id="${cat.id}" style="padding: 16px; cursor: pointer; border: 1px solid rgba(255,255,255,0.06); transition: all 0.2s ease;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);">${cat.label}</div>
              <div style="font-size: 0.6rem; color: var(--text-tertiary); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">MCC ${cat.mcc}</div>
            </div>
            <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 6px; line-height: 1.3;">${cat.description}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

    app.innerHTML = '';
    app.appendChild(screen);

    // Animation stagger
    screen.querySelectorAll('.category-item').forEach((item, i) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(10px)';
        setTimeout(() => {
            item.style.transition = 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 + (i * 50));
    });

    document.getElementById('cat-back').addEventListener('click', () => navigate('merchants', params));

    screen.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('mousedown', () => {
            item.style.transform = 'scale(0.98)';
            item.style.borderColor = 'var(--poli-purple)';
        });
        item.addEventListener('mouseup', () => {
            item.style.transform = 'scale(1)';
        });
        item.addEventListener('click', () => {
            const catId = item.dataset.id;
            const subCat = merchant.subCategories.find(c => c.id === catId);
            navigate('transaction', {
                ...params,
                category: subCat.category,
                subCategory: subCat.id,
                subCategoryLabel: subCat.label,
                mcc: subCat.mcc
            });
        });
    });
}
