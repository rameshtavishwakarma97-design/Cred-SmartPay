// ============================================
// CRED Smart Pay — Main Router (v2 with Auth)
// ============================================

import './style.css';
import { isLoggedIn, getUser, createPendingTransaction } from './api.js';
import { renderLogin } from './screens/login.js';
import { renderHome } from './screens/home.js';
import { renderMerchants } from './screens/merchants.js';
import { renderTransaction } from './screens/transaction.js';
import { renderRecommendation } from './screens/recommendation.js';
import { renderConfirm } from './screens/confirm.js';
import { renderSuccess } from './screens/success.js';
import { renderHistory } from './screens/history.js';
import { renderCancel } from './screens/cancel.js';
import { renderCards } from './screens/cards.js';
import { renderUpiPin } from './screens/upi_pin.js';
import { renderMerchantSimulator } from './screens/merchant_simulator.js';
import { renderCategorySelection } from './screens/category_selection.js';
import { renderDashboard } from './screens/dashboard.js';
import { merchants } from './data/merchants.js';

const app = document.getElementById('app');

// Create layout structure
app.innerHTML = `
  <div id="screen-container" style="min-height: 100vh;"></div>
  <div id="global-nav"></div>
`;

const screenContainer = document.getElementById('screen-container');
const globalNav = document.getElementById('global-nav');

// Global state
let currentScreen = 'home';
let screenParams = {};

// Screen registry
const screens = {
  login: renderLogin,
  home: renderHome,
  merchants: renderMerchants,
  transaction: renderTransaction,
  recommendation: renderRecommendation,
  confirm: renderConfirm,
  success: renderSuccess,
  history: renderHistory,
  cancel: renderCancel,
  cards: renderCards,
  upi_pin: renderUpiPin,
  merchant_simulator: renderMerchantSimulator,
  dashboard: renderDashboard,
  category_selection: renderCategorySelection,
};

// Protected screens (require login)
const publicScreens = ['login'];

// Navigation function
function sanitizeScreen(screen) {
  const user = getUser();
  const loggedIn = isLoggedIn();

  if (!publicScreens.includes(screen) && !loggedIn) {
    return 'login';
  }

  if (loggedIn && user) {
    if (user.role === 'admin') {
      if (screen !== 'dashboard' && screen !== 'login') {
        return 'dashboard';
      }
    } else {
      if (screen === 'dashboard') {
        return 'home';
      }
    }
  }
  return screen;
}

// Navigation function
function navigate(screen, params = {}) {
  currentScreen = sanitizeScreen(screen);
  screenParams = params;

  const hash = `#${currentScreen}${params.merchantId ? `/${params.merchantId}` : ''}`;
  history.pushState({ screen: currentScreen, params }, '', hash);

  render();
}

// Render Footer
function renderFooter() {
  if (currentScreen === 'login' || currentScreen === 'upi_pin' || currentScreen === 'success' || currentScreen === 'merchant_simulator' || currentScreen === 'dashboard') {
    globalNav.innerHTML = '';
    return;
  }

  globalNav.innerHTML = `
    <div class="bottom-nav">
      <button class="nav-item ${currentScreen === 'home' ? 'active' : ''}" id="nav-home">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">HOME</span>
      </button>
      <button class="nav-item ${currentScreen === 'cards' ? 'active' : ''}" id="nav-cards">
        <span class="nav-icon">💳</span>
        <span class="nav-label">CARDS</span>
      </button>
      <button class="nav-item-center" id="nav-upi">
        <span class="nav-icon">💸</span>
        <span class="nav-label">UPI</span>
      </button>
      <button class="nav-item ${currentScreen === 'history' ? 'active' : ''}" id="nav-history">
        <span class="nav-icon">📊</span>
        <span class="nav-label">HISTORY</span>
      </button>
      <button class="nav-item" id="nav-more">
        <span class="nav-icon">⠿</span>
        <span class="nav-label">MORE</span>
      </button>
    </div>
  `;

  // Add listeners
  document.getElementById('nav-home')?.addEventListener('click', () => navigate('home'));
  document.getElementById('nav-cards')?.addEventListener('click', () => navigate('cards'));
  document.getElementById('nav-upi')?.addEventListener('click', () => {
    const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
    navigate('transaction', { merchantId: randomMerchant.id, forceUpi: true });
  });
  document.getElementById('nav-history')?.addEventListener('click', () => navigate('history'));

  // Only show MORE (Dashboard) for admins in the footer if at all
  const user = getUser();
  if (user?.role === 'admin') {
    document.getElementById('nav-more')?.addEventListener('click', () => navigate('dashboard'));
  } else {
    // Hide or disable for non-admins
    const moreBtn = document.getElementById('nav-more');
    if (moreBtn) moreBtn.style.opacity = '0.3';
  }
}

// Render current screen
function render() {
  currentScreen = sanitizeScreen(currentScreen);
  const renderFn = screens[currentScreen];

  if (renderFn) {
    renderFn(screenContainer, navigate, screenParams);
  } else {
    renderHome(screenContainer, navigate);
  }

  renderFooter();
}

// Handle browser back/forward
window.addEventListener('popstate', (e) => {
  if (e.state) {
    currentScreen = e.state.screen;
    screenParams = e.state.params || {};
  } else {
    currentScreen = 'home';
    screenParams = {};
  }
  render();
});

// Initial render — check auth and check URL params for inbound requests
async function initApp() {
  const urlParams = new URLSearchParams(window.location.search);
  const simulator = urlParams.get('simulator');
  const inboundMerchant = urlParams.get('merchant');
  const inboundCategory = urlParams.get('category');
  const inboundAmount = urlParams.get('amount');
  const inboundOrderId = urlParams.get('orderId');
  if (window.history.state && window.history.state.params) {
    screenParams = window.history.state.params;
  }

  if (simulator === 'true') {
    currentScreen = 'merchant_simulator';
    render();
    return;
  }

  const dashboard = urlParams.get('dashboard');
  if (dashboard === 'true') {
    currentScreen = 'dashboard';
    render();
    return;
  }

  if (inboundMerchant && inboundCategory && inboundAmount) {
    const pendingTxnParams = {
      merchantId: inboundMerchant,
      category: inboundCategory,
      amount: inboundAmount,
      orderId: inboundOrderId
    };

    // Clear URL params so refresh doesn't trigger it again
    window.history.replaceState({}, document.title, window.location.pathname);

    if (isLoggedIn()) {
      try {
        const res = await createPendingTransaction({
          merchant_id: inboundMerchant,
          merchant_name: inboundMerchant,
          category: inboundCategory,
          amount: parseFloat(inboundAmount)
        });

        if (autoOpen) {
          currentScreen = 'transaction';
          screenParams = { ...pendingTxnParams, transactionId: res.id };
          const hash = `#transaction/${inboundMerchant}`;
          history.replaceState({ screen: 'transaction', params: screenParams }, '', hash);
        } else {
          currentScreen = 'home';
          screenParams = {};
          history.replaceState({ screen: 'home', params: {} }, '', '#home');
        }
        render();
        return;
      } catch (e) {
        console.error('Failed to create pending transaction', e);
      }
    } else {
      sessionStorage.setItem('pendingTransaction', JSON.stringify(pendingTxnParams));
    }
  }

  // Check session storage for pending transaction
  const pendingTxnStr = sessionStorage.getItem('pendingTransaction');
  if (pendingTxnStr) {
    try {
      const pendingTxnParams = JSON.parse(pendingTxnStr);
      if (isLoggedIn()) {
        sessionStorage.removeItem('pendingTransaction');
        const res = await createPendingTransaction({
          merchant_id: pendingTxnParams.merchantId,
          merchant_name: pendingTxnParams.merchantId,
          category: pendingTxnParams.category,
          amount: parseFloat(pendingTxnParams.amount)
        });

        currentScreen = 'transaction';
        screenParams = { ...pendingTxnParams, transactionId: res.id };
        const hash = `#transaction/${pendingTxnParams.merchantId}`;
        history.replaceState({ screen: 'transaction', params: screenParams }, '', hash);
        render();
        return;
      }
    } catch (e) {
      console.error('Failed to parse pending transaction');
    }
  }

  // Restore state from hash if possible
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const parts = hash.split('/');
    currentScreen = parts[0];
    if (window.history.state && window.history.state.params) {
      screenParams = window.history.state.params;
    } else if (parts[1]) {
      // Fallback: extract merchantId from hash if history state is missing
      screenParams = { merchantId: parts[1] };
    }
  }

  if (!isLoggedIn()) {
    currentScreen = 'login';
  }

  render();
}

initApp();
