// ============================================
// Enhanced Card Database — Industry-Level Accuracy (India 2024-25)
// Sources: Official bank MITC, Paisabazaar, BankBazaar, RewardMatrix, Finology
// Last Updated: March 2026
// ============================================

// Point valuation table (₹ per point at best redemption)
export const POINT_VALUES = {
  'HDFC Bank': 0.50,      // vs Statement: ₹0.20/pt; Gold Catalogue: ₹0.65/pt; SmartBuy Flights: ₹0.50/pt
  'SBI Card': 0.25,        // 1 RP = ₹0.25 on Yatra/Amazon/Snapdeal
  'ICICI Bank': 0.25,      // 1 RP = ₹0.25 (SmartPay), varies by card
  'Axis Bank': 0.20,       // EDGE Reward Points: 1 pt ≈ ₹0.20; EDGE Miles (Atlas): ₹1/mile (partner transfer)
  'Amex': 0.50,            // 1 MR pt ≈ ₹0.33–0.75 depending on transfer partner (IndiGo, Air India, Marriott)
  'RBL Bank': 0.25,
  'YES Bank': 1.00,        // 1 YES RP = ₹1 (direct cashback redemption)
  'HSBC': 0.25,
  'IDFC FIRST': 1.00,      // IDFC pts redeemable at ₹1 each via statement credit
  'IndusInd Bank': 0.50,
  'Tata Neu': 1.00,        // 1 NeuCoin = ₹1 on Tata platforms
  'default': 0.25
};

// ===== USER'S WALLET CARDS =====
export const userCards = [
  // ─── HDFC Millennia ───────────────────────────────────────────────────────
  {
    id: 'hdfc-millennia',
    name: 'Millennia',
    bank: 'HDFC Bank',
    network: 'VISA',
    last4: '4821',
    holder: 'SHREYANSH M',
    gradient: 'card-gradient-1',
    color: '#0f3460',
    tier: 'standard',  // ₹1,000 fee, 10-merchant partner cashback — upper-entry/standard segment
    annualFee: 1000,
    feeWaiverSpend: 100000,   // ₹1 Lakh annual spend = fee waived
    forexMarkup: 3.5,
    rewards: {
      // 5% CashPoints on 10 specific online merchants (verified from HDFC Bank MITC)
      online_shopping: {
        type: 'cashback',
        rate: 5,
        label: '5% CashPoints on Amazon, Flipkart, BookMyShow, Cult.fit, Myntra, Sony LIV, Swiggy, Tata CLiQ, Uber, Zomato',
        cap: 1000,           // ₹1,000 per statement cycle (revised from earlier ₹750)
        capUnit: 'per_cycle',
        minTxn: 100,
        cashPointValue: 1,   // 1 CashPoint = ₹1 on statement redemption
        merchants: ['amazon', 'flipkart', 'bookmyshow', 'cultfit', 'myntra', 'sonyliv', 'swiggy', 'tatacliq', 'uber', 'zomato'],
        note: 'Cashback as CashPoints (1 CP = ₹1). Separate cap from 1% category.'
      },
      dining: {
        type: 'cashback',
        rate: 5,
        label: '5% CashPoints on Swiggy & Zomato (counted under partner cap)',
        cap: 1000,
        capUnit: 'per_cycle',
        minTxn: 100,
        note: 'Swiggy/Zomato counted under the ₹1,000 partner cap'
      },
      movies: {
        type: 'cashback',
        rate: 5,
        label: '5% CashPoints on BookMyShow',
        cap: 1000,           // Shared with partner cap
        minTxn: 100
      },
      grocery: {
        type: 'cashback',
        rate: 1,
        label: '1% CashPoints on grocery & all other eligible spends',
        cap: 1000,           // ₹1,000 separate cap for 1% category
        capUnit: 'per_cycle',
        minTxn: 100
      },
      fuel: {
        type: 'surcharge_waiver',
        rate: 1,
        label: '1% fuel surcharge waiver (txn ₹400–₹5,000)',
        cap: 250,
        minTxn: 400,
        maxTxn: 5000,
        note: 'No CashPoints on fuel spend'
      },
      travel: {
        type: 'cashback',
        rate: 1,
        label: '1% CashPoints on offline travel',
        cap: 1000,
        minTxn: 100
      },
      utility: {
        type: 'cashback',
        rate: 1,
        label: '1% CashPoints on utility bills',
        cap: 1000,
        minTxn: 100,
        note: 'Rent, wallet loads, govt payments excluded'
      },
      insurance: {
        type: 'cashback',
        rate: 1,
        label: '1% CashPoints on insurance',
        cap: 1000,
        minTxn: 100
      },
      default: {
        type: 'cashback',
        rate: 1,
        label: '1% CashPoints on all other eligible spends',
        cap: 1000,
        minTxn: 100
      }
    },
    quarterlyBenefit: {
      spend: 100000,
      reward: '₹1,000 gift voucher OR 1 domestic lounge access (per calendar quarter)'
    },
    excluded: ['rent', 'wallet_load', 'govt_payments', 'gift_card_load', 'voucher_purchase', 'forex_transactions'],
    bestFor: ['online_shopping', 'dining', 'movies']
  },

  // ─── SBI Cashback Credit Card ──────────────────────────────────────────────
  {
    id: 'sbi-cashback',
    name: 'Cashback',
    bank: 'SBI Card',
    network: 'VISA',
    last4: '7392',
    holder: 'SHREYANSH M',
    gradient: 'card-gradient-2',
    color: '#11998e',
    tier: 'standard',
    annualFee: 999,
    feeWaiverSpend: 200000,  // ₹2 Lakh annual spend = fee waived
    forexMarkup: 3.5,
    rewards: {
      online_shopping: {
        type: 'cashback',
        rate: 5,
        label: '5% cashback on ALL online spends (any merchant, no restriction)',
        cap: 5000,           // ₹5,000 per statement, reducing to ₹2,000 from Apr 2026
        capUnit: 'per_cycle',
        minTxn: 100,
        note: 'Best card for universal online cashback. Auto-credited in 2 business days post statement.'
      },
      default: {
        type: 'cashback',
        rate: 1,
        label: '1% cashback on all offline spends',
        cap: 5000,
        capUnit: 'per_cycle',
        minTxn: 100
      },
      fuel: {
        type: 'surcharge_waiver',
        rate: 1,
        label: '1% fuel surcharge waiver',
        cap: 100,
        minTxn: 500
      }
    },
    excluded: ['fuel', 'utility', 'insurance', 'rent', 'wallet_load', 'education', 'jewellery', 'railway', 'emi', 'quasi_cash', 'gaming', 'toll', 'govt_payments'],
    bestFor: ['online_shopping']
  },

  // ─── Amazon Pay ICICI ──────────────────────────────────────────────────────
  {
    id: 'amazon-icici',
    name: 'Amazon Pay',
    bank: 'ICICI Bank',
    network: 'VISA',
    last4: '5150',
    holder: 'SHREYANSH M',
    gradient: 'card-gradient-3',
    color: '#333333',
    tier: 'standard',
    annualFee: 0,            // Lifetime free
    forexMarkup: 1.99,       // Reduced from 3.5% effective Oct 2025
    rewards: {
      amazon_prime: {
        type: 'cashback',
        rate: 5,
        label: '5% back on Amazon.in for Prime members (credited as Amazon Pay balance)',
        cap: null,           // No cap — unlimited
        minTxn: 1,
        isPrime: true,
        note: 'Applicable on eligible Amazon.in purchases. Excludes EMI, gold, rent, fuel.'
      },
      amazon_non_prime: {
        type: 'cashback',
        rate: 3,
        label: '3% back on Amazon.in for non-Prime members',
        cap: null,
        minTxn: 1,
        isPrime: false
      },
      amazon_pay_partners: {
        type: 'cashback',
        rate: 2,
        label: '2% cashback at 100+ Amazon Pay partner merchants (e.g. Prakash Petrolium, BigBazaar, Paytm)',
        cap: null,
        minTxn: 1,
        note: 'Must pay via Amazon Pay interface'
      },
      utility: {
        type: 'cashback',
        rate: 2,
        label: '2% on recharge & bill payments via Amazon Pay',
        cap: null,
        minTxn: 1
      },
      fuel: {
        type: 'surcharge_waiver',
        rate: 1,
        label: '1% fuel surcharge waiver (txn up to ₹4,000)',
        cap: 250,
        minTxn: 100,
        maxTxn: 4000
      },
      default: {
        type: 'cashback',
        rate: 1,
        label: '1% cashback on all other offline/online spends',
        cap: null,
        minTxn: 1
      }
    },
    loungeAccess: {
      domestic: 8,           // 8 complimentary/year on min ₹75k quarterly spend
      loungeCondition: 'Min ₹75,000 spend in previous quarter'
    },
    excluded: ['gold_purchase', 'rent', 'fuel_amazon', 'emi', 'education', 'tax', 'international_amazon'],
    bestFor: ['online_shopping', 'grocery']
  },

  // ─── HDFC Diners Club Privilege ───────────────────────────────────────────
  {
    id: 'hdfc-diners-privilege',
    name: 'Diners Club Privilege',
    bank: 'HDFC Bank',
    network: 'Diners',
    last4: '0088',
    holder: 'SHREYANSH M',
    gradient: 'card-gradient-4',
    color: '#2d0a4e',
    tier: 'premium',  // ₹2,500 fee, lounge access, Diners network — mid-premium
    annualFee: 2500,
    feeWaiverSpend: 300000,
    loungeDomestic: 12,
    loungeInternational: 6,
    forexMarkup: 2.0,
    rewards: {
      smartbuy: {
        type: 'points',
        rate: 10,
        label: '10X Reward Points (40 RP/₹150) via HDFC SmartBuy — flights, hotels, vouchers',
        cap: null,
        minTxn: 150,
        pointValue: 0.50,
        note: '10X capped at a monthly limit; base 1X continues after cap'
      },
      swiggy_zomato: {
        type: 'points',
        rate: 5,
        label: '5X Reward Points (20 RP/₹150) on Swiggy & Zomato',
        cap: 2500,           // 2,500 accelerated RP cap per month (verified HDFC MITC)
        capUnit: 'per_month_per_merchant',
        minTxn: 150,
        pointValue: 0.50,
        note: 'Base 1X continues beyond cap. Cap is on accelerated (4X) component.'
      },
      dining: {
        type: 'points',
        rate: 2,
        label: '2X Reward Points on weekend dining at standalone restaurants',
        cap: 500,            // 500 RP cap per day for weekend dining
        capUnit: 'per_day',
        minTxn: 150,
        pointValue: 0.50,
        note: 'Only Sat & Sun'
      },
      movies: {
        type: 'discount',
        rate: 50,
        label: 'Buy 1 Get 1 Free on BookMyShow (Fri/Sat/Sun, max ₹250 off per ticket, 2 free tickets/month)',
        cap: 500,            // ₹500 savings per month (2 × ₹250)
        minTxn: 0,
        note: 'Not a points benefit — direct discount via BMS offer'
      },
      dineout: {
        type: 'discount',
        rate: 20,
        label: 'Up to 20% off at 20,000+ Swiggy Dineout restaurants',
        cap: null,
        minTxn: 0
      },
      travel: {
        type: 'points',
        rate: 4,
        label: '4 Reward Points / ₹150 on travel bookings (non-SmartBuy)',
        cap: null,
        minTxn: 150,
        pointValue: 0.50
      },
      default: {
        type: 'points',
        rate: 4,
        label: '4 Reward Points / ₹150 on all retail spends (≈1.33% value)',
        cap: null,
        minTxn: 150,
        pointValue: 0.50
      },
      insurance: {
        type: 'points',
        rate: 0,
        label: 'Excluded from reward points',
        cap: 0,
        minTxn: 0
      }
    },
    excluded: ['fuel', 'wallet_load', 'rent', 'emi', 'insurance'],
    bestFor: ['dining', 'travel', 'movies', 'online_shopping']
  },

  // ─── Axis ACE ─────────────────────────────────────────────────────────────
  {
    id: 'axis-ace',
    name: 'ACE',
    bank: 'Axis Bank',
    network: 'VISA',
    last4: '6234',
    holder: 'SHREYANSH M',
    gradient: 'card-gradient-5',
    color: '#4a0000',
    tier: 'standard',  // ₹499 fee, Google Pay utility focus — entry/standard cashback
    annualFee: 499,
    feeWaiverSpend: 200000,
    rewards: {
      // 5% ONLY via Google Pay utility bill payments (electricity, gas, internet, DTH, mobile recharge)
      utility: {
        type: 'cashback',
        rate: 5,
        label: '5% cashback on electricity, gas, internet, DTH & mobile recharge via Google Pay ONLY',
        cap: 500,            // Combined ₹500/month cap with 4% category
        capUnit: 'combined_per_month',
        minTxn: 1,
        note: 'ONLY when billed via Google Pay. Utility outside GPay earns 1.5%.'
      },
      // 4% on Swiggy, Zomato, Ola (these are the only 3 merchants at 4%)
      dining: {
        type: 'cashback',
        rate: 4,
        label: '4% cashback on Swiggy, Zomato & Ola',
        cap: 500,            // Shared ₹500/month cap with 5% GPay
        capUnit: 'combined_per_month',
        minTxn: 1,
        merchants: ['swiggy', 'zomato', 'ola'],
        note: 'Only these 3 merchants. Other dining is 1.5%.'
      },
      restaurant_discount: {
        type: 'discount',
        rate: 15,
        label: 'Up to 15% off at 4,000+ partner restaurants via Axis Bank Dining Delights',
        cap: null,
        minTxn: 0
      },
      fuel: {
        type: 'surcharge_waiver',
        rate: 1,
        label: '1% fuel surcharge waiver (txn ₹400–₹4,000)',
        cap: 500,
        minTxn: 400,
        maxTxn: 4000,
        note: 'No cashback on fuel principal spend'
      },
      default: {
        type: 'cashback',
        rate: 1.5,
        label: '1.5% cashback on all other eligible spends (revised from 2% effective Apr 2024)',
        cap: null,
        minTxn: 1,
        note: 'Rate reduced from 2% to 1.5% on Apr 20, 2024'
      }
    },
    loungeAccess: {
      domestic: 'complimentary',
      loungeCondition: 'Min ₹50,000 spend in preceding 3 calendar months (from May 2024)'
    },
    excluded: ['fuel_principal', 'emi', 'wallet_load', 'rent', 'jewellery', 'gold', 'insurance', 'education', 'govt_services'],
    bestFor: ['utility', 'dining']
  }
];

// ===== INDUSTRY CARDS DATABASE (30+ Cards — Deep Research) =====
export const industryCards = [

  // ─── CASHBACK & SHOPPING ──────────────────────────────────────────────────
  {
    id: 'yes-paisasave',
    name: 'YES Paisabazaar PaisaSave',
    bank: 'YES Bank',
    network: 'VISA',
    tier: 'entry',  // ₹499, basic dining+travel cashback — entry-level
    annualFee: 499,
    feeWaiverSpend: 120000,
    bestFor: ['dining', 'travel'],
    rewards: {
      dining: {
        type: 'cashback',
        rate: 6,
        label: '6% cashback on dining (including Swiggy, Zomato, restaurant POS)',
        cap: 3000,
        capUnit: 'per_cycle',
        minTxn: 500
      },
      travel: {
        type: 'cashback',
        rate: 6,
        label: '6% cashback on travel (flights, hotels, cabs, IRCTC)',
        cap: 3000,
        capUnit: 'per_cycle',
        minTxn: 500
      },
      fuel: {
        type: 'surcharge_waiver',
        rate: 1,
        label: '1% fuel surcharge waiver',
        cap: 250,
        minTxn: 400
      },
      default: {
        type: 'cashback',
        rate: 1,
        label: '1% cashback on all other spends including UPI',
        cap: null,
        minTxn: 100
      }
    }
  },

  {
    id: 'sbi-cashback-ind',
    name: 'Cashback SBI Card',
    bank: 'SBI Card',
    network: 'VISA',
    tier: 'standard',  // ₹999, universal online cashback — mass-market standard
    annualFee: 999,
    feeWaiverSpend: 200000,
    bestFor: ['online_shopping'],
    rewards: {
      online_shopping: {
        type: 'cashback',
        rate: 5,
        label: '5% automatic cashback on ALL online spends — any merchant, no restriction',
        cap: 5000,
        capUnit: 'per_cycle',
        minTxn: 100,
        note: 'Auto-credited within 2 business days. Cap dropping to ₹2,000 from Apr 1, 2026.'
      },
      default: {
        type: 'cashback',
        rate: 1,
        label: '1% cashback on offline spends',
        cap: 5000,
        capUnit: 'per_cycle',
        minTxn: 100
      }
    },
    excluded: ['fuel', 'utility', 'insurance', 'rent', 'wallet_load', 'education', 'jewellery', 'railway', 'emi', 'gaming', 'toll']
  },

  {
    id: 'tata-neu-infinity',
    name: 'Tata Neu Infinity HDFC',
    bank: 'HDFC Bank',
    network: 'VISA',
    tier: 'standard',  // ₹1,499 co-branded — upper standard (Tata ecosystem play)
    annualFee: 1499,
    feeWaiverSpend: 300000,
    bestFor: ['online_shopping', 'grocery'],
    rewards: {
      tata_brands: {
        type: 'cashback',
        rate: 5,
        label: '5% NeuCoins on Tata brands — Croma, BigBasket, 1mg, Westside, Titan, Tanishq, AirAsia via Tata Neu',
        cap: null,
        minTxn: 1,
        note: '1 NeuCoin = ₹1 on Tata Neu platform only',
        partnerOnly: true
      },
      grocery: {
        type: 'cashback',
        rate: 5,
        label: '5% NeuCoins on BigBasket purchases via Tata Neu',
        cap: null,
        minTxn: 1
      },
      travel: {
        type: 'cashback',
        rate: 5,
        label: '5% NeuCoins on Air India Express via Tata Neu',
        cap: null,
        minTxn: 1
      },
      default: {
        type: 'cashback',
        rate: 1.5,
        label: '1.5% NeuCoins on all other eligible spends',
        cap: null,
        minTxn: 1
      }
    }
  },

  {
    id: 'swiggy-hdfc',
    name: 'Swiggy HDFC Credit Card',
    bank: 'HDFC Bank',
    network: 'VISA',
    tier: 'standard',  // ₹500, niche food/grocery co-branded — entry/standard
    annualFee: 500,
    feeWaiverSpend: 200000,
    bestFor: ['dining', 'grocery'],
    rewards: {
      swiggy_food: {
        type: 'cashback',
        rate: 10,
        label: '10% cashback on all Swiggy Food & DineOut orders',
        cap: 1500,
        capUnit: 'per_cycle',
        minTxn: 1,
        note: 'Cashback credited as Swiggy money within 5 days post statement'
      },
      swiggy_instamart: {
        type: 'cashback',
        rate: 10,
        label: '10% cashback on Swiggy Instamart grocery orders',
        cap: 1500,
        capUnit: 'per_cycle',
        minTxn: 1
      },
      online_shopping: {
        type: 'cashback',
        rate: 5,
        label: '5% cashback on other select online merchants',
        cap: 500,
        capUnit: 'per_cycle',
        minTxn: 1
      },
      default: {
        type: 'cashback',
        rate: 1,
        label: '1% cashback on all other eligible spends',
        cap: null,
        minTxn: 1
      }
    }
  },

  {
    id: 'hsbc-live-plus',
    name: 'HSBC Live+ Credit Card',
    bank: 'HSBC',
    network: 'VISA',
    tier: 'standard',  // Lifetime free, 10% dining+grocery — strong standard
    annualFee: 0,            // Lifetime free
    bestFor: ['dining', 'grocery'],
    rewards: {
      dining: {
        type: 'cashback',
        rate: 10,
        label: '10% cashback on dining & food delivery (restaurants, Swiggy, Zomato)',
        cap: 1000,
        capUnit: 'per_cycle',
        minTxn: 500
      },
      grocery: {
        type: 'cashback',
        rate: 10,
        label: '10% cashback on groceries (supermarkets, BigBasket, Blinkit)',
        cap: 1000,
        capUnit: 'per_cycle',
        minTxn: 500
      },
      default: {
        type: 'cashback',
        rate: 1.5,
        label: '1.5% cashback on all other eligible spends',
        cap: null,
        minTxn: 1
      }
    }
  },

  {
    id: 'flipkart-axis',
    name: 'Flipkart Axis Bank',
    bank: 'Axis Bank',
    network: 'VISA',
    tier: 'standard',  // ₹500 co-branded — entry/standard shopping
    annualFee: 500,
    feeWaiverSpend: 200000,
    bestFor: ['online_shopping', 'dining'],
    rewards: {
      flipkart_myntra: {
        type: 'cashback',
        rate: 5,
        label: '5% unlimited cashback on Flipkart & Myntra (no cap)',
        cap: null,
        minTxn: 1,
        partnerOnly: true
      },
      dining_preferred: {
        type: 'cashback',
        rate: 4,
        label: '4% cashback on Swiggy, Uber, PVR & preferred partners',
        cap: null,
        minTxn: 1,
        merchants: ['swiggy', 'uber', 'pvr']
      },
      default: {
        type: 'cashback',
        rate: 1.5,
        label: '1.5% cashback on all other spends',
        cap: null,
        minTxn: 1
      }
    }
  },

  // ─── REWARDS / LIFESTYLE ──────────────────────────────────────────────────
  {
    id: 'hdfc-regalia-gold',
    name: 'HDFC Regalia Gold',
    bank: 'HDFC Bank',
    network: 'VISA',
    tier: 'premium',  // ₹2,500, 12+6 lounge, milestone vouchers, Priority Pass — mid-premium lifestyle
    annualFee: 2500,
    feeWaiverSpend: 400000,  // ₹4 Lakh annual spend = ₹2,500 fee waived
    loungeDomestic: 12,
    loungeInternational: 6,  // Complimentary Priority Pass
    bestFor: ['online_shopping', 'general', 'travel'],
    rewards: {
      lifestyle_partners: {
        type: 'points',
        rate: 5,
        label: '5X Reward Points (20 RP/₹150) on Nykaa, Myntra, Marks & Spencer, Reliance Digital',
        cap: 5000,           // 5,000 partner RP cap per month
        capUnit: 'per_month',
        minTxn: 150,
        pointValue: 0.65,
        partnerOnly: true,
        note: '1 RP = ₹0.65 on Gold Catalogue; ₹0.50 on SmartBuy flights'
      },
      smartbuy: {
        type: 'points',
        rate: 10,
        label: '10X on SmartBuy hotel bookings; 5X on flights, buses',
        cap: null,
        minTxn: 150,
        pointValue: 0.50
      },
      default: {
        type: 'points',
        rate: 4,
        label: '4 Reward Points / ₹150 on all retail spends (≈1.73% value at Gold Catalogue)',
        cap: null,
        minTxn: 150,
        pointValue: 0.65
      },
      dineout: {
        type: 'discount',
        rate: 20,
        label: 'Up to 20% off at Swiggy Dineout partner restaurants',
        cap: null,
        minTxn: 0
      }
    },
    quarterlyMilestone: {
      spend: 150000,
      reward: '₹1,500 vouchers from Marriott / Myntra / M&S / Reliance Digital'
    },
    annualMilestone: [
      { spend: 500000, reward: '₹5,000 flight vouchers' },
      { spend: 750000, reward: 'Additional ₹5,000 flight vouchers' }
    ]
  },

  {
    id: 'axis-select',
    name: 'Axis SELECT',
    bank: 'Axis Bank',
    network: 'VISA',
    tier: 'premium',  // ₹3,000, lifestyle rewards, lounge — entry-premium
    annualFee: 3000,
    bestFor: ['online_shopping', 'movies', 'dining'],
    rewards: {
      online_shopping: {
        type: 'points',
        rate: 2,
        label: '2X EDGE Reward Points on online shopping',
        cap: null,
        minTxn: 1,
        pointValue: 0.20
      },
      movies: {
        type: 'discount',
        rate: 50,
        label: 'Buy 1 Get 1 Free on BookMyShow (up to ₹300 off per ticket, 2 bookings/month)',
        cap: 600,
        note: 'Applies to movies on weekends'
      },
      premium_dining: {
        type: 'discount',
        rate: 20,
        label: 'Up to 20% off at select premium restaurants',
        cap: null
      },
      default: {
        type: 'points',
        rate: 2,
        label: '2X EDGE Reward Points on all other retail spends',
        cap: null,
        minTxn: 1,
        pointValue: 0.20
      }
    }
  },

  {
    id: 'sbi-prime',
    name: 'SBI Prime',
    bank: 'SBI Card',
    network: 'VISA',
    tier: 'premium',  // ₹2,999, 10X on dining/grocery/movies, birthday 20X — entry-premium
    annualFee: 2999,
    bestFor: ['dining', 'grocery', 'movies', 'dining'],
    rewards: {
      dining: {
        type: 'points',
        rate: 10,
        label: '10X Reward Points on dining (restaurants, cafes, food aggregators)',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      },
      grocery: {
        type: 'points',
        rate: 10,
        label: '10X Reward Points on grocery & departmental stores',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      },
      movies: {
        type: 'points',
        rate: 10,
        label: '10X Reward Points on movies (BookMyShow, PVR, INOX)',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      },
      international: {
        type: 'points',
        rate: 2,
        label: '2X Reward Points on international spends',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      },
      birthday: {
        type: 'points',
        rate: 20,
        label: '20X Reward Points on birthday month spends',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      },
      default: {
        type: 'points',
        rate: 1,
        label: '1 Reward Point / ₹100 on all other eligible spends',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      }
    }
  },

  {
    id: 'amex-mrcc',
    name: 'Amex Membership Rewards',
    bank: 'Amex',
    network: 'Amex',
    tier: 'premium',  // ₹1,500 fee but Amex positioning, transfer partners, milestone — entry-premium
    annualFee: 1500,         // First year free; from 2nd year ₹1,500 (updated 2024)
    bestFor: ['general', 'dining'],
    rewards: {
      base: {
        type: 'points',
        rate: 1,
        label: '1 MR Point per ₹50 spent on eligible transactions',
        cap: null,
        minTxn: 50,
        pointValue: 0.50,  // Up to ₹0.75 with IndiGo 6e Rewards; typical ₹0.35–0.50
        note: '18,000 MR Points milestone every 6 months on reaching ₹1.5 Lakh spend within the period'
      },
      amex_partners: {
        type: 'points',
        rate: 5,
        label: '5X MR Points at partner merchants — Amazon, Flipkart, Paytm, Myntra, BookMyShow',
        cap: null,
        minTxn: 50,
        note: 'Amex Offers — merchant-specific, varies monthly'
      },
      dining: {
        type: 'discount',
        rate: 25,
        label: 'Up to 25% off at 1,500+ EazyDiner partner restaurants via Amex',
        cap: null,
        minTxn: 0
      }
    }
  },

  {
    id: 'hdfc-moneyback-plus',
    name: 'HDFC MoneyBack+',
    bank: 'HDFC Bank',
    network: 'VISA',
    tier: 'entry',  // ₹500, 2X online, basic points — entry-level starter card
    annualFee: 500,
    feeWaiverSpend: 50000,
    bestFor: ['online_shopping'],
    rewards: {
      online_shopping: {
        type: 'points',
        rate: 2,
        label: '2X CashPoints on Amazon, Flipkart, Myntra, Swiggy, Zomato & Uber',
        cap: null,
        minTxn: 150,
        pointValue: 0.50
      },
      emi_department: {
        type: 'points',
        rate: 2,
        label: '2X CashPoints on EMI transactions & department stores',
        cap: null,
        minTxn: 150,
        pointValue: 0.50
      },
      default: {
        type: 'points',
        rate: 1,
        label: '1 CashPoint / ₹150 on all other eligible spends',
        cap: null,
        minTxn: 150,
        pointValue: 0.50,
        note: '1 CashPoint = ₹0.50 for statement credit redemption'
      }
    }
  },

  {
    id: 'easydiner-indusind',
    name: 'EazyDiner IndusInd',
    bank: 'IndusInd Bank',
    network: 'Mastercard',
    tier: 'premium',  // ₹2,999, complimentary EazyDiner Prime, dining-focused lifestyle — mid-premium
    annualFee: 2999,
    bestFor: ['dining'],
    rewards: {
      easydiner: {
        type: 'discount',
        rate: 25,
        label: 'Up to 25% off at 22,000+ EazyDiner Prime restaurants — complimentary EazyDiner Prime membership',
        cap: null,
        minTxn: 0,
        note: 'EazyDiner Prime worth ₹1,499/yr included free'
      },
      reward_points: {
        type: 'points',
        rate: 10,
        label: '10 Reward Points per ₹100 on dining spends',
        cap: null,
        minTxn: 100,
        pointValue: 0.50
      },
      default: {
        type: 'points',
        rate: 2,
        label: '2 Reward Points per ₹100 on all other spends',
        cap: null,
        minTxn: 100,
        pointValue: 0.50
      }
    }
  },

  {
    id: 'sbi-simplysave',
    name: 'SBI SimplySAVE',
    bank: 'SBI Card',
    network: 'VISA',
    tier: 'entry',  // ₹499, 10X on 3 categories, 1X default — classic entry-level earner
    annualFee: 499,
    feeWaiverSpend: 100000,
    bestFor: ['grocery', 'dining', 'movies'],
    rewards: {
      grocery: {
        type: 'points',
        rate: 10,
        label: '10X Reward Points on grocery & departmental stores (Big Bazaar, DMart, grocery apps)',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      },
      dining: {
        type: 'points',
        rate: 10,
        label: '10X Reward Points on dining spends',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      },
      movies: {
        type: 'points',
        rate: 10,
        label: '10X Reward Points on movies (BookMyShow, PVR)',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      },
      default: {
        type: 'points',
        rate: 1,
        label: '1 Reward Point / ₹100 on all other spends',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      }
    }
  },

  // ─── TRAVEL ───────────────────────────────────────────────────────────────
  {
    id: 'axis-atlas',
    name: 'Axis Atlas',
    bank: 'Axis Bank',
    network: 'VISA',
    tier: 'premium',  // ₹5,000, 18+12 lounge, EDGE Miles transfers — upper-premium travel
    annualFee: 5000,
    loungeDomestic: 18,
    loungeInternational: 12,
    forexMarkup: 1.5,
    bestFor: ['travel'],
    rewards: {
      travel_partners: {
        type: 'points',
        rate: 5,
        label: '5 EDGE Miles per ₹100 on travel bookings (MakeMyTrip, Yatra, IRCTC, BookingCom, airline sites)',
        cap: null,
        minTxn: 100,
        pointValue: 1.0,
        note: '1 EDGE Mile = ₹1 equivalent when transferred to airline/hotel programs (Vistara, Air Asia, Marriott Bonvoy, Accor)'
      },
      default: {
        type: 'points',
        rate: 2,
        label: '2 EDGE Miles per ₹100 on all other retail spends',
        cap: null,
        minTxn: 100,
        pointValue: 1.0
      }
    },
    milestones: [
      { spend: 750000, reward: '5,000 bonus EDGE Miles + Club Vistara Silver Tier' },
      { spend: 1500000, reward: '10,000 bonus EDGE Miles + Club Vistara Gold Tier' }
    ]
  },

  {
    id: 'axis-horizon',
    name: 'Axis Horizon',
    bank: 'Axis Bank',
    network: 'VISA',
    tier: 'premium',  // ₹3,000, 8+4 lounge, travel miles — entry-premium travel (not standard)
    annualFee: 3000,
    loungeDomestic: 8,
    loungeInternational: 4,
    bestFor: ['travel'],
    rewards: {
      travel: {
        type: 'points',
        rate: 3,
        label: '3 EDGE Miles per ₹100 on flights, hotels, bus bookings',
        cap: null,
        minTxn: 100,
        pointValue: 1.0
      },
      default: {
        type: 'points',
        rate: 1,
        label: '1 EDGE Mile per ₹100 on all other spends',
        cap: null,
        minTxn: 100,
        pointValue: 1.0
      }
    }
  },

  {
    id: 'amex-platinum-travel',
    name: 'Amex Platinum Travel',
    bank: 'Amex',
    network: 'Amex',
    tier: 'premium',  // ₹3,500, milestone Taj vouchers, lounge access — mid-premium travel
    annualFee: 3500,         // Updated: ₹3,500 joining; renewal varies
    loungeDomestic: 4,
    bestFor: ['travel'],
    rewards: {
      travel: {
        type: 'points',
        rate: 3,
        label: '3 MR Points per ₹100 on travel — flights, hotels, car rentals',
        cap: null,
        minTxn: 100,
        pointValue: 0.50
      },
      milestone_travel: {
        type: 'voucher',
        rate: 0,
        label: '₹7,700 Taj Experiences voucher on spending ₹1.9 Lakh in a year; ₹11,800 + lounge on ₹4 Lakh',
        cap: null,
        minTxn: 0,
        note: 'Travel voucher milestone benefits significantly enhance card value'
      },
      default: {
        type: 'points',
        rate: 1,
        label: '1 MR Point per ₹50 on all other eligible spends',
        cap: null,
        minTxn: 50,
        pointValue: 0.50
      }
    }
  },

  {
    id: 'hsbc-travelone',
    name: 'HSBC TravelOne',
    bank: 'HSBC',
    network: 'VISA',
    tier: 'premium',  // ₹4,999, 8+4 lounge, 1:1 transfer to 7 airline/hotel programs — upper-premium travel
    annualFee: 4999,
    loungeDomestic: 8,
    loungeInternational: 4,
    forexMarkup: 1.75,
    bestFor: ['travel'],
    rewards: {
      travel: {
        type: 'points',
        rate: 4,
        label: '4 Reward Points per ₹100 on travel spends — 1:1 transfer to 7+ airline & hotel programmes',
        cap: null,
        minTxn: 100,
        pointValue: 1.0,
        partners: ['Air India', 'IndiGo', 'Marriott Bonvoy', 'IHG', 'Accor', 'Singapore Airlines', 'British Airways']
      },
      default: {
        type: 'points',
        rate: 2,
        label: '2 Reward Points per ₹100 on all other eligible spends',
        cap: null,
        minTxn: 100,
        pointValue: 1.0
      }
    }
  },

  {
    id: 'mmt-icici',
    name: 'MakeMyTrip ICICI',
    bank: 'ICICI Bank',
    network: 'VISA',
    tier: 'standard',  // ₹999, co-branded MMT cashback — standard co-branded
    annualFee: 999,
    bestFor: ['travel'],
    rewards: {
      mmt_flights: {
        type: 'cashback',
        rate: 8,
        label: '8% value back as MMT Cash on domestic flights via MakeMyTrip',
        cap: null,
        partnerOnly: true,
        note: 'MMT Cash redeemable on future bookings on MMT'
      },
      mmt_hotels: {
        type: 'cashback',
        rate: 10,
        label: '10% value back as MMT Cash on hotel bookings via MakeMyTrip',
        cap: null,
        partnerOnly: true
      },
      mmt_holidays: {
        type: 'cashback',
        rate: 5,
        label: '5% value back on holiday packages via MakeMyTrip',
        cap: null,
        partnerOnly: true
      },
      default: {
        type: 'cashback',
        rate: 1,
        label: '1% as myRewardz points on all other spends',
        cap: null,
        minTxn: 1
      }
    }
  },

  // ─── SUPER PREMIUM ────────────────────────────────────────────────────────
  {
    id: 'hdfc-infinia',
    name: 'HDFC Infinia Metal',
    bank: 'HDFC Bank',
    network: 'VISA',
    tier: 'super_premium',  // ₹12,500, unlimited lounge, 5RP/₹150 base, invite-only — top-tier
    annualFee: 12500,
    loungeDomestic: -1,      // Unlimited
    loungeInternational: -1, // Unlimited via Priority Pass
    forexMarkup: 2.0,
    bestFor: ['general', 'travel', 'online_shopping'],
    rewards: {
      smartbuy: {
        type: 'points',
        rate: 10,
        label: '10X Reward Points (50 RP/₹150) via HDFC SmartBuy — flights, hotels, instant vouchers',
        cap: null,
        minTxn: 150,
        pointValue: 0.50,
        note: 'No capping on SmartBuy 10X for Infinia unlike Regalia/Diners'
      },
      default: {
        type: 'points',
        rate: 5,
        label: '5 Reward Points / ₹150 on all eligible retail spends (≈1.67% effective value)',
        cap: null,
        minTxn: 150,
        pointValue: 0.50
      },
      dining: {
        type: 'discount',
        rate: 20,
        label: 'Up to 20% off at 10,000+ Swiggy Dineout restaurants; Golf privileges at 400+ courses',
        cap: null
      }
    }
  },

  {
    id: 'hdfc-diners-black',
    name: 'HDFC Diners Club Black Metal',
    bank: 'HDFC Bank',
    network: 'Diners',
    tier: 'super_premium',  // ₹10,000, unlimited lounge, 5RP base, waivable on ₹8L — top-tier
    annualFee: 10000,
    feeWaiverSpend: 800000,  // ₹8 Lakh spend = annual fee waived
    loungeDomestic: -1,      // Unlimited
    loungeInternational: -1, // Unlimited
    forexMarkup: 2.0,
    bestFor: ['general', 'travel', 'dining', 'online_shopping'],
    rewards: {
      smartbuy: {
        type: 'points',
        rate: 10,
        label: '10X Reward Points via SmartBuy (flights, hotels, instant vouchers, EGV)',
        cap: null,
        minTxn: 150,
        pointValue: 0.50
      },
      weekend_dining: {
        type: 'points',
        rate: 2,
        label: '2X Reward Points on weekend dining (Sat & Sun) at standalone restaurants',
        cap: null,
        minTxn: 150,
        pointValue: 0.50,
        note: 'Base 5X for Diners Black; 2X multiplier makes it 10X on weekend dining effectively'
      },
      default: {
        type: 'points',
        rate: 5,
        label: '5 Reward Points / ₹150 on all retail spends (≈1.67% at SmartBuy value)',
        cap: null,
        minTxn: 150,
        pointValue: 0.50
      }
    }
  },

  {
    id: 'axis-reserve',
    name: 'Axis Reserve',
    bank: 'Axis Bank',
    network: 'VISA',
    tier: 'super_premium',  // ₹50,000, unlimited lounge, metal card, 5 BMS free/month — ultra-premium
    annualFee: 50000,
    loungeDomestic: -1,      // Unlimited
    loungeInternational: -1, // Unlimited Priority Pass
    forexMarkup: 1.5,
    bestFor: ['travel', 'general'],
    rewards: {
      international_travel: {
        type: 'points',
        rate: 30,
        label: '30 EDGE Reward Points per ₹200 on international spends (2X vs domestic)',
        cap: null,
        minTxn: 200,
        pointValue: 0.20
      },
      default: {
        type: 'points',
        rate: 15,
        label: '15 EDGE Reward Points per ₹200 on all domestic retail spends',
        cap: null,
        minTxn: 200,
        pointValue: 0.20
      },
      movies: {
        type: 'discount',
        rate: 50,
        label: 'Buy 1 Get 1 Free on BookMyShow — up to 5 free tickets per month',
        cap: null,
        note: 'No monetary cap mentioned; 5 free ticket benefit per calendar month'
      }
    }
  },

  // ─── FUEL ─────────────────────────────────────────────────────────────────
  {
    id: 'iocl-rbl-xtra',
    name: 'IndianOil RBL XTRA',
    bank: 'RBL Bank',
    network: 'Mastercard',
    tier: 'standard',  // ₹1,500, co-branded fuel — upper standard fuel card
    annualFee: 1500,
    bestFor: ['fuel'],
    rewards: {
      iocl_fuel: {
        type: 'cashback',
        rate: 8.5,
        label: '8.5% value back at IndianOil outlets (4% turbopoints + 1% surcharge waiver + 2.5% bank cashback + 1% discount)',
        cap: null,
        minTxn: 100,
        partnerOnly: true,
        note: 'Breakdown: 4% Turbopoints + 2.5% cashback + 1% surcharge waiver + 1% IndianOil loyalty discount'
      },
      default: {
        type: 'points',
        rate: 1,
        label: '1 RBL Reward Point / ₹100 on all other retail spends',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      }
    }
  },

  {
    id: 'bpcl-sbi-octane',
    name: 'BPCL SBI Octane',
    bank: 'SBI Card',
    network: 'VISA',
    tier: 'standard',  // ₹1,499, co-branded BPCL fuel + dining — upper standard fuel card
    annualFee: 1499,
    bestFor: ['fuel', 'dining', 'grocery'],
    rewards: {
      bpcl_fuel: {
        type: 'cashback',
        rate: 7.25,
        label: '7.25% value back at BPCL petrol stations (6X RP + 1% surcharge waiver)',
        cap: null,
        minTxn: 100,
        partnerOnly: true,
        note: '6X Reward Points (valued at 6.25% with 1 RP = ₹0.25) + 1% surcharge waiver'
      },
      dining_movies: {
        type: 'points',
        rate: 5,
        label: '5X Reward Points on dining & movies',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      },
      grocery: {
        type: 'points',
        rate: 5,
        label: '5X Reward Points on grocery & departmental stores',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      },
      default: {
        type: 'points',
        rate: 1,
        label: '1 Reward Point / ₹100 on all other eligible spends',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      }
    }
  },

  {
    id: 'idfc-power-plus',
    name: 'IDFC FIRST Power+',
    bank: 'IDFC FIRST',
    network: 'VISA',
    tier: 'entry',  // ₹499, fuel/grocery/utility 5% — entry-level utility card
    annualFee: 499,
    bestFor: ['fuel', 'grocery', 'utility'],
    rewards: {
      hpcl_fuel: {
        type: 'cashback',
        rate: 5,
        label: '5% savings on HPCL petrol stations (4% cashback + 1% surcharge waiver)',
        cap: null,
        minTxn: 100,
        partnerOnly: true
      },
      grocery: {
        type: 'cashback',
        rate: 5,
        label: '5% cashback on grocery spends (supermarkets, grocery apps)',
        cap: null,
        minTxn: 100
      },
      utility: {
        type: 'cashback',
        rate: 5,
        label: '5% cashback on utility bill payments (electricity, water, gas)',
        cap: null,
        minTxn: 100
      },
      default: {
        type: 'points',
        rate: 1,
        label: '10X Reward Points on birthday month; 3X on weekends; 1X regular',
        cap: null,
        pointValue: 1.0,   // IDFC FIRST points = ₹1 each
        note: 'IDFC FIRST Reward Points are among highest value in industry at ₹1/pt'
      }
    }
  },

  {
    id: 'icici-hpcl-saver',
    name: 'ICICI HPCL Super Saver',
    bank: 'ICICI Bank',
    network: 'VISA',
    tier: 'entry',  // ₹500, HPCL-specific fuel benefit — basic entry fuel card
    annualFee: 500,
    bestFor: ['fuel', 'grocery'],
    rewards: {
      hpcl_fuel: {
        type: 'cashback',
        rate: 4,
        label: '4% Reward Points + 1% surcharge waiver = 5% effective value at HPCL stations',
        cap: null,
        minTxn: 100,
        partnerOnly: true
      },
      grocery: {
        type: 'cashback',
        rate: 2,
        label: '2% Reward Points on grocery & departmental store spends',
        cap: null,
        minTxn: 100
      },
      utility: {
        type: 'cashback',
        rate: 2,
        label: '2% Reward Points on utility bill payments',
        cap: null,
        minTxn: 100
      },
      default: {
        type: 'points',
        rate: 1,
        label: '1 ICICI Reward Point per ₹100 on all other eligible spends',
        cap: null,
        minTxn: 100,
        pointValue: 0.25
      }
    }
  },

  {
    id: 'iocl-axis',
    name: 'IndianOil Axis Bank',
    bank: 'Axis Bank',
    network: 'VISA',
    tier: 'entry',  // ₹500, IOCL fuel + 4% online — entry-level co-branded
    annualFee: 500,
    bestFor: ['fuel', 'online_shopping'],
    rewards: {
      iocl_fuel: {
        type: 'cashback',
        rate: 4,
        label: '4% value back at IndianOil — credited as Turbopoints',
        cap: null,
        minTxn: 100,
        partnerOnly: true
      },
      online_shopping: {
        type: 'cashback',
        rate: 4,
        label: '4% cashback on online shopping (Myntra, Amazon, Flipkart, Nykaa)',
        cap: null,
        minTxn: 100,
        merchants: ['myntra', 'amazon', 'flipkart', 'nykaa']
      },
      fuel_surcharge: {
        type: 'surcharge_waiver',
        rate: 1,
        label: '1% fuel surcharge waiver on all petrol stations',
        cap: 250,
        minTxn: 400
      },
      default: {
        type: 'points',
        rate: 1,
        label: '1 EDGE Reward Point per ₹100 on other spends',
        cap: null,
        pointValue: 0.20
      }
    }
  }
];
