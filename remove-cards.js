import Database from 'better-sqlite3';
const db = new Database('./server/smartpay.db');

const info = db.prepare("DELETE FROM user_cards WHERE card_id IN ('hdfc-diners-privilege', 'hdfc-millennia')").run();
console.log('Deleted rows:', info.changes);

const remaining = db.prepare("SELECT card_id FROM user_cards WHERE user_id = 1").all();
console.log('Remaining cards:', remaining);
