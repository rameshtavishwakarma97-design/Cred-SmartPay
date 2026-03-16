// ============================================
// Cancel Screen (Inbound Requests)
// ============================================

export function renderCancel(app, navigate, params = {}) {
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'cancel-screen';

  screen.innerHTML = `
    <div class="screen-header">
      <span class="header-title">Payment Cancelled</span>
    </div>
    
    <div class="success-content stagger-1" style="height: 70vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 24px;">
      <div class="success-icon" style="background: rgba(239,68,68,0.1); color: #ef4444; width: 80px; height: 80px; border-radius: 40px; display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 24px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>
      
      <h2 style="font-size: 1.5rem; margin-bottom: 12px; font-weight: 700;">Transaction Cancelled</h2>
      <p style="color: var(--text-secondary); line-height: 1.5; font-size: 0.95rem;">
        You cancelled the payment request from ${params.merchantName || 'the merchant'}.
      </p>
      
      <div style="margin-top: 32px; width: 100%;">
        <button class="neo-btn" id="btn-home" style="background: var(--bg-elevated); color: white; width: 100%;">Return to Home</button>
      </div>
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  document.getElementById('btn-home')?.addEventListener('click', () => {
    navigate('home');
  });
}
