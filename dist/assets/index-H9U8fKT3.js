(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`/api`;function t(){return localStorage.getItem(`smartpay_token`)}function n(e){localStorage.setItem(`smartpay_token`,e)}function r(){localStorage.removeItem(`smartpay_token`),localStorage.removeItem(`smartpay_user`)}function i(){let e=localStorage.getItem(`smartpay_user`);return e?JSON.parse(e):null}function a(e){localStorage.setItem(`smartpay_user`,JSON.stringify(e))}function o(){return!!t()}async function s(n,i={}){let a=t(),o={headers:{"Content-Type":`application/json`,...a?{Authorization:`Bearer ${a}`}:{},...i.headers},...i};i.body&&typeof i.body==`object`&&(o.body=JSON.stringify(i.body));let s=await fetch(`${e}${n}`,o),c,l=s.headers.get(`content-type`);if(l&&l.includes(`application/json`))c=await s.json();else{let e=await s.text();if(!s.ok)throw Error(`Server Error (${s.status}): ${s.status===404?`Endpoint not found. Is the server restarted?`:`Internal Server Error`}`);try{c=JSON.parse(e)}catch{throw Error(`Server returned non-JSON response`)}}if(!s.ok)throw s.status===401&&(r(),window.location.hash=`#login`),Error(c.error||`API error`);return c}async function c(e,t,r){let i=await s(`/auth/signup`,{method:`POST`,body:{email:e,name:t,password:r}});return n(i.token),a(i.user),i}async function l(e,t){let r=await s(`/auth/login`,{method:`POST`,body:{email:e,password:t}});return n(r.token),a(r.user),r}async function u(){let e=await s(`/auth/me`);return a(e.user),e}async function d(e){return console.log(`API: Recording transaction:`,e),s(`/transactions`,{method:`POST`,body:e})}async function f(e=1,t={}){return s(`/transactions?${new URLSearchParams({page:e,...t})}`)}async function p(){return s(`/transactions/stats`)}async function ee(){return s(`/cards`)}async function m(e,t,n,r,i=0){return s(`/recommend`,{method:`POST`,body:{merchant_id:e,merchant_name:t,category:n,amount:r,cred_cashback:i}})}async function h(e){return s(`/transactions/pending`,{method:`POST`,body:e})}async function g(e,t,n={}){return console.log(`API: Updating transaction status:`,{id:e,status:t,...n}),s(`/transactions/${e}/status`,{method:`PUT`,body:{status:t,...n}})}async function _(e,t={}){let n=i(),r=sessionStorage.getItem(`analytics_session_id`)||`anon-`+Date.now();return sessionStorage.getItem(`analytics_session_id`)||sessionStorage.setItem(`analytics_session_id`,r),s(`/analytics/log`,{method:`POST`,body:{session_id:r,user_id:n?n.id:null,event_name:e,metadata:t}}).catch(e=>console.warn(`Analytics log failed`,e))}async function te(e,t){if(e)return s(`/recommend/${e}/select`,{method:`PUT`,body:{selected_card_id:t}}).catch(e=>console.warn(`Selection log failed`,e))}async function ne(){return s(`/analytics/stats`)}async function re(e){return s(`/auth/cards`,{method:`POST`,body:e})}async function ie(e){return s(`/auth/cards/${e}`,{method:`DELETE`})}function v(e,t){let n=i();if(n){t(n.role===`admin`?`dashboard`:`home`);return}let r=`login`,a=document.createElement(`div`);a.className=`screen`,a.id=`login-screen`,a.style.cssText=`display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 24px;`;function o(){a.innerHTML=`
      <!-- Logo -->
      <div style="text-align: center; margin-bottom: 40px;" class="stagger-1">
        <div style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; letter-spacing: -0.02em;">
          smart<span style="color: var(--orange-sunshine);">pay</span>
        </div>
        <div style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 4px;">by CRED</div>
        <div style="margin-top: 16px; font-size: 0.8rem; color: var(--text-secondary); max-width: 280px; line-height: 1.6;">
          Pay smarter with AI-powered card recommendations. Save more on every transaction.
        </div>
      </div>

      <!-- Form -->
      <div class="stagger-2" style="width: 100%; max-width: 340px;">
        <!-- Mode Tabs -->
        <div style="display: flex; background: var(--bg-card); border-radius: var(--radius-xl); padding: 4px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.06);">
          <button class="login-tab ${r===`login`?`active`:``}" id="tab-login" style="flex: 1; padding: 10px; border: none; background: ${r===`login`?`var(--poli-purple)`:`transparent`}; color: var(--text-primary); border-radius: var(--radius-lg); font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: all 0.2s;">
            Login
          </button>
          <button class="login-tab ${r===`signup`?`active`:``}" id="tab-signup" style="flex: 1; padding: 10px; border: none; background: ${r===`signup`?`var(--poli-purple)`:`transparent`}; color: var(--text-primary); border-radius: var(--radius-lg); font-weight: 600; font-size: 0.8rem; cursor: pointer; transition: all 0.2s;">
            Sign Up
          </button>
        </div>

        ${r===`signup`?`
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Full Name</label>
            <input type="text" id="input-name" placeholder="Shreyansh M" style="width: 100%; padding: 14px 16px; background: var(--bg-card); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-lg); color: var(--text-primary); font-size: 0.9rem; outline: none; box-sizing: border-box;" />
          </div>
        `:``}

        <div style="margin-bottom: 16px;">
          <label style="display: block; font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Email</label>
          <input type="email" id="input-email" placeholder="shreyansh@email.com" style="width: 100%; padding: 14px 16px; background: var(--bg-card); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-lg); color: var(--text-primary); font-size: 0.9rem; outline: none; box-sizing: border-box;" />
        </div>

        <div style="margin-bottom: 24px;">
          <label style="display: block; font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.05em;">Password</label>
          <input type="password" id="input-password" placeholder="••••••••" style="width: 100%; padding: 14px 16px; background: var(--bg-card); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-lg); color: var(--text-primary); font-size: 0.9rem; outline: none; box-sizing: border-box;" />
        </div>

        <!-- Error -->
        <div id="login-error" style="display: none; padding: 10px 14px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.15); border-radius: var(--radius-md); margin-bottom: 16px; font-size: 0.75rem; color: var(--error);"></div>

        <!-- Submit -->
        <button class="neo-btn neo-btn-primary neo-btn-full" id="submit-btn">
          ${r===`login`?`→ Login`:`→ Create Account`}
        </button>

        <div style="text-align: center; margin-top: 20px; font-size: 0.72rem; color: var(--text-tertiary);">
          ${r===`login`?`New here? Switch to <strong>Sign Up</strong> tab above`:`Already have an account? Switch to <strong>Login</strong> tab`}
        </div>
      </div>

      <!-- Features -->
      <div class="stagger-3" style="margin-top: 48px; display: flex; gap: 24px; max-width: 340px; width: 100%;">
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 1.4rem;">🧠</div>
          <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 4px;">Smart AI</div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 1.4rem;">💳</div>
          <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 4px;">25+ Cards</div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 1.4rem;">📊</div>
          <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 4px;">Track Savings</div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 1.4rem;">🎁</div>
          <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 4px;">Live Offers</div>
        </div>
      </div>
    `,a.querySelector(`#tab-login`)?.addEventListener(`click`,()=>{r=`login`,o()}),a.querySelector(`#tab-signup`)?.addEventListener(`click`,()=>{r=`signup`,o()}),a.querySelector(`#submit-btn`)?.addEventListener(`click`,s),a.querySelectorAll(`input`).forEach(e=>{e.addEventListener(`keydown`,e=>{e.key===`Enter`&&s()})})}async function s(){let e=a.querySelector(`#input-email`)?.value?.trim(),n=a.querySelector(`#input-password`)?.value,i=a.querySelector(`#input-name`)?.value?.trim(),o=a.querySelector(`#login-error`),s=a.querySelector(`#submit-btn`);if(!e||!n||r===`signup`&&!i){u(o,`Please fill in all fields`);return}s.disabled=!0,s.textContent=`⏳ Please wait...`;try{if(r===`signup`){if((await c(e,i,n)).user.role===`admin`){t(`dashboard`);return}}else if((await l(e,n)).user.role===`admin`){t(`dashboard`);return}let a=sessionStorage.getItem(`pendingTransaction`);if(a)try{let e=JSON.parse(a);sessionStorage.removeItem(`pendingTransaction`);let n=await h({merchant_id:e.merchantId,merchant_name:e.merchantId,category:e.category,amount:parseFloat(e.amount)});t(`transaction`,{...e,transactionId:n.id});return}catch(e){console.error(`Failed to handle pending transaction`,e)}t(`home`)}catch(e){u(o,e.message),s.disabled=!1,s.textContent=r===`login`?`→ Login`:`→ Create Account`}}function u(e,t){e&&(e.textContent=t,e.style.display=`block`,setTimeout(()=>{e.style.display=`none`},4e3))}o(),e.innerHTML=``,e.appendChild(a)}function y(e,t){_(`home_viewed`);let n=document.createElement(`div`);n.className=`screen`,n.id=`home-screen`,n.innerHTML=`
    <!-- Header -->
    <div style="padding: 24px 24px 12px; display: flex; justify-content: space-between; align-items: center; background: var(--bg-primary);">
      <div>
        <div style="display: flex; align-items: baseline; gap: 8px;">
          <span style="font-size: 1.1rem; color: var(--text-primary); font-weight: 700; letter-spacing: -0.02em;">explore</span>
          <span style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 900; letter-spacing: -0.01em; color: var(--text-primary); text-transform: uppercase;">CRED</span>
          <span class="new-badge-nudge">SMART PAY ⚡</span>
        </div>
        <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 4px; letter-spacing: 0.05em;">Best card recommendations inside 🧠</div>
      </div>
      <div id="profile-btn" style="width: 40px; height: 40px; border-radius: 50%; background: #000000; border: 1.5px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 14c-3.314 0-6 2.686-6 6v1h12v-1c0-3.314-2.686-6-6-6z" />
          <circle cx="12" cy="8" r="4" />
          <path d="M7 6.5s1-1.5 5-1.5 5 1.5 5 1.5M7 6.5v1M17 6.5v1" />
        </svg>
      </div>
    </div>

    <!-- PENDING PAYMENTS Section (Dynamic) -->
    <div id="pending-requests-section" style="display: none; padding: 0 24px 20px;">
      <div class="section-group-title" style="margin-bottom: 12px; color: var(--orange-sunshine);">PENDING PAYMENTS</div>
      <div id="pending-requests-container" style="display: flex; flex-direction: column; gap: 12px;"></div>
    </div>

    <!-- CARDS Section (Dynamic) -->
    <div class="section-group stagger-1">
      <div class="section-group-title">YOUR CARDS</div>
      <div id="card-carousel" class="card-carousel" style="padding-left: 0; padding-right: 0; margin-left: -24px; margin-right: -24px;">
        <div style="padding: 0 24px; color: var(--text-tertiary); font-size: 0.8rem;">Loading cards...</div>
      </div>
    </div>

    <!-- POPULAR Section -->
    <div class="section-group stagger-1">
      <div class="section-group-title">POPULAR</div>
      <div class="grid-4">
        <div class="icon-item" id="qa-scan">
          <div class="circular-icon">📷</div>
          <div class="icon-label">SCAN<br>& PAY</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">👤</div>
          <div class="icon-label">PAY<br>CONTACTS</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">🏦</div>
          <div class="icon-label">BANK<br>ACCOUNTS</div>
        </div>
        <div class="icon-item nudge-highlight" id="nav-smartpay">
          <div class="circular-icon" style="background: radial-gradient(circle at center, #2A1A2A 0%, #1A1A1A 100%);">🧠</div>
          <div class="icon-label">SmartPay</div>
        </div>
      </div>
    </div>

    <!-- Banner -->
    <div class="mint-card stagger-2">
      <div class="mint-info">
        <div class="mint-icon">💎</div>
        <div>
          <div class="mint-text-title">CRED mint</div>
          <div class="mint-text-desc">invest and earn up to 9% p.a.</div>
        </div>
      </div>
      <div style="color: var(--text-tertiary);">›</div>
    </div>

    <!-- MONEY MATTERS Section -->
    <div class="section-group stagger-3">
      <div class="section-group-title">MONEY MATTERS</div>
      <div class="grid-4">
        <div class="icon-item">
          <div class="circular-icon">📊</div>
          <div class="icon-label">CREDIT<br>SCORE</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">📈</div>
          <div class="icon-label">INVEST</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">💰</div>
          <div class="icon-label">CASH</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">🧪</div>
          <div class="icon-label">MINT</div>
        </div>
      </div>
    </div>

    <!-- BILLS Section -->
    <div class="section-group stagger-4">
      <div class="section-group-title">BILLS</div>
      <div class="grid-4">
        <div class="icon-item">
          <div class="circular-icon">💡</div>
          <div class="icon-label">ELECTRICITY</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">📱</div>
          <div class="icon-label">MOBILE</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">📡</div>
          <div class="icon-label">DTH</div>
        </div>
        <div class="icon-item">
          <div class="circular-icon">➕</div>
          <div class="icon-label">VIEW ALL</div>
        </div>
      </div>
    </div>

    <!-- RECENT ACTIVITY Section (Dynamic) -->
    <div class="section-group stagger-5" style="margin-top: 24px;">
      <div class="section-group-title">RECENT ACTIVITY</div>
      <div id="recent-activity-container" style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
        <div style="padding: 12px; color: var(--text-tertiary); font-size: 0.8rem;">Loading activity...</div>
      </div>
    </div>
  `,e.innerHTML=``,e.appendChild(n);let i=n.querySelector(`#nav-smartpay`);i&&setTimeout(()=>{i.classList.add(`active`),setTimeout(()=>{i.classList.remove(`active`)},2e3)},500),document.getElementById(`qa-scan`)?.addEventListener(`click`,()=>t(`merchants`)),document.getElementById(`nav-smartpay`)?.addEventListener(`click`,()=>t(`merchants`)),document.getElementById(`profile-btn`)?.addEventListener(`click`,()=>{let e=document.createElement(`div`);e.className=`modal-overlay`,e.style.zIndex=`1000`,e.innerHTML=`
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Logout</h2>
        </div>
        <div class="modal-body">
          <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">Are you sure you want to log out of your CRED Smart Pay account?</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn-secondary" id="logout-cancel">Cancel</button>
          <button class="modal-btn modal-btn-danger" id="logout-confirm">Logout</button>
        </div>
      </div>
    `,document.body.appendChild(e),document.getElementById(`logout-cancel`)?.addEventListener(`click`,()=>{e.classList.remove(`active`),setTimeout(()=>e.remove(),300)}),document.getElementById(`logout-confirm`)?.addEventListener(`click`,()=>{e.classList.remove(`active`),setTimeout(()=>{e.remove(),r(),t(`login`)},300)}),requestAnimationFrame(()=>{e.classList.add(`active`)})}),f(1,{status:`pending`}).then(e=>{let n=e.transactions||[];if(n.length>0){let e=document.getElementById(`pending-requests-container`),r=document.getElementById(`pending-requests-section`);e.innerHTML=n.map(e=>`
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; background: linear-gradient(to right, rgba(234,88,12,0.1), transparent); border-radius: var(--radius-lg); border: 1px solid rgba(234,88,12,0.2);">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(234,88,12,0.15); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">🔔</div>
            <div>
              <div style="font-size: 0.85rem; font-weight: 600;">${e.merchant_name||e.merchant_id}</div>
              <div style="font-size: 0.65rem; color: var(--text-tertiary);">Payment Request</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-display); font-weight: 800; font-size: 1rem; margin-bottom: 6px;">₹${e.amount.toLocaleString(`en-IN`)}</div>
            <button class="neo-btn" id="resume-txn-${e.id}" style="padding: 6px 16px; font-size: 0.7rem; background: var(--orange-sunshine);">Pay Now</button>
          </div>
        </div>
      `).join(``),r.style.display=`block`,n.forEach(e=>{document.getElementById(`resume-txn-${e.id}`)?.addEventListener(`click`,()=>{t(`transaction`,{transactionId:e.id,merchantId:e.merchant_id,amount:e.amount,category:e.category})})})}}).catch(e=>console.error(`Failed to fetch pending requests`,e)),u().then(e=>{let t=e.cards||[],n=document.getElementById(`card-carousel`);if(n){if(t.length===0){n.innerHTML=`<div style="padding: 24px; color: var(--text-tertiary); font-size: 0.8rem;">No cards mapped</div>`;return}n.innerHTML=t.map(t=>`
      <div class="credit-card ${t.gradient||`bg-gradient-to-br from-gray-800 to-gray-900`}" data-card-id="${t.card_id}">
        <div class="card-bank">${t.bank||`Bank`}</div>
        <div class="card-number">•••• •••• •••• ${t.last4}</div>
        <div class="card-bottom">
          <div>
            <div class="card-name">${e.user.name||`User`}</div>
          </div>
          <div class="card-network">${t.network||`Visa`}</div>
        </div>
      </div>
    `).join(``)}}).catch(e=>console.error(`Failed to load profile cards`,e)),f(1).then(e=>{let t=(e.transactions||[]).filter(e=>e.status===`completed`).slice(0,3),n=document.getElementById(`recent-activity-container`);if(n){if(t.length===0){n.innerHTML=`
        <div style="text-align: center; padding: 24px 16px; color: var(--text-tertiary); font-size: 0.8rem;">
          No recent transactions
        </div>
      `;return}n.innerHTML=t.map(e=>{let t={dining:`🍕`,online_shopping:`🛒`,grocery:`🥦`,fuel:`⛽`,travel:`✈️`,movies:`🎬`,utility:`💡`,insurance:`🛡️`,education:`📚`,general:`💫`}[e.category]||`💳`,n=`Just now`;return e.created_at&&(n=new Date(e.created_at).toLocaleDateString(`en-IN`,{month:`short`,day:`numeric`})),`
        <div style="display: flex; align-items: center; gap: 14px; padding: 14px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.04);">
          <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: var(--bg-elevated); display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">${t}</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.85rem;">${e.merchant_name||e.merchant_id}</div>
            <div style="font-size: 0.7rem; color: var(--text-tertiary);">${n}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.9rem;">₹${(e.amount||0).toLocaleString(`en-IN`)}</div>
            ${e.savings>0?`<div style="font-size: 0.6rem; color: var(--park-green); font-weight: 500;">₹${e.savings.toLocaleString(`en-IN`)} saved</div>`:``}
          </div>
        </div>
      `}).join(``)}}).catch(e=>console.error(`Failed to load recent txns`,e))}var b=[{id:`zomato`,name:`Zomato`,category:`dining`,categoryLabel:`Dining & Food`,emoji:`🍕`,bgColor:`#E23744`,upiId:`zomato@hdfcbank`,credOffer:`Up to 20% CRED cashback`,credCashback:5,popular:!0},{id:`swiggy`,name:`Swiggy`,category:`dining`,categoryLabel:`Dining & Food`,emoji:`🍔`,bgColor:`#FC8019`,upiId:`swiggy@icici`,credOffer:`Flat ₹75 off on ₹500+`,credCashback:3,popular:!0},{id:`amazon`,name:`Amazon`,category:`online_shopping`,categoryLabel:`Online Shopping`,emoji:`📦`,bgColor:`#FF9900`,upiId:`amazon@apl`,credOffer:`10% CRED cashback up to ₹200`,credCashback:4,popular:!0},{id:`flipkart`,name:`Flipkart`,category:`online_shopping`,categoryLabel:`Online Shopping`,emoji:`🛒`,bgColor:`#2874F0`,upiId:`flipkart@axisbank`,credOffer:`CRED coins worth ₹150`,credCashback:3,popular:!0},{id:`bigbasket`,name:`BigBasket`,category:`grocery`,categoryLabel:`Grocery`,emoji:`🥬`,bgColor:`#84C225`,upiId:`bigbasket@ybl`,credOffer:`₹100 off on ₹1000+`,credCashback:2,popular:!0},{id:`blinkit`,name:`Blinkit`,category:`grocery`,categoryLabel:`Grocery`,emoji:`⚡`,bgColor:`#F8CE46`,upiId:`blinkit@paytm`,credOffer:`Flat ₹50 CRED cashback`,credCashback:2,popular:!0},{id:`hp-petrol`,name:`HP Petroleum`,category:`fuel`,categoryLabel:`Fuel`,emoji:`⛽`,bgColor:`#00843D`,upiId:`hppetrol@sbi`,credOffer:null,credCashback:0,popular:!1},{id:`ioc-petrol`,name:`Indian Oil`,category:`fuel`,categoryLabel:`Fuel`,emoji:`🛢️`,bgColor:`#0066B3`,upiId:`iocl@icici`,credOffer:`1% fuel surcharge waiver`,credCashback:1,popular:!1},{id:`makemytrip`,name:`MakeMyTrip`,category:`travel`,categoryLabel:`Travel`,emoji:`✈️`,bgColor:`#EB2226`,upiId:`makemytrip@hdfcbank`,credOffer:`Up to ₹500 CRED cashback`,credCashback:3,popular:!0},{id:`uber`,name:`Uber`,category:`travel`,categoryLabel:`Travel & Transport`,emoji:`🚗`,bgColor:`#000000`,upiId:`uber@icici`,credOffer:`15% off up to ₹100`,credCashback:2,popular:!1},{id:`croma`,name:`Croma`,category:`online_shopping`,categoryLabel:`Electronics`,emoji:`💻`,bgColor:`#00A651`,upiId:`croma@hdfcbank`,credOffer:`CRED coins worth ₹300`,credCashback:2,popular:!1},{id:`dmart`,name:`DMart`,category:`grocery`,categoryLabel:`Grocery & Essentials`,emoji:`🏪`,bgColor:`#006838`,upiId:`dmart@ybl`,credOffer:null,credCashback:0,popular:!1}],ae=[{id:`all`,label:`All`,emoji:`✨`},{id:`dining`,label:`Dining`,emoji:`🍽️`},{id:`online_shopping`,label:`Shopping`,emoji:`🛍️`},{id:`grocery`,label:`Grocery`,emoji:`🥦`},{id:`fuel`,label:`Fuel`,emoji:`⛽`},{id:`travel`,label:`Travel`,emoji:`✈️`}];function x(e,t){let n=document.createElement(`div`);n.className=`screen`,n.id=`merchants-screen`,n.innerHTML=`
    <div class="screen-header">
      <button class="back-btn" id="merchants-back">←</button>
      <span class="header-title">SmartPay</span>
      <div class="header-action"></div>
    </div>

    <!-- Search -->
    <div class="search-bar stagger-1">
      <span class="search-icon">🔍</span>
      <input type="text" id="merchant-search" placeholder="Search merchants..." autocomplete="off" />
    </div>

    <!-- Category Pills -->
    <div class="pill-row stagger-2" id="category-pills">
      ${ae.map((e,t)=>`
        <button class="pill ${t===0?`active`:``}" data-category="${e.id}">
          ${e.emoji} ${e.label}
        </button>
      `).join(``)}
    </div>

    <!-- Featured Merchants -->
    <div class="section-header stagger-3">
      <span class="section-title">Popular Merchants</span>
    </div>

    <div class="screen-padding stagger-3" id="merchant-grid" style="display: flex; flex-direction: column; gap: 10px; padding-bottom: 32px;">
      ${C(b)}
    </div>
  `,e.innerHTML=``,e.appendChild(n),document.getElementById(`merchants-back`)?.addEventListener(`click`,()=>t(`home`));let r=`all`;document.getElementById(`category-pills`)?.addEventListener(`click`,e=>{let t=e.target.closest(`.pill`);t&&(document.querySelectorAll(`.pill`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),r=t.dataset.category,S(r,document.getElementById(`merchant-search`)?.value||``))}),document.getElementById(`merchant-search`)?.addEventListener(`input`,e=>{S(r,e.target.value)}),document.getElementById(`merchant-grid`)?.addEventListener(`click`,e=>{let n=e.target.closest(`.merchant-tile`);n&&(n.style.transform=`scale(0.97)`,setTimeout(()=>{let e=n.dataset.merchantId;t(`transaction`,{merchantId:e})},150))})}function S(e,t){let n=b;if(e!==`all`&&(n=n.filter(t=>t.category===e)),t.trim()){let e=t.toLowerCase();n=n.filter(t=>t.name.toLowerCase().includes(e)||t.categoryLabel.toLowerCase().includes(e))}let r=document.getElementById(`merchant-grid`);r&&(r.innerHTML=n.length?C(n):`<div style="text-align: center; padding: 48px 20px; color: var(--text-tertiary); font-size: 0.85rem;">No merchants found</div>`)}function C(e){return e.map(e=>`
    <div class="merchant-tile" data-merchant-id="${e.id}">
      <div class="merchant-logo" style="background: ${e.bgColor}22;">
        <span>${e.emoji}</span>
      </div>
      <div class="merchant-info">
        <div class="merchant-name">${e.name}</div>
        <div class="merchant-category">${e.categoryLabel}</div>
        ${e.credOffer?`<div class="merchant-offer" style="margin-top: 4px; display: inline-block;">${e.credOffer}</div>`:``}
      </div>
      <div class="merchant-arrow">›</div>
    </div>
  `).join(``)}function oe({title:e=`Confirmation`,desc:t=`Are you sure?`,icon:n=`⚠️`,confirmText:r=`OK`,cancelText:i=`Cancel`,neutralText:a=null,danger:o=!1}){return new Promise(s=>{let c=document.createElement(`div`);c.className=`modal-overlay`,c.innerHTML=`
      <div class="modal">
        <button class="modal-close" id="modal-close">×</button>
        <div class="modal-content">
          <span class="modal-icon">${n}</span>
          <h3 class="modal-title">${e}</h3>
          <p class="modal-desc">${t}</p>
        </div>
        <div class="modal-actions" style="flex-direction: column; gap: 8px;">
          ${r?`
            <button class="modal-btn ${o?`modal-btn-danger`:`modal-btn-primary`}" id="modal-confirm" style="width: 100%;">
              ${r}
            </button>
          `:``}
          ${a?`
            <button class="modal-btn modal-btn-secondary" id="modal-neutral" style="width: 100%;">
              ${a}
            </button>
          `:``}
          ${i?`
            <button class="modal-btn modal-btn-secondary" id="modal-cancel" style="width: 100%;">
              ${i}
            </button>
          `:``}
        </div>
      </div>
    `,document.body.appendChild(c),requestAnimationFrame(()=>{c.classList.add(`active`)});let l=e=>{c.classList.remove(`active`),setTimeout(()=>{document.body.removeChild(c),s(e)},300)};c.querySelector(`#modal-close`).addEventListener(`click`,()=>l(`cancel`)),r&&c.querySelector(`#modal-confirm`).addEventListener(`click`,()=>l(`confirm`)),i&&c.querySelector(`#modal-cancel`).addEventListener(`click`,()=>l(`cancel`)),a&&c.querySelector(`#modal-neutral`).addEventListener(`click`,()=>l(`neutral`)),c.addEventListener(`click`,e=>{e.target===c&&l(`cancel`)})})}function se(e,t,n){_(`amount_page_viewed`,{merchantId:n.merchantId,amount:n.amount});let r=b.find(e=>e.id===n.merchantId);if(!r){t(`merchants`);return}let i=n.amount?n.amount.toString():``,a=`smartpay`;n.forceUpi&&(a=`upi`),n.forceSmartPay&&(a=`smartpay`);let o=document.createElement(`div`);o.className=`screen`,o.id=`transaction-screen`,o.innerHTML=`
    <div class="screen-header">
      <button class="back-btn" id="txn-back">←</button>
      <span class="header-title">Enter Amount</span>
      <div class="header-action"></div>
    </div>

    <!-- Merchant Header -->
    <div class="merchant-header stagger-1">
      <div class="mh-logo" style="background: ${r.bgColor}22;">
        <span>${r.emoji}</span>
      </div>
      <div>
        <div class="mh-name">${r.name}</div>
        <div class="mh-category">${r.categoryLabel}</div>
      </div>
    </div>

    ${r.credOffer?`
      <div class="stagger-2" style="margin: 12px 24px 0; display: flex; align-items: center; gap: 8px; padding: 10px 14px; background: rgba(16,185,129,0.08); border-radius: var(--radius-lg); border: 1px solid rgba(16,185,129,0.12);">
        <span style="font-size: 0.9rem;">🎉</span>
        <span style="font-size: 0.72rem; color: var(--park-green); font-weight: 500;">${r.credOffer}</span>
      </div>
    `:``}

    <!-- Amount Display -->
    <div class="amount-display stagger-2">
      <span class="currency">₹</span>
      <span class="amount-value ${i?``:`empty`}" id="amount-display">${i?w(i):`0`}</span>
    </div>

    <!-- Smart Pay hint -->
    <div class="stagger-3" style="text-align: center; margin-bottom: 20px;">
      <div style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; background: var(--bg-card); border-radius: var(--radius-full); border: 1px solid rgba(255,255,255,0.06);">
        <span style="font-size: 0.8rem;">🧠</span>
        <span style="font-size: 0.7rem; color: var(--text-secondary);">Smart Pay will find your best card</span>
      </div>
    </div>

    <!-- Numpad -->
    ${n.transactionId?`
      <div class="stagger-4" style="text-align: center; margin: 20px 0; color: var(--text-tertiary); font-size: 0.8rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Amount locked by merchant
      </div>
    `:`
      <div class="numpad stagger-4" id="numpad">
        ${[1,2,3,4,5,6,7,8,9,`.`,0,`⌫`].map(e=>`
          <button class="numpad-key ${e===`⌫`?`numpad-delete`:``}" data-key="${e}">${e}</button>
        `).join(``)}
      </div>
    `}

    <!-- Payment Method Selector -->
    <div class="stagger-3" style="margin: 0 24px 20px;">
      <div class="payment-selector">
        <button class="selector-item ${a===`smartpay`?`active`:``} ${n.forceUpi?`disabled`:``}" id="sel-smartpay" ${n.forceUpi?`disabled`:``}>
          <span class="sel-icon">🧠</span>
          <span class="sel-text">Smart Pay</span>
        </button>
        <button class="selector-item ${a===`upi`?`active`:``} ${n.forceSmartPay?`disabled`:``}" id="sel-upi" ${n.forceSmartPay?`disabled`:``}>
          <span class="sel-icon">📱</span>
          <span class="sel-text">UPI</span>
        </button>
      </div>
    </div>

    <!-- Smart Pay Button -->
    <div style="padding: 0 24px 32px; margin-top: 12px;">
      <button class="neo-btn neo-btn-accent neo-btn-full" id="smart-pay-btn" ${i?``:`disabled`}>
        🧠 Smart Pay — Find Best Card
      </button>
    </div>
  `,e.innerHTML=``,e.appendChild(o);let s=document.getElementById(`amount-display`),c=document.getElementById(`smart-pay-btn`);document.getElementById(`numpad`)?.addEventListener(`click`,e=>{let t=e.target.closest(`.numpad-key`);if(!t)return;let n=t.dataset.key;n===`⌫`?i=i.slice(0,-1):n===`.`?!i.includes(`.`)&&i.length>0&&(i+=`.`):i.length<8&&(i===`0`&&n!==`.`&&(i=``),i+=n),i&&parseFloat(i)>0?(s.textContent=w(i),s.classList.remove(`empty`),c.disabled=!1):(s.textContent=`0`,s.classList.add(`empty`),c.disabled=!0),t.style.background=`var(--bg-elevated)`,setTimeout(()=>{t.style.background=`transparent`},100)});let l=document.getElementById(`sel-smartpay`),u=document.getElementById(`sel-upi`);function d(e){n.forceUpi&&e===`smartpay`||n.forceSmartPay&&e===`upi`||(a=e,e===`smartpay`?(l.classList.add(`active`),u.classList.remove(`active`),c.textContent=`🧠 Smart Pay — Find Best Card`,c.className=`neo-btn neo-btn-accent neo-btn-full`):(u.classList.add(`active`),l.classList.remove(`active`),c.textContent=`Pay via UPI`,c.className=`neo-btn neo-btn-primary neo-btn-full`))}d(a),l?.addEventListener(`click`,()=>d(`smartpay`)),u?.addEventListener(`click`,()=>d(`upi`)),c?.addEventListener(`click`,async()=>{if(!i||parseFloat(i)<=0)return;c.innerHTML=`<span>⏳</span> Processing...`;let e=0;try{let t=await m(r.id,r.name,r.category,parseFloat(i));t&&t.bestUserCard&&(e=t.bestUserCard.totalSavings||0),console.log(`DEBUG: Potential savings found:`,e)}catch(e){console.warn(`Failed to pre-fetch potential savings:`,e.message)}t(a===`smartpay`?`recommendation`:`upi_pin`,{transactionId:n.transactionId,merchantId:r.id,amount:parseFloat(i),potentialSavings:e})}),document.getElementById(`txn-back`)?.addEventListener(`click`,async()=>{if(n.transactionId){let e=await oe({title:`Cancel Payment?`,desc:`Are you sure you want to cancel the payment to ${r.name}? You can dismiss it entirely or pay later from your home screen.`,icon:`⚠️`,confirmText:`Yes, Cancel`,neutralText:`Pay Later`,cancelText:null,danger:!0});if(e===`cancel`)return;if(e===`confirm`)try{await g(n.transactionId,`cancelled`)}catch(e){console.error(`Failed to cancel txn:`,e)}}t(`home`)})}function w(e){let t=parseFloat(e);if(isNaN(t))return`0`;if(e.includes(`.`)){let t=e.split(`.`);return parseInt(t[0]).toLocaleString(`en-IN`)+`.`+(t[1]||``)}return parseInt(e).toLocaleString(`en-IN`)}var ce=[{id:`hdfc-millennia`,name:`Millennia`,bank:`HDFC Bank`,network:`VISA`,last4:`4821`,holder:`SHREYANSH M`,gradient:`card-gradient-1`,color:`#0f3460`,tier:`standard`,annualFee:1e3,feeWaiverSpend:1e5,forexMarkup:3.5,rewards:{online_shopping:{type:`cashback`,rate:5,label:`5% CashPoints on Amazon, Flipkart, BookMyShow, Cult.fit, Myntra, Sony LIV, Swiggy, Tata CLiQ, Uber, Zomato`,cap:1e3,capUnit:`per_cycle`,minTxn:100,cashPointValue:1,merchants:[`amazon`,`flipkart`,`bookmyshow`,`cultfit`,`myntra`,`sonyliv`,`swiggy`,`tatacliq`,`uber`,`zomato`],note:`Cashback as CashPoints (1 CP = ₹1). Separate cap from 1% category.`},dining:{type:`cashback`,rate:5,label:`5% CashPoints on Swiggy & Zomato (counted under partner cap)`,cap:1e3,capUnit:`per_cycle`,minTxn:100,note:`Swiggy/Zomato counted under the ₹1,000 partner cap`},movies:{type:`cashback`,rate:5,label:`5% CashPoints on BookMyShow`,cap:1e3,minTxn:100},grocery:{type:`cashback`,rate:1,label:`1% CashPoints on grocery & all other eligible spends`,cap:1e3,capUnit:`per_cycle`,minTxn:100},fuel:{type:`surcharge_waiver`,rate:1,label:`1% fuel surcharge waiver (txn ₹400–₹5,000)`,cap:250,minTxn:400,maxTxn:5e3,note:`No CashPoints on fuel spend`},travel:{type:`cashback`,rate:1,label:`1% CashPoints on offline travel`,cap:1e3,minTxn:100},utility:{type:`cashback`,rate:1,label:`1% CashPoints on utility bills`,cap:1e3,minTxn:100,note:`Rent, wallet loads, govt payments excluded`},insurance:{type:`cashback`,rate:1,label:`1% CashPoints on insurance`,cap:1e3,minTxn:100},default:{type:`cashback`,rate:1,label:`1% CashPoints on all other eligible spends`,cap:1e3,minTxn:100}},quarterlyBenefit:{spend:1e5,reward:`₹1,000 gift voucher OR 1 domestic lounge access (per calendar quarter)`},excluded:[`rent`,`wallet_load`,`govt_payments`,`gift_card_load`,`voucher_purchase`,`forex_transactions`],bestFor:[`online_shopping`,`dining`,`movies`]},{id:`sbi-cashback`,name:`Cashback`,bank:`SBI Card`,network:`VISA`,last4:`7392`,holder:`SHREYANSH M`,gradient:`card-gradient-2`,color:`#11998e`,tier:`standard`,annualFee:999,feeWaiverSpend:2e5,forexMarkup:3.5,rewards:{online_shopping:{type:`cashback`,rate:5,label:`5% cashback on ALL online spends (any merchant, no restriction)`,cap:5e3,capUnit:`per_cycle`,minTxn:100,note:`Best card for universal online cashback. Auto-credited in 2 business days post statement.`},default:{type:`cashback`,rate:1,label:`1% cashback on all offline spends`,cap:5e3,capUnit:`per_cycle`,minTxn:100},fuel:{type:`surcharge_waiver`,rate:1,label:`1% fuel surcharge waiver`,cap:100,minTxn:500}},excluded:[`fuel`,`utility`,`insurance`,`rent`,`wallet_load`,`education`,`jewellery`,`railway`,`emi`,`quasi_cash`,`gaming`,`toll`,`govt_payments`],bestFor:[`online_shopping`]},{id:`amazon-icici`,name:`Amazon Pay`,bank:`ICICI Bank`,network:`VISA`,last4:`5150`,holder:`SHREYANSH M`,gradient:`card-gradient-3`,color:`#333333`,tier:`standard`,annualFee:0,forexMarkup:1.99,rewards:{amazon_prime:{type:`cashback`,rate:5,label:`5% back on Amazon.in for Prime members (credited as Amazon Pay balance)`,cap:null,minTxn:1,isPrime:!0,note:`Applicable on eligible Amazon.in purchases. Excludes EMI, gold, rent, fuel.`},amazon_non_prime:{type:`cashback`,rate:3,label:`3% back on Amazon.in for non-Prime members`,cap:null,minTxn:1,isPrime:!1},amazon_pay_partners:{type:`cashback`,rate:2,label:`2% cashback at 100+ Amazon Pay partner merchants (e.g. Prakash Petrolium, BigBazaar, Paytm)`,cap:null,minTxn:1,note:`Must pay via Amazon Pay interface`},utility:{type:`cashback`,rate:2,label:`2% on recharge & bill payments via Amazon Pay`,cap:null,minTxn:1},fuel:{type:`surcharge_waiver`,rate:1,label:`1% fuel surcharge waiver (txn up to ₹4,000)`,cap:250,minTxn:100,maxTxn:4e3},default:{type:`cashback`,rate:1,label:`1% cashback on all other offline/online spends`,cap:null,minTxn:1}},loungeAccess:{domestic:8,loungeCondition:`Min ₹75,000 spend in previous quarter`},excluded:[`gold_purchase`,`rent`,`fuel_amazon`,`emi`,`education`,`tax`,`international_amazon`],bestFor:[`online_shopping`,`grocery`]},{id:`hdfc-diners-privilege`,name:`Diners Club Privilege`,bank:`HDFC Bank`,network:`Diners`,last4:`0088`,holder:`SHREYANSH M`,gradient:`card-gradient-4`,color:`#2d0a4e`,tier:`premium`,annualFee:2500,feeWaiverSpend:3e5,loungeDomestic:12,loungeInternational:6,forexMarkup:2,rewards:{smartbuy:{type:`points`,rate:10,label:`10X Reward Points (40 RP/₹150) via HDFC SmartBuy — flights, hotels, vouchers`,cap:null,minTxn:150,pointValue:.5,note:`10X capped at a monthly limit; base 1X continues after cap`},swiggy_zomato:{type:`points`,rate:5,label:`5X Reward Points (20 RP/₹150) on Swiggy & Zomato`,cap:2500,capUnit:`per_month_per_merchant`,minTxn:150,pointValue:.5,note:`Base 1X continues beyond cap. Cap is on accelerated (4X) component.`},dining:{type:`points`,rate:2,label:`2X Reward Points on weekend dining at standalone restaurants`,cap:500,capUnit:`per_day`,minTxn:150,pointValue:.5,note:`Only Sat & Sun`},movies:{type:`discount`,rate:50,label:`Buy 1 Get 1 Free on BookMyShow (Fri/Sat/Sun, max ₹250 off per ticket, 2 free tickets/month)`,cap:500,minTxn:0,note:`Not a points benefit — direct discount via BMS offer`},dineout:{type:`discount`,rate:20,label:`Up to 20% off at 20,000+ Swiggy Dineout restaurants`,cap:null,minTxn:0},travel:{type:`points`,rate:4,label:`4 Reward Points / ₹150 on travel bookings (non-SmartBuy)`,cap:null,minTxn:150,pointValue:.5},default:{type:`points`,rate:4,label:`4 Reward Points / ₹150 on all retail spends (≈1.33% value)`,cap:null,minTxn:150,pointValue:.5},insurance:{type:`points`,rate:0,label:`Excluded from reward points`,cap:0,minTxn:0}},excluded:[`fuel`,`wallet_load`,`rent`,`emi`,`insurance`],bestFor:[`dining`,`travel`,`movies`,`online_shopping`]},{id:`axis-ace`,name:`ACE`,bank:`Axis Bank`,network:`VISA`,last4:`6234`,holder:`SHREYANSH M`,gradient:`card-gradient-5`,color:`#4a0000`,tier:`standard`,annualFee:499,feeWaiverSpend:2e5,rewards:{utility:{type:`cashback`,rate:5,label:`5% cashback on electricity, gas, internet, DTH & mobile recharge via Google Pay ONLY`,cap:500,capUnit:`combined_per_month`,minTxn:1,note:`ONLY when billed via Google Pay. Utility outside GPay earns 1.5%.`},dining:{type:`cashback`,rate:4,label:`4% cashback on Swiggy, Zomato & Ola`,cap:500,capUnit:`combined_per_month`,minTxn:1,merchants:[`swiggy`,`zomato`,`ola`],note:`Only these 3 merchants. Other dining is 1.5%.`},restaurant_discount:{type:`discount`,rate:15,label:`Up to 15% off at 4,000+ partner restaurants via Axis Bank Dining Delights`,cap:null,minTxn:0},fuel:{type:`surcharge_waiver`,rate:1,label:`1% fuel surcharge waiver (txn ₹400–₹4,000)`,cap:500,minTxn:400,maxTxn:4e3,note:`No cashback on fuel principal spend`},default:{type:`cashback`,rate:1.5,label:`1.5% cashback on all other eligible spends (revised from 2% effective Apr 2024)`,cap:null,minTxn:1,note:`Rate reduced from 2% to 1.5% on Apr 20, 2024`}},loungeAccess:{domestic:`complimentary`,loungeCondition:`Min ₹50,000 spend in preceding 3 calendar months (from May 2024)`},excluded:[`fuel_principal`,`emi`,`wallet_load`,`rent`,`jewellery`,`gold`,`insurance`,`education`,`govt_services`],bestFor:[`utility`,`dining`]}],le=[{id:`yes-paisasave`,name:`YES Paisabazaar PaisaSave`,bank:`YES Bank`,network:`VISA`,tier:`entry`,annualFee:499,feeWaiverSpend:12e4,bestFor:[`dining`,`travel`],rewards:{dining:{type:`cashback`,rate:6,label:`6% cashback on dining (including Swiggy, Zomato, restaurant POS)`,cap:3e3,capUnit:`per_cycle`,minTxn:500},travel:{type:`cashback`,rate:6,label:`6% cashback on travel (flights, hotels, cabs, IRCTC)`,cap:3e3,capUnit:`per_cycle`,minTxn:500},fuel:{type:`surcharge_waiver`,rate:1,label:`1% fuel surcharge waiver`,cap:250,minTxn:400},default:{type:`cashback`,rate:1,label:`1% cashback on all other spends including UPI`,cap:null,minTxn:100}}},{id:`sbi-cashback-ind`,name:`Cashback SBI Card`,bank:`SBI Card`,network:`VISA`,tier:`standard`,annualFee:999,feeWaiverSpend:2e5,bestFor:[`online_shopping`],rewards:{online_shopping:{type:`cashback`,rate:5,label:`5% automatic cashback on ALL online spends — any merchant, no restriction`,cap:5e3,capUnit:`per_cycle`,minTxn:100,note:`Auto-credited within 2 business days. Cap dropping to ₹2,000 from Apr 1, 2026.`},default:{type:`cashback`,rate:1,label:`1% cashback on offline spends`,cap:5e3,capUnit:`per_cycle`,minTxn:100}},excluded:[`fuel`,`utility`,`insurance`,`rent`,`wallet_load`,`education`,`jewellery`,`railway`,`emi`,`gaming`,`toll`]},{id:`tata-neu-infinity`,name:`Tata Neu Infinity HDFC`,bank:`HDFC Bank`,network:`VISA`,tier:`standard`,annualFee:1499,feeWaiverSpend:3e5,bestFor:[`online_shopping`,`grocery`],rewards:{tata_brands:{type:`cashback`,rate:5,label:`5% NeuCoins on Tata brands — Croma, BigBasket, 1mg, Westside, Titan, Tanishq, AirAsia via Tata Neu`,cap:null,minTxn:1,note:`1 NeuCoin = ₹1 on Tata Neu platform only`,partnerOnly:!0},grocery:{type:`cashback`,rate:5,label:`5% NeuCoins on BigBasket purchases via Tata Neu`,cap:null,minTxn:1},travel:{type:`cashback`,rate:5,label:`5% NeuCoins on Air India Express via Tata Neu`,cap:null,minTxn:1},default:{type:`cashback`,rate:1.5,label:`1.5% NeuCoins on all other eligible spends`,cap:null,minTxn:1}}},{id:`swiggy-hdfc`,name:`Swiggy HDFC Credit Card`,bank:`HDFC Bank`,network:`VISA`,tier:`standard`,annualFee:500,feeWaiverSpend:2e5,bestFor:[`dining`,`grocery`],rewards:{swiggy_food:{type:`cashback`,rate:10,label:`10% cashback on all Swiggy Food & DineOut orders`,cap:1500,capUnit:`per_cycle`,minTxn:1,note:`Cashback credited as Swiggy money within 5 days post statement`},swiggy_instamart:{type:`cashback`,rate:10,label:`10% cashback on Swiggy Instamart grocery orders`,cap:1500,capUnit:`per_cycle`,minTxn:1},online_shopping:{type:`cashback`,rate:5,label:`5% cashback on other select online merchants`,cap:500,capUnit:`per_cycle`,minTxn:1},default:{type:`cashback`,rate:1,label:`1% cashback on all other eligible spends`,cap:null,minTxn:1}}},{id:`hsbc-live-plus`,name:`HSBC Live+ Credit Card`,bank:`HSBC`,network:`VISA`,tier:`standard`,annualFee:0,bestFor:[`dining`,`grocery`],rewards:{dining:{type:`cashback`,rate:10,label:`10% cashback on dining & food delivery (restaurants, Swiggy, Zomato)`,cap:1e3,capUnit:`per_cycle`,minTxn:500},grocery:{type:`cashback`,rate:10,label:`10% cashback on groceries (supermarkets, BigBasket, Blinkit)`,cap:1e3,capUnit:`per_cycle`,minTxn:500},default:{type:`cashback`,rate:1.5,label:`1.5% cashback on all other eligible spends`,cap:null,minTxn:1}}},{id:`flipkart-axis`,name:`Flipkart Axis Bank`,bank:`Axis Bank`,network:`VISA`,tier:`standard`,annualFee:500,feeWaiverSpend:2e5,bestFor:[`online_shopping`,`dining`],rewards:{flipkart_myntra:{type:`cashback`,rate:5,label:`5% unlimited cashback on Flipkart & Myntra (no cap)`,cap:null,minTxn:1,partnerOnly:!0},dining_preferred:{type:`cashback`,rate:4,label:`4% cashback on Swiggy, Uber, PVR & preferred partners`,cap:null,minTxn:1,merchants:[`swiggy`,`uber`,`pvr`]},default:{type:`cashback`,rate:1.5,label:`1.5% cashback on all other spends`,cap:null,minTxn:1}}},{id:`hdfc-regalia-gold`,name:`HDFC Regalia Gold`,bank:`HDFC Bank`,network:`VISA`,tier:`premium`,annualFee:2500,feeWaiverSpend:4e5,loungeDomestic:12,loungeInternational:6,bestFor:[`online_shopping`,`general`,`travel`],rewards:{lifestyle_partners:{type:`points`,rate:5,label:`5X Reward Points (20 RP/₹150) on Nykaa, Myntra, Marks & Spencer, Reliance Digital`,cap:5e3,capUnit:`per_month`,minTxn:150,pointValue:.65,partnerOnly:!0,note:`1 RP = ₹0.65 on Gold Catalogue; ₹0.50 on SmartBuy flights`},smartbuy:{type:`points`,rate:10,label:`10X on SmartBuy hotel bookings; 5X on flights, buses`,cap:null,minTxn:150,pointValue:.5},default:{type:`points`,rate:4,label:`4 Reward Points / ₹150 on all retail spends (≈1.73% value at Gold Catalogue)`,cap:null,minTxn:150,pointValue:.65},dineout:{type:`discount`,rate:20,label:`Up to 20% off at Swiggy Dineout partner restaurants`,cap:null,minTxn:0}},quarterlyMilestone:{spend:15e4,reward:`₹1,500 vouchers from Marriott / Myntra / M&S / Reliance Digital`},annualMilestone:[{spend:5e5,reward:`₹5,000 flight vouchers`},{spend:75e4,reward:`Additional ₹5,000 flight vouchers`}]},{id:`axis-select`,name:`Axis SELECT`,bank:`Axis Bank`,network:`VISA`,tier:`premium`,annualFee:3e3,bestFor:[`online_shopping`,`movies`,`dining`],rewards:{online_shopping:{type:`points`,rate:2,label:`2X EDGE Reward Points on online shopping`,cap:null,minTxn:1,pointValue:.2},movies:{type:`discount`,rate:50,label:`Buy 1 Get 1 Free on BookMyShow (up to ₹300 off per ticket, 2 bookings/month)`,cap:600,note:`Applies to movies on weekends`},premium_dining:{type:`discount`,rate:20,label:`Up to 20% off at select premium restaurants`,cap:null},default:{type:`points`,rate:2,label:`2X EDGE Reward Points on all other retail spends`,cap:null,minTxn:1,pointValue:.2}}},{id:`sbi-prime`,name:`SBI Prime`,bank:`SBI Card`,network:`VISA`,tier:`premium`,annualFee:2999,bestFor:[`dining`,`grocery`,`movies`,`dining`],rewards:{dining:{type:`points`,rate:10,label:`10X Reward Points on dining (restaurants, cafes, food aggregators)`,cap:null,minTxn:100,pointValue:.25},grocery:{type:`points`,rate:10,label:`10X Reward Points on grocery & departmental stores`,cap:null,minTxn:100,pointValue:.25},movies:{type:`points`,rate:10,label:`10X Reward Points on movies (BookMyShow, PVR, INOX)`,cap:null,minTxn:100,pointValue:.25},international:{type:`points`,rate:2,label:`2X Reward Points on international spends`,cap:null,minTxn:100,pointValue:.25},birthday:{type:`points`,rate:20,label:`20X Reward Points on birthday month spends`,cap:null,minTxn:100,pointValue:.25},default:{type:`points`,rate:1,label:`1 Reward Point / ₹100 on all other eligible spends`,cap:null,minTxn:100,pointValue:.25}}},{id:`amex-mrcc`,name:`Amex Membership Rewards`,bank:`Amex`,network:`Amex`,tier:`premium`,annualFee:1500,bestFor:[`general`,`dining`],rewards:{base:{type:`points`,rate:1,label:`1 MR Point per ₹50 spent on eligible transactions`,cap:null,minTxn:50,pointValue:.5,note:`18,000 MR Points milestone every 6 months on reaching ₹1.5 Lakh spend within the period`},amex_partners:{type:`points`,rate:5,label:`5X MR Points at partner merchants — Amazon, Flipkart, Paytm, Myntra, BookMyShow`,cap:null,minTxn:50,note:`Amex Offers — merchant-specific, varies monthly`},dining:{type:`discount`,rate:25,label:`Up to 25% off at 1,500+ EazyDiner partner restaurants via Amex`,cap:null,minTxn:0}}},{id:`hdfc-moneyback-plus`,name:`HDFC MoneyBack+`,bank:`HDFC Bank`,network:`VISA`,tier:`entry`,annualFee:500,feeWaiverSpend:5e4,bestFor:[`online_shopping`],rewards:{online_shopping:{type:`points`,rate:2,label:`2X CashPoints on Amazon, Flipkart, Myntra, Swiggy, Zomato & Uber`,cap:null,minTxn:150,pointValue:.5},emi_department:{type:`points`,rate:2,label:`2X CashPoints on EMI transactions & department stores`,cap:null,minTxn:150,pointValue:.5},default:{type:`points`,rate:1,label:`1 CashPoint / ₹150 on all other eligible spends`,cap:null,minTxn:150,pointValue:.5,note:`1 CashPoint = ₹0.50 for statement credit redemption`}}},{id:`easydiner-indusind`,name:`EazyDiner IndusInd`,bank:`IndusInd Bank`,network:`Mastercard`,tier:`premium`,annualFee:2999,bestFor:[`dining`],rewards:{easydiner:{type:`discount`,rate:25,label:`Up to 25% off at 22,000+ EazyDiner Prime restaurants — complimentary EazyDiner Prime membership`,cap:null,minTxn:0,note:`EazyDiner Prime worth ₹1,499/yr included free`},reward_points:{type:`points`,rate:10,label:`10 Reward Points per ₹100 on dining spends`,cap:null,minTxn:100,pointValue:.5},default:{type:`points`,rate:2,label:`2 Reward Points per ₹100 on all other spends`,cap:null,minTxn:100,pointValue:.5}}},{id:`sbi-simplysave`,name:`SBI SimplySAVE`,bank:`SBI Card`,network:`VISA`,tier:`entry`,annualFee:499,feeWaiverSpend:1e5,bestFor:[`grocery`,`dining`,`movies`],rewards:{grocery:{type:`points`,rate:10,label:`10X Reward Points on grocery & departmental stores (Big Bazaar, DMart, grocery apps)`,cap:null,minTxn:100,pointValue:.25},dining:{type:`points`,rate:10,label:`10X Reward Points on dining spends`,cap:null,minTxn:100,pointValue:.25},movies:{type:`points`,rate:10,label:`10X Reward Points on movies (BookMyShow, PVR)`,cap:null,minTxn:100,pointValue:.25},default:{type:`points`,rate:1,label:`1 Reward Point / ₹100 on all other spends`,cap:null,minTxn:100,pointValue:.25}}},{id:`axis-atlas`,name:`Axis Atlas`,bank:`Axis Bank`,network:`VISA`,tier:`premium`,annualFee:5e3,loungeDomestic:18,loungeInternational:12,forexMarkup:1.5,bestFor:[`travel`],rewards:{travel_partners:{type:`points`,rate:5,label:`5 EDGE Miles per ₹100 on travel bookings (MakeMyTrip, Yatra, IRCTC, BookingCom, airline sites)`,cap:null,minTxn:100,pointValue:1,note:`1 EDGE Mile = ₹1 equivalent when transferred to airline/hotel programs (Vistara, Air Asia, Marriott Bonvoy, Accor)`},default:{type:`points`,rate:2,label:`2 EDGE Miles per ₹100 on all other retail spends`,cap:null,minTxn:100,pointValue:1}},milestones:[{spend:75e4,reward:`5,000 bonus EDGE Miles + Club Vistara Silver Tier`},{spend:15e5,reward:`10,000 bonus EDGE Miles + Club Vistara Gold Tier`}]},{id:`axis-horizon`,name:`Axis Horizon`,bank:`Axis Bank`,network:`VISA`,tier:`premium`,annualFee:3e3,loungeDomestic:8,loungeInternational:4,bestFor:[`travel`],rewards:{travel:{type:`points`,rate:3,label:`3 EDGE Miles per ₹100 on flights, hotels, bus bookings`,cap:null,minTxn:100,pointValue:1},default:{type:`points`,rate:1,label:`1 EDGE Mile per ₹100 on all other spends`,cap:null,minTxn:100,pointValue:1}}},{id:`amex-platinum-travel`,name:`Amex Platinum Travel`,bank:`Amex`,network:`Amex`,tier:`premium`,annualFee:3500,loungeDomestic:4,bestFor:[`travel`],rewards:{travel:{type:`points`,rate:3,label:`3 MR Points per ₹100 on travel — flights, hotels, car rentals`,cap:null,minTxn:100,pointValue:.5},milestone_travel:{type:`voucher`,rate:0,label:`₹7,700 Taj Experiences voucher on spending ₹1.9 Lakh in a year; ₹11,800 + lounge on ₹4 Lakh`,cap:null,minTxn:0,note:`Travel voucher milestone benefits significantly enhance card value`},default:{type:`points`,rate:1,label:`1 MR Point per ₹50 on all other eligible spends`,cap:null,minTxn:50,pointValue:.5}}},{id:`hsbc-travelone`,name:`HSBC TravelOne`,bank:`HSBC`,network:`VISA`,tier:`premium`,annualFee:4999,loungeDomestic:8,loungeInternational:4,forexMarkup:1.75,bestFor:[`travel`],rewards:{travel:{type:`points`,rate:4,label:`4 Reward Points per ₹100 on travel spends — 1:1 transfer to 7+ airline & hotel programmes`,cap:null,minTxn:100,pointValue:1,partners:[`Air India`,`IndiGo`,`Marriott Bonvoy`,`IHG`,`Accor`,`Singapore Airlines`,`British Airways`]},default:{type:`points`,rate:2,label:`2 Reward Points per ₹100 on all other eligible spends`,cap:null,minTxn:100,pointValue:1}}},{id:`mmt-icici`,name:`MakeMyTrip ICICI`,bank:`ICICI Bank`,network:`VISA`,tier:`standard`,annualFee:999,bestFor:[`travel`],rewards:{mmt_flights:{type:`cashback`,rate:8,label:`8% value back as MMT Cash on domestic flights via MakeMyTrip`,cap:null,partnerOnly:!0,note:`MMT Cash redeemable on future bookings on MMT`},mmt_hotels:{type:`cashback`,rate:10,label:`10% value back as MMT Cash on hotel bookings via MakeMyTrip`,cap:null,partnerOnly:!0},mmt_holidays:{type:`cashback`,rate:5,label:`5% value back on holiday packages via MakeMyTrip`,cap:null,partnerOnly:!0},default:{type:`cashback`,rate:1,label:`1% as myRewardz points on all other spends`,cap:null,minTxn:1}}},{id:`hdfc-infinia`,name:`HDFC Infinia Metal`,bank:`HDFC Bank`,network:`VISA`,tier:`super_premium`,annualFee:12500,loungeDomestic:-1,loungeInternational:-1,forexMarkup:2,bestFor:[`general`,`travel`,`online_shopping`],rewards:{smartbuy:{type:`points`,rate:10,label:`10X Reward Points (50 RP/₹150) via HDFC SmartBuy — flights, hotels, instant vouchers`,cap:null,minTxn:150,pointValue:.5,note:`No capping on SmartBuy 10X for Infinia unlike Regalia/Diners`},default:{type:`points`,rate:5,label:`5 Reward Points / ₹150 on all eligible retail spends (≈1.67% effective value)`,cap:null,minTxn:150,pointValue:.5},dining:{type:`discount`,rate:20,label:`Up to 20% off at 10,000+ Swiggy Dineout restaurants; Golf privileges at 400+ courses`,cap:null}}},{id:`hdfc-diners-black`,name:`HDFC Diners Club Black Metal`,bank:`HDFC Bank`,network:`Diners`,tier:`super_premium`,annualFee:1e4,feeWaiverSpend:8e5,loungeDomestic:-1,loungeInternational:-1,forexMarkup:2,bestFor:[`general`,`travel`,`dining`,`online_shopping`],rewards:{smartbuy:{type:`points`,rate:10,label:`10X Reward Points via SmartBuy (flights, hotels, instant vouchers, EGV)`,cap:null,minTxn:150,pointValue:.5},weekend_dining:{type:`points`,rate:2,label:`2X Reward Points on weekend dining (Sat & Sun) at standalone restaurants`,cap:null,minTxn:150,pointValue:.5,note:`Base 5X for Diners Black; 2X multiplier makes it 10X on weekend dining effectively`},default:{type:`points`,rate:5,label:`5 Reward Points / ₹150 on all retail spends (≈1.67% at SmartBuy value)`,cap:null,minTxn:150,pointValue:.5}}},{id:`axis-reserve`,name:`Axis Reserve`,bank:`Axis Bank`,network:`VISA`,tier:`super_premium`,annualFee:5e4,loungeDomestic:-1,loungeInternational:-1,forexMarkup:1.5,bestFor:[`travel`,`general`],rewards:{international_travel:{type:`points`,rate:30,label:`30 EDGE Reward Points per ₹200 on international spends (2X vs domestic)`,cap:null,minTxn:200,pointValue:.2},default:{type:`points`,rate:15,label:`15 EDGE Reward Points per ₹200 on all domestic retail spends`,cap:null,minTxn:200,pointValue:.2},movies:{type:`discount`,rate:50,label:`Buy 1 Get 1 Free on BookMyShow — up to 5 free tickets per month`,cap:null,note:`No monetary cap mentioned; 5 free ticket benefit per calendar month`}}},{id:`iocl-rbl-xtra`,name:`IndianOil RBL XTRA`,bank:`RBL Bank`,network:`Mastercard`,tier:`standard`,annualFee:1500,bestFor:[`fuel`],rewards:{iocl_fuel:{type:`cashback`,rate:8.5,label:`8.5% value back at IndianOil outlets (4% turbopoints + 1% surcharge waiver + 2.5% bank cashback + 1% discount)`,cap:null,minTxn:100,partnerOnly:!0,note:`Breakdown: 4% Turbopoints + 2.5% cashback + 1% surcharge waiver + 1% IndianOil loyalty discount`},default:{type:`points`,rate:1,label:`1 RBL Reward Point / ₹100 on all other retail spends`,cap:null,minTxn:100,pointValue:.25}}},{id:`bpcl-sbi-octane`,name:`BPCL SBI Octane`,bank:`SBI Card`,network:`VISA`,tier:`standard`,annualFee:1499,bestFor:[`fuel`,`dining`,`grocery`],rewards:{bpcl_fuel:{type:`cashback`,rate:7.25,label:`7.25% value back at BPCL petrol stations (6X RP + 1% surcharge waiver)`,cap:null,minTxn:100,partnerOnly:!0,note:`6X Reward Points (valued at 6.25% with 1 RP = ₹0.25) + 1% surcharge waiver`},dining_movies:{type:`points`,rate:5,label:`5X Reward Points on dining & movies`,cap:null,minTxn:100,pointValue:.25},grocery:{type:`points`,rate:5,label:`5X Reward Points on grocery & departmental stores`,cap:null,minTxn:100,pointValue:.25},default:{type:`points`,rate:1,label:`1 Reward Point / ₹100 on all other eligible spends`,cap:null,minTxn:100,pointValue:.25}}},{id:`idfc-power-plus`,name:`IDFC FIRST Power+`,bank:`IDFC FIRST`,network:`VISA`,tier:`entry`,annualFee:499,bestFor:[`fuel`,`grocery`,`utility`],rewards:{hpcl_fuel:{type:`cashback`,rate:5,label:`5% savings on HPCL petrol stations (4% cashback + 1% surcharge waiver)`,cap:null,minTxn:100,partnerOnly:!0},grocery:{type:`cashback`,rate:5,label:`5% cashback on grocery spends (supermarkets, grocery apps)`,cap:null,minTxn:100},utility:{type:`cashback`,rate:5,label:`5% cashback on utility bill payments (electricity, water, gas)`,cap:null,minTxn:100},default:{type:`points`,rate:1,label:`10X Reward Points on birthday month; 3X on weekends; 1X regular`,cap:null,pointValue:1,note:`IDFC FIRST Reward Points are among highest value in industry at ₹1/pt`}}},{id:`icici-hpcl-saver`,name:`ICICI HPCL Super Saver`,bank:`ICICI Bank`,network:`VISA`,tier:`entry`,annualFee:500,bestFor:[`fuel`,`grocery`],rewards:{hpcl_fuel:{type:`cashback`,rate:4,label:`4% Reward Points + 1% surcharge waiver = 5% effective value at HPCL stations`,cap:null,minTxn:100,partnerOnly:!0},grocery:{type:`cashback`,rate:2,label:`2% Reward Points on grocery & departmental store spends`,cap:null,minTxn:100},utility:{type:`cashback`,rate:2,label:`2% Reward Points on utility bill payments`,cap:null,minTxn:100},default:{type:`points`,rate:1,label:`1 ICICI Reward Point per ₹100 on all other eligible spends`,cap:null,minTxn:100,pointValue:.25}}},{id:`iocl-axis`,name:`IndianOil Axis Bank`,bank:`Axis Bank`,network:`VISA`,tier:`entry`,annualFee:500,bestFor:[`fuel`,`online_shopping`],rewards:{iocl_fuel:{type:`cashback`,rate:4,label:`4% value back at IndianOil — credited as Turbopoints`,cap:null,minTxn:100,partnerOnly:!0},online_shopping:{type:`cashback`,rate:4,label:`4% cashback on online shopping (Myntra, Amazon, Flipkart, Nykaa)`,cap:null,minTxn:100,merchants:[`myntra`,`amazon`,`flipkart`,`nykaa`]},fuel_surcharge:{type:`surcharge_waiver`,rate:1,label:`1% fuel surcharge waiver on all petrol stations`,cap:250,minTxn:400},default:{type:`points`,rate:1,label:`1 EDGE Reward Point per ₹100 on other spends`,cap:null,pointValue:.2}}}];function ue(e,t,n){let r=e.rewards[t]||e.rewards.default||e.rewards.default;if(!r)return{fixedSavings:0,estimatedSavings:0,totalSavings:0,label:`No applicable reward`,type:`none`,rate:0};let i=0,a=0,o=r.label,s=r.type,c=r.rate;if(n<(r.minTxn||0))return{fixedSavings:0,estimatedSavings:0,totalSavings:0,label:`Min transaction ₹${r.minTxn} required`,type:`ineligible`,rate:0};let l=0;switch(r.type){case`cashback`:l=n*r.rate/100,r.cap&&l>r.cap&&(l=r.cap),i=l;break;case`points`:let e=r.pointValue||.5;l=Math.floor(n/(r.spendBase||150))*r.rate*e,i=l;break;case`surcharge_waiver`:l=n*r.rate/100,r.cap&&l>r.cap&&(l=r.cap),i=l;break;default:i=0}return r.dineoutDiscount&&t===`dining`&&(a=n*r.dineoutDiscount/100),{fixedSavings:Math.round(i*100)/100,estimatedSavings:Math.round(a*100)/100,totalSavings:Math.round((i+a)*100)/100,label:o,type:s,rate:c,cap:r.cap,dineoutDiscount:r.dineoutDiscount}}function T(e,t,n=0){let r=ce.map(r=>{let i=ue(r,e,t),a=t*n/100,o=Math.round(i.fixedSavings+a),s=i.estimatedSavings,c=o+s;return{card:r,...i,fixedSavings:o,estimatedSavings:s,totalSavings:c,credCashback:Math.round(a),reasoning:E(r,i,e,t)}});r.sort((e,t)=>Math.abs(t.totalSavings-e.totalSavings)<1?t.fixedSavings-e.fixedSavings:t.totalSavings-e.totalSavings);let i=le.filter(t=>t.bestFor.includes(e)).map(r=>{let i=r.rewards[e]||r.rewards.default,a=0,o=0;if(i.type===`cashback`)a=t*i.rate/100,i.cap&&a>i.cap&&(a=i.cap);else if(i.type===`points`){let e=POINT_VALUES[r.bank]||.25;a=Math.floor(t/(i.spendBase||100))*i.rate*e}i.dineoutDiscount&&e===`dining`&&(o=t*i.dineoutDiscount/100);let s=t*n/100,c=Math.round(a+s),l=c+o;return{card:r,fixedSavings:c,estimatedSavings:o,totalSavings:l,label:i.label,reasoning:`${i.label} ${o>0?`+ ${i.dineoutDiscount}% Dineout`:``}`}}).sort((e,t)=>t.totalSavings-e.totalSavings)[0]||null,a=r[0];return{userCards:r,bestUserCard:a,industryBest:i,industryBeatUser:i&&i.totalSavings>a.totalSavings,maxSavings:a.totalSavings,category:e,amount:t}}function E(e,t,n,r){let i=[];return t.type===`cashback`?i.push(`${t.rate}% cashback = ₹${t.savings}`):t.type===`points`?i.push(`${t.rate}X reward points ≈ ₹${t.savings} value`):t.type===`surcharge_waiver`?i.push(`${t.rate}% surcharge waiver = ₹${t.savings}`):t.type===`ineligible`&&i.push(t.label),t.cap&&i.push(`Monthly cap: ₹${t.cap}`),t.dineoutDiscount&&i.push(`+${t.dineoutDiscount}% Dineout discount on eligible restaurants`),i.join(` • `)}function D(e,t,n){_(`recommendation_shown`,{merchantId:n.merchantId,amount:n.amount});let r=b.find(e=>e.id===n.merchantId);if(!r){t(`merchants`);return}let i=n.amount,a=document.createElement(`div`);a.className=`screen`,a.id=`recommendation-screen`,a.innerHTML=`
    <div class="screen-header">
      <button class="back-btn" id="reco-back">←</button>
      <span class="header-title">🧠 Smart Recommendation</span>
      <div class="header-action"></div>
    </div>
    <div style="text-align: center; padding: 80px 24px;">
      <div style="font-size: 2.5rem; margin-bottom: 16px;" class="shimmer">🧠</div>
      <div style="font-family: var(--font-display); font-weight: 700; font-size: 1rem; margin-bottom: 8px;">Finding best value for you</div>
      <div style="font-size: 0.75rem; color: var(--text-tertiary);">Checking offers, caps, and savings</div>
    </div>
  `,e.innerHTML=``,e.appendChild(a),document.getElementById(`reco-back`)?.addEventListener(`click`,()=>{t(`transaction`,{merchantId:r.id,amount:n.amount,transactionId:n.transactionId})}),O(a,t,r,i,n)}async function O(e,t,n,r,i){let a,o=!1;await new Promise(e=>setTimeout(e,1e3));try{a=await m(n.id,n.name,n.category,r,n.credCashback||0),o=!0}catch(e){console.log(`Server unavailable, using local engine:`,e.message);let t=T(n.category,r,n.credCashback||0);a={userCards:t.userCards,bestUserCard:t.bestUserCard,industryBest:t.industryBest,industryBeatUser:t.industryBeatUser,activeOffers:0}}if(!a||!a.bestUserCard||!a.userCards||a.userCards.length===0){e.innerHTML=`
      <div class="screen-header">
        <button class="back-btn" id="reco-back">←</button>
        <span class="header-title">🧠 Smart Recommendation</span>
        <div class="header-action"></div>
      </div>
      <div style="text-align: center; padding: 80px 24px;">
        <div style="font-size: 2.5rem; margin-bottom: 16px;">🃏</div>
        <div style="font-family: var(--font-display); font-weight: 700; font-size: 1rem; margin-bottom: 8px;">No cards available</div>
        <div style="font-size: 0.75rem; color: var(--text-tertiary);">Add cards to your wallet to get recommendations</div>
      </div>
    `,e.querySelector(`#reco-back`)?.addEventListener(`click`,()=>{t(`transaction`,{merchantId:n.id,amount:i.amount,transactionId:i.transactionId})});return}let s=Math.max(...a.userCards.map(e=>e.totalSavings),1);e.innerHTML=`
    <div class="screen-header">
      <button class="back-btn" id="reco-back">←</button>
      <span class="header-title">🧠 Smart Recommendation</span>
      <div class="header-action"></div>
    </div>

    <!-- Transaction Context -->
    <div class="stagger-1" style="margin: 0 24px 16px; padding: 16px 20px; background: var(--bg-card); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: space-between; border: 1px solid rgba(255,255,255,0.04);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: ${n.bgColor}22; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">${n.emoji}</div>
        <div>
          <div style="font-weight: 600; font-size: 0.9rem;">${n.name}</div>
          <div style="font-size: 0.7rem; color: var(--text-secondary);">${n.categoryLabel}</div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 800;">₹${r.toLocaleString(`en-IN`)}</div>
        ${a.activeOffers>0?`<div style="font-size: 0.6rem; color: var(--orange-sunshine); font-weight: 600;">${a.activeOffers} offers active</div>`:``}
      </div>
    </div>

    ${o?`<div style="margin: 0 24px 12px; display: inline-flex; align-items: center; gap: 4px; font-size: 0.6rem; color: var(--poli-purple);">⚡ Powered by Smart Pay Engine</div>`:``}

    <!-- Best Card from Wallet -->
    <div class="section-header stagger-2">
      <span class="section-title">Best from Your Wallet</span>
      <span class="reco-badge badge-best" style="padding: 4px 10px; border-radius: 9999px; font-size: 0.6rem; font-weight: 700;">✦ RECOMMENDED</span>
    </div>

    <div class="screen-padding stagger-2">
      <div class="reco-card best">
        <div class="reco-header">
          <div class="mini-card">
            <div class="mini-card-icon" style="background: ${a.bestUserCard.card.color||`#333`};">${(a.bestUserCard.card.network||`V`).charAt(0)}</div>
            <div class="mini-card-info">
              <div class="mini-card-name">${a.bestUserCard.card.bank||``} ${a.bestUserCard.card.name||``}</div>
              <div class="mini-card-bank">•••• ${a.bestUserCard.card.last4||``}</div>
            </div>
          </div>
        </div>
        <div class="reco-savings">₹${a.bestUserCard.totalSavings} saved</div>
        <div style="display: flex; gap: 16px; margin: 8px 0 12px;">
          <div style="background: rgba(30,215,96,0.06); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid rgba(30,215,96,0.15); flex: 1;">
            <div style="font-size: 0.6rem; color: var(--park-green); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 2px;">Fixed (Guaranteed)</div>
            <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--park-green);">₹${a.bestUserCard.fixedSavings}</div>
          </div>
          ${a.bestUserCard.estimatedSavings>0?`
            <div style="background: rgba(255,107,44,0.06); padding: 8px 12px; border-radius: var(--radius-md); border: 1px solid rgba(255,107,44,0.15); flex: 1;">
              <div style="font-size: 0.6rem; color: var(--orange-sunshine); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 2px;">Estimated (Upto)</div>
              <div style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 800; color: var(--orange-sunshine);">₹${a.bestUserCard.estimatedSavings}</div>
            </div>
          `:``}
        </div>
        <div class="reco-breakdown">
          ${k(a.bestUserCard)}
        </div>
        <div class="savings-bar-container"><div class="savings-bar-bg"><div class="savings-bar-fill" style="width: 0%;" data-target="100"></div></div></div>
      </div>
    </div>

    <!-- All Cards Comparison -->
    <div class="section-header stagger-3">
      <span class="section-title">All Your Cards</span>
    </div>

    <div class="screen-padding stagger-3" style="display: flex; flex-direction: column; gap: 10px;">
      ${a.userCards.slice(1).map((e,t)=>`
        <div class="reco-card" data-card-id="${e.card.id}">
          <div class="reco-header">
            <div class="mini-card">
              <div class="mini-card-icon" style="background: ${e.card.color||`#333`};">${(e.card.network||`V`).charAt(0)}</div>
              <div class="mini-card-info">
                <div class="mini-card-name">${e.card.bank||``} ${e.card.name||``}</div>
                <div class="mini-card-bank">•••• ${e.card.last4||``}</div>
              </div>
            </div>
            <span class="reco-badge badge-rank">#${t+2}</span>
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
            <div>
               <div style="display: flex; align-items: baseline; gap: 8px;">
                <span style="font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; color: var(--text-primary);">₹${e.totalSavings}</span>
                <span style="font-size: 0.7rem; color: var(--text-tertiary);">saved</span>
                ${e.totalSavings<a.bestUserCard.totalSavings?`<span style="font-size: 0.65rem; color: var(--error);">₹${(a.bestUserCard.totalSavings-e.totalSavings).toFixed(0)} less</span>`:``}
              </div>
              <div style="display: flex; gap: 12px; margin-top: 6px;">
                <span style="font-size: 0.65rem; color: var(--park-green); background: rgba(30,215,96,0.08); padding: 2px 6px; border-radius: 4px; font-weight: 600;">Fixed: ₹${e.fixedSavings}</span>
                ${e.estimatedSavings>0?`<span style="font-size: 0.65rem; color: var(--orange-sunshine); background: rgba(255,107,44,0.08); padding: 2px 6px; border-radius: 4px; font-weight: 600;">Est: ₹${e.estimatedSavings}</span>`:``}
              </div>
            </div>
          </div>

          <div class="reco-breakdown" style="font-size: 0.7rem; margin-top: 10px;">${e.label||e.reasoning||``}</div>
          ${A(e)}
          <div class="savings-bar-container" style="margin-top: 12px;"><div class="savings-bar-bg"><div class="savings-bar-fill" style="width: 0%;" data-target="${s>0?Math.round(e.totalSavings/s*100):0}"></div></div></div>
        </div>
      `).join(``)}
    </div>

    <!-- Industry Best -->
    ${a.industryBest?`
      <div class="divider stagger-4"></div>
      <div class="section-header stagger-4">
        <span class="section-title">Best in Industry</span>
        <span class="reco-badge badge-industry" style="padding: 4px 10px; border-radius: 9999px; font-size: 0.6rem; font-weight: 700;">🏆 UPGRADE TIP</span>
      </div>
      <div class="screen-padding stagger-4" style="padding-bottom: 24px;">
        <div class="reco-card industry">
          <div class="reco-header">
            <div>
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.95rem;">${a.industryBest.card.name}</div>
              <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px;">${a.industryBest.card.bank} • ${a.industryBest.card.network}</div>
            </div>
            ${a.industryBeatUser?`<span style="font-size: 0.6rem; font-weight: 700; color: var(--orange-sunshine); background: rgba(255,107,44,0.12); padding: 4px 10px; border-radius: 9999px;">BEATS YOUR BEST</span>`:``}
          </div>
          <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; color: var(--orange-sunshine); margin: 8px 0;">₹${a.industryBest.totalSavings} saved</div>
          <div style="display: flex; gap: 12px; margin-bottom: 12px;">
            <span style="font-size: 0.65rem; color: var(--park-green); background: rgba(30,215,96,0.08); padding: 2px 8px; border-radius: 4px; font-weight: 700;">Fixed: ₹${a.industryBest.fixedSavings}</span>
            ${a.industryBest.estimatedSavings>0?`<span style="font-size: 0.65rem; color: var(--orange-sunshine); background: rgba(255,107,44,0.08); padding: 2px 8px; border-radius: 4px; font-weight: 700;">Est: ₹${a.industryBest.estimatedSavings}</span>`:``}
          </div>
          <div class="reco-breakdown"><div>✨ <span>${a.industryBest.reasoning||a.industryBest.label}</span></div></div>
          ${a.industryBest.card.annualFee?`<div style="margin-top: 8px; font-size: 0.65rem; color: var(--text-tertiary);">Annual fee: ₹${a.industryBest.card.annualFee}</div>`:``}
          ${a.industryBeatUser?`
            <div style="margin-top: 14px; padding: 10px 14px; background: rgba(255,107,44,0.06); border-radius: var(--radius-md); font-size: 0.72rem; color: var(--text-secondary); line-height: 1.6;">
              💡 <span style="color: var(--orange-sunshine); font-weight: 600;">Consider getting this card</span> — save <span style="color: var(--orange-sunshine); font-weight: 700;">₹${(a.industryBest.totalSavings-a.bestUserCard.totalSavings).toFixed(0)} more</span> per transaction.
            </div>
          `:`
            <div style="margin-top: 14px; padding: 10px 14px; background: rgba(255,255,255,0.03); border-radius: var(--radius-md); font-size: 0.72rem; color: var(--text-secondary); line-height: 1.6;">
              ✅ Your <strong>${a.bestUserCard.card.name}</strong> card already gives competitive savings!
            </div>
          `}
        </div>
      </div>
    `:``}

    <!-- Pay Button -->
    <div style="padding: 12px 24px 32px;">
      <button class="neo-btn neo-btn-primary neo-btn-full" id="proceed-pay-btn">
        Pay ₹${r.toLocaleString(`en-IN`)} with ${a.bestUserCard.card.name}
      </button>
    </div>
  `,requestAnimationFrame(()=>{setTimeout(()=>{e.querySelectorAll(`.savings-bar-fill`).forEach(e=>{e.style.width=e.dataset.target+`%`})},300)}),e.querySelector(`#reco-back`)?.addEventListener(`click`,()=>{t(`transaction`,{merchantId:n.id,amount:i.amount,transactionId:i.transactionId})});let c=a.bestUserCard;e.querySelector(`#proceed-pay-btn`)?.addEventListener(`click`,()=>{te(a.impressionId,c.card.id),t(`confirm`,{transactionId:i.transactionId,merchantId:n.id,amount:r,cardId:c.card.id,cardName:c.card.name,cardBank:c.card.bank,cardLast4:c.card.last4,savings:c.totalSavings,potentialSavings:a.bestUserCard.totalSavings})}),e.querySelectorAll(`.reco-card[data-card-id]`).forEach(t=>{t.style.cursor=`pointer`,t.addEventListener(`click`,()=>{let n=t.dataset.cardId,i=a.userCards.find(e=>e.card.id===n);if(i){c=i;let n=e.querySelector(`#proceed-pay-btn`);n&&(n.textContent=`Pay ₹${r.toLocaleString(`en-IN`)} with ${i.card.name}`),e.querySelectorAll(`.reco-card`).forEach(e=>e.style.borderColor=`rgba(255,255,255,0.06)`),t.style.borderColor=`var(--poli-purple)`}})})}function k(e){return e.breakdown&&e.breakdown.length>0?e.breakdown.map(e=>{let t=e.type===`cred_cashback`?`🎁`:e.type===`offer`?`🔥`:e.type===`dineout`?`🍽️`:`💳`,n=e.is_expiring?` <span style="color: var(--error); font-size: 0.55rem; font-weight: 700;">EXPIRING SOON</span>`:``;return`<div>${t} <span>${e.text}: ₹${Math.round(e.value)}</span>${n}</div>`}).join(``):e.reasoning?`<div>💳 <span>${e.reasoning}</span></div>`:``}function A(e){if(!e.breakdown)return``;let t=e.breakdown.find(e=>e.type===`cap_warning`);return t?`<div style="margin-top: 6px; padding: 6px 10px; background: rgba(239,68,68,0.06); border-radius: var(--radius-sm); font-size: 0.65rem; color: var(--warning);">⚠️ ${t.text}</div>`:``}function j(e,t,n){let r=b.find(e=>e.id===n.merchantId);if(!r){t(`home`);return}let i=n.amount,a=n.savings,o=n.cardName||`Card`,s=n.cardBank||``,c=n.cardLast4||`----`,l=document.createElement(`div`);l.className=`screen`,l.id=`confirm-screen`,l.innerHTML=`
    <div class="screen-header">
      <button class="back-btn" id="confirm-back">←</button>
      <span class="header-title">Confirm Payment</span>
      <div class="header-action"></div>
    </div>

    <!-- Merchant + Amount Hero -->
    <div class="stagger-1" style="text-align: center; padding: 32px 24px 24px;">
      <div style="width: 72px; height: 72px; border-radius: var(--radius-xl); background: ${r.bgColor}22; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 16px;">${r.emoji}</div>
      <div style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; margin-bottom: 4px;">Paying ${r.name}</div>
      <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; letter-spacing: -0.02em;">₹${i.toLocaleString(`en-IN`)}</div>
    </div>

    <!-- Transaction Details -->
    <div class="txn-summary stagger-2">
      <div class="txn-row">
        <span class="txn-label">Merchant</span>
        <span class="txn-value">${r.name}</span>
      </div>
      <div class="txn-row">
        <span class="txn-label">Category</span>
        <span class="txn-value">${r.categoryLabel}</span>
      </div>
      <div class="txn-row">
        <span class="txn-label">Amount</span>
        <span class="txn-value">₹${i.toLocaleString(`en-IN`)}</span>
      </div>
      <div class="txn-row">
        <span class="txn-label">Paying with</span>
        <span class="txn-value">${s} ${o}</span>
      </div>
      <div class="txn-row">
        <span class="txn-label">Card</span>
        <span class="txn-value">•••• ${c}</span>
      </div>
      ${a>0?`
        <div class="txn-row">
          <span class="txn-label">Estimated Savings</span>
          <span class="txn-value savings">-₹${a}</span>
        </div>
        <div class="txn-row">
          <span class="txn-label" style="font-weight: 600; color: var(--text-primary);">Effective Amount</span>
          <span class="txn-value" style="font-weight: 700; font-family: var(--font-display); font-size: 1rem;">₹${(i-a).toLocaleString(`en-IN`)}</span>
        </div>
      `:``}
    </div>

    ${a>0?`
      <div class="stagger-3" style="margin: 16px 24px; text-align: center;">
        <div style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.15); border-radius: var(--radius-full);">
          <span>🧠</span>
          <span style="font-size: 0.75rem; font-weight: 600; color: var(--park-green);">Smart Pay saving you ₹${a}</span>
        </div>
      </div>
    `:``}

    <!-- Swipe to Pay -->
    <div class="stagger-4" style="padding: 24px 24px 40px;">
      <div class="swipe-track" id="swipe-track">
        <div class="swipe-fill" id="swipe-fill"></div>
        <div class="swipe-label">Swipe to Pay →</div>
        <div class="swipe-thumb" id="swipe-thumb">→</div>
      </div>
    </div>
  `,e.innerHTML=``,e.appendChild(l),M(t,n,r),document.getElementById(`confirm-back`)?.addEventListener(`click`,()=>{t(`recommendation`,{merchantId:r.id,amount:i,transactionId:n.transactionId})})}function M(e,t,n){let r=document.getElementById(`swipe-track`),i=document.getElementById(`swipe-thumb`),a=document.getElementById(`swipe-fill`);if(!r||!i||!a)return;let o=!1,s=0,c=0;function l(){return r.offsetWidth-52-8}function u(e){o=!0,s=(e.touches?e.touches[0].clientX:e.clientX)-c,i.style.transition=`none`,a.style.transition=`none`}function d(e){if(!o)return;e.preventDefault();let t=(e.touches?e.touches[0].clientX:e.clientX)-s,n=l();c=Math.max(0,Math.min(t,n)),i.style.left=c+4+`px`,a.style.width=c+52+4+`px`}function f(){if(!o)return;o=!1,i.style.transition=`left 300ms ease`,a.style.transition=`width 300ms ease`;let r=l();c>=r*.85?(c=r,i.style.left=r+4+`px`,a.style.width=`100%`,setTimeout(()=>{e(`success`,{...t,merchantName:n.name,category:n.category})},400)):(c=0,i.style.left=`4px`,a.style.width=`0px`)}i.addEventListener(`touchstart`,u,{passive:!0}),document.addEventListener(`touchmove`,d,{passive:!1}),document.addEventListener(`touchend`,f),i.addEventListener(`mousedown`,u),document.addEventListener(`mousemove`,d),document.addEventListener(`mouseup`,f)}function N(e,t,n){_(`payment_success`),sessionStorage.removeItem(`analytics_session_id`);let r=n.amount,i=n.savings,a=n.cardName||`Card`,o=n.cardBank||``,s=n.cardLast4||`----`,c=n.merchantName||n.merchantId||`Merchant`,l=P(),u=Promise.resolve();u=n.transactionId?g(n.transactionId,`completed`,{card_id:n.cardId,savings:i,potential_savings:n.potentialSavings,offer_id:n.offerId}).catch(e=>console.log(`Failed to update txn:`,e.message)):d({card_id:n.cardId,merchant_id:n.merchantId,merchant_name:c,category:n.category||`general`,amount:r,savings:i,potential_savings:n.potentialSavings,offer_id:n.offerId}).catch(e=>console.log(`Failed to record transaction:`,e.message));let f=document.createElement(`div`);f.className=`success-screen`,f.id=`success-screen`,f.innerHTML=`
    <div class="confetti-container" id="confetti-container"></div>

    <div class="success-checkmark stagger-1">✓</div>
    <div class="success-amount stagger-2">₹${r.toLocaleString(`en-IN`)}</div>
    <div class="success-subtitle stagger-2">Paid to ${c}</div>

    ${i>0?`
      <div class="success-savings-badge stagger-3">
        <span class="badge-icon">🧠</span>
        <span class="badge-text">You saved ₹${i} with Smart Pay!</span>
      </div>
    `:``}

    <div class="stagger-4" style="width: 100%; max-width: 360px;">
      <div class="txn-summary" style="margin: 0 0 24px;">
        <div style="text-align: center; margin-bottom: 16px;">
          <div style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--text-tertiary);">Transaction Receipt</div>
        </div>
        <div class="txn-row">
          <span class="txn-label">Merchant</span>
          <span class="txn-value">${c}</span>
        </div>
        <div class="txn-row">
          <span class="txn-label">Card Used</span>
          <span class="txn-value">${o} ${a}</span>
        </div>
        <div class="txn-row">
          <span class="txn-label">Card Number</span>
          <span class="txn-value">•••• ${s}</span>
        </div>
        <div class="txn-row">
          <span class="txn-label">Amount</span>
          <span class="txn-value">₹${r.toLocaleString(`en-IN`)}</span>
        </div>
        ${i>0?`
          <div class="txn-row">
            <span class="txn-label">Savings Earned</span>
            <span class="txn-value savings">₹${i}</span>
          </div>
        `:``}
        <div class="txn-row">
          <span class="txn-label">Transaction ID</span>
          <span class="txn-value" style="font-size: 0.7rem; font-family: monospace; color: var(--text-tertiary);">${l}</span>
        </div>
        <div class="txn-row">
          <span class="txn-label">Date & Time</span>
          <span class="txn-value" style="font-size: 0.75rem;">${new Date().toLocaleString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`,hour:`2-digit`,minute:`2-digit`})}</span>
        </div>
      </div>
    </div>

    <div class="stagger-5" style="width: 100%; max-width: 360px; margin-bottom: 24px;">
      <div style="padding: 16px 20px; background: linear-gradient(135deg, rgba(212,168,83,0.1) 0%, rgba(255,107,44,0.06) 100%); border: 1px solid rgba(212,168,83,0.15); border-radius: var(--radius-xl); display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 1.5rem;">🪙</span>
        <div>
          <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.85rem; color: var(--manna-gold);">+${Math.floor(r/10)} CRED coins earned</div>
          <div style="font-size: 0.7rem; color: var(--text-secondary); margin-top: 2px;">Use coins for exclusive rewards</div>
        </div>
      </div>
    </div>

    <div style="width: 100%; max-width: 360px; display: flex; gap: 12px;">
      <button class="neo-btn neo-btn-secondary" id="view-history-btn" style="flex: 1;">📊 History</button>
      <button class="neo-btn neo-btn-primary" id="done-btn" style="flex: 2;">Done</button>
    </div>
  `,e.innerHTML=``,e.appendChild(f),F(),document.getElementById(`done-btn`)?.addEventListener(`click`,async()=>{await u,t(`home`)}),document.getElementById(`view-history-btn`)?.addEventListener(`click`,async()=>{await u,t(`history`)})}function P(){let e=`TXN`;for(let t=0;t<10;t++)e+=`ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`.charAt(Math.floor(Math.random()*36));return e}function F(){let e=document.getElementById(`confetti-container`);if(!e)return;let t=[`#FF6B2C`,`#8B5CF6`,`#10B981`,`#EC4899`,`#F59E0B`,`#3B82F6`,`#D4A853`,`#84CC16`];for(let n=0;n<50;n++){let n=document.createElement(`div`);n.className=`confetti-piece`,n.style.left=Math.random()*100+`%`,n.style.backgroundColor=t[Math.floor(Math.random()*t.length)],n.style.animationDelay=Math.random()*2+`s`,n.style.animationDuration=2+Math.random()*2+`s`,n.style.setProperty(`--drift`,Math.random()*200-100+`px`),n.style.width=6+Math.random()*8+`px`,n.style.height=6+Math.random()*8+`px`,n.style.borderRadius=Math.random()>.5?`50%`:`2px`,e.appendChild(n)}setTimeout(()=>{e.innerHTML=``},5e3)}function I(e,t){let n=document.createElement(`div`);n.className=`screen`,n.id=`history-screen`,n.innerHTML=`
    <div class="screen-header">
      <button class="back-btn" id="history-back">←</button>
      <span class="header-title">Transaction History</span>
      <div class="header-action"></div>
    </div>
    <div id="history-content" style="padding: 0 0 32px;">
      <div style="text-align: center; padding: 60px 24px; color: var(--text-tertiary);">Loading...</div>
    </div>
  `,e.innerHTML=``,e.appendChild(n),document.getElementById(`history-back`)?.addEventListener(`click`,()=>t(`home`)),L()}async function L(){let e=document.getElementById(`history-content`);if(e)try{let[t,n]=await Promise.all([f(1,{status:`completed,cancelled`}),p()]),r=n.thisMonth,a=n.allTime,o=t.transactions,s=n.categoryBreakdown,c=i(),l=c&&c.role===`admin`;e.innerHTML=`
      <!-- Monthly Stats Hero -->
      <div class="stagger-1" style="padding: 20px 24px 8px;">
        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <div style="flex: 1; padding: 16px; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid rgba(255,255,255,0.04);">
            <div style="font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-tertiary); margin-bottom: 6px;">This Month Spent</div>
            <div style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 800;">₹${R(r.total_spent)}</div>
            <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 4px;">${r.transaction_count} transactions</div>
          </div>
        </div>
        
        <div style="display: flex; gap: 12px;">
          <div style="flex: 1; padding: 16px; background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(132,204,22,0.05)); border-radius: var(--radius-xl); border: 1px solid rgba(16,185,129,0.12);">
            <div style="font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--park-green); margin-bottom: 6px;">Saved</div>
            <div style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; color: var(--park-green);">₹${R(r.total_savings)}</div>
            <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 4px;">via Smart Pay 🧠 ${l?`(Admin)`:``}</div>
          </div>
          ${l?``:`
          <div style="flex: 1; padding: 16px; background: linear-gradient(135deg, rgba(248,113,113,0.1), rgba(239,68,68,0.05)); border-radius: var(--radius-xl); border: 1px solid rgba(239,68,68,0.12);">
            <div style="font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.1em; color: #F87171; margin-bottom: 6px;">Opportunity Lost</div>
            <div style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; color: #F87171;">₹${R(r.opportunity_lost)}</div>
            <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-top: 4px;">missed rewards ❌</div>
          </div>
          `}
        </div>
      </div>

      <!-- All-time stats -->
      <div class="stagger-2" style="padding: 0 24px 16px;">
        <div style="padding: 14px 16px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.04); display: flex; justify-content: space-between; align-items: center;">
          <div style="font-size: 0.75rem; color: var(--text-secondary);">All-time savings</div>
          <div style="font-family: var(--font-display); font-weight: 700; color: var(--park-green); font-size: 0.9rem;">₹${R(a.total_savings)} across ${a.transaction_count} txns</div>
        </div>
      </div>

      ${s.length>0?`
        <!-- Category Breakdown -->
        <div class="section-header stagger-2">
          <span class="section-title">Spending by Category</span>
        </div>
        <div class="screen-padding stagger-2" style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px;">
          ${s.map(e=>`
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.04);">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1rem;">${B(e.category)}</span>
                <div>
                  <div style="font-size: 0.8rem; font-weight: 600; text-transform: capitalize;">${e.category.replace(`_`,` `)}</div>
                  <div style="font-size: 0.65rem; color: var(--text-tertiary);">${e.count} transactions</div>
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.85rem;">₹${R(e.total)}</div>
                <div style="font-size: 0.6rem; color: var(--park-green);">₹${R(e.savings)} saved</div>
              </div>
            </div>
          `).join(``)}
        </div>
      `:``}

      <!-- Transactions List -->
      <div class="section-header stagger-3">
        <span class="section-title">Recent Transactions</span>
      </div>

      <div class="screen-padding stagger-3" style="display: flex; flex-direction: column; gap: 8px;">
        ${o.length===0?`
          <div style="text-align: center; padding: 48px 20px;">
            <div style="font-size: 2.5rem; margin-bottom: 12px;">📋</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 4px;">No transactions yet</div>
            <div style="font-size: 0.75rem; color: var(--text-tertiary);">Make a payment to see your history here</div>
          </div>
        `:o.map(e=>`
          <div style="display: flex; align-items: center; gap: 14px; padding: 14px 16px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.04);">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: var(--bg-elevated); display: flex; align-items: center; justify-content: center; font-size: 1.1rem;">
              ${B(e.category)}
            </div>
            <div style="flex: 1;">
              <div style="font-weight: 600; font-size: 0.85rem;">${e.merchant_name||e.merchant_id}</div>
              <div style="font-size: 0.65rem; color: var(--text-tertiary);">
                ${z(e.created_at)}
                ${e.status===`pending`?` • <span style="color:var(--orange-sunshine); font-weight:600;">Pending</span>`:``}
                ${e.status===`cancelled`?` • <span style="color:var(--error); font-weight:600;">Cancelled</span>`:``}
                ${e.status===`completed`&&e.card_id?` • ${e.card_id}`:``}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.9rem;">₹${R(e.amount)}</div>
              ${e.savings>0?`<div style="font-size: 0.6rem; color: var(--park-green); font-weight: 500;">₹${R(e.savings)} saved</div>`:``}
            </div>
          </div>
        `).join(``)}
      </div>
    `}catch(t){e.innerHTML=`
      <div style="text-align: center; padding: 60px 24px;">
        <div style="font-size: 2rem; margin-bottom: 12px;">⚠️</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Could not load history</div>
        <div style="font-size: 0.72rem; color: var(--text-tertiary);">${t.message}</div>
      </div>
    `}}function R(e){return(parseFloat(e)||0).toLocaleString(`en-IN`,{maximumFractionDigits:0})}function z(e){if(!e)return``;let t=e.replace(` `,`T`).concat(`Z`);return new Date(t).toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,hour:`2-digit`,minute:`2-digit`})}function B(e){return{dining:`🍕`,online_shopping:`🛒`,grocery:`🥦`,fuel:`⛽`,travel:`✈️`,movies:`🎬`,utility:`💡`,insurance:`🛡️`,education:`📚`,general:`💫`}[e]||`💳`}function V(e,t,n={}){_(`payment_cancelled`),sessionStorage.removeItem(`analytics_session_id`);let r=document.createElement(`div`);r.className=`screen`,r.id=`cancel-screen`,r.innerHTML=`
    <div class="screen-header">
      <span class="header-title">Payment Cancelled</span>
    </div>
    
    <div class="success-content stagger-1" style="height: 70vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 24px;">
      <div class="success-icon" style="background: rgba(239,68,68,0.1); color: #ef4444; width: 80px; height: 80px; border-radius: 40px; display: flex; align-items: center; justify-content: center; font-size: 32px; margin-bottom: 24px;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </div>
      
      <h2 style="font-size: 1.5rem; margin-bottom: 12px; font-weight: 700;">Transaction Cancelled</h2>
      <p style="color: var(--text-secondary); line-height: 1.5; font-size: 0.95rem;">
        You cancelled the payment request from ${n.merchantName||`the merchant`}.
      </p>
      
      <div style="margin-top: 32px; width: 100%;">
        <button class="neo-btn" id="btn-home" style="background: var(--bg-elevated); color: white; width: 100%;">Return to Home</button>
      </div>
    </div>
  `,e.innerHTML=``,e.appendChild(r),document.getElementById(`btn-home`)?.addEventListener(`click`,()=>{t(`home`)})}function H(e,t){let n=document.createElement(`div`);n.className=`screen`,n.id=`cards-screen`,n.innerHTML=`
    <div class="screen-header">
      <button class="back-btn" id="cards-back">←</button>
      <span class="header-title">My Cards</span>
      <div class="header-action">
        <button id="add-card-btn" style="background: none; border: none; font-size: 1.5rem; color: var(--orange-sunshine); cursor: pointer; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px;">+</button>
      </div>
    </div>
    <div id="cards-content" class="screen-padding" style="padding-top: 20px; padding-bottom: 100px;">
      <div style="text-align: center; padding: 60px 24px; color: var(--text-tertiary);">Loading your wallet...</div>
    </div>
  `,e.innerHTML=``,e.appendChild(n),document.getElementById(`cards-back`)?.addEventListener(`click`,()=>t(`home`)),document.getElementById(`add-card-btn`)?.addEventListener(`click`,()=>U(W)),W()}async function U(e){let t=document.createElement(`div`);t.className=`modal-overlay`,t.style.zIndex=`1000`,t.innerHTML=`
    <div class="modal" style="max-height: 80vh; display: flex; flex-direction: column;">
      <div class="modal-header">
        <h2 class="modal-title">Add New Card</h2>
      </div>
      <div class="modal-body" style="overflow-y: auto; flex: 1;">
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Select Card Template</label>
          <select id="card-template-select" style="width: 100%; background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 12px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem; appearance: none; background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right%2012px%20top%2050%25; background-size: 10px%20auto;">
            <option value="" disabled selected>Choose a card...</option>
          </select>
        </div>
        
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Last 4 Digits</label>
          <input type="text" id="new-card-last4" maxlength="4" placeholder="4821" style="width: 100%; background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 12px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem;">
        </div>

        <div style="margin-bottom: 5px;">
          <label style="display: block; font-size: 0.75rem; color: var(--text-tertiary); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em;">Nickname (Optional)</label>
          <input type="text" id="new-card-nickname" placeholder="Primary Shopping Card" style="width: 100%; background: var(--bg-elevated); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 12px; color: var(--text-primary); font-family: var(--font-body); font-size: 0.9rem;">
        </div>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-secondary" id="add-card-cancel">Cancel</button>
        <button class="modal-btn modal-btn-primary" id="add-card-confirm" disabled style="opacity: 0.5;">Add Card</button>
      </div>
    </div>
  `,document.body.appendChild(t);let n=null;try{let{cards:e}=await ee(),t=document.getElementById(`card-template-select`),r=e.reduce((e,t)=>(e[t.bank]||(e[t.bank]=[]),e[t.bank].push(t),e),{});t.innerHTML=`<option value="" disabled selected>Choose a card...</option>`+Object.entries(r).map(([e,t])=>`
        <optgroup label="${e}">
          ${t.map(e=>`<option value="${e.id}">${e.name}</option>`).join(``)}
        </optgroup>
      `).join(``),t.addEventListener(`change`,e=>{n=e.target.value,a()})}catch(e){console.error(`Failed to load card templates`,e)}let r=document.getElementById(`new-card-last4`),i=document.getElementById(`add-card-confirm`),a=()=>{let e=n&&r.value.length===4;i.disabled=!e,i.style.opacity=e?`1`:`0.5`};r.addEventListener(`input`,a),document.getElementById(`add-card-cancel`)?.addEventListener(`click`,()=>{t.classList.remove(`active`),setTimeout(()=>t.remove(),300)}),document.getElementById(`add-card-confirm`)?.addEventListener(`click`,async()=>{let a=r.value,o=document.getElementById(`new-card-nickname`).value;i.disabled=!0,i.innerText=`Adding...`;try{await re({card_id:n,last4:a,nickname:o}),t.classList.remove(`active`),setTimeout(()=>{t.remove(),e()},300)}catch(e){alert(`Failed to add card: `+e.message),i.disabled=!1,i.innerText=`Add Card`}}),requestAnimationFrame(()=>t.classList.add(`active`))}async function de(e,t,n){let r=document.createElement(`div`);r.className=`modal-overlay`,r.style.zIndex=`1000`,r.innerHTML=`
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Remove Card</h2>
      </div>
      <div class="modal-body">
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">Are you sure you want to remove <strong>${t}</strong> from your wallet?</p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-secondary" id="delete-cancel">Cancel</button>
        <button class="modal-btn modal-btn-danger" id="delete-confirm">Remove</button>
      </div>
    </div>
  `,document.body.appendChild(r),document.getElementById(`delete-cancel`)?.addEventListener(`click`,()=>{r.classList.remove(`active`),setTimeout(()=>r.remove(),300)}),document.getElementById(`delete-confirm`)?.addEventListener(`click`,async()=>{try{await ie(e),r.classList.remove(`active`),setTimeout(()=>{r.remove(),n()},300)}catch(e){alert(`Failed to delete card: `+e.message)}}),requestAnimationFrame(()=>r.classList.add(`active`))}function fe(e){return{entry:`Entry`,standard:`Standard`,premium:`Premium`,super_premium:`Super Premium`}[e]||(e?e.charAt(0).toUpperCase()+e.slice(1):`Standard`)}function pe(e){return{entry:`#8b8b8b`,standard:`#64b5f6`,premium:`#ba68c8`,super_premium:`#ffd700`}[e]||`#64b5f6`}function me(e){return{cashback:`💰`,points:`⭐`,discount:`🏷️`,surcharge_waiver:`⛽`,voucher:`🎟️`}[e]||`•`}function he(e,t){if(!t)return``;let n=me(t.type),r=t.rate>0?`<strong style="color: var(--accent-green, #4caf50); font-size: 0.85rem;">${t.type===`points`?t.rate+`X`:t.rate+`%`}</strong> `:``,i=t.cap?`<span style="color: var(--text-tertiary); font-size: 0.65rem;"> • Max ₹${t.cap.toLocaleString(`en-IN`)}${t.capUnit===`per_month`?`/mo`:`/cycle`}</span>`:``,a=t.note?`<div style="font-size: 0.62rem; color: var(--text-tertiary); margin-top: 2px; font-style: italic;">${t.note}</div>`:``;return`
    <div style="display: flex; gap: 8px; align-items: flex-start; padding: 7px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
      <span style="font-size: 0.9rem; margin-top: 1px;">${n}</span>
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
          ${r}${t.label||e.replace(/_/g,` `)}${i}
        </div>
        ${a}
      </div>
    </div>
  `}async function W(){let e=document.getElementById(`cards-content`);if(e)try{let t=await u(),n=t.cards||[];if(n.length===0){e.innerHTML=`
        <div style="text-align: center; padding: 48px 20px;">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">💳</div>
          <div style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 4px;">No cards found</div>
          <div style="font-size: 0.75rem; color: var(--text-tertiary);">Your wallet is empty.</div>
        </div>
      `;return}let r=n.map((e,n)=>{let r=e.tier||`standard`,i=fe(r),a=pe(r),o=e.annual_fee||0,s=e.rewards||{},c=e.best_for||[],l=Object.entries(s).filter(([,e])=>e&&e.rate>0).sort(([,e],[,t])=>t.rate-e.rate),u=l.length>0?l.map(([e,t])=>he(e,t)).join(``):`<div style="font-size:0.75rem; color: var(--text-tertiary); padding: 8px 0;">No reward data available</div>`,d=c.length>0?`<div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 14px;">
            ${c.map(e=>`
              <span style="background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.25); color: #b39ddb; padding: 3px 8px; border-radius: 12px; font-size: 0.63rem; text-transform: capitalize; letter-spacing: 0.02em;">
                ${e.replace(/_/g,` `)}
              </span>
            `).join(``)}
          </div>`:``,f=`card-gradient-${n%5+1}`;return`
        <div class="stagger-${n%5+1}">
          <!-- Visual Card -->
          <div class="credit-card ${f}" style="margin: 0 0 12px; width: 100%; height: 168px; box-sizing: border-box;">
            <div class="card-bank">${e.bank||`Bank`}</div>
            <div class="card-number" style="margin-top: 32px;">•••• •••• •••• ${e.last4}</div>
            <div class="card-bottom">
              <div><div class="card-name">${t.user.name||`User`}</div></div>
              <div class="card-network">${e.network||`Visa`}</div>
            </div>
          </div>

          <!-- Detail Panel -->
          <div style="background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.05); padding: 16px;">
            
            <!-- Card title row -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px;">
              <div>
                <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 4px;">${e.full_name||e.nickname}</div>
                <span style="font-size: 0.65rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: ${a}; background: ${a}20; padding: 2px 7px; border-radius: 4px; border: 1px solid ${a}40;">
                  ${i}
                </span>
              </div>
              <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                <div style="text-align: right;">
                  <div style="font-size: 0.65rem; color: var(--text-tertiary); margin-bottom: 2px;">Annual Fee</div>
                  <div style="font-weight: 700; font-family: var(--font-display); font-size: 1rem; color: ${o===0?`#4caf50`:`var(--text-primary)`};">
                    ${o===0?`FREE`:`₹`+o.toLocaleString(`en-IN`)}
                  </div>
                </div>
                <button class="delete-card-btn" data-id="${e.user_card_id}" data-name="${e.full_name||e.nickname}" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: var(--error); border-radius: 6px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 150ms ease;">
                  <span style="font-size: 1rem;">🗑️</span>
                </button>
              </div>
            </div>

            <!-- Rewards section -->
            <div style="border-top: 1px solid rgba(255,255,255,0.07); padding-top: 12px;">
              <div style="font-size: 0.68rem; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">Reward Structure</div>
              ${u}
            </div>

            ${d}
          </div>
        </div>
      `});e.innerHTML=`
      <div style="margin-bottom: 20px;">
        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px;">Active cards in wallet</div>
        <div style="font-family: var(--font-display); font-size: 2rem; font-weight: 800;">${n.length}</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 24px;">
        ${r.join(``)}
      </div>
    `,document.querySelectorAll(`.delete-card-btn`).forEach(e=>{e.addEventListener(`click`,e=>{let t=e.currentTarget.dataset.id,n=e.currentTarget.dataset.name;de(t,n,W)})})}catch(t){e.innerHTML=`
      <div style="text-align: center; padding: 60px 24px;">
        <div style="font-size: 2rem; margin-bottom: 12px;">⚠️</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px;">Could not load wallet</div>
        <div style="font-size: 0.72rem; color: var(--text-tertiary);">${t.message}</div>
      </div>
    `}}function ge(e,t,n){_(`upi_pin_viewed`);let r=b.find(e=>e.id===n.merchantId),i=n.amount||0,a=[],o=document.createElement(`div`);o.className=`screen upi-screen`,o.id=`upi-pin-screen`;function s(){o.innerHTML=`
      <div class="upi-header">
        <div class="upi-logo-container">
          <span class="upi-logo-text">UPI</span>
          <span class="upi-bank-name">Punjab National Bank</span>
        </div>
        <button class="upi-close-btn" id="upi-close">✕</button>
      </div>

      <div class="upi-payment-hero">
        <div class="upi-hero-left">
          <div class="upi-hero-label">Pay ₹${i.toLocaleString(`en-IN`,{minimumFractionDigits:2})}</div>
          <div class="upi-hero-to">To ${r?r.name:`Merchant`}</div>
        </div>
        <div class="upi-hero-right">
          <div class="upi-hero-icon-stack">
            <span>₹</span>
            <div class="upi-user-icon">👤</div>
          </div>
        </div>
      </div>

      <div class="upi-pin-section">
        <div class="upi-pin-label">Enter your PIN</div>
        <div class="upi-pin-dots">
          ${[,,,,,,].fill(0).map((e,t)=>`
            <div class="upi-pin-dot ${a.length>t?`filled`:``}"></div>
          `).join(``)}
        </div>
        <div class="upi-pin-warning">
          <span class="warning-icon">ⓘ</span>
          Never enter your UPI PIN to receive money
        </div>
      </div>

      <div class="upi-numpad">
        <div class="upi-numpad-grid">
          ${[1,2,3,4,5,6,7,8,9].map(e=>`
            <button class="upi-key" data-key="${e}">${e}</button>
          `).join(``)}
          <button class="upi-key upi-key-back" data-key="back">⌫</button>
          <button class="upi-key" data-key="0">0</button>
          <button class="upi-key upi-key-pay" id="upi-pay-btn" ${a.length===6?``:`disabled`}>Pay</button>
        </div>
      </div>
    `,c()}function c(){document.getElementById(`upi-close`)?.addEventListener(`click`,()=>{t(`transaction`,{merchantId:n.merchantId,amount:n.amount,transactionId:n.transactionId})}),o.querySelectorAll(`.upi-key`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.key;t===`back`?a.length>0&&(a.pop(),s()):isNaN(t)||a.length<6&&(a.push(t),s())})}),document.getElementById(`upi-pay-btn`)?.addEventListener(`click`,()=>{a.length===6&&t(`success`,{...n,merchantName:r?r.name:`Merchant`,category:r?r.category:`general`,cardId:`upi`,cardName:`UPI Payment`,cardBank:`Punjab National Bank`,cardLast4:`UPI`,savings:0})})}e.innerHTML=``,e.appendChild(o),s()}var G=[{id:`zomato`,primaryColor:`#E23744`,borderRadius:`12px`,font:`system-ui`},{id:`swiggy`,primaryColor:`#FC8019`,borderRadius:`24px`,font:`system-ui`},{id:`amazon`,primaryColor:`#FF9900`,borderRadius:`4px`,font:`Amazon Ember, Arial, sans-serif`},{id:`croma`,primaryColor:`#00A651`,borderRadius:`0px`,font:`Inter, sans-serif`}];function _e(e,t,n){_(`simulator_started`);let r=G[Math.floor(Math.random()*G.length)],i=b.find(e=>e.id===r.id)||b[0],a=Math.floor(Math.random()*4500)+500,o=document.createElement(`div`);o.className=`merchant-sim-wrapper`,o.id=`merchant-sim-screen`,o.style.setProperty(`--ms-primary`,r.primaryColor),o.style.setProperty(`--ms-radius`,r.borderRadius),o.style.setProperty(`--ms-font`,r.font);let s=null;function c(){o.innerHTML=`
      <div class="merchant-sim-container" style="font-family: var(--ms-font);">
        <div class="ms-header" style="border-bottom: 2px solid var(--ms-primary);">
          <button class="ms-back-btn" id="ms-back">←</button>
          <span class="ms-merchant-name" style="color: var(--ms-primary);">${i.name} Checkout</span>
          <div style="width: 24px;"></div>
        </div>

        <div class="ms-content">
          <div class="ms-order-card" style="border-radius: var(--ms-radius);">
            <div class="ms-order-summary">Order Summary</div>
            <div class="ms-order-item">
              <span class="ms-item-name">Priority Delivery</span>
              <span class="ms-item-price">₹${a.toLocaleString(`en-IN`)}</span>
            </div>
            <div class="ms-order-item">
              <span class="ms-item-name">Service Fee</span>
              <span class="ms-item-price">₹25.00</span>
            </div>
            <div class="ms-order-total" style="color: var(--ms-primary);">
              <span>Total to pay</span>
              <span>₹${(a+25).toLocaleString(`en-IN`)}</span>
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
    `,l()}function l(){let e=o.querySelector(`#ms-payment-overlay`),n=o.querySelector(`#ms-proceed-btn`);o.querySelector(`#ms-back`)?.addEventListener(`click`,()=>{window.location.href=`/`});let c=[`netbanking`,`cards`,`upi`];c.forEach(e=>{o.querySelector(`#ms-method-${e}`)?.addEventListener(`click`,()=>{c.forEach(e=>{let t=o.querySelector(`#ms-method-${e}`);t.classList.remove(`selected`),t.style.borderColor=`#E9ECEF`});let t=o.querySelector(`#ms-method-${e}`);t.classList.add(`selected`),t.style.borderColor=r.primaryColor,s=e,e===`netbanking`?(n.disabled=!0,n.classList.add(`disabled`),n.style.background=`#E9ECEF`,n.textContent=`Select a different method`):(n.disabled=!1,n.classList.remove(`disabled`),n.style.background=r.primaryColor,n.textContent=`Proceed to Pay`)})}),n?.addEventListener(`click`,()=>{e.classList.add(`active`)}),o.querySelector(`#ms-close-overlay`)?.addEventListener(`click`,()=>{e.classList.remove(`active`)}),o.querySelectorAll(`.ms-option-item`).forEach(n=>{n.addEventListener(`click`,async()=>{let r=n.dataset.method;if(r===`cred`){e.classList.remove(`active`);try{let e=a+25,n=await h({merchant_id:i.id,merchant_name:i.name,category:i.category||`general`,amount:e});t(`transaction`,{merchantId:i.id,amount:e,transactionId:n.id,forceSmartPay:s===`cards`,forceUpi:s===`upi`,fromSimulator:!0})}catch(e){console.error(`Failed to log transaction stage`,e),alert(`Failed to initiate CRED Pay. Please try again.`)}}else alert(`Simulated: ${r} is not available in this demo. Try CRED Pay!`)})})}e.innerHTML=``,e.appendChild(o),c()}function ve(e,t,n){let a=i();if(!a||a.role!==`admin`){alert(`Access Denied: Admin privileges required.`),t(`login`);return}let o=document.getElementById(`app`);o.classList.add(`admin-mode`);let s=document.createElement(`div`);s.className=`dashboard-wrapper`,s.id=`dashboard-screen`,s.innerHTML=`
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
              <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-primary); margin-top: 4px;">${a.email}</div>
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
  `,e.innerHTML=``,e.appendChild(s);let c=s.querySelector(`#dash-refresh`);c?.addEventListener(`click`,()=>{c.classList.add(`shimmer`),K(s).then(()=>{c.classList.remove(`shimmer`)})}),document.getElementById(`dash-logout-side`)?.addEventListener(`click`,()=>{r(),o.classList.remove(`admin-mode`),t(`login`)}),K(s)}async function K(e){try{let t=await ne(),n=e.querySelector(`#dash-content`),r=e.querySelector(`#dash-loading`),i=e.querySelector(`#dash-kpi-grid`),a=e.querySelector(`#dash-funnel`),o=e.querySelector(`#dash-meta`),s=[{key:`simulator_started`,label:`Funnel Entries`},{key:`amount_page_viewed`,label:`Amount Entered`},{key:`recommendation_shown`,label:`Engine Serve`},{key:`payment_success`,label:`Successful Payments`}],c=t.funnel.simulator_started||0,l=t.funnel.payment_success||0,u=c>0?l/c*100:0;i.innerHTML=`
      <div class="dash-kpi" style="padding: 40px 12px;">
        <div class="kpi-val">${t.state.pendingTransactions}</div>
        <div class="kpi-label" style="font-size: 0.55rem;">Active Orders</div>
      </div>
      <div class="dash-kpi" style="padding: 40px 12px;">
        <div class="kpi-val" style="color: var(--park-green);">${Math.round(u)}%</div>
        <div class="kpi-label" style="font-size: 0.55rem;">Funnel Win</div>
      </div>
      <div class="dash-kpi" style="padding: 40px 12px;">
        <div class="kpi-val">${t.recommendations.avgLatency}ms</div>
        <div class="kpi-label" style="font-size: 0.55rem;">Engine Speed</div>
      </div>
      <div class="dash-kpi" style="padding: 40px 12px;">
        <div class="kpi-val" style="color: var(--poli-purple);">${Math.round(t.recommendations.bestMatchRate)}%</div>
        <div class="kpi-label" style="font-size: 0.55rem;">Uptake</div>
      </div>
      <div class="dash-kpi" style="padding: 40px 12px;">
        <div class="kpi-val" style="color: #F87171;">${Math.round(t.recommendations.waiverRate||0)}%</div>
        <div class="kpi-label" style="font-size: 0.55rem;">Waiver Rate</div>
      </div>
    `,a.innerHTML=s.map((e,n)=>{let r=t.funnel[e.key]||0,i=n>0?t.funnel[s[n-1].key]||0:r,a=n>0&&i>0?Math.round((i-r)/i*100):0,o=c>0?r/c*100:0;return`
        <div class="funnel-row">
          <div class="funnel-info">
            <div class="funnel-label">${e.label}</div>
            <div class="funnel-count">${r}</div>
          </div>
          <div class="funnel-bar" style="height: 10px;">
            <div class="funnel-fill" style="width: ${o}%"></div>
          </div>
          ${a>0?`
            <div class="funnel-drop" style="position: absolute; top: 18px; right: 0;">
              <span>📉</span> <strong>${a}% churn</strong>
            </div>
          `:``}
        </div>
      `}).join(``),o.innerHTML=`
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
         <span>Total Transactions</span>
         <strong>${t.state.totalTransactions}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
         <span>Engine Impressions</span>
         <strong>${t.recommendations.total}</strong>
      </div>
    `,r.style.display=`none`,n.style.display=`block`}catch(t){console.error(`Failed to load dashboard stats`,t),e.querySelector(`#dash-loading`).innerHTML=`
      <div style="color: var(--error); font-size: 0.9rem;">Connection lost: Unable to fetch system telemetry.</div>
    `}}var ye=document.getElementById(`app`);ye.innerHTML=`
  <div id="screen-container" style="min-height: 100vh;"></div>
  <div id="global-nav"></div>
`;var q=document.getElementById(`screen-container`),J=document.getElementById(`global-nav`),Y=`home`,X={},be={login:v,home:y,merchants:x,transaction:se,recommendation:D,confirm:j,success:N,history:I,cancel:V,cards:H,upi_pin:ge,merchant_simulator:_e,dashboard:ve},xe=[`login`];function Z(e){let t=i(),n=o();if(!xe.includes(e)&&!n)return`login`;if(n&&t){if(t.role===`admin`){if(e!==`dashboard`&&e!==`login`)return`dashboard`}else if(e===`dashboard`)return`home`}return e}function Q(e,t={}){Y=Z(e),X=t;let n=`#${Y}${t.merchantId?`/${t.merchantId}`:``}`;history.pushState({screen:Y,params:t},``,n),$()}function Se(){if(Y===`login`||Y===`upi_pin`||Y===`success`||Y===`merchant_simulator`||Y===`dashboard`){J.innerHTML=``;return}if(J.innerHTML=`
    <div class="bottom-nav">
      <button class="nav-item ${Y===`home`?`active`:``}" id="nav-home">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">HOME</span>
      </button>
      <button class="nav-item ${Y===`cards`?`active`:``}" id="nav-cards">
        <span class="nav-icon">💳</span>
        <span class="nav-label">CARDS</span>
      </button>
      <button class="nav-item-center" id="nav-upi">
        <span class="nav-icon">💸</span>
        <span class="nav-label">UPI</span>
      </button>
      <button class="nav-item ${Y===`history`?`active`:``}" id="nav-history">
        <span class="nav-icon">📊</span>
        <span class="nav-label">HISTORY</span>
      </button>
      <button class="nav-item" id="nav-more">
        <span class="nav-icon">⠿</span>
        <span class="nav-label">MORE</span>
      </button>
    </div>
  `,document.getElementById(`nav-home`)?.addEventListener(`click`,()=>Q(`home`)),document.getElementById(`nav-cards`)?.addEventListener(`click`,()=>Q(`cards`)),document.getElementById(`nav-upi`)?.addEventListener(`click`,()=>{let e=b[Math.floor(Math.random()*b.length)];Q(`transaction`,{merchantId:e.id,forceUpi:!0})}),document.getElementById(`nav-history`)?.addEventListener(`click`,()=>Q(`history`)),i()?.role===`admin`)document.getElementById(`nav-more`)?.addEventListener(`click`,()=>Q(`dashboard`));else{let e=document.getElementById(`nav-more`);e&&(e.style.opacity=`0.3`)}}function $(){Y=Z(Y);let e=be[Y];e?e(q,Q,X):y(q,Q),Se()}window.addEventListener(`popstate`,e=>{e.state?(Y=e.state.screen,X=e.state.params||{}):(Y=`home`,X={}),$()});async function Ce(){let e=new URLSearchParams(window.location.search),t=e.get(`simulator`),n=e.get(`merchant`),r=e.get(`category`),i=e.get(`amount`),a=e.get(`orderId`),s=e.get(`autoOpen`)!==`false`;if(t===`true`){Y=`merchant_simulator`,$();return}if(e.get(`dashboard`)===`true`){Y=`dashboard`,$();return}if(n&&r&&i){let e={merchantId:n,category:r,amount:i,orderId:a};if(window.history.replaceState({},document.title,window.location.pathname),o())try{let t=await h({merchant_id:n,merchant_name:n,category:r,amount:parseFloat(i)});if(s){Y=`transaction`,X={...e,transactionId:t.id};let r=`#transaction/${n}`;history.replaceState({screen:`transaction`,params:X},``,r)}else Y=`home`,X={},history.replaceState({screen:`home`,params:{}},``,`#home`);$();return}catch(e){console.error(`Failed to create pending transaction`,e)}else sessionStorage.setItem(`pendingTransaction`,JSON.stringify(e))}let c=sessionStorage.getItem(`pendingTransaction`);if(c)try{let e=JSON.parse(c);if(o()){sessionStorage.removeItem(`pendingTransaction`);let t=await h({merchant_id:e.merchantId,merchant_name:e.merchantId,category:e.category,amount:parseFloat(e.amount)});Y=`transaction`,X={...e,transactionId:t.id};let n=`#transaction/${e.merchantId}`;history.replaceState({screen:`transaction`,params:X},``,n),$();return}}catch{console.error(`Failed to parse pending transaction`)}o()||(Y=`login`),$()}Ce();