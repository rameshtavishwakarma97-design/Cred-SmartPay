// ============================================
// Custom Confirmation Modal Component
// ============================================

export function showModal({
  title = 'Confirmation',
  desc = 'Are you sure?',
  icon = '⚠️',
  confirmText = 'OK',
  cancelText = 'Cancel',
  neutralText = null,
  danger = false
}) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    overlay.innerHTML = `
      <div class="modal">
        <button class="modal-close" id="modal-close">×</button>
        <div class="modal-content">
          <span class="modal-icon">${icon}</span>
          <h3 class="modal-title">${title}</h3>
          <p class="modal-desc">${desc}</p>
        </div>
        <div class="modal-actions" style="flex-direction: column; gap: 8px;">
          ${confirmText ? `
            <button class="modal-btn ${danger ? 'modal-btn-danger' : 'modal-btn-primary'}" id="modal-confirm" style="width: 100%;">
              ${confirmText}
            </button>
          ` : ''}
          ${neutralText ? `
            <button class="modal-btn modal-btn-secondary" id="modal-neutral" style="width: 100%;">
              ${neutralText}
            </button>
          ` : ''}
          ${cancelText ? `
            <button class="modal-btn modal-btn-secondary" id="modal-cancel" style="width: 100%;">
              ${cancelText}
            </button>
          ` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      overlay.classList.add('active');
    });

    const cleanup = (result) => {
      overlay.classList.remove('active');
      setTimeout(() => {
        document.body.removeChild(overlay);
        resolve(result);
      }, 300);
    };

    overlay.querySelector('#modal-close').addEventListener('click', () => cleanup('cancel'));
    if (confirmText) {
      overlay.querySelector('#modal-confirm').addEventListener('click', () => cleanup('confirm'));
    }
    if (cancelText) {
      overlay.querySelector('#modal-cancel').addEventListener('click', () => cleanup('cancel'));
    }
    if (neutralText) {
      overlay.querySelector('#modal-neutral').addEventListener('click', () => cleanup('neutral'));
    }
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cleanup('cancel');
    });
  });
}
