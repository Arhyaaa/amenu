// ================= LOADER =================
const loader = document.getElementById('loader');
const loaderFill = document.querySelector('.loader-fill');
const loaderPct = document.getElementById('loaderPct');
const loaderStatus = document.getElementById('loaderStatus');

const loadingSteps = [
  { pct: 15, text: 'Initializing core...' },
  { pct: 35, text: 'Loading modules...' },
  { pct: 55, text: 'Injecting hooks...' },
  { pct: 75, text: 'Bypassing detection...' },
  { pct: 92, text: 'Verifying license...' },
  { pct: 100, text: 'Ready.' }
];

let currentStep = 0;
let currentPct = 0;

function animateLoader() {
  if (currentStep >= loadingSteps.length) {
    setTimeout(() => {
      loader.classList.add('hide');
      document.getElementById('landing').classList.remove('hidden');
      setTimeout(() => {
        if (loader.parentElement) loader.parentElement.removeChild(loader);
      }, 800);
    }, 400);
    return;
  }
  const step = loadingSteps[currentStep];
  loaderStatus.textContent = step.text;
  const targetPct = step.pct;
  const interval = setInterval(() => {
    if (currentPct >= targetPct) {
      clearInterval(interval);
      currentStep++;
      setTimeout(animateLoader, 200);
      return;
    }
    currentPct += 1;
    loaderFill.style.width = currentPct + '%';
    loaderPct.textContent = currentPct + '%';
  }, 12);
}
setTimeout(animateLoader, 400);

// ================= SCROLL PROGRESS =================
const scrollBar = document.getElementById('scrollBar');
window.addEventListener('scroll', () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  scrollBar.style.width = ((window.scrollY / h) * 100) + '%';
});

// ================= REVEAL =================
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 90);
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
reveals.forEach(el => obs.observe(el));

// ================= COUNTER =================
const counters = document.querySelectorAll('.meta-num[data-count]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.count;
      const start = performance.now();
      const duration = 2000;
      const isPercent = el.nextElementSibling?.textContent?.includes('%');
      const isBans = el.nextElementSibling?.textContent?.toLowerCase().includes('bans');
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.floor(eased * target);
        if (isPercent || isBans) {
          el.textContent = val.toLocaleString('id-ID');
        } else {
          el.textContent = val.toLocaleString('id-ID') + '+';
        }
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.4 });
counters.forEach(el => counterObs.observe(el));

// ================= FAQ =================
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

// ================= SCROLL BUTTONS =================
document.getElementById('scrollBtn').addEventListener('click', () => {
  document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('discordBtn').addEventListener('click', () => {
  window.open('https://discord.gg/amenu', '_blank');
});
document.getElementById('navDiscord').addEventListener('click', () => {
  window.open('https://discord.gg/amenu', '_blank');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({ behavior: 'smooth' });
  });
});

// ================= OPEN PANEL =================
const panelWrap = document.getElementById('panel');
const panelFF = document.getElementById('panelFF');
const panelFiveM = document.getElementById('panelFiveM');

document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const game = card.dataset.game;
    panelFF.classList.add('hidden');
    panelFiveM.classList.add('hidden');
    if (game === 'ff') panelFF.classList.remove('hidden');
    else panelFiveM.classList.remove('hidden');
    panelWrap.classList.remove('hidden');
    void panelWrap.offsetWidth;
    panelWrap.classList.add('show');
    document.body.classList.add('locked');
  });
});

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', closePanel);
});
panelWrap.querySelector('.panel-backdrop').addEventListener('click', closePanel);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && panelWrap.classList.contains('show')) closePanel();
});

function closePanel() {
  panelWrap.classList.remove('show');
  setTimeout(() => {
    panelWrap.classList.add('hidden');
    document.body.classList.remove('locked');
  }, 450);
}

// ================= PANEL TABS =================
document.querySelectorAll('.p-nav-list').forEach(list => {
  list.querySelectorAll('.p-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.closest('.panel-window');
      const label = btn.querySelector('span')?.textContent || btn.dataset.tab;
      panel.querySelectorAll('.p-nav').forEach(b => b.classList.remove('active'));
      panel.querySelectorAll('.p-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const target = panel.querySelector(`.p-tab[data-tab="${btn.dataset.tab}"]`);
      if (target) {
        target.style.animation = 'none';
        void target.offsetWidth;
        target.style.animation = '';
        target.classList.add('active');
      }
      const indicator = panel.querySelector('.p-tab-indicator');
      if (indicator) {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(-6px)';
        setTimeout(() => {
          indicator.textContent = label;
          indicator.style.opacity = '1';
          indicator.style.transform = 'translateY(0)';
        }, 150);
      }
    });
  });
});

// ================= TOGGLE NOTIF =================
document.querySelectorAll('input[type="checkbox"].switch').forEach(el => {
  el.addEventListener('change', () => {
    const label = el.closest('.p-row')?.querySelector('span')?.textContent || el.dataset.key;
    showToast(`${label} ${el.checked ? '· Enabled' : '· Disabled'}`);
  });
});

// ================= CONFIG SAVE =================
document.querySelectorAll('[data-save-cfg]').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.closest('.p-panel');
    const input = panel.querySelector('.text');
    const name = input.value.trim() || 'unnamed';
    const list = panel.querySelector('.config-list');
    const item = document.createElement('div');
    item.className = 'config-item';
    item.innerHTML = `<span class="cfg-name">${name}.cfg</span><button class="btn-sm">LOAD</button>`;
    list.appendChild(item);
    input.value = '';
    showToast(`Config "${name}.cfg" saved`);
  });
});

// ================= RESET =================
document.querySelectorAll('[data-reset]').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.closest('.panel-window');
    panel.querySelectorAll('input[type="checkbox"].switch').forEach(el => el.checked = false);
    panel.querySelectorAll('input[type="range"].range').forEach(el => el.value = el.min);
    showToast('All settings reset');
  });
});

// ================= TOAST =================
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
}

// ================= LIVE STATS =================
const startTime = Date.now();
setInterval(() => {
  const ffFps = document.getElementById('ffFps');
  const ffPing = document.getElementById('ffPing');
  if (ffFps) ffFps.textContent = 110 + Math.floor(Math.random() * 20);
  if (ffPing) ffPing.textContent = (22 + Math.floor(Math.random() * 12)) + 'ms';

  const fmFps = document.getElementById('fmFps');
  const fmPing = document.getElementById('fmPing');
  if (fmFps) fmFps.textContent = 140 + Math.floor(Math.random() * 8);
  if (fmPing) fmPing.textContent = (10 + Math.floor(Math.random() * 8)) + 'ms';

  const now = new Date();
  document.querySelectorAll('.clock').forEach(el => {
    el.textContent = now.toTimeString().slice(0, 8);
  });
  const diff = Math.floor((Date.now() - startTime) / 1000);
  const h = String(Math.floor(diff / 3600)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
  const s = String(diff % 60).padStart(2, '0');
  document.querySelectorAll('.uptime').forEach(el => {
    el.textContent = `${h}:${m}:${s}`;
  });
}, 1000);