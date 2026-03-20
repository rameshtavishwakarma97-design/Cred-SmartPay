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
    <div style="display: flex; min-height: 100vh; background: #000; width: 100vw; position: relative; margin-left: calc(-50vw + 50%);">
      <!-- Sidebar -->
      <aside style="width: 280px; background: #080808; border-right: 1px solid rgba(255,255,255,0.05); padding: 40px 24px; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh;">
        <div style="font-family: var(--font-display); font-size: 1.6rem; font-weight: 800; margin-bottom: 48px; letter-spacing: -0.04em;">
           smart<span style="color: var(--poli-purple);">pay</span> <span style="font-size: 0.55rem; vertical-align: middle; border: 1px solid var(--poli-purple); padding: 3px 8px; border-radius: 4px; color: var(--poli-purple); font-weight: 900; margin-left: 4px; letter-spacing: 0.1em;">ADMIN</span>
        </div>
        
        <nav style="display: flex; flex-direction: column; gap: 8px;">
          <div class="side-nav-item active">📊 System Overview</div>
          <div class="side-nav-item">📈 Recommendation Logs</div>
          <div class="side-nav-item">💳 Managed Cards</div>
          <div class="side-nav-item">⚡ Engine Settings</div>
        </nav>
        
        <div style="margin-top: auto;">
           <div style="padding: 16px; background: rgba(255,255,255,0.02); border-radius: 12px; margin-bottom: 24px;">
              <div style="font-size: 0.75rem; color: var(--text-tertiary);">Logged in as</div>
              <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-top: 4px;">${user.email}</div>
           </div>
           <button id="dash-logout-side" class="side-nav-item" style="width: 100%; border: none; color: #F87171; background: rgba(239, 68, 68, 0.05);">🚪 Sign Out</button>
        </div>
      </aside>
      
      <!-- Main Content -->
      <main style="flex: 1; padding: 60px 80px; max-width: 1400px;">
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px;">
          <div>
            <h1 style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 800; letter-spacing: -0.02em;">Real-time Insights</h1>
            <p style="color: var(--text-tertiary); font-size: 1rem; margin-top: 8px;">Monitoring funnel conversion and recommendation performance</p>
          </div>
          <div style="display: flex; gap: 16px;">
             <button id="dash-refresh" class="neo-btn neo-btn-secondary" style="height: 48px; padding: 0 32px; border-radius: 8px; font-size: 0.8rem;">↻ Sync Data</button>
          </div>
        </header>

        <div id="dash-loading" style="text-align: center; padding: 100px;">
          <div class="shimmer" style="width: 48px; height: 48px; border-radius: 50%; margin: 0 auto 20px;"></div>
          <div style="font-size: 0.9rem; color: var(--text-tertiary);">Analyzing transaction streams...</div>
        </div>
        
        <div id="dash-content" style="display: none;">
          <!-- KPI Grid -->
          <div id="dash-kpi-grid" class="dash-grid stagger-1"></div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; margin-top: 60px;">
             <!-- Funnel Visualization -->
             <div class="stagger-2">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 24px;">
                   <h2 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800;">Conversion Funnel</h2>
                   <span style="font-size: 0.75rem; color: var(--text-tertiary);">Unique Sessions</span>
                </div>
                <div id="dash-funnel" class="funnel-container" style="background: rgba(255,255,255,0.02); border: none;"></div>
             </div>

             <!-- Engine Logs -->
             <div class="stagger-3">
                <h2 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; margin-bottom: 24px;">System Health</h2>
                <div style="background: var(--bg-card); border-radius: 20px; padding: 32px; border: 1px solid rgba(255,255,255,0.03);">
                   <div style="margin-bottom: 32px;">
                      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 12px;">
                         <span style="color: var(--text-secondary);">API Uptime</span>
                         <span style="color: var(--park-green); font-weight: 700;">99.98%</span>
                      </div>
                      <div style="height: 4px; background: rgba(255,255,255,0.04); border-radius: 2px;">
                         <div style="width: 99%; height: 100%; background: var(--park-green); border-radius: 2px;"></div>
                      </div>
                   </div>
                   <div style="margin-bottom: 32px;">
                      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 12px;">
                         <span style="color: var(--text-secondary);">Cache Hit Rate</span>
                         <span style="color: var(--poli-purple); font-weight: 700;">84.2%</span>
                      </div>
                      <div style="height: 4px; background: rgba(255,255,255,0.04); border-radius: 2px;">
                         <div style="width: 84%; height: 100%; background: var(--poli-purple); border-radius: 2px;"></div>
                      </div>
                   </div>
                   <div id="dash-meta" style="font-size: 0.8rem; color: var(--text-tertiary); padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.03);">
                      <!-- Total txns etc -->
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
    const metaEl = screen.querySelector('#dash-meta');
    
    const stages = [
      { key: 'simulator_started', label: 'Funnel Entries' },
      { key: 'amount_page_viewed', label: 'Amount Entered' },
      { key: 'recommendation_shown', label: 'Engine Serve' },
      { key: 'payment_success', label: 'Successful Payments' }
    ];
    
    const entryCount = stats.funnel['simulator_started'] || 0;
    const successCount = stats.funnel['payment_success'] || 0;
    const conversionRate = entryCount > 0 ? (successCount / entryCount) * 100 : 0;

    kpiGrid.innerHTML = `
      <div class="dash-kpi" style="padding: 40px 12px;">
        <div class="kpi-val">${stats.state.pendingTransactions}</div>
        <div class="kpi-label" style="font-size: 0.55rem;">Active Orders</div>
      </div>
      <div class="dash-kpi" style="padding: 40px 12px;">
        <div class="kpi-val" style="color: var(--park-green);">${Math.round(conversionRate)}%</div>
        <div class="kpi-label" style="font-size: 0.55rem;">Funnel Win</div>
      </div>
      <div class="dash-kpi" style="padding: 40px 12px;">
        <div class="kpi-val">${stats.recommendations.avgLatency}ms</div>
        <div class="kpi-label" style="font-size: 0.55rem;">Engine Speed</div>
      </div>
      <div class="dash-kpi" style="padding: 40px 12px;">
        <div class="kpi-val" style="color: var(--poli-purple);">${Math.round(stats.recommendations.bestMatchRate)}%</div>
        <div class="kpi-label" style="font-size: 0.55rem;">Uptake</div>
      </div>
      <div class="dash-kpi" style="padding: 40px 12px;">
        <div class="kpi-val" style="color: #F87171;">${Math.round(stats.recommendations.waiverRate || 0)}%</div>
        <div class="kpi-label" style="font-size: 0.55rem;">Waiver Rate</div>
      </div>
    `;

    funnelContainer.innerHTML = stages.map((s, i) => {
      const count = stats.funnel[s.key] || 0;
      const prevCount = i > 0 ? (stats.funnel[stages[i-1].key] || 0) : count;
      const dropRate = i > 0 ? (prevCount > 0 ? Math.round(((prevCount - count) / prevCount) * 100) : 0) : 0;
      const fillPercentage = entryCount > 0 ? (count / entryCount) * 100 : 0;

      return `
        <div class="funnel-row">
          <div class="funnel-info">
            <div class="funnel-label">${s.label}</div>
            <div class="funnel-count">${count}</div>
          </div>
          <div class="funnel-bar" style="height: 10px;">
            <div class="funnel-fill" style="width: ${fillPercentage}%"></div>
          </div>
          ${dropRate > 0 ? `
            <div class="funnel-drop" style="position: absolute; top: 18px; right: 0;">
              <span>📉</span> <strong>${dropRate}% churn</strong>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    metaEl.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
         <span>Total Transactions</span>
         <strong>${stats.state.totalTransactions}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
         <span>Engine Impressions</span>
         <strong>${stats.recommendations.total}</strong>
      </div>
    `;

    loading.style.display = 'none';
    content.style.display = 'block';
  } catch (err) {
    console.error('Failed to load dashboard stats', err);
    screen.querySelector('#dash-loading').innerHTML = `
      <div style="color: var(--error); font-size: 0.9rem;">Connection lost: Unable to fetch system telemetry.</div>
    `;
  }
}
