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

// Dynamically import card data (ES module from src/)
import { userCards, industryCards } from '../src/data/cards.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Initialize DB and seed data
console.log('📦 Initializing database...');
const db = getDb();

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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/cards', cardRoutes);

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
