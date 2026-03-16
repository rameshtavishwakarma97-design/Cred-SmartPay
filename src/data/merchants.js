// ============================================
// Merchant Database
// ============================================

export const merchants = [
  {
    id: 'zomato',
    name: 'Zomato',
    category: 'dining',
    categoryLabel: 'Dining & Food',
    emoji: '🍕',
    bgColor: '#E23744',
    upiId: 'zomato@hdfcbank',
    credOffer: 'Up to 20% CRED cashback',
    credCashback: 5,
    popular: true
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    category: 'dining',
    categoryLabel: 'Dining & Food',
    emoji: '🍔',
    bgColor: '#FC8019',
    upiId: 'swiggy@icici',
    credOffer: 'Flat ₹75 off on ₹500+',
    credCashback: 3,
    popular: true
  },
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'online_shopping',
    categoryLabel: 'Online Shopping',
    emoji: '📦',
    bgColor: '#FF9900',
    upiId: 'amazon@apl',
    credOffer: '10% CRED cashback up to ₹200',
    credCashback: 4,
    popular: true
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    category: 'online_shopping',
    categoryLabel: 'Online Shopping',
    emoji: '🛒',
    bgColor: '#2874F0',
    upiId: 'flipkart@axisbank',
    credOffer: 'CRED coins worth ₹150',
    credCashback: 3,
    popular: true
  },
  {
    id: 'bigbasket',
    name: 'BigBasket',
    category: 'grocery',
    categoryLabel: 'Grocery',
    emoji: '🥬',
    bgColor: '#84C225',
    upiId: 'bigbasket@ybl',
    credOffer: '₹100 off on ₹1000+',
    credCashback: 2,
    popular: true
  },
  {
    id: 'blinkit',
    name: 'Blinkit',
    category: 'grocery',
    categoryLabel: 'Grocery',
    emoji: '⚡',
    bgColor: '#F8CE46',
    upiId: 'blinkit@paytm',
    credOffer: 'Flat ₹50 CRED cashback',
    credCashback: 2,
    popular: true
  },
  {
    id: 'hp-petrol',
    name: 'HP Petroleum',
    category: 'fuel',
    categoryLabel: 'Fuel',
    emoji: '⛽',
    bgColor: '#00843D',
    upiId: 'hppetrol@sbi',
    credOffer: null,
    credCashback: 0,
    popular: false
  },
  {
    id: 'ioc-petrol',
    name: 'Indian Oil',
    category: 'fuel',
    categoryLabel: 'Fuel',
    emoji: '🛢️',
    bgColor: '#0066B3',
    upiId: 'iocl@icici',
    credOffer: '1% fuel surcharge waiver',
    credCashback: 1,
    popular: false
  },
  {
    id: 'makemytrip',
    name: 'MakeMyTrip',
    category: 'travel',
    categoryLabel: 'Travel',
    emoji: '✈️',
    bgColor: '#EB2226',
    upiId: 'makemytrip@hdfcbank',
    credOffer: 'Up to ₹500 CRED cashback',
    credCashback: 3,
    popular: true
  },
  {
    id: 'uber',
    name: 'Uber',
    category: 'travel',
    categoryLabel: 'Travel & Transport',
    emoji: '🚗',
    bgColor: '#000000',
    upiId: 'uber@icici',
    credOffer: '15% off up to ₹100',
    credCashback: 2,
    popular: false
  },
  {
    id: 'croma',
    name: 'Croma',
    category: 'online_shopping',
    categoryLabel: 'Electronics',
    emoji: '💻',
    bgColor: '#00A651',
    upiId: 'croma@hdfcbank',
    credOffer: 'CRED coins worth ₹300',
    credCashback: 2,
    popular: false
  },
  {
    id: 'dmart',
    name: 'DMart',
    category: 'grocery',
    categoryLabel: 'Grocery & Essentials',
    emoji: '🏪',
    bgColor: '#006838',
    upiId: 'dmart@ybl',
    credOffer: null,
    credCashback: 0,
    popular: false
  }
];

export const categories = [
  { id: 'all', label: 'All', emoji: '✨' },
  { id: 'dining', label: 'Dining', emoji: '🍽️' },
  { id: 'online_shopping', label: 'Shopping', emoji: '🛍️' },
  { id: 'grocery', label: 'Grocery', emoji: '🥦' },
  { id: 'fuel', label: 'Fuel', emoji: '⛽' },
  { id: 'travel', label: 'Travel', emoji: '✈️' }
];
