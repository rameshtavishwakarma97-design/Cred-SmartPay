// ============================================
// Card Seed Data (shared between frontend & server)
// ============================================

import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();

// GET /api/cards — List all cards in DB
router.get('/', (req, res) => {
  const db = getDb();
  const cards = db.prepare('SELECT * FROM cards ORDER BY tier DESC, annual_fee DESC').all();

  const parsed = cards.map(c => ({
    ...c,
    rewards: JSON.parse(c.rewards),
    best_for: JSON.parse(c.best_for || '[]')
  }));

  res.json({ cards: parsed });
});

// GET /api/cards/:id — Get single card details
router.get('/:id', (req, res) => {
  const db = getDb();
  const card = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id);

  if (!card) return res.status(404).json({ error: 'Card not found' });

  res.json({
    ...card,
    rewards: JSON.parse(card.rewards),
    best_for: JSON.parse(card.best_for || '[]')
  });
});

// GET /api/cards/by-category/:category — Best cards for category
router.get('/by-category/:category', (req, res) => {
  const db = getDb();
  const cards = db.prepare('SELECT * FROM cards').all();

  const matching = cards
    .filter(c => {
      const bestFor = JSON.parse(c.best_for || '[]');
      return bestFor.includes(req.params.category);
    })
    .map(c => ({
      ...c,
      rewards: JSON.parse(c.rewards),
      best_for: JSON.parse(c.best_for || '[]')
    }));

  res.json({ cards: matching });
});

export default router;
