// ============================================
// Database Initialization — SQLite via better-sqlite3
// ============================================

import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'smartpay.db');

let db;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema();
    runMigrations(db);
  }
  return db;
}

function runMigrations(db) {
  try {
    // Attempt column addition. Will throw if it already exists.
    db.prepare('ALTER TABLE transactions ADD COLUMN status TEXT DEFAULT "completed"').run();
  } catch (e) {
    // Column likely exists
  }
  try {
    db.prepare('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"').run();
  } catch (e) { }
  try {
    db.prepare('ALTER TABLE transactions ADD COLUMN potential_savings REAL DEFAULT 0').run();
  } catch (e) { }
  try {
    db.prepare('ALTER TABLE transactions ADD COLUMN is_simulation INTEGER DEFAULT 0').run();
  } catch (e) { }
  try {
    db.prepare('ALTER TABLE recommendation_impressions ADD COLUMN is_simulation INTEGER DEFAULT 0').run();
  } catch (e) { }
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS recommendation_impressions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        merchant_id TEXT NOT NULL,
        amount REAL NOT NULL,
        recommended_card_id TEXT NOT NULL,
        selected_card_id TEXT,
        latency_ms INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS funnel_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        user_id INTEGER,
        event_name TEXT NOT NULL,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_impressions_date ON recommendation_impressions(created_at);
      CREATE INDEX IF NOT EXISTS idx_funnel_session ON funnel_events(session_id);
    `);
  } catch (e) {
    console.warn('Analytics table migration warning:', e.message);
  }
  try {
    // We cannot drop NOT NULL via ALTER TABLE in standard SQLite, 
    // but we can just leave it as is if it fails. The default behavior 
    // for pending is card_id = null. We can bypass NOT NULL by storing dummy or recreating table.
    // Instead of completely recreating, we'll recreate the table properly.
    const tblInfo = db.prepare('PRAGMA table_info(transactions)').all();
    const cardIdCol = tblInfo.find(c => c.name === 'card_id');
    if (cardIdCol && cardIdCol.notnull === 1) {
      db.exec(`
        PRAGMA foreign_keys=off;
        BEGIN TRANSACTION;
        CREATE TABLE transactions_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          card_id TEXT,
          merchant_id TEXT NOT NULL,
          merchant_name TEXT,
          category TEXT NOT NULL,
          amount REAL NOT NULL,
          savings REAL DEFAULT 0,
          offer_id INTEGER,
          status TEXT DEFAULT 'completed',
          is_simulation INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        );
        INSERT INTO transactions_new SELECT * FROM transactions;
        DROP TABLE transactions;
        ALTER TABLE transactions_new RENAME TO transactions;
        CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
        CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at);
        COMMIT;
        PRAGMA foreign_keys=on;
      `);
      console.log('📦 Database migration completed (transactions table altered).');
    }
  } catch (e) {
    console.warn('Migration warning:', e.message);
  }
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      card_id TEXT NOT NULL,
      last4 TEXT NOT NULL,
      nickname TEXT,
      added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      card_id TEXT,
      merchant_id TEXT NOT NULL,
      merchant_name TEXT,
      category TEXT NOT NULL,
      amount REAL NOT NULL,
      savings REAL DEFAULT 0,
      potential_savings REAL DEFAULT 0,
      offer_id INTEGER,
      status TEXT DEFAULT 'completed',
      is_simulation INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      bank TEXT NOT NULL,
      network TEXT NOT NULL,
      tier TEXT DEFAULT 'standard',
      annual_fee INTEGER DEFAULT 0,
      fee_waiver_spend INTEGER,
      forex_markup REAL,
      lounge_domestic INTEGER DEFAULT 0,
      lounge_international INTEGER DEFAULT 0,
      rewards TEXT NOT NULL,
      best_for TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS offers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_id TEXT,
      merchant_id TEXT,
      category TEXT,
      title TEXT NOT NULL,
      description TEXT,
      discount_type TEXT NOT NULL,
      discount_value REAL NOT NULL,
      min_amount REAL DEFAULT 0,
      max_discount REAL,
      start_date DATETIME,
      end_date DATETIME,
      max_uses_per_user INTEGER,
      max_total_uses INTEGER,
      source_url TEXT,
      source_name TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS offer_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      offer_id INTEGER NOT NULL,
      transaction_id INTEGER,
      used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (offer_id) REFERENCES offers(id),
      FOREIGN KEY (transaction_id) REFERENCES transactions(id)
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
    CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(created_at);
    CREATE INDEX IF NOT EXISTS idx_user_cards_user ON user_cards(user_id);
    CREATE INDEX IF NOT EXISTS idx_offers_active ON offers(is_active, end_date);
    CREATE INDEX IF NOT EXISTS idx_offers_card ON offers(card_id);
    CREATE INDEX IF NOT EXISTS idx_offer_usage_user ON offer_usage(user_id, offer_id);

    CREATE TABLE IF NOT EXISTS recommendation_impressions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      merchant_id TEXT NOT NULL,
      amount REAL NOT NULL,
      recommended_card_id TEXT NOT NULL,
      selected_card_id TEXT,
      latency_ms INTEGER,
      is_simulation INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS funnel_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      user_id INTEGER,
      event_name TEXT NOT NULL,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_impressions_date ON recommendation_impressions(created_at);
    CREATE INDEX IF NOT EXISTS idx_funnel_session ON funnel_events(session_id);
  `);
}

export function seedCards(cardsData) {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO cards (id, name, bank, network, tier, annual_fee, fee_waiver_spend, forex_markup, lounge_domestic, lounge_international, rewards, best_for, updated_at)
    VALUES (@id, @name, @bank, @network, @tier, @annual_fee, @fee_waiver_spend, @forex_markup, @lounge_domestic, @lounge_international, @rewards, @best_for, CURRENT_TIMESTAMP)
  `);

  const insertMany = db.transaction((cards) => {
    for (const card of cards) {
      insert.run({
        id: card.id,
        name: card.name,
        bank: card.bank,
        network: card.network,
        tier: card.tier || 'standard',
        annual_fee: card.annualFee || 0,
        fee_waiver_spend: card.feeWaiverSpend || null,
        forex_markup: card.forexMarkup || null,
        lounge_domestic: card.loungeDomestic || 0,
        lounge_international: card.loungeInternational || 0,
        rewards: JSON.stringify(card.rewards || {}),
        best_for: JSON.stringify(card.bestFor || [])
      });
    }
  });

  insertMany(cardsData);
}

export function seedOffers(offersData) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO offers (card_id, merchant_id, category, title, description, discount_type, discount_value, min_amount, max_discount, start_date, end_date, max_uses_per_user, source_url, source_name)
    VALUES (@card_id, @merchant_id, @category, @title, @description, @discount_type, @discount_value, @min_amount, @max_discount, @start_date, @end_date, @max_uses_per_user, @source_url, @source_name)
  `);

  const insertMany = db.transaction((offers) => {
    for (const offer of offers) {
      insert.run(offer);
    }
  });

  insertMany(offersData);
}
