// ============================================
// Login / Signup Screen
// ============================================

import { login, signup, isLoggedIn, getUser, createPendingTransaction } from '../api.js';

export function renderLogin(app, navigate) {
  const user = getUser();
  if (user) {
    navigate(user.role === 'admin' ? 'dashboard' : 'home');
    return;
  }

  let mode = 'login'; // or 'signup'

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'login-screen';
  screen.style.cssText = 'display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 24px;';

  function render() {
    screen.innerHTML = `
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 60px;" class="stagger-1">
        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 950; letter-spacing: -0.02em; text-transform: uppercase;">
          CRED
        </div>
      </div>

      <!-- Form -->
      <div class="stagger-2" style="width: 100%; max-width: 340px;">
        <!-- Mode Tabs -->
        <div style="display: flex; background: var(--bg-card); border-radius: var(--radius-xl); padding: 4px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.06);">
          <button class="login-tab ${mode === 'login' ? 'active' : ''}" id="tab-login" style="flex: 1; padding: 10px; border: none; background: ${mode === 'login' ? 'var(--poli-purple)' : 'transparent'}; color: var(--text-primary); border-radius: var(--radius-lg); font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: all 0.2s;">
            Login
          </button>
          <button class="login-tab ${mode === 'signup' ? 'active' : ''}" id="tab-signup" style="flex: 1; padding: 10px; border: none; background: ${mode === 'signup' ? 'var(--poli-purple)' : 'transparent'}; color: var(--text-primary); border-radius: var(--radius-lg); font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: all 0.2s;">
            Sign Up
          </button>
        </div>

        ${mode === 'signup' ? `
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Full Name</label>
            <input type="text" id="input-name" placeholder="Shreyansh M" style="width: 100%; padding: 14px 16px; background: var(--bg-card); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-lg); color: var(--text-primary); font-size: 0.9rem; outline: none; box-sizing: border-box;" />
          </div>
        ` : ''}

        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Email</label>
          <input type="email" id="input-email" placeholder="shreyansh@email.com" style="width: 100%; padding: 14px 16px; background: var(--bg-card); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-lg); color: var(--text-primary); font-size: 0.9rem; outline: none; box-sizing: border-box;" />
        </div>

        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Password</label>
          <input type="password" id="input-password" placeholder="••••••••" style="width: 100%; padding: 14px 16px; background: var(--bg-card); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-lg); color: var(--text-primary); font-size: 0.9rem; outline: none; box-sizing: border-box;" />
        </div>

        <!-- Error -->
        <div id="login-error" style="display: none; padding: 10px 14px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.15); border-radius: var(--radius-md); margin-bottom: 16px; font-size: 0.75rem; color: var(--error);"></div>

        <!-- Submit -->
        <button class="neo-btn neo-btn-primary neo-btn-full" id="submit-btn">
          ${mode === 'login' ? '→ Login' : '→ Create Account'}
        </button>

        <div style="text-align: center; margin-top: 20px; font-size: 0.72rem; color: var(--text-tertiary);">
          ${mode === 'login' ? 'New here? Switch to <strong>Sign Up</strong> tab above' : 'Already have an account? Switch to <strong>Login</strong> tab'}
        </div>
      </div>
    `;

    // Event listeners
    screen.querySelector('#tab-login')?.addEventListener('click', () => { mode = 'login'; render(); });
    screen.querySelector('#tab-signup')?.addEventListener('click', () => { mode = 'signup'; render(); });

    screen.querySelector('#submit-btn')?.addEventListener('click', handleSubmit);

    // Enter key
    screen.querySelectorAll('input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSubmit();
      });
    });
  }

  async function handleSubmit() {
    const email = screen.querySelector('#input-email')?.value?.trim();
    const password = screen.querySelector('#input-password')?.value;
    const name = screen.querySelector('#input-name')?.value?.trim();
    const errorEl = screen.querySelector('#login-error');
    const btn = screen.querySelector('#submit-btn');

    if (!email || !password || (mode === 'signup' && !name)) {
      showError(errorEl, 'Please fill in all fields');
      return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Please wait...';

    try {
      if (mode === 'signup') {
        const data = await signup(email, name, password);
        if (data.user.role === 'admin') { navigate('dashboard'); return; }
      } else {
        const data = await login(email, password);
        if (data.user.role === 'admin') { navigate('dashboard'); return; }
      }
      
      // Check for pending transaction
      const pendingTxnStr = sessionStorage.getItem('pendingTransaction');
      if (pendingTxnStr) {
        try {
          const pendingTxnParams = JSON.parse(pendingTxnStr);
          sessionStorage.removeItem('pendingTransaction');
          
          const res = await createPendingTransaction({
            merchant_id: pendingTxnParams.merchantId,
            merchant_name: pendingTxnParams.merchantId,
            category: pendingTxnParams.category,
            amount: parseFloat(pendingTxnParams.amount)
          });
          
          navigate('transaction', { ...pendingTxnParams, transactionId: res.id });
          return;
        } catch (e) {
          console.error('Failed to handle pending transaction', e);
        }
      }
      
      navigate('home');
    } catch (err) {
      showError(errorEl, err.message);
      btn.disabled = false;
      btn.textContent = mode === 'login' ? '→ Login' : '→ Create Account';
    }
  }

  function showError(el, msg) {
    if (el) {
      el.textContent = msg;
      el.style.display = 'block';
      setTimeout(() => { el.style.display = 'none'; }, 4000);
    }
  }

  render();
  app.innerHTML = '';
  app.appendChild(screen);
}
