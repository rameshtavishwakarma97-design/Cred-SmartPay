// ============================================
// Merchant Simulator (3rd Party App Mock)
// ============================================

import { merchants } from '../data/merchants.js';
import { createPendingTransaction, logFunnelEvent } from '../api.js';

const SIM_MERCHANTS = [
  { id: 'zomato', primaryColor: '#E23744', borderRadius: '12px', font: 'system-ui' },
  { id: 'swiggy', primaryColor: '#FC8019', borderRadius: '24px', font: 'system-ui' },
  { id: 'amazon', primaryColor: '#FF9900', borderRadius: '4px', font: 'Amazon Ember, Arial, sans-serif' },
  { id: 'croma', primaryColor: '#00A651', borderRadius: '0px', font: 'Inter, sans-serif' }
];

export function renderMerchantSimulator(app, navigate, params) {
  logFunnelEvent('simulator_started');
  // Randomly select one of our 4 themed merchants
  const theme = SIM_MERCHANTS[Math.floor(Math.random() * SIM_MERCHANTS.length)];
  const merchant = merchants.find(m => m.id === theme.id) || merchants[0];
  const randomAmount = Math.floor(Math.random() * 4500) + 500; // ₹500 to ₹5000
  
  const screen = document.createElement('div');
  screen.className = 'merchant-sim-wrapper';
  screen.id = 'merchant-sim-screen';
  
  // Apply merchant-specific theme variables
  screen.style.setProperty('--ms-primary', theme.primaryColor);
  screen.style.setProperty('--ms-radius', theme.borderRadius);
  screen.style.setProperty('--ms-font', theme.font);

  let selectedFlow = null; // 'cards' or 'upi'

  function render() {
    screen.innerHTML = `
      <div class="merchant-sim-container" style="font-family: var(--ms-font);">
        <div class="ms-header" style="border-bottom: 2px solid var(--ms-primary);">
          <button class="ms-back-btn" id="ms-back">←</button>
          <span class="ms-merchant-name" style="color: var(--ms-primary);">${merchant.name} Checkout</span>
          <div style="width: 24px;"></div>
        </div>

        <div class="ms-content">
          <div class="ms-order-card" style="border-radius: var(--ms-radius);">
            <div class="ms-order-summary">Order Summary</div>
            <div class="ms-order-item">
              <span class="ms-item-name">Priority Delivery</span>
              <span class="ms-item-price">₹${randomAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="ms-order-item">
              <span class="ms-item-name">Service Fee</span>
              <span class="ms-item-price">₹25.00</span>
            </div>
            <div class="ms-order-total" style="color: var(--ms-primary);">
              <span>Total to pay</span>
              <span>₹${(randomAmount + 25).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div class="ms-payment-section">
            <div class="ms-section-title">Select Payment Method</div>
            
            <div class="ms-payment-methods-grid">
              <div class="ms-method-card" id="ms-method-netbanking" style="border-radius: var(--ms-radius);">
                <span class="ms-method-icon">🏦</span>
                <span class="ms-method-label">Net Banking</span>
              </div>
              <div class="ms-method-card" id="ms-method-cards" style="border-radius: var(--ms-radius);">
                <span class="ms-method-icon">💳</span>
                <span class="ms-method-label">Cards</span>
              </div>
              <div class="ms-method-card" id="ms-method-upi" style="border-radius: var(--ms-radius);">
                <span class="ms-method-icon">📱</span>
                <span class="ms-method-label">UPI</span>
              </div>
            </div>
          </div>

          <button class="ms-primary-btn disabled" id="ms-proceed-btn" disabled style="background: var(--ms-primary); border-radius: var(--ms-radius);">Select a method to proceed</button>
        </div>

        <!-- Payment Dropdown / Overlay -->
        <div class="ms-overlay" id="ms-payment-overlay">
          <div class="ms-bottom-sheet" style="border-radius: var(--ms-radius) var(--ms-radius) 0 0;">
            <div class="ms-sheet-header">
              <span>Choose how to pay</span>
              <button id="ms-close-overlay">✕</button>
            </div>
            <div class="ms-options-list">
              <div class="ms-option-item" data-method="gpay" style="border-radius: var(--ms-radius);">
                <span class="ms-option-icon" style="background: var(--ms-primary);">𝐆</span>
                <span>Google Pay</span>
              </div>
              <div class="ms-option-item" data-method="paytm" style="border-radius: var(--ms-radius);">
                <span class="ms-option-icon" style="background: var(--ms-primary);">𝐏</span>
                <span>Paytm</span>
              </div>
              <div class="ms-option-item ms-option-featured" data-method="cred" style="border-radius: var(--ms-radius); border-color: var(--ms-primary);">
                <span class="ms-option-icon" style="background: #000;">🧠</span>
                <div class="ms-option-content">
                  <div class="ms-option-title">CRED Pay</div>
                  <div class="ms-option-desc">Trusted by 25M+ members</div>
                </div>
                <span class="ms-option-badge" style="background: var(--ms-primary);">OFFER</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    attachListeners();
  }

  function attachListeners() {
    const overlay = screen.querySelector('#ms-payment-overlay');
    const proceedBtn = screen.querySelector('#ms-proceed-btn');
    
    screen.querySelector('#ms-back')?.addEventListener('click', () => { window.location.href = '/'; });
    
    const methods = ['netbanking', 'cards', 'upi'];
    methods.forEach(m => {
      screen.querySelector(`#ms-method-${m}`)?.addEventListener('click', () => {
        methods.forEach(x => {
          const el = screen.querySelector(`#ms-method-${x}`);
          el.classList.remove('selected');
          el.style.borderColor = '#E9ECEF';
        });
        const target = screen.querySelector(`#ms-method-${m}`);
        target.classList.add('selected');
        target.style.borderColor = theme.primaryColor;
        selectedFlow = m;
        
        if (m === 'netbanking') {
          proceedBtn.disabled = true;
          proceedBtn.classList.add('disabled');
          proceedBtn.style.background = '#E9ECEF';
          proceedBtn.textContent = 'Select a different method';
        } else {
          proceedBtn.disabled = false;
          proceedBtn.classList.remove('disabled');
          proceedBtn.style.background = theme.primaryColor;
          proceedBtn.textContent = 'Proceed to Pay';
        }
      });
    });

    proceedBtn?.addEventListener('click', () => {
      overlay.classList.add('active');
    });

    screen.querySelector('#ms-close-overlay')?.addEventListener('click', () => {
      overlay.classList.remove('active');
    });

    screen.querySelectorAll('.ms-option-item').forEach(opt => {
      opt.addEventListener('click', async () => {
        const method = opt.dataset.method;
        if (method === 'cred') {
          overlay.classList.remove('active');
          
          try {
            // Log transaction stage: Creating pending transaction
            const totalAmount = randomAmount + 25;
            const res = await createPendingTransaction({
              merchant_id: merchant.id,
              merchant_name: merchant.name,
              category: merchant.category || 'general',
              amount: totalAmount
            });

            // Navigate to CRED app with forced flow
            navigate('transaction', {
              merchantId: merchant.id,
              amount: totalAmount,
              transactionId: res.id,
              forceSmartPay: (selectedFlow === 'cards'),
              forceUpi: (selectedFlow === 'upi'),
              fromSimulator: true
            });
          } catch (e) {
            console.error('Failed to log transaction stage', e);
            alert('Failed to initiate CRED Pay. Please try again.');
          }
        } else {
          alert(`Simulated: ${method} is not available in this demo. Try CRED Pay!`);
        }
      });
    });
  }

  app.innerHTML = '';
  app.appendChild(screen);
  render();
}
