// ============================================
// Auth Routes — Signup, Login, JWT Middleware
// ============================================

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'smartpay-secret-key-change-in-prod';
const JWT_EXPIRY = '7d';

// Middleware: Verify JWT
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// POST /api/auth/signup
router.post('/signup', (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ error: 'Email, name, and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const db = getDb();

  // Check if user exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  // Hash password and create user
  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db.prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)').run(email, name, passwordHash);

  // Auto-add default cards to user's wallet
  const defaultCards = [
    { card_id: 'hdfc-millennia', last4: '4821', nickname: 'HDFC Millennia' },
    { card_id: 'sbi-cashback', last4: '7392', nickname: 'SBI Cashback' },
    { card_id: 'amazon-icici', last4: '5150', nickname: 'Amazon Pay ICICI' },
    { card_id: 'axis-ace', last4: '6234', nickname: 'Axis ACE' }
  ];

  const insertCard = db.prepare('INSERT INTO user_cards (user_id, card_id, last4, nickname) VALUES (?, ?, ?, ?)');
  for (const card of defaultCards) {
    insertCard.run(result.lastInsertRowid, card.card_id, card.last4, card.nickname);
  }

  const token = jwt.sign({ userId: result.lastInsertRowid, email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

  res.status(201).json({
    token,
    user: { id: result.lastInsertRowid, email, name }
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role }
  });
});

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res) => {
  const db = getDb();
  const user = db.prepare('SELECT id, email, name, created_at FROM users WHERE id = ?').get(req.userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Get user's cards joined with card details
  const cards = db.prepare(`
    SELECT uc.id as user_card_id, uc.card_id, uc.last4, uc.nickname, uc.added_at,
           c.name as full_name, c.bank, c.network, c.tier, c.annual_fee, c.rewards, c.best_for
    FROM user_cards uc
    LEFT JOIN cards c ON uc.card_id = c.id
    WHERE uc.user_id = ?
    ORDER BY uc.added_at
  `).all(req.userId).map(c => ({
    ...c,
    rewards: c.rewards ? JSON.parse(c.rewards) : [],
    best_for: c.best_for ? JSON.parse(c.best_for) : []
  }));

  console.log("DEBUG_BACKEND_ME:", JSON.stringify(cards, null, 2));

  res.json({ user, cards });
});

// POST /api/auth/cards — Add a new card to user's wallet
router.post('/cards', authMiddleware, (req, res) => {
  const { card_id, last4, nickname } = req.body;

  if (!card_id || !last4) {
    return res.status(400).json({ error: 'card_id and last4 are required' });
  }

  const db = getDb();
  
  // Verify card exists in industry DB
  const cardTemplate = db.prepare('SELECT id FROM cards WHERE id = ?').get(card_id);
  if (!cardTemplate) {
    return res.status(404).json({ error: 'Card template not found' });
  }

  try {
    const result = db.prepare(`
      INSERT INTO user_cards (user_id, card_id, last4, nickname) 
      VALUES (?, ?, ?, ?)
    `).run(req.userId, card_id, last4, nickname || null);

    res.status(201).json({ 
      id: result.lastInsertRowid,
      message: 'Card added to wallet successfully' 
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add card: ' + err.message });
  }
});

// DELETE /api/auth/cards/:id — Remove a card from user's wallet
router.delete('/cards/:id', authMiddleware, (req, res) => {
  const db = getDb();
  
  try {
    const result = db.prepare(`
      DELETE FROM user_cards 
      WHERE id = ? AND user_id = ?
    `).run(req.params.id, req.userId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Card not found in your wallet' });
    }

    res.json({ message: 'Card removed from wallet successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove card: ' + err.message });
  }
});

export default router;
