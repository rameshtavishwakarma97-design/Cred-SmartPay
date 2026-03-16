PRAGMA foreign_keys=off;
BEGIN TRANSACTION;
ALTER TABLE transactions RENAME TO _transactions_old;
CREATE TABLE transactions (
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
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
INSERT INTO transactions (id, user_id, card_id, merchant_id, merchant_name, category, amount, savings, offer_id, status, created_at)
SELECT id, user_id, card_id, merchant_id, merchant_name, category, amount, savings, offer_id, 'completed', created_at
FROM _transactions_old;
DROP TABLE _transactions_old;
COMMIT;
PRAGMA foreign_keys=on;
