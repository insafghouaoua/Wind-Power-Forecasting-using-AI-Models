/*
   1. NAVBAR SCROLL + MOBILE BURGER
*/
(function () {
  const navbar = document.getElementById('navbar');
  const burger = document.getElementById('navBurger');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
})();


/*
   2. FADE-IN ON SCROLL (IntersectionObserver)
*/
(function () {
  const els = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings slightly
          const siblings = Array.from(entry.target.parentElement.querySelectorAll('.fade-in'));
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('visible'), idx * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach(el => observer.observe(el));
})();


/*
   3. ANIMATED WIND CANVAS (Hero)
*/
(function () {
  const canvas = document.getElementById('windCanvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particles representing wind flows
  const PARTICLE_COUNT = 120;
  const particles = [];

  function randomParticle(fresh = false) {
    return {
      x:     fresh ? Math.random() * canvas.width : -50,
      y:     Math.random() * canvas.height,
      speed: 0.8 + Math.random() * 2.2,
      size:  0.5 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.45,
      wave:  Math.random() * Math.PI * 2,
      waveAmp: 10 + Math.random() * 40,
      waveFreq: 0.003 + Math.random() * 0.007,
      color: Math.random() > 0.6 ? '#00c896' : Math.random() > 0.5 ? '#00e5c8' : '#00d4ff',
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(randomParticle(true));
  }

  // Wind turbine blades (subtle background element)
  function drawTurbine(x, y, r, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = 'rgba(0,200,150,0.08)';
    ctx.lineWidth = 2;

    // Mast
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, r * 2.5);
    ctx.stroke();

    // Blades
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate(angle + (i * Math.PI * 2) / 3);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(r * 0.3, -r * 0.1, r * 0.4, -r * 0.2, r, 0);
      ctx.bezierCurveTo(r * 0.4, r * 0.1, r * 0.3, r * 0.05, 0, 0);
      ctx.fillStyle = 'rgba(0,200,150,0.06)';
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Hub
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.08, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,200,150,0.25)';
    ctx.fill();
    ctx.restore();
  }

  let angle = 0;
  let t = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient
    const grad = ctx.createRadialGradient(
      canvas.width * 0.65, canvas.height * 0.35, 0,
      canvas.width * 0.65, canvas.height * 0.35, canvas.width * 0.7
    );
    grad.addColorStop(0, 'rgba(0,90,70,0.12)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Turbines
    const W = canvas.width, H = canvas.height;
    drawTurbine(W * 0.15, H * 0.55, 70, angle);
    drawTurbine(W * 0.82, H * 0.42, 100, angle * 0.8);
    drawTurbine(W * 0.55, H * 0.68, 55, angle * 1.2);

    // Particles
    particles.forEach(p => {
      p.x += p.speed;
      p.wave += p.waveFreq;
      const y = p.y + Math.sin(p.wave) * p.waveAmp;

      ctx.beginPath();
      ctx.arc(p.x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
      ctx.fill();

      // Draw short trail
      ctx.beginPath();
      ctx.moveTo(p.x, y);
      ctx.lineTo(p.x - p.speed * 8, y);
      ctx.strokeStyle = p.color + '22';
      ctx.lineWidth = p.size * 0.6;
      ctx.stroke();

      if (p.x > canvas.width + 60) {
        Object.assign(p, randomParticle(false));
      }
    });

    angle += 0.004;
    t++;
    requestAnimationFrame(animate);
  }

  animate();
})();


/*
   4. CHART.JS DATA & RENDERING
*/
(function () {
  const data = {
    algeria: {
      labels: ['Lin.Reg', 'Ridge', 'Lasso', 'XGBoost', 'LightGBM', 'Grad.B', 'RNN', 'LSTM', 'GRU', 'RNN-D', 'LSTM-D', 'GRU-D', 'CNN+LSTM', 'CNN+GRU', 'QNN'],
      r2:   [0.94, 0.93, 0.93, 0.99, 0.99, 0.99, 0.97, 0.97, 0.97, 0.97, 0.98, 0.97, 0.98, 0.98, 0.97],
      rmse: [0.49, 0.51, 0.51, 0.08, 0.09, 0.07, 0.27, 0.27, 0.28, 0.31, 0.26, 0.28, 0.26, 0.27, 0.32],
    },
    turkey: {
      labels: ['Lin.Reg', 'Ridge', 'Lasso', 'XGBoost', 'LightGBM', 'Grad.B', 'RNN', 'LSTM', 'GRU', 'RNN-D', 'LSTM-D', 'GRU-D', 'CNN+LSTM', 'CNN+GRU', 'QNN'],
      r2:   [0.93, 0.94, 0.91, 0.99, 0.99, 0.99, 0.93, 0.94, 0.93, 0.94, 0.94, 0.94, 0.94, 0.94, 0.96],
      rmse: [0.31, 0.28, 0.35, 0.11, 0.10, 0.11, 0.30, 0.29, 0.32, 0.29, 0.29, 0.29, 0.29, 0.30, 0.22],
    },
    // Simulated 24-hr predictions (Gradient Boosting Algeria)
    pred: {
      time: Array.from({length: 96}, (_, i) => `${String(Math.floor(i/4)).padStart(2,'0')}:${['00','15','30','45'][i%4]}`),
      actual: [850,900,1200,1600,2100,2800,3100,3400,3600,3700,3750,3800,3820,3850,3900,3850,3800,3700,3500,3200,2800,2400,2000,1700,1400,1100,850,700,600,550,520,500,600,750,900,1100,1400,1700,2100,2500,2900,3100,3300,3500,3600,3700,3750,3800,3820,3800,3750,3700,3600,3400,3100,2800,2500,2100,1800,1500,1200,1000,850,750,700,680,700,750,850,1000,1200,1500,1800,2100,2400,2700,2900,3000,3100,3200,3150,3100,2900,2600,2300,2000,1700,1400,1100,850,700],
    },
  };

  // Add slight noise to predictions (simulated model)
  data.pred.predicted = data.pred.actual.map(v => {
    const noise = (Math.random() - 0.5) * 200;
    return Math.max(0, v + noise);
  });

  // ── Chart defaults ──
  Chart.defaults.color = '#7fb8a8';
  Chart.defaults.borderColor = 'rgba(0,255,180,0.08)';
  Chart.defaults.font.family = "'DM Sans', sans-serif";

  const GRAD_BAR_GREEN = (ctx) => {
    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, '#00c896');
    gradient.addColorStop(1, '#00d4ff');
    return gradient;
  };
  const GRAD_BAR_MUTED = 'rgba(0,200,150,0.25)';

  let r2Chart, rmseChart, predChart;
  let currentDataset = 'algeria';

  function createBarChart(canvasId, labels, values, label, color, max) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    return new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label,
          data: values,
          backgroundColor: (ctx) => {
            const v = values[ctx.dataIndex];
            const isTop = label.includes('R²') ? v >= 0.99 : v <= 0.10;
            return isTop ? color(ctx) : GRAD_BAR_MUTED;
          },
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0f2820',
            borderColor: 'rgba(0,200,150,0.3)',
            borderWidth: 1,
            padding: 10,
          }
        },
        scales: {
          y: {
            max,
            grid: { color: 'rgba(0,200,150,0.07)' },
            ticks: { font: { size: 10 } }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 9 }, maxRotation: 45 }
          }
        }
      }
    });
  }

  function createPredChart(canvasId, actual, predicted, labels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Actual',
            data: actual,
            borderColor: '#00c896',
            borderWidth: 2,
            pointRadius: 0,
            fill: false,
            tension: 0.4,
          },
          {
            label: 'Predicted',
            data: predicted,
            borderColor: '#00d4ff',
            borderWidth: 2,
            borderDash: [6, 3],
            pointRadius: 0,
            fill: false,
            tension: 0.4,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#7fb8a8',
              font: { size: 11 },
              boxWidth: 24,
              usePointStyle: true,
            }
          },
          tooltip: {
            backgroundColor: '#0f2820',
            borderColor: 'rgba(0,200,150,0.3)',
            borderWidth: 1,
            padding: 10,
            callbacks: {
              label: (ctx) => `  ${ctx.dataset.label}: ${Math.round(ctx.parsed.y)} kW`
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(0,200,150,0.07)' },
            ticks: { font: { size: 10 }, callback: v => v >= 1000 ? (v/1000).toFixed(1)+'MW' : v+'kW' }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 9 }, maxTicksLimit: 12 }
          }
        }
      }
    });
  }

  function initCharts(dataset) {
    const d = data[dataset];

    if (r2Chart)   r2Chart.destroy();
    if (rmseChart) rmseChart.destroy();
    if (predChart) predChart.destroy();

    r2Chart   = createBarChart('r2Chart',   d.labels, d.r2,   'R² Score', GRAD_BAR_GREEN, 1.05);
    rmseChart = createBarChart('rmseChart', d.labels, d.rmse, 'RMSE',     GRAD_BAR_GREEN, 0.6);
    predChart = createPredChart('predChart', data.pred.actual.slice(0,96), data.pred.predicted.slice(0,96), data.pred.time.slice(0,96));
  }

  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDataset = btn.dataset.tab;
      initCharts(currentDataset);
    });
  });

  // Init on load
  initCharts('algeria');
})();


/*
   5. FORECASTING DEMO SIMULATOR
*/
(function () {
  // Power curve approximation for GAMESA G52/850
  function powerCurve(ws) {
    if (ws < 3)  return 0;
    if (ws > 25) return 0;
    if (ws <= 13) {
      // Cubic-ish rise
      return Math.min(850, Math.pow((ws - 3) / 10, 2.4) * 850);
    }
    return 850; // Rated power in kW
  }

  // Usability factor from wind direction (Algeria: optimal 30–90°)
  function usability(dir) {
    const optimal_center = 60;
    const deviation = Math.min(Math.abs(dir - optimal_center), 360 - Math.abs(dir - optimal_center));
    return Math.max(0, 1 - deviation / 180);
  }

  // Season modifier
  const seasonMod = { spring: 1.05, summer: 0.95, autumn: 1.1, winter: 1.15 };

  // Temperature effect (air density proxy)
  function tempFactor(t) {
    return 1 + (15 - t) * 0.003; // cooler air = slightly denser = more power
  }

  const windSpeedInput = document.getElementById('windSpeed');
  const windDirInput   = document.getElementById('windDir');
  const tempInput      = document.getElementById('temperature');
  const seasonInput    = document.getElementById('season');
  const predictBtn     = document.getElementById('predictBtn');

  const windSpeedVal   = document.getElementById('windSpeedVal');
  const windDirVal     = document.getElementById('windDirVal');
  const temperatureVal = document.getElementById('temperatureVal');

  const outputValue  = document.getElementById('outputValue');
  const outputConf   = document.getElementById('outputConf');
  const outputStatus = document.getElementById('outputStatus');
  const outputBar    = document.getElementById('outputBar');

  // Live labels
  windSpeedInput.addEventListener('input', () => { windSpeedVal.textContent = parseFloat(windSpeedInput.value).toFixed(1); });
  windDirInput.addEventListener('input',   () => { windDirVal.textContent   = windDirInput.value + '°'; });
  tempInput.addEventListener('input',      () => { temperatureVal.textContent = tempInput.value + '°C'; });

  predictBtn.addEventListener('click', () => {
    const ws  = parseFloat(windSpeedInput.value);
    const dir = parseFloat(windDirInput.value);
    const t   = parseFloat(tempInput.value);
    const s   = seasonInput.value;

    const basePow    = powerCurve(ws);
    const u          = usability(dir);
    const tFactor    = tempFactor(t);
    const sMod       = seasonMod[s] || 1;

    // Add small stochastic noise (±5%)
    const noise      = 0.95 + Math.random() * 0.1;
    const totalPower = basePow * u * tFactor * sMod * noise;
    const mw         = (totalPower / 1000).toFixed(3);
    const pct        = Math.min(100, (totalPower / 850) * 100);

    // Confidence level based on wind in optimal range
    let conf = 'High (>90%)';
    if (ws < 5 || ws > 22) conf = 'Low (<65%)';
    else if (u < 0.6)      conf = 'Medium (70%)';

    // Status label
    let status = '✅ Optimal conditions';
    if (ws < 3)  status = '⚠ Below cut-in speed';
    else if (ws > 25) status = '🛑 Above cut-out speed';
    else if (u < 0.4) status = '⚠ Poor wind alignment';

    // Animate output
    outputValue.textContent  = mw + ' MW';
    outputConf.textContent   = conf;
    outputStatus.textContent = status;
    outputBar.style.width    = pct.toFixed(1) + '%';

    // Flash animation
    outputValue.style.opacity = '0.3';
    setTimeout(() => { outputValue.style.opacity = '1'; }, 150);
  });
})();


/*
   6. ACTIVE NAV LINK ON SCROLL
*/
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }, { passive: true });
})();
