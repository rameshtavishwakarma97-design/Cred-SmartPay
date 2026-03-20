// ============================================
// CRED Smart Pay — Express Backend Server
// ============================================

import express from 'express';
import cors from 'cors';
import { getDb, seedCards, seedOffers } from './db.js';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import offerRoutes from './routes/offers.js';
import recommendRoutes from './routes/recommend.js';
import cardRoutes from './routes/cards.js';
import analyticsRoutes from './routes/analytics.js';
import bcrypt from 'bcryptjs';

// Dynamically import card data (ES module from src/)
import { userCards, industryCards } from '../src/data/cards.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
const allowedOrigins = [
  'https://cred-smartpay-production.up.railway.app',
  'http://localhost:5173', // Vite default port
  'http://localhost:3000',
  'http://localhost:3005'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Serve static files from the 'dist' directory (relative to project root)
app.use(express.static('dist'));

// Initialize DB and seed data
console.log('📦 Initializing database...');
let db;
try {
  db = getDb();
  console.log('✅ Database initialized');
} catch (err) {
  console.error('❌ Database initialization failed:', err);
  process.exit(1);
}

// Seed cards into DB
const allCards = [...userCards, ...industryCards].map(card => ({
  id: card.id,
  name: card.name,
  bank: card.bank,
  network: card.network,
  tier: card.tier || 'standard',
  annualFee: card.annualFee || 0,
  feeWaiverSpend: card.feeWaiverSpend || null,
  forexMarkup: card.forexMarkup || null,
  loungeDomestic: card.loungeDomestic || 0,
  loungeInternational: card.loungeInternational || 0,
  rewards: card.rewards,
  bestFor: card.bestFor || []
}));

seedCards(allCards);
console.log(`  ✅ Seeded ${allCards.length} cards`);

// Seed default offers
const defaultOffers = [
  {
    card_id: null, merchant_id: 'zomato', category: 'dining',
    title: 'CRED x Zomato: Up to 20% cashback',
    description: 'Get up to 20% cashback on Zomato orders when paying via CRED',
    discount_type: 'cashback_percentage', discount_value: 20,
    min_amount: 200, max_discount: 200,
    start_date: '2026-03-01', end_date: '2026-03-31',
    max_uses_per_user: 5, source_url: 'https://cred.club/offers', source_name: 'CRED'
  },
  {
    card_id: null, merchant_id: 'swiggy', category: 'dining',
    title: 'CRED x Swiggy: 15% off up to ₹100',
    description: 'Flat 15% off on Swiggy orders via CRED payment',
    discount_type: 'percentage', discount_value: 15,
    min_amount: 300, max_discount: 100,
    start_date: '2026-03-01', end_date: '2026-03-31',
    max_uses_per_user: 3, source_url: 'https://cred.club/offers', source_name: 'CRED'
  },
  {
    card_id: null, merchant_id: 'amazon', category: 'online_shopping',
    title: 'CRED x Amazon: ₹50 cashback on ₹500+',
    description: 'Get ₹50 cashback on Amazon Gift Card purchase of ₹500+',
    discount_type: 'flat', discount_value: 50,
    min_amount: 500, max_discount: 50,
    start_date: '2026-03-01', end_date: '2026-03-20',
    max_uses_per_user: 2, source_url: 'https://cred.club/offers', source_name: 'CRED'
  },
  {
    card_id: null, merchant_id: null, category: 'dining',
    title: 'Dineout GIRF: Flat 50% off at restaurants',
    description: 'Flat 50% off at 10,000+ restaurants',
    discount_type: 'percentage', discount_value: 50,
    min_amount: 500, max_discount: 500,
    start_date: '2026-03-15', end_date: '2026-03-22',
    max_uses_per_user: 3, source_url: 'https://dineout.co.in/', source_name: 'Dineout'
  }
];

try {
  seedOffers(defaultOffers);
  console.log(`  ✅ Seeded ${defaultOffers.length} default offers`);
} catch (e) {
  console.log(`  ℹ️  Offers already seeded`);
}

// Seed admin user
try {
  const adminPwdHash = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT OR REPLACE INTO users (email, name, password_hash, role)
    VALUES (?, ?, ?, ?)
  `).run('admin@cred.club', 'System Admin', adminPwdHash, 'admin');
  console.log(`  ✅ Seeded/Updated admin user`);
} catch (e) {
  console.error('Failed to seed admin user:', e.message);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const cardCount = db.prepare('SELECT COUNT(*) as c FROM cards').get();
  const offerCount = db.prepare('SELECT COUNT(*) as c FROM offers WHERE is_active = 1').get();
  const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get();
  res.json({
    status: 'ok',
    cards: cardCount.c,
    activeOffers: offerCount.c,
    users: userCount.c
  });
});

app.get('/api/debug-static', (req, res) => {
  try {
    const files = fs.readdirSync(distPath);
    res.json({ distPath, files });
  } catch (err) {
    res.json({ distPath, error: err.message });
  }
});

// SPA Fallback: Any non-API route serves index.html
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  
  const indexPath = path.resolve('dist', 'index.html');
  try {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  } catch (err) {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Smart Pay API running at http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
  
  // Auto-expire pending transactions older than 5 minutes
  setInterval(() => {
    try {
      const result = db.prepare(`
        UPDATE transactions 
        SET status = 'cancelled' 
        WHERE status = 'pending' 
        AND created_at <= datetime('now', '-5 minutes')
      `).run();
      
      if (result.changes > 0) {
        console.log(`🧹 Auto-cancelled ${result.changes} expired pending transactions`);
      }
    } catch (e) {
      console.error('Failed to run expiry job', e);
    }
  }, 60 * 1000); // Check every minute
});
 