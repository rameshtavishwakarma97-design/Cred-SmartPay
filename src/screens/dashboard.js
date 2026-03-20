import { getAnalyticsStats, clearToken, getUser } from '../api.js';

export function renderDashboard(app, navigate, params) {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    alert('Access Denied: Admin privileges required.');
    navigate('login');
    return;
  }

  // Toggle admin mode for desktop view
  const rootApp = document.getElementById('app');
  rootApp.classList.add('admin-mode');

  const screen = document.createElement('div');
  screen.className = 'dashboard-wrapper';
  screen.id = 'dashboard-screen';

  screen.innerHTML = `
    <div style="display: flex; min-height: 100vh; background: #050505; width: 100vw; position: relative; margin-left: calc(-50vw + 50%); color: #fff;">
      <!-- Sidebar -->
      <aside style="width: 280px; background: rgba(10, 10, 10, 0.8); backdrop-filter: blur(20px); border-right: 1px solid rgba(255,255,255,0.05); padding: 40px 24px; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; z-index: 100;">
        <div style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; margin-bottom: 48px; letter-spacing: -0.04em; display: flex; align-items: center; gap: 12px;">
           <div style="width: 32px; height: 32px; background: var(--poli-purple); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1rem;">C</div>
           CRED <span style="font-size: 0.55rem; vertical-align: middle; border: 1px solid rgba(139, 92, 246, 0.3); padding: 3px 8px; border-radius: 4px; color: var(--poli-purple); font-weight: 900; letter-spacing: 0.1em;">CONTROL</span>
        </div>
        
        <nav style="display: flex; flex-direction: column; gap: 4px;">
          <div class="side-nav-item active">📊 Performance Hub</div>
          <div class="side-nav-item">📈 Real-time Streams</div>
          <div class="side-nav-item">🛡️ Fraud Monitor</div>
          <div class="side-nav-item">⚙️ Engine Optimiser</div>
        </nav>
        
        <div style="margin-top: auto;">
           <div style="padding: 16px; background: rgba(255,255,255,0.03); border-radius: 16px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.05);">
              <div style="font-size: 0.65rem; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em;">Security Token Active</div>
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-top: 6px; display: flex; align-items: center; gap: 8px;">
                <span style="width: 6px; height: 6px; background: var(--park-green); border-radius: 50%;"></span>
                Admin: ${user.name || 'System'}
              </div>
           </div>
           <button id="dash-logout-side" class="side-nav-item" style="width: 100%; border: none; color: #F87171; background: rgba(239, 68, 68, 0.08);">🚪 Terminate Session</button>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main style="flex: 1; padding: 60px 80px; overflow-y: auto;">
        <header style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px;">
          <div>
            <div style="font-size: 0.7rem; color: var(--poli-purple); font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 12px;">Intelligence Dashboard v2.0</div>
            <h1 style="font-family: var(--font-display); font-size: 2.8rem; font-weight: 950; letter-spacing: -0.03em;">System Telemetry</h1>
          </div>
          <div style="display: flex; gap: 16px; margin-bottom: 8px;">
             <button id="dash-refresh" class="neo-btn neo-btn-primary" style="height: 48px; padding: 0 28px; border-radius: 12px; font-size: 0.75rem; background: #fff; color: #000; box-shadow: 0 10px 20px rgba(255,255,255,0.1);">↻ Refresh Data</button>
             <button class="neo-btn neo-btn-secondary" style="height: 48px; width: 48px; padding: 0; border-radius: 12px; font-size: 1.2rem;">📥</button>
          </div>
        </header>

        <div id="dash-loading" style="text-align: center; padding: 120px 0;">
          <div class="shimmer" style="width: 60px; height: 60px; border-radius: 12px; background: rgba(255,255,255,0.05); margin: 0 auto 24px;"></div>
          <div style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; color: var(--text-secondary);">Aggregating global transaction data...</div>
        </div>
        
        <div id="dash-content" style="display: none;">
          <!-- Primary KPI Row -->
          <div id="dash-kpi-grid" class="dash-grid stagger-1"></div>
          
          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; margin-top: 40px;">
             <!-- Left Column: Funnel & Performance -->
             <div class="stagger-2">
                <div class="glass-card" style="height: 100%;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
                    <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 800;">Conversion Pipeline</h2>
                    <div style="font-size: 0.7rem; color: var(--text-tertiary); background: rgba(255,255,255,0.05); padding: 6px 12px; border-radius: 20px;">LAST 30 DAYS</div>
                  </div>
                  <div id="dash-funnel" class="chart-container"></div>
                </div>
             </div>

             <!-- Right Column: Market Share & Insights -->
             <div class="stagger-3" style="display: flex; flex-direction: column; gap: 40px;">
                <!-- Top Merchants -->
                <div class="glass-card">
                   <h2 style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; margin-bottom: 24px;">Market Dominance</h2>
                   <div id="dash-top-merchants" class="chart-container"></div>
                </div>

                <!-- Top Cards -->
                <div class="glass-card">
                   <h2 style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; margin-bottom: 24px;">Card Performance</h2>
                   <div id="dash-top-cards" class="chart-container"></div>
                </div>
             </div>
          </div>

          <!-- Bottom Section: Explanations & Tech Stats -->
          <div style="margin-top: 40px;" class="stagger-4">
            <div class="glass-card" style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(0,0,0,0) 100%);">
              <h2 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 800; margin-bottom: 20px;">Logic & Calculations</h2>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;">
                <div style="font-size: 0.8rem; line-height: 1.6; color: var(--text-secondary);">
                  <strong style="color: #fff; display: block; margin-bottom: 4px;">Uptake Efficiency</strong>
                  Ratio of transactions where the user selected the engine’s top recommendation vs total completed payments.
                </div>
                <div style="font-size: 0.8rem; line-height: 1.6; color: var(--text-secondary);">
                  <strong style="color: #fff; display: block; margin-bottom: 4px;">Waiver Deviation</strong>
                  Frequency of users manually overriding a higher-saving card for a lesser one (indicates brand loyalty).
                </div>
                <div style="font-size: 0.8rem; line-height: 1.6; color: var(--text-secondary);">
                  <strong style="color: #fff; display: block; margin-bottom: 4px;">Funnel Attribution</strong>
                  Cross-session tracking of simulation entries to final payment confirmation (15-min TTL window).
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(screen);

  const refreshBtn = screen.querySelector('#dash-refresh');
  refreshBtn?.addEventListener('click', () => {
    refreshBtn.classList.add('shimmer');
    loadStats(screen).then(() => {
      refreshBtn.classList.remove('shimmer');
    });
  });

  document.getElementById('dash-logout-side')?.addEventListener('click', () => {
    clearToken();
    rootApp.classList.remove('admin-mode');
    navigate('login');
  });

  loadStats(screen);
}

async function loadStats(screen) {
  try {
    const stats = await getAnalyticsStats();
    const content = screen.querySelector('#dash-content');
    const loading = screen.querySelector('#dash-loading');
    const kpiGrid = screen.querySelector('#dash-kpi-grid');
    const funnelContainer = screen.querySelector('#dash-funnel');
    const merchantContainer = screen.querySelector('#dash-top-merchants');
    const cardContainer = screen.querySelector('#dash-top-cards');

    const entryCount = stats.funnel['simulator_started'] || 0;
    const successCount = stats.funnel['payment_success'] || 0;
    const conversionRate = entryCount > 0 ? (successCount / entryCount) * 100 : 0;

    // 1. KPI Grid
    kpiGrid.innerHTML = `
      <div class="glass-card" style="padding: 32px 24px; text-align: left;">
        <div class="kpi-label">Value Unlocked <span class="info-icon" title="Total savings realised across all successful non-simulation transactions">i</span></div>
        <div class="kpi-val" style="color: var(--park-green); font-size: 2.4rem;">₹${(stats.financials.totalSavings || 0).toLocaleString()}</div>
        <div class="kpi-trend trend-up">↑ 12% from last week</div>
      </div>
      <div class="glass-card" style="padding: 32px 24px; text-align: left;">
        <div class="kpi-label">Uptake <span class="info-icon" title="Percentage of users who followed the engine's best recommendation">i</span></div>
        <div class="kpi-val" style="color: var(--poli-purple); font-size: 2.4rem;">${Math.round(stats.recommendations.bestMatchRate)}%</div>
        <div class="kpi-trend trend-up">↑ 4.2% optimized</div>
      </div>
      <div class="glass-card" style="padding: 32px 24px; text-align: left;">
        <div class="kpi-label">System Velocity <span class="info-icon" title="Number of completed transactions in the last 24 hours">i</span></div>
        <div class="kpi-val" style="font-size: 2.4rem;">${stats.state.last24hVolume}</div>
        <div class="kpi-label" style="font-size: 0.55rem; margin-top: 4px; opacity: 0.5;">Transactions / 24h</div>
      </div>
      <div class="glass-card" style="padding: 32px 24px; text-align: left;">
        <div class="kpi-label">Waiver Rate <span class="info-icon" title="Rate at which users ignored the best card for another selection">i</span></div>
        <div class="kpi-val" style="color: #F87171; font-size: 2.4rem;">${Math.round(stats.recommendations.waiverRate || 0)}%</div>
        <div class="kpi-trend trend-down">↓ 1.5% friction</div>
      </div>
      <div class="glass-card" style="padding: 32px 24px; text-align: left;">
        <div class="kpi-label">Engine Latency <span class="info-icon" title="Average time taken for the SmartPay engine to return recommendations">i</span></div>
        <div class="kpi-val" style="font-size: 2.4rem;">${stats.recommendations.avgLatency}ms</div>
        <div style="height: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; margin-top: 14px; overflow: hidden;">
          <div style="width: ${Math.min(100, stats.recommendations.avgLatency / 10)}%; height: 100%; background: ${stats.recommendations.avgLatency < 200 ? 'var(--park-green)' : 'var(--orange-sunshine)'};"></div>
        </div>
      </div>
    `;

    // 2. Funnel
    const stages = [
      { key: 'simulator_started', label: 'Funnel Entries' },
      { key: 'amount_page_viewed', label: 'Amount Intent' },
      { key: 'recommendation_shown', label: 'Engine Serve' },
      { key: 'payment_success', label: 'Payout' }
    ];

    funnelContainer.innerHTML = stages.map((s, i) => {
      const count = stats.funnel[s.key] || 0;
      const fillPercentage = entryCount > 0 ? (count / entryCount) * 100 : 0;
      return `
        <div class="chart-bar-group">
          <div class="chart-bar-label">
            <span>${s.label}</span>
            <span>${count}</span>
          </div>
          <div class="chart-bar-bg">
            <div class="chart-bar-fill" style="width: ${fillPercentage}%; background: ${i === 3 ? 'var(--park-green)' : 'var(--poli-purple)'};"></div>
          </div>
        </div>
      `;
    }).join('');

    // 3. Top Merchants
    const maxMerchantCount = Math.max(...(stats.financials.topMerchants || []).map(m => m.count), 1);
    merchantContainer.innerHTML = stats.financials.topMerchants.length > 0 ? stats.financials.topMerchants.map(m => `
      <div class="chart-bar-group">
        <div class="chart-bar-label">
          <span>${m.merchant_name}</span>
          <span>${m.count} txns</span>
        </div>
        <div class="chart-bar-bg" style="height: 6px;">
          <div class="chart-bar-fill" style="width: ${(m.count / maxMerchantCount) * 100}%; background: rgba(255,255,255,0.3);"></div>
        </div>
      </div>
    `).join('') : '<div style="color: var(--text-tertiary); font-size: 0.8rem;">Insufficient data</div>';

    // 4. Top Cards
    const maxCardCount = Math.max(...(stats.financials.topCards || []).map(c => c.count), 1);
    cardContainer.innerHTML = stats.financials.topCards.length > 0 ? stats.financials.topCards.map(c => `
      <div class="chart-bar-group">
        <div class="chart-bar-label">
          <span>${c.card_id}</span>
          <span>₹${c.savings} saved</span>
        </div>
        <div class="chart-bar-bg" style="height: 6px;">
          <div class="chart-bar-fill" style="width: ${(c.count / maxCardCount) * 100}%; background: var(--manna-gold);"></div>
        </div>
      </div>
    `).join('') : '<div style="color: var(--text-tertiary); font-size: 0.8rem;">Insufficient data</div>';

    loading.style.display = 'none';
    content.style.display = 'block';
  } catch (err) {
    console.error('Dashboard Error:', err);
    screen.querySelector('#dash-loading').innerHTML = `<div style="color: var(--error);">Failed to aggregate system insights.</div>`;
  }
}
