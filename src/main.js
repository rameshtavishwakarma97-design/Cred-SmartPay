// ============================================
// CRED Smart Pay — Main Router (v2 with Auth)
// ============================================

import './style.css';
import { isLoggedIn, createPendingTransaction } from './api.js';
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

const app = document.getElementById('app');

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
};

// Protected screens (require login)
const publicScreens = ['login'];

// Navigation function
function navigate(screen, params = {}) {
  // Auth guard
  if (!publicScreens.includes(screen) && !isLoggedIn()) {
    screen = 'login';
    params = {};
  }

  currentScreen = screen;
  screenParams = params;

  const hash = `#${screen}${params.merchantId ? `/${params.merchantId}` : ''}`;
  history.pushState({ screen, params }, '', hash);

  render();
}

// Render current screen
function render() {
  const renderFn = screens[currentScreen];
  if (renderFn) {
    renderFn(app, navigate, screenParams);
  } else {
    renderHome(app, navigate);
  }
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
  const inboundMerchant = urlParams.get('merchant');
  const inboundCategory = urlParams.get('category');
  const inboundAmount = urlParams.get('amount');
  const inboundOrderId = urlParams.get('orderId');

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
        
        currentScreen = 'transaction';
        screenParams = { ...pendingTxnParams, transactionId: res.id };
        const hash = `#transaction/${inboundMerchant}`;
        history.replaceState({ screen: 'transaction', params: screenParams }, '', hash);
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

  if (!isLoggedIn()) {
    currentScreen = 'login';
  }
  
  render();
}

initApp();
