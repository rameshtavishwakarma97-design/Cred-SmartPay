// ============================================
// Offer Auto-Update Script
// Usage: node scripts/update-offers.js
// ============================================

import { getDb, seedOffers } from '../server/db.js';

const SOURCES = [
  {
    name: 'CRED Platform Offers',
    offers: [
      {
        card_id: null,
        merchant_id: 'zomato',
        category: 'dining',
        title: 'CRED x Zomato: Up to 20% cashback',
        description: 'Get up to 20% cashback on Zomato orders when paying via CRED',
        discount_type: 'cashback_percentage',
        discount_value: 20,
        min_amount: 200,
        max_discount: 200,
        start_date: '2026-03-01',
        end_date: '2026-03-31',
        max_uses_per_user: 5,
        source_url: 'https://cred.club/offers',
        source_name: 'CRED'
      },
      {
        card_id: null,
        merchant_id: 'swiggy',
        category: 'dining',
        title: 'CRED x Swiggy: 15% off up to ₹100',
        description: 'Flat 15% off on Swiggy orders via CRED payment',
        discount_type: 'percentage',
        discount_value: 15,
        min_amount: 300,
        max_discount: 100,
        start_date: '2026-03-01',
        end_date: '2026-03-31',
        max_uses_per_user: 3,
        source_url: 'https://cred.club/offers',
        source_name: 'CRED'
      },
      {
        card_id: null,
        merchant_id: 'amazon',
        category: 'online_shopping',
        title: 'CRED x Amazon: ₹50 cashback on ₹500+',
        description: 'Get ₹50 cashback on Amazon Gift Card purchase of ₹500+',
        discount_type: 'flat',
        discount_value: 50,
        min_amount: 500,
        max_discount: 50,
        start_date: '2026-03-01',
        end_date: '2026-03-20',
        max_uses_per_user: 2,
        source_url: 'https://cred.club/offers',
        source_name: 'CRED'
      },
      {
        card_id: null,
        merchant_id: 'blinkit',
        category: 'grocery',
        title: 'CRED x Blinkit: 10% off groceries',
        description: 'Flat 10% off on Blinkit orders via CRED',
        discount_type: 'percentage',
        discount_value: 10,
        min_amount: 200,
        max_discount: 150,
        start_date: '2026-03-01',
        end_date: '2026-04-15',
        max_uses_per_user: 4,
        source_url: 'https://cred.club/offers',
        source_name: 'CRED'
      }
    ]
  },
  {
    name: 'HDFC SmartBuy Offers',
    offers: [
      {
        card_id: 'hdfc-diners-privilege',
        merchant_id: null,
        category: 'travel',
        title: 'HDFC SmartBuy: 10X rewards on flights',
        description: '10X reward points on flight bookings via SmartBuy portal',
        discount_type: 'cashback_percentage',
        discount_value: 3.3,
        min_amount: 1000,
        max_discount: null,
        start_date: '2026-01-01',
        end_date: '2026-12-31',
        max_uses_per_user: null,
        source_url: 'https://offers.smartbuy.hdfcbank.com/',
        source_name: 'HDFC SmartBuy'
      },
      {
        card_id: 'hdfc-millennia',
        merchant_id: null,
        category: 'online_shopping',
        title: 'HDFC Millennia: 5% cashback on SmartBuy',
        description: '5% cashback on online shopping via SmartBuy',
        discount_type: 'cashback_percentage',
        discount_value: 5,
        min_amount: 100,
        max_discount: 750,
        start_date: '2026-01-01',
        end_date: '2026-06-30',
        max_uses_per_user: null,
        source_url: 'https://offers.smartbuy.hdfcbank.com/',
        source_name: 'HDFC SmartBuy'
      }
    ]
  },
  {
    name: 'SBI Card Offers',
    offers: [
      {
        card_id: 'sbi-cashback',
        merchant_id: null,
        category: 'online_shopping',
        title: 'SBI Cashback: Extra 1% on Amazon (March)',
        description: 'Additional 1% cashback on Amazon purchases for March 2026',
        discount_type: 'cashback_percentage',
        discount_value: 1,
        min_amount: 500,
        max_discount: 200,
        start_date: '2026-03-01',
        end_date: '2026-03-31',
        max_uses_per_user: 3,
        source_url: 'https://www.sbicard.com/en/offers.page',
        source_name: 'SBI Card'
      }
    ]
  },
  {
    name: 'Fuel Station Offers',
    offers: [
      {
        card_id: null,
        merchant_id: 'hp_petrol',
        category: 'fuel',
        title: 'HP Pay: Extra ₹10 off per transaction',
        description: '₹10 instant discount on fuel via HP Pay app',
        discount_type: 'flat',
        discount_value: 10,
        min_amount: 500,
        max_discount: 10,
        start_date: '2026-03-01',
        end_date: '2026-03-31',
        max_uses_per_user: 10,
        source_url: 'https://www.hindustanpetroleum.com/',
        source_name: 'HP Fuel'
      }
    ]
  },
  {
    name: 'Seasonal / Festival Offers',
    offers: [
      {
        card_id: null,
        merchant_id: null,
        category: 'online_shopping',
        title: 'March Madness: Extra 5% on electronics via any credit card',
        description: 'Seasonal offer on electronics purchases across major merchants',
        discount_type: 'cashback_percentage',
        discount_value: 5,
        min_amount: 5000,
        max_discount: 1500,
        start_date: '2026-03-10',
        end_date: '2026-03-25',
        max_uses_per_user: 1,
        source_url: 'https://www.cardinsider.com/blog/',
        source_name: 'CardInsider'
      },
      {
        card_id: null,
        merchant_id: null,
        category: 'dining',
        title: 'Dineout Great Indian Restaurant Festival: Flat 50% off',
        description: 'Flat 50% off at 10,000+ restaurants via Dineout',
        discount_type: 'percentage',
        discount_value: 50,
        min_amount: 500,
        max_discount: 500,
        start_date: '2026-03-15',
        end_date: '2026-03-22',
        max_uses_per_user: 3,
        source_url: 'https://www.dineout.co.in/',
        source_name: 'Dineout'
      }
    ]
  }
];

async function updateOffers() {
  console.log('🔄 Starting offer update...\n');

  const db = getDb();

  // Mark expired offers as inactive
  const expired = db.prepare(`
    UPDATE offers SET is_active = 0 WHERE end_date < datetime("now") AND is_active = 1
  `).run();
  console.log(`  ⏰ Marked ${expired.changes} expired offers as inactive`);

  let totalInserted = 0;

  for (const source of SOURCES) {
    console.log(`\n📡 Processing: ${source.name}`);
    console.log(`   Found ${source.offers.length} offers`);

    try {
      seedOffers(source.offers);
      totalInserted += source.offers.length;
      console.log(`   ✅ Inserted/updated ${source.offers.length} offers`);
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
    }
  }

  // Summary
  const activeCount = db.prepare('SELECT COUNT(*) as c FROM offers WHERE is_active = 1').get();
  const totalCount = db.prepare('SELECT COUNT(*) as c FROM offers').get();

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Update complete!`);
  console.log(`   Total offers in DB: ${totalCount.c}`);
  console.log(`   Active offers: ${activeCount.c}`);
  console.log(`   New this run: ${totalInserted}`);
  console.log('='.repeat(50));
}

/*
 * EXTENDING THIS SCRIPT:
 * 
 * To add real web scraping, you can:
 * 1. Install: npm install cheerio node-fetch
 * 2. Add scraper functions that fetch from:
 *    - https://www.paisabazaar.com/credit-card/credit-card-offers/
 *    - https://www.cardinsider.com/blog/credit-card-offers/
 *    - https://www.sbicard.com/en/offers.page
 *    - https://offers.smartbuy.hdfcbank.com/
 * 3. Parse the HTML for offer details (title, discount, validity, card restrictions)
 * 4. Normalize into the offer schema and call seedOffers()
 * 
 * Example scraper pattern:
 * 
 *   async function scrapePaisabazaar() {
 *     const res = await fetch('https://www.paisabazaar.com/credit-card/credit-card-offers/');
 *     const html = await res.text();
 *     const $ = cheerio.load(html);
 *     const offers = [];
 *     $('.offer-card').each((_, el) => {
 *       offers.push({
 *         title: $(el).find('.offer-title').text().trim(),
 *         discount_value: parseFloat($(el).find('.discount').text()),
 *         // ... parse more fields
 *       });
 *     });
 *     return offers;
 *   }
 */

updateOffers().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
