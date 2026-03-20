// ============================================
// API Utility — fetch with JWT token
// ============================================

const API_BASE = '/api';

export function getToken() {
  return localStorage.getItem('smartpay_token');
}

export function setToken(token) {
  localStorage.setItem('smartpay_token', token);
}

export function clearToken() {
  localStorage.removeItem('smartpay_token');
  localStorage.removeItem('smartpay_user');
}

export function getUser() {
  const raw = localStorage.getItem('smartpay_user');
  return raw ? JSON.parse(raw) : null;
}

export function setUser(user) {
  localStorage.setItem('smartpay_user', JSON.stringify(user));
}

export function isLoggedIn() {
  return !!getToken();
}

export async function api(endpoint, options = {}) {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, config);

  // Try to parse JSON, if it fails and res is not OK, throw status error
  let data;
  const contentType = res.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`Server Error (${res.status}): ${res.status === 404 ? 'Endpoint not found. Is the server restarted?' : 'Internal Server Error'}`);
    }
    // If OK but not JSON (unexpected)
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error('Server returned non-JSON response');
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
      window.location.hash = '#login';
    }
    throw new Error(data.error || 'API error');
  }

  return data;
}

// Auth helpers
export async function signup(email, name, password) {
  const data = await api('/auth/signup', {
    method: 'POST',
    body: { email, name, password }
  });
  setToken(data.token);
  setUser(data.user);
  return data;
}

export async function login(email, password) {
  const data = await api('/auth/login', {
    method: 'POST',
    body: { email, password }
  });
  setToken(data.token);
  setUser(data.user);
  return data;
}

export async function getProfile() {
  const data = await api('/auth/me');
  setUser(data.user);
  return data;
}

// Transaction helpers
export async function recordTransaction(txn) {
  console.log('API: Recording transaction:', txn);
  return api('/transactions', { method: 'POST', body: txn });
}

export async function getTransactions(page = 1, filters = {}) {
  const params = new URLSearchParams({ page, ...filters });
  return api(`/transactions?${params}`);
}

export async function getTransactionStats() {
  return api('/transactions/stats');
}

// Card helpers
export async function getCards() {
  return api('/cards');
}

// Recommendation helper
export async function getSmartRecommendation(merchantId, merchantName, category, amount, credCashback = 0, mcc = null) {
  return api('/recommend', {
    method: 'POST',
    body: {
      merchant_id: merchantId,
      merchant_name: merchantName,
      category,
      amount,
      cred_cashback: credCashback,
      mcc: mcc
    }
  });
}

// Offer helpers
export async function getActiveOffers(filters = {}) {
  const params = new URLSearchParams(filters);
  return api(`/offers?${params}`);
}

export async function getOffersForTransaction(cardId, merchantId, category, amount) {
  const params = new URLSearchParams({ card_id: cardId, merchant_id: merchantId, category, amount });
  return api(`/offers/for-transaction?${params}`);
}

// Pending Transaction helpers
export async function createPendingTransaction(data) {
  return api('/transactions/pending', { method: 'POST', body: data });
}

export async function updateTransactionStatus(id, status, extraData = {}) {
  console.log('API: Updating transaction status:', { id, status, ...extraData });
  return api(`/transactions/${id}/status`, { method: 'PUT', body: { status, ...extraData } });
}

// Analytics helpers
export async function logFunnelEvent(eventName, metadata = {}) {
  const user = getUser();
  const sessionId = sessionStorage.getItem('analytics_session_id') || 'anon-' + Date.now();
  if (!sessionStorage.getItem('analytics_session_id')) {
    sessionStorage.setItem('analytics_session_id', sessionId);
  }

  return api('/analytics/log', {
    method: 'POST',
    body: {
      session_id: sessionId,
      user_id: user ? user.id : null,
      event_name: eventName,
      metadata
    }
  }).catch(err => console.warn('Analytics log failed', err));
}

export async function updateRecommendationSelection(impressionId, selectedCardId) {
  if (!impressionId) return;
  return api(`/recommend/${impressionId}/select`, {
    method: 'PUT',
    body: { selected_card_id: selectedCardId }
  }).catch(err => console.warn('Selection log failed', err));
}

export async function getAnalyticsStats() {
  return api('/analytics/stats');
}

export async function addUserCard(cardData) {
  return api('/auth/cards', { method: 'POST', body: cardData });
}

export async function deleteUserCard(userCardId) {
  return api(`/auth/cards/${userCardId}`, { method: 'DELETE' });
}
