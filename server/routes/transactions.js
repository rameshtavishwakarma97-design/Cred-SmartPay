// ============================================
// Transaction Routes — CRUD + Stats
// ============================================

import { Router } from 'express';
import { authMiddleware } from './auth.js';
import { getDb } from '../db.js';

const router = Router();

// POST /api/transactions — Record a payment
router.post('/', authMiddleware, (req, res) => {
  const { card_id, merchant_id, merchant_name, category, amount, savings, potential_savings, offer_id } = req.body;

  if (!card_id || !merchant_id || !category || !amount) {
    return res.status(400).json({ error: 'card_id, merchant_id, category, amount required' });
  }

  const db = getDb();

  const result = db.prepare(`
    INSERT INTO transactions (user_id, card_id, merchant_id, merchant_name, category, amount, savings, potential_savings, offer_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.userId, card_id, merchant_id, merchant_name || '', category, amount, savings || 0, potential_savings || 0, offer_id || null);

  // Record offer usage if applicable
  if (offer_id) {
    db.prepare(`
      INSERT INTO offer_usage (user_id, offer_id, transaction_id) VALUES (?, ?, ?)
    `).run(req.userId, offer_id, result.lastInsertRowid);
  }

  res.status(201).json({
    id: result.lastInsertRowid,
    message: 'Transaction recorded'
  });
});

// POST /api/transactions/pending — Create a pending inbound request
router.post('/pending', authMiddleware, (req, res) => {
  const { merchant_id, merchant_name, category, amount } = req.body;

  if (!merchant_id || !category || !amount) {
    return res.status(400).json({ error: 'merchant_id, category, amount required' });
  }

  const db = getDb();
  const result = db.prepare(`
    INSERT INTO transactions (user_id, merchant_id, merchant_name, category, amount, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `).run(req.userId, merchant_id, merchant_name || '', category, amount);

  res.status(201).json({
    id: result.lastInsertRowid,
    message: 'Pending transaction created'
  });
});

// PUT /api/transactions/:id/status — Complete or cancel a transaction
router.put('/:id/status', authMiddleware, (req, res) => {
  const { status, card_id, savings, potential_savings, offer_id } = req.body;
  const db = getDb();
  
  if (!['completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  // Verify ownership
  const txn = db.prepare('SELECT id FROM transactions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!txn) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  db.prepare(`
    UPDATE transactions 
    SET status = ?, card_id = COALESCE(?, card_id), savings = COALESCE(?, savings), potential_savings = COALESCE(?, potential_savings), offer_id = COALESCE(?, offer_id)
    WHERE id = ?
  `).run(status, card_id || null, savings ?? null, potential_savings ?? null, offer_id || null, req.params.id);

  if (offer_id && status === 'completed') {
    db.prepare('INSERT INTO offer_usage (user_id, offer_id, transaction_id) VALUES (?, ?, ?)')
      .run(req.userId, offer_id, req.params.id);
  }

  res.json({ message: `Transaction marked as ${status}` });
});

// GET /api/transactions — List user transactions (paginated)
router.get('/', authMiddleware, (req, res) => {
  const { page = 1, limit = 20, category, card_id, status } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const db = getDb();

  let where = 'WHERE user_id = ?';
  const params = [req.userId];

  if (category) {
    where += ' AND category = ?';
    params.push(category);
  }
  if (card_id) {
    where += ' AND card_id = ?';
    params.push(card_id);
  }
  if (status) {
    let statuses = [];
    if (typeof status === 'string') {
      statuses = status.split(',').map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(status)) {
      statuses = status.flatMap(s => typeof s === 'string' ? s.split(',') : s).map(s => String(s).trim()).filter(Boolean);
    }
    
    if (statuses.length > 0) {
      where += ` AND status IN (${statuses.map(() => '?').join(', ')})`;
      params.push(...statuses);
    }
  }

  const total = db.prepare(`SELECT COUNT(*) as count FROM transactions ${where}`).get(...params);
  params.push(parseInt(limit), offset);
  const transactions = db.prepare(`
    SELECT * FROM transactions ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?
  `).all(...params);

  res.json({
    transactions,
    total: total.count,
    page: parseInt(page),
    totalPages: Math.ceil(total.count / parseInt(limit))
  });
});

// GET /api/transactions/stats — Monthly spending summary
router.get('/stats', authMiddleware, (req, res) => {
  const db = getDb();

  // This month's spending
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const monthStats = db.prepare(`
    SELECT
      COUNT(*) as transaction_count,
      COALESCE(SUM(amount), 0) as total_spent,
      COALESCE(SUM(savings), 0) as total_savings,
      COALESCE(SUM(potential_savings), 0) as total_potential
    FROM transactions
    WHERE user_id = ? AND created_at >= ? AND status = 'completed'
  `).get(req.userId, monthStart.toISOString());

  // Per-category breakdown this month
  const categoryBreakdown = db.prepare(`
    SELECT
      category,
      COUNT(*) as count,
      SUM(amount) as total,
      SUM(savings) as savings,
      SUM(potential_savings) as potential
    FROM transactions
    WHERE user_id = ? AND created_at >= ? AND status = 'completed'
    GROUP BY category
    ORDER BY total DESC
  `).all(req.userId, monthStart.toISOString());

  // Per-card spending this month (for cap tracking)
  const cardSpending = db.prepare(`
    SELECT
      card_id,
      category,
      SUM(amount) as total_amount,
      SUM(savings) as total_savings,
      SUM(potential_savings) as total_potential,
      COUNT(*) as txn_count
    FROM transactions
    WHERE user_id = ? AND created_at >= ? AND status = 'completed'
    GROUP BY card_id, category
  `).all(req.userId, monthStart.toISOString());

  // All-time stats
  const allTimeStats = db.prepare(`
    SELECT
      COUNT(*) as transaction_count,
      COALESCE(SUM(amount), 0) as total_spent,
      COALESCE(SUM(savings), 0) as total_savings,
      COALESCE(SUM(potential_savings), 0) as total_potential
    FROM transactions
    WHERE user_id = ? AND status = 'completed'
  `).get(req.userId);

  res.json({
    thisMonth: {
      ...monthStats,
      opportunity_lost: Math.max(0, monthStats.total_potential - monthStats.total_savings)
    },
    categoryBreakdown,
    cardSpending,
    allTime: {
      ...allTimeStats,
      opportunity_lost: Math.max(0, allTimeStats.total_potential - allTimeStats.total_savings)
    }
  });
});

// GET /api/transactions/cap-usage — Get monthly cap usage per card
router.get('/cap-usage', authMiddleware, (req, res) => {
  const { card_id, category } = req.query;
  const db = getDb();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  let where = 'WHERE user_id = ? AND created_at >= ?';
  const params = [req.userId, monthStart.toISOString()];

  if (card_id) {
    where += ' AND card_id = ?';
    params.push(card_id);
  }
  if (category) {
    where += ' AND category = ?';
    params.push(category);
  }

  const usage = db.prepare(`
    SELECT card_id, category, SUM(savings) as total_cashback_used
    FROM transactions
    ${where}
    GROUP BY card_id, category
  `).all(...params);

  res.json({ capUsage: usage });
});

export default router;
