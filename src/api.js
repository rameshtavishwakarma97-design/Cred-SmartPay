// ============================================
// API Utility — fetch with JWT token
// ============================================

const API_BASE = 'http://localhost:3001/api';

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
  const data = await res.json();

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
export async function getSmartRecommendation(merchantId, merchantName, category, amount, credCashback = 0) {
  return api('/recommend', {
    method: 'POST',
    body: {
      merchant_id: merchantId,
      merchant_name: merchantName,
      category,
      amount,
      cred_cashback: credCashback
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
  return api(`/transactions/${id}/status`, { method: 'PUT', body: { status, ...extraData } });
}
