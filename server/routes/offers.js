// ============================================
// Offer Routes — List, Filter, Active Offers
// ============================================

import { Router } from 'express';
import { authMiddleware } from './auth.js';
import { getDb } from '../db.js';

const router = Router();

// GET /api/offers — List active offers (with optional filters)
router.get('/', (req, res) => {
  const { card_id, category, merchant_id } = req.query;
  const db = getDb();

  let where = 'WHERE is_active = 1 AND (end_date IS NULL OR end_date >= datetime(\'now\'))';
  const params = [];

  if (card_id) {
    where += ' AND (card_id = ? OR card_id IS NULL)';
    params.push(card_id);
  }
  if (category) {
    where += ' AND (category = ? OR category IS NULL)';
    params.push(category);
  }
  if (merchant_id) {
    where += ' AND (merchant_id = ? OR merchant_id IS NULL)';
    params.push(merchant_id);
  }

  const offers = db.prepare(`
    SELECT * FROM offers ${where} ORDER BY discount_value DESC, end_date ASC
  `).all(...params);

  res.json({ offers });
});

// GET /api/offers/for-transaction — Get applicable offers for a transaction
router.get('/for-transaction', authMiddleware, (req, res) => {
  const { card_id, merchant_id, category, amount } = req.query;
  const db = getDb();

  if (!category || !amount) {
    return res.status(400).json({ error: 'category and amount required' });
  }

  // Find matching offers
  const offers = db.prepare(`
    SELECT * FROM offers
    WHERE is_active = 1
      AND (end_date IS NULL OR end_date >= datetime('now'))
      AND (start_date IS NULL OR start_date <= datetime('now'))
      AND (min_amount IS NULL OR min_amount <= ?)
      AND (
        (card_id = ? OR card_id IS NULL)
        AND (merchant_id = ? OR merchant_id IS NULL)
        AND (category = ? OR category IS NULL)
      )
    ORDER BY discount_value DESC
  `).all(parseFloat(amount), card_id || '', merchant_id || '', category);

  // Check user's usage for max_uses_per_user
  const applicableOffers = offers.filter(offer => {
    if (!offer.max_uses_per_user) return true;

    const usageCount = db.prepare(`
      SELECT COUNT(*) as count FROM offer_usage
      WHERE user_id = ? AND offer_id = ?
    `).get(req.userId, offer.id);

    return usageCount.count < offer.max_uses_per_user;
  });

  // Calculate savings for each offer
  const withSavings = applicableOffers.map(offer => {
    let savings = 0;
    const amt = parseFloat(amount);

    if (offer.discount_type === 'percentage') {
      savings = (amt * offer.discount_value) / 100;
      if (offer.max_discount && savings > offer.max_discount) {
        savings = offer.max_discount;
      }
    } else if (offer.discount_type === 'flat') {
      savings = offer.discount_value;
    } else if (offer.discount_type === 'cashback_percentage') {
      savings = (amt * offer.discount_value) / 100;
      if (offer.max_discount && savings > offer.max_discount) {
        savings = offer.max_discount;
      }
    }

    return {
      ...offer,
      calculated_savings: Math.round(savings * 100) / 100,
      is_expiring_soon: offer.end_date && new Date(offer.end_date) - new Date() < 3 * 24 * 60 * 60 * 1000
    };
  });

  res.json({ offers: withSavings });
});

export default router;
