// ============================================================
// AMMAR AHMED MUHAMMAD YOUSAF · IT GRADUATE + SIGNAGE SALES EXECUTIVE
// script.js
// ============================================================


// ============================================================
// SECTION 0 · SMOOTH SCROLL
// ============================================================

(function () {
  var navH = function () {
    var nav = document.getElementById('topNav');
    return nav ? nav.offsetHeight : 68;
  };

  function scrollTo(href) {
    if (!href || href === '#') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    var target = document.querySelector(href);
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.pageYOffset - navH() - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  }

  function closeMobileDrawer() {
    if (window.mobileNav && typeof window.mobileNav.close === 'function') {
      window.mobileNav.close();
    }
  }

  document.addEventListener('click', function (e) {
    var anchor = e.target.closest('.nav-anchor');
    if (!anchor) return;
    var href = anchor.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    closeMobileDrawer();
    scrollTo(href);
  }, true);
})();


// ============================================================
// SECTION 0B · SCROLL PROGRESS BAR
// ============================================================

(function () {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', function () {
    var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
})();


// ============================================================
// SECTION 0C · INTERACTIVE HERO BACKGROUND — Advanced Canvas
// ============================================================

(function () {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, mouse = { x: -999, y: -999 }, time = 0;
  var isMobile = window.innerWidth < 768;
  var COUNT = isMobile ? 55 : 120;
  var particles = [], waves = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', function () { resize(); isMobile = window.innerWidth < 768; }, { passive: true });
  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('touchmove', function (e) {
    if (e.touches[0]) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
  }, { passive: true });

  function Particle() { this.reset(true); }
  Particle.prototype.reset = function (randomY) {
    this.x  = Math.random() * (W || 1200);
    this.y  = randomY ? Math.random() * (H || 800) : H + 20;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = -(Math.random() * 0.5 + 0.1);
    this.r  = Math.random() * 2 + 0.5;
    this.life = Math.random() * 0.5 + 0.2;
    this.maxLife = this.life;
    this.hue = [75, 90, 100, 10][Math.floor(Math.random() * 4)];
    this.sat = Math.floor(Math.random() * 30) + 50;
    this.lit = Math.floor(Math.random() * 20) + 60;
    this.twinkle = Math.random() * Math.PI * 2;
    this.twinkleSpeed = Math.random() * 0.04 + 0.01;
    this.type = Math.random() > 0.85 ? 'diamond' : 'circle';
  };
  Particle.prototype.update = function () {
    this.twinkle += this.twinkleSpeed;
    var dx = this.x - mouse.x, dy = this.y - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 160 && dist > 0) {
      var f = (160 - dist) / 160 * 0.7;
      this.vx += (dx / dist) * f * 0.08;
      this.vy += (dy / dist) * f * 0.08;
    }
    this.vx *= 0.97; this.vy *= 0.97;
    this.x += this.vx; this.y += this.vy;
    this.life -= 0.001;
    if (this.life <= 0 || this.x < -30 || this.x > W + 30 || this.y < -30) this.reset(false);
  };
  Particle.prototype.draw = function () {
    var twinkleAlpha = (Math.sin(this.twinkle) * 0.3 + 0.7) * (this.life / this.maxLife);
    ctx.save();
    if (this.type === 'diamond') {
      var grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 6);
      grd.addColorStop(0, 'hsla(' + this.hue + ',' + this.sat + '%,' + this.lit + '%,' + (twinkleAlpha * 0.4) + ')');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 6, 0, Math.PI * 2); ctx.fill();
      ctx.translate(this.x, this.y); ctx.rotate(Math.PI / 4 + this.twinkle * 0.1);
      ctx.fillStyle = 'hsla(' + this.hue + ',' + this.sat + '%,' + this.lit + '%,' + twinkleAlpha + ')';
      ctx.fillRect(-this.r * 1.2, -this.r * 1.2, this.r * 2.4, this.r * 2.4);
    } else {
      var grd2 = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 4);
      grd2.addColorStop(0, 'hsla(' + this.hue + ',' + this.sat + '%,' + this.lit + '%,' + (twinkleAlpha * 0.25) + ')');
      grd2.addColorStop(1, 'transparent');
      ctx.fillStyle = grd2;
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r * 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'hsla(' + this.hue + ',' + this.sat + '%,' + this.lit + '%,' + twinkleAlpha + ')';
      ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  };

  function Wave(y, amp, speed, color, opacity) {
    this.y = y; this.amp = amp; this.speed = speed;
    this.color = color; this.opacity = opacity; this.offset = Math.random() * Math.PI * 2;
  }
  Wave.prototype.draw = function (t) {
    ctx.beginPath();
    ctx.moveTo(0, this.y);
    for (var x = 0; x <= W; x += 4) {
      var mouseInfluence = 0;
      if (Math.abs(mouse.y - this.y) < 120) {
        var mdx = x - mouse.x;
        mouseInfluence = Math.exp(-mdx * mdx / 20000) * (120 - Math.abs(mouse.y - this.y)) * 0.3;
      }
      ctx.lineTo(x, this.y + Math.sin(x * 0.008 + t * this.speed + this.offset) * this.amp
                    + Math.sin(x * 0.015 + t * this.speed * 0.7 + this.offset) * this.amp * 0.4
                    + mouseInfluence);
    }
    ctx.strokeStyle = this.color.replace('OPACITY', this.opacity);
    ctx.lineWidth = 1.2;
    ctx.stroke();
  };

  function DataStream() {
    this.x = Math.random() * (W || 1200);
    this.y = Math.random() * (H || 800);
    this.speed = Math.random() * 1.5 + 0.5;
    this.chars = '01'.split('');
    this.length = Math.floor(Math.random() * 10) + 5;
    this.opacity = Math.random() * 0.08 + 0.02;
    this.hue = Math.random() > 0.5 ? 85 : 10;
    this.fontSize = Math.floor(Math.random() * 5) + 8;
  }
  DataStream.prototype.update = function () {
    this.y += this.speed;
    if (this.y > H + this.length * this.fontSize) {
      this.y = -this.length * this.fontSize;
      this.x = Math.random() * W;
    }
  };
  DataStream.prototype.draw = function () {
    ctx.font = this.fontSize + 'px "DM Mono", monospace';
    for (var i = 0; i < this.length; i++) {
      var alpha = this.opacity * (1 - i / this.length) * (i === 0 ? 3 : 1);
      ctx.fillStyle = 'hsla(' + this.hue + ',70%,70%,' + Math.min(alpha, 0.25) + ')';
      ctx.fillText(this.chars[Math.floor(Math.random() * this.chars.length)], this.x, this.y - i * this.fontSize);
    }
  };

  for (var i = 0; i < COUNT; i++) particles.push(new Particle());
  var LINK_DIST = isMobile ? 80 : 120;

  var waveColors = [
    'hsla(85,50%,50%,OPACITY)',
    'hsla(80,45%,55%,OPACITY)',
    'hsla(10,50%,65%,OPACITY)'
  ];
  waves.push(new Wave(0, 22, 0.25, waveColors[0], 0.06));
  waves.push(new Wave(0, 16, -0.18, waveColors[1], 0.05));
  waves.push(new Wave(0, 12, 0.32, waveColors[2], 0.04));

  function updateWavePositions() {
    waves[0].y = H * 0.55;
    waves[1].y = H * 0.65;
    waves[2].y = H * 0.72;
  }
  updateWavePositions();
  window.addEventListener('resize', updateWavePositions, { passive: true });

  var streams = [];
  if (!isMobile) {
    for (var s = 0; s < 18; s++) streams.push(new DataStream());
  }

  function drawConnections() {
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < LINK_DIST) {
          var op = (1 - d / LINK_DIST) * 0.18;
          var midHue = (particles[a].hue + particles[b].hue) / 2;
          var life = Math.min(particles[a].life / particles[a].maxLife, particles[b].life / particles[b].maxLife);
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = 'hsla(' + midHue + ',60%,68%,' + (op * life) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function drawAurora(t) {
    var aurora1 = ctx.createLinearGradient(0, H * 0.2, W, H * 0.8);
    aurora1.addColorStop(0,   'hsla(155,80%,30%,0)');
    aurora1.addColorStop(0.3, 'hsla(145,70%,35%,' + (0.035 + 0.02 * Math.sin(t * 0.003)) + ')');
    aurora1.addColorStop(0.6, 'hsla(48,75%,45%,'  + (0.025 + 0.015 * Math.cos(t * 0.004)) + ')');
    aurora1.addColorStop(1,   'hsla(160,60%,30%,0)');
    ctx.fillStyle = aurora1;
    ctx.fillRect(0, 0, W, H);

    if (mouse.x > 0) {
      var grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 280);
      grd.addColorStop(0, 'hsla(155,70%,50%,0.06)');
      grd.addColorStop(0.5, 'hsla(48,65%,55%,0.03)');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawHexGrid(t) {
    if (isMobile) return;
    var size = 45, cols = Math.ceil(W / (size * 1.75)) + 1, rows = Math.ceil(H / (size * 1.5)) + 1;
    ctx.lineWidth = 0.4;
    for (var row = -1; row < rows; row++) {
      for (var col = -1; col < cols; col++) {
        var cx = col * size * 1.73 + (row % 2 === 0 ? 0 : size * 0.865);
        var cy = row * size * 1.5;
        var dx = cx - mouse.x, dy = cy - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var pulse = Math.sin(t * 0.008 + cx * 0.008 + cy * 0.006) * 0.5 + 0.5;
        var alpha = 0.025 + pulse * 0.02;
        if (dist < 220) alpha += (1 - dist / 220) * 0.04;
        ctx.beginPath();
        for (var k = 0; k < 6; k++) {
          var angle = (Math.PI / 3) * k;
          var hx = cx + size * Math.cos(angle), hy = cy + size * Math.sin(angle);
          k === 0 ? ctx.moveTo(hx, hy) : ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.strokeStyle = 'hsla(155,60%,55%,' + alpha + ')';
        ctx.stroke();
      }
    }
  }

  function frame() {
    time++;
    ctx.clearRect(0, 0, W, H);
    drawAurora(time);
    drawHexGrid(time);
    if (!isMobile) { streams.forEach(function (s) { s.update(); s.draw(); }); }
    waves.forEach(function (w) { w.draw(time); });
    drawConnections();
    particles.forEach(function (p) { p.update(); p.draw(); });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();


// ============================================================
// SECTION 2 · PORTFOLIO INIT (DOMContentLoaded)
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 50 });
  }
  initNav();
  initCursor();
  initFAB();
  initCounters();
  initRings();
  initFolderTabs();
  initTestimonialsSlider();
  initTouchPressStates();
  initSectionFadeIn();
  loadArsenal();
  loadLanguages();
  loadProjects();
  loadExperience();
  loadCertifications();
  initSkillBars();
  initScrollReveal();
  initMagneticButtons();
  initSoftParallax();
  initDynamicStaggerObserver();
  setTimeout(initStaggerFadeIn, 50);
  printSignature();
});


// ============================================================
// SECTION 3 · NAVIGATION
// ============================================================

function initNav() {
  var nav      = document.getElementById('topNav');
  var navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', function () {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 60);
    var current = '';
    document.querySelectorAll('section[id]').forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }, { passive: true });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      var rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left - 2) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - 2) + 'px';
      this.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  });
}


// ============================================================
// SECTION 4 · CUSTOM CURSOR (desktop only)
// ============================================================

function initCursor() {
  var dot  = document.getElementById('cursorDot');
  var ring = document.getElementById('cursorRing');
  if (!dot || !ring || window.innerWidth < 1024) return;

  var ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px'; dot.style.top = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px'; ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .project-card, .exp-card, .arsenal-category').forEach(function (el) {
    el.addEventListener('mouseenter', function () { ring.style.width = '48px'; ring.style.height = '48px'; ring.style.opacity = '0.3'; });
    el.addEventListener('mouseleave', function () { ring.style.width = '28px'; ring.style.height = '28px'; ring.style.opacity = '0.6'; });
  });
}


// ============================================================
// SECTION 5 · FLOATING ACTION BUTTON
// ============================================================

function initFAB() {
  var container = document.getElementById('fabContainer');
  var mainBtn   = document.getElementById('fabMain');
  if (!mainBtn || !container) return;

  function closeFAB() {
    container.classList.remove('open');
    mainBtn.classList.remove('open');
  }

  mainBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    container.classList.toggle('open');
    mainBtn.classList.toggle('open');
  });

  var contactOpt = document.querySelector('.fab-option-contact');
  if (contactOpt) contactOpt.addEventListener('click', closeFAB);

  document.addEventListener('click', function (e) {
    if (!container.contains(e.target)) closeFAB();
  });

  container.style.cssText = 'opacity:0;pointer-events:none;transition:opacity 0.3s ease;';

  window.addEventListener('scroll', function () {
    var visible = window.scrollY > 200;
    container.style.opacity       = visible ? '1' : '0';
    container.style.pointerEvents = visible ? 'auto' : 'none';
  }, { passive: true });
}


// ============================================================
// SECTION 6 · TOUCH PRESS STATES (iOS feedback)
// ============================================================

function initTouchPressStates() {
  var sel = '.btn,.fab-option,.fab-main,.mob-link,.contact-item,.social-btn,.exp-btn,.nav-resume-btn,.slider-btn,.slider-dot,.ftab,.pc-link,.contact-item-whatsapp,.social-btn-whatsapp';
  document.querySelectorAll(sel).forEach(function (el) {
    el.addEventListener('touchstart',  function () { el.classList.add('pressed'); },    { passive: true });
    el.addEventListener('touchend',    function () { setTimeout(function () { el.classList.remove('pressed'); }, 150); }, { passive: true });
    el.addEventListener('touchcancel', function () { el.classList.remove('pressed'); }, { passive: true });
  });
}


// ============================================================
// SECTION 7 · COUNTER ANIMATION
// ============================================================

function initCounters() {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      animateCount(entry.target, +entry.target.getAttribute('data-count'));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) {
    el.textContent = '0';
    observer.observe(el);
  });
}

function animateCount(el, target) {
  var duration = 1600, start = performance.now();
  function step(now) {
    var progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.ceil((1 - Math.pow(2, -10 * progress)) * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}


// ============================================================
// SECTION 8 · SVG RING ANIMATION
// ============================================================

function initRings() {
  document.querySelectorAll('.ring-fg').forEach(function (r) {
    r.style.strokeDashoffset = (2 * Math.PI * 50).toString();
  });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var ring = entry.target;
      var pct  = parseInt(ring.getAttribute('data-percent'));
      setTimeout(function () {
        ring.style.strokeDashoffset = (2 * Math.PI * 50) * (1 - pct / 100);
      }, 350);
      observer.unobserve(ring);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.ring-fg').forEach(function (r) { observer.observe(r); });
}


// ============================================================
// SECTION 9 · EDUCATION FOLDER TABS
// ============================================================

function initFolderTabs() {
  document.querySelectorAll('.ftab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.ftab').forEach(function (t) { t.classList.remove('active'); });
      document.querySelectorAll('.folder-pane').forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var pane = document.getElementById(tab.getAttribute('data-pane'));
      if (pane) pane.classList.add('active');
    });
  });
}


// ============================================================
// SECTION 10 · TESTIMONIALS SLIDER
// ============================================================

function initTestimonialsSlider() {
  var slides = document.querySelectorAll('.testimonial-slide');
  var dots   = document.querySelectorAll('.slider-dot');
  var prev   = document.getElementById('sliderPrev');
  var next   = document.getElementById('sliderNext');
  if (!slides.length) return;

  var current = 0, autoTimer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function startAuto() { autoTimer = setInterval(function () { goTo(current + 1); }, 6000); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }

  if (prev) prev.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
  if (next) next.addEventListener('click', function () { goTo(current + 1); resetAuto(); });
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () { goTo(+dot.getAttribute('data-index')); resetAuto(); });
  });

  var slider = document.getElementById('testimonialsSlider');
  var tx = 0, ty = 0;
  if (slider) {
    slider.addEventListener('touchstart', function (e) { tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      var dx = tx - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 50 && Math.abs(ty - e.changedTouches[0].clientY) < 40) { goTo(dx > 0 ? current + 1 : current - 1); resetAuto(); }
    }, { passive: true });
  }

  startAuto();
}


// ============================================================
// SECTION 11 · SECTION FADE-IN ON SCROLL
// ============================================================

function initSectionFadeIn() {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var sections = document.querySelectorAll('.section');
  sections.forEach(function (sec) {
    if (sec.getBoundingClientRect().top > window.innerHeight) {
      sec.style.cssText = 'opacity:0;transform:translateY(24px);transition:opacity 0.65s ease,transform 0.65s cubic-bezier(0.4,0,0.2,1);';
    }
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  sections.forEach(function (sec) { observer.observe(sec); });
}


// ============================================================
// SECTION 12 · SCROLL REVEAL (cards)
// ============================================================

function initScrollReveal() {
  if (typeof IntersectionObserver === 'undefined') return;
  if (window.innerWidth < 768) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var els = document.querySelectorAll('.project-card, .exp-card, .ach-item, .lang-card');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.style.cssText = 'transition:opacity 0.5s ease,transform 0.5s ease;opacity:1;transform:none;';
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  els.forEach(function (el) { el.style.opacity = '0'; observer.observe(el); });

  setTimeout(function () {
    els.forEach(function (el) {
      if (el.style.opacity === '0') {
        el.style.cssText = 'transition:opacity 0.5s ease,transform 0.5s ease;opacity:1;transform:none;';
      }
    });
  }, 3500);
}


// ============================================================
// SECTION 13 · STAGGERED FADE-IN
// ============================================================

function initStaggerFadeIn() {
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('stagger-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.stagger-child, .bento-item, .cert-card, .ach-item, .lang-item')
    .forEach(function (el) { observer.observe(el); });
}


// ============================================================
// SECTION 14 · SKILL BARS
// ============================================================

function initSkillBars() {
  var container = document.getElementById('arsenalBento');
  if (!container) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.sk-bar-fill').forEach(function (bar) {
        setTimeout(function () { bar.style.width = bar.getAttribute('data-width'); }, 200);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });
  observer.observe(container);
}


// ============================================================
// SECTION 15 · MAGNETIC BUTTONS (desktop)
// ============================================================

function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll('.btn-gold, .btn-ghost, .nav-resume-btn').forEach(function (btn) {
    btn.classList.add('btn-magnetic');
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      btn.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.28) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.28) + 'px) scale(1.04)';
    });
    btn.addEventListener('mouseleave', function () { btn.style.transform = ''; });
  });
}


// ============================================================
// SECTION 16 · SOFT PARALLAX (desktop)
// ============================================================

function initSoftParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('.orb-1, .hero-grid-bg').forEach(function (el) { el.classList.add('parallax-slow'); });
  document.querySelectorAll('.orb-2').forEach(function (el) { el.classList.add('parallax-mid'); });
  document.querySelectorAll('.orb-3').forEach(function (el) { el.classList.add('parallax-fast'); });

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    requestAnimationFrame(function () {
      var sy = window.scrollY;
      document.querySelectorAll('.parallax-slow').forEach(function (el) { el.style.setProperty('--py-slow', sy * 0.04 + 'px'); });
      document.querySelectorAll('.parallax-mid').forEach(function  (el) { el.style.setProperty('--py-mid',  sy * 0.07 + 'px'); });
      document.querySelectorAll('.parallax-fast').forEach(function (el) { el.style.setProperty('--py-fast', sy * 0.11 + 'px'); });
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}


// ============================================================
// SECTION 17 · SKELETON LOADING (projects)
// ============================================================

function showProjectSkeleton() {
  var grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.insertAdjacentHTML('beforebegin',
    '<div class="projects-skeleton" id="projectsSkeleton"></div>'
  );
}

function hideProjectSkeleton() {
  var skel = document.getElementById('projectsSkeleton');
  if (!skel) return;
  skel.style.transition = 'opacity 0.3s ease';
  skel.style.opacity    = '0';
  setTimeout(function () { skel.remove(); }, 300);
}


// ============================================================
// SECTION 18 · DYNAMIC STAGGER / SKELETON OBSERVER
// ============================================================

function initDynamicStaggerObserver() {
  var targets = ['projectsGrid','certsGrid','arsenalBento','langGrid','expTimeline']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  var mo = new MutationObserver(function () {
    initStaggerFadeIn();
    var grid = document.getElementById('projectsGrid');
    if (grid && grid.children.length > 0) hideProjectSkeleton();
  });

  targets.forEach(function (t) { mo.observe(t, { childList: true }); });
}


// ============================================================
// SECTION 19 · DATA — PROJECTS
// ============================================================

var projectsData = [
  // ── INDUSTRY PROJECTS ──
  {
    icon: 'fa-store', sector: 'Retail · Branding',
    title: 'Retail Store Signage Rollouts',
    challenge: 'Deliver complete, on-brand signage solutions for high-footfall retail environments where visual identity and installation precision are non-negotiable.',
    solution:  'Managed full project lifecycle from client brief to final installation — including illuminated 3D channel letters, acrylic lightboxes, and full storefront branding packages.',
    impact:    'Multiple retail clients delivered on schedule. Zero rework due to pre-installation site measurements. Repeat business secured through relationship management.',
    tools:     ['3D Channel Letters','Acrylic Lightboxes','Storefront Branding','Site Measurement','Client Coordination','Production Follow-up']
  },
  {
    icon: 'fa-building', sector: 'Commercial · F&B · Hospitality',
    title: 'Gyms, Restaurants, Cafés & Hotels',
    challenge: 'Execute diverse signage briefs across F&B, fitness, and hospitality verticals — each with unique brand standards, material requirements, and tight installation windows.',
    solution:  'Delivered tailored signage solutions including hoardings, indoor/outdoor branding, vinyl applications, and illuminated displays across gyms, restaurants, cafés, offices, and hotel properties.',
    impact:    'Consistently met brand specifications across all verticals. Successfully coordinated multi-trade installations to avoid business disruption.',
    tools:     ['Hoardings & Banners','Vinyl Graphics','LED Modules','Indoor Branding','Outdoor Signage','Material Specification']
  },
  {
    icon: 'fa-city', sector: 'Residential · Infrastructure · Abu Dhabi',
    title: 'Villa Community — Abu Dhabi Site Management',
    challenge: 'Oversee signage installation across an entire villa community in Abu Dhabi, coordinating multiple installation crews across dozens of units simultaneously.',
    solution:  'Conducted full site inspections and measurements pre-installation, coordinated installer teams on-ground, and ensured correct placement and quality of all community signage elements.',
    impact:    'All community signage delivered to specification. Site managed without delays. Quality sign-off achieved across all villa units.',
    tools:     ['Site Inspection','Installer Coordination','Quality Control','Measurement & Layout','Community Wayfinding','Project Scheduling']
  },
  // ── ACADEMIC / TECHNICAL PROJECTS ──
  {
    icon: 'fa-hands', sector: 'AI · Machine Learning · Academic',
    title: 'AI-Based Hand Sign Language Translator',
    challenge: 'Build an accessible, real-time AI system capable of recognising hand sign language and translating gestures into readable text — bridging communication gaps for the deaf community.',
    solution:  'Developed a CNN-based image recognition model trained on hand sign datasets using Python and Jupyter Notebook. Integrated Gradio for image-based interaction and planned real-time video recognition via FastAPI. Designed a clean frontend using HTML, CSS, JavaScript, and Vue.js.',
    impact:    'Successfully trained and deployed an image-based sign recognition model. Gradio interface enabled easy testing and demonstration. Frontend prototype built and functional.',
    tools:     ['Python','CNN (Deep Learning)','Jupyter Notebook','Gradio','FastAPI','HTML/CSS/JS','Vue.js','Image Recognition']
  },
  {
    icon: 'fa-code', sector: 'Web Development · Frontend',
    title: 'Frontend Web Development Projects',
    challenge: 'Design and build responsive, modern web interfaces that are intuitive, accessible, and visually polished across all device sizes.',
    solution:  'Built multiple responsive websites using HTML, CSS, and JavaScript with a focus on clean UI/UX principles. Currently developing proficiency in Vue.js for component-based modern web development.',
    impact:    'Delivered functional and visually refined web projects. Established a strong foundation in frontend development and modern JS frameworks.',
    tools:     ['HTML5','CSS3','JavaScript','Vue.js','Responsive Design','UI/UX Principles']
  }
];

function loadProjects() {
  var grid = document.getElementById('projectsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  projectsData.forEach(function (p, i) {
    var card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', i * 100);
    card.innerHTML =
      '<div class="pc-header"><div class="pc-icon"><i class="fas ' + p.icon + '"></i></div><span class="pc-sector-tag">' + p.sector + '</span></div>' +
      '<h3 class="pc-title">' + p.title + '</h3>' +
      '<div class="pc-challenge-solution">' +
        '<div class="pc-block"><span class="pc-block-label challenge"><i class="fas fa-triangle-exclamation"></i> The Challenge</span><p class="pc-block-text">' + p.challenge + '</p></div>' +
        '<div class="pc-block"><span class="pc-block-label solution"><i class="fas fa-circle-check"></i> The Solution</span><p class="pc-block-text">' + p.solution + '</p></div>' +
      '</div>' +
      '<div class="pc-impact"><strong><i class="fas fa-chart-line"></i> Impact</strong>' + p.impact + '</div>' +
      '<div class="pc-tools">' + p.tools.map(function (t) { return '<span class="pc-tool-badge">' + t + '</span>'; }).join('') + '</div>' +
      (p.letter ? '<a href="' + p.letter.url + '" target="_blank" rel="noopener noreferrer" class="pc-link"><i class="fas fa-file-contract"></i> ' + p.letter.text + '<i class="fas fa-arrow-up-right-from-square" style="margin-left:auto;"></i></a>' : '');
    grid.appendChild(card);
  });
}


// ============================================================
// SECTION 20 · DATA — EXPERIENCE
// ============================================================

var experienceData = [

  {
    date: '2023 – Present',
    title: 'Sales Executive',
    type: 'Full-Time',
    company: 'Graphics Sign LLC · Sharjah, UAE',

    stats: [
      { icon: 'fa-store',              value: '50+',  label: 'Projects Delivered' },
      { icon: 'fa-city',               value: '5+',   label: 'Industry Verticals' },
      { icon: 'fa-screwdriver-wrench', value: '100%', label: 'End-to-End Managed' },
      { icon: 'fa-handshake',          value: 'UAE',  label: 'Sharjah & Abu Dhabi' }
    ],

    projects: [
      {
        icon: 'fa-dumbbell',
        label: 'Gyms & Fitness Centres',
        color: '#1a6b4a',
        gradient: 'linear-gradient(135deg,#1a6b4a,#27ae60)',
        detail: 'Wall graphics · LED signage · Branding installs'
      },
      {
        icon: 'fa-utensils',
        label: 'Restaurants & Cafés',
        color: '#b07d2e',
        gradient: 'linear-gradient(135deg,#b07d2e,#f0a500)',
        detail: 'Fascia signs · 3D letters · Interior branding'
      },
      {
        icon: 'fa-building',
        label: 'Offices & Commercial',
        color: '#1a6b8a',
        gradient: 'linear-gradient(135deg,#1a6b8a,#2196f3)',
        detail: 'Directory boards · Reception signage · Hoardings'
      },
      {
        icon: 'fa-hotel',
        label: 'Hotels & Hospitality',
        color: '#6c3483',
        gradient: 'linear-gradient(135deg,#6c3483,#9b59b6)',
        detail: 'Wayfinding systems · Lobby branding · Room IDs'
      },
      {
        icon: 'fa-city',
        label: 'Villa Community — Abu Dhabi',
        color: '#c0551a',
        gradient: 'linear-gradient(135deg,#c0551a,#e8793a)',
        detail: 'Full site managed · Installer coordination · AUH'
      },
      {
        icon: 'fa-store',
        label: 'Retail & Storefront',
        color: '#1a6b4a',
        gradient: 'linear-gradient(135deg,#0d4a32,#1a6b4a)',
        detail: 'Lightboxes · Channel letters · Storefront branding'
      }
    ],

    responsibilities: [
      '<b>End-to-End Project Management:</b> Handled complete signage projects from client brief and site visit through design coordination, production follow-up, and final installation supervision.',
      '<b>Client Consultation & Quotation:</b> Understood client requirements for retail, commercial, F&B, and hospitality sectors — preparing accurate quotations for 3D letters, lightboxes, hoardings, and vinyl graphics.',
      '<b>Site Inspection & Measurement:</b> Conducted on-site visits and precise measurements to ensure correct specification before production, eliminating costly rework.',
      '<b>Design & Production Coordination:</b> Liaised between clients, in-house designers, and production teams to ensure brand accuracy and material quality across all deliverables.',
      '<b>Installation Supervision:</b> Managed installer teams on-site including the full villa community rollout in Abu Dhabi, ensuring correct placement, safety compliance, and quality sign-off.',
      '<b>Multi-Vertical Experience:</b> Delivered signage solutions across gyms, restaurants, cafés, offices, hotels, retail stores, and residential community projects throughout UAE.',
      '<b>Client Relationship Management:</b> Maintained strong client relationships to drive repeat business and referrals within the Sharjah and wider UAE market.',
      '<b>Material & Technical Knowledge:</b> Applied expertise in acrylic, aluminium, LED modules, and vinyl to advise clients on optimal material selection for their environment and budget.'
    ]
  }

];

function loadExperience() {
  var timeline = document.getElementById('expTimeline');
  if (!timeline) return;
  timeline.innerHTML = '';

  experienceData.forEach(function (exp, i) {
    var item = document.createElement('div');
    item.className = 'exp-item';
    item.setAttribute('data-aos', 'fade-up');
    item.setAttribute('data-aos-delay', i * 80);

    var statsHTML = exp.stats && exp.stats.length
      ? '<div class="exp-stats-strip">' + exp.stats.map(function (s, si) {
          return '<div class="exp-stat-chip" style="animation-delay:' + (si * 80) + 'ms">' +
            '<div class="esc-icon"><i class="fas ' + s.icon + '"></i></div>' +
            '<div class="esc-body"><span class="esc-value">' + s.value + '</span><span class="esc-label">' + s.label + '</span></div>' +
            '</div>';
        }).join('') + '</div>'
      : '';

    var projectsHTML = exp.projects && exp.projects.length
      ? '<div class="exp-projects-row">' + exp.projects.map(function (p, pi) {
          return '<div class="exp-project-box" style="--proj-color:' + p.color + ';background:' + (p.gradient || p.color) + ';animation-delay:' + (pi * 80) + 'ms">' +
            '<div class="epb-glow"></div>' +
            '<div class="epb-icon"><i class="fas ' + p.icon + '"></i></div>' +
            '<div class="epb-info"><span class="epb-label">' + p.label + '</span><span class="epb-detail">' + p.detail + '</span></div>' +
            '<div class="epb-shine"></div>' +
            '</div>';
        }).join('') + '</div>'
      : '';

    var lettersHTML = (exp.letters || []).map(function (l) {
      return '<a href="' + l.url + '" target="_blank" rel="noopener noreferrer" class="exp-btn">' +
        '<i class="fas fa-file-contract"></i>' + l.text + '</a>';
    }).join('');

    item.innerHTML =
      '<div class="exp-card">' +
        '<div class="exp-header">' +
          '<div class="exp-title-row">' +
            '<h3 class="exp-title">' + exp.title + '</h3>' +
            (exp.type ? '<span class="exp-type-badge">' + exp.type + '</span>' : '') +
          '</div>' +
          '<div class="exp-meta">' +
            '<span class="exp-date"><i class="fas fa-calendar-alt"></i> <b>' + exp.date + '</b></span>' +
            '<span class="exp-company-name">' + exp.company + '</span>' +
          '</div>' +
        '</div>' +
        statsHTML +
        projectsHTML +
        '<ul class="exp-list">' +
          exp.responsibilities.map(function (r) { return '<li>' + r + '</li>'; }).join('') +
        '</ul>' +
        (lettersHTML ? '<div class="exp-actions">' + lettersHTML + '</div>' : '') +
      '</div>';

    timeline.appendChild(item);
  });
}


// ============================================================
// SECTION 21 · DATA — TECHNICAL ARSENAL
// ============================================================

var arsenalData = [
  {
    id: 'webdev', icon: 'fa-code', title: 'Web Development', subtitle: 'Frontend · Frameworks · Design',
    color: '#3B82F6', span: false,
    tools: [
      { icon: 'fa-html5',        name: 'HTML5',         color: '#E34F26' },
      { icon: 'fa-css3-alt',     name: 'CSS3',          color: '#1572B6' },
      { icon: 'fa-js',           name: 'JavaScript',    color: '#F7DF1E' },
      { icon: 'fa-vuejs',        name: 'Vue.js',        color: '#42B883' },
      { icon: 'fa-mobile-alt',   name: 'Responsive Design', color: '#3B82F6' },
      { icon: 'fa-palette',      name: 'UI/UX Design',  color: '#8B5CF6' }
    ]
  },
  {
    id: 'ai', icon: 'fa-brain', title: 'AI & Python', subtitle: 'Machine Learning · Data · APIs',
    color: '#8B5CF6', span: false,
    tools: [
      { icon: 'fa-python',         name: 'Python',         color: '#3776AB' },
      { icon: 'fa-robot',          name: 'CNN / Deep Learning', color: '#8B5CF6' },
      { icon: 'fa-flask',          name: 'Jupyter Notebook', color: '#F37626' },
      { icon: 'fa-bolt',           name: 'FastAPI',         color: '#009688' },
      { icon: 'fa-image',          name: 'Gradio',          color: '#FF7C7C' },
      { icon: 'fa-diagram-project',name: 'Image Recognition',color: '#27AE60' }
    ]
  },
  {
    id: 'signage', icon: 'fa-sign-hanging', title: 'Signage Solutions', subtitle: 'Products · Materials · Fabrication',
    color: '#C9836A', span: false,
    tools: [
      { icon: 'fa-cube',          name: '3D Channel Letters', color: '#C9836A' },
      { icon: 'fa-lightbulb',     name: 'LED Lightboxes',     color: '#F59E0B' },
      { icon: 'fa-rectangle-ad',  name: 'Hoardings & Banners', color: '#E07B39' },
      { icon: 'fa-palette',       name: 'Vinyl Graphics',     color: '#3B82F6' },
      { icon: 'fa-layer-group',   name: 'Acrylic Signage',    color: '#06B6D4' },
      { icon: 'fa-medal',         name: 'Aluminium Fabrication', color: '#9AA3B2' }
    ]
  },
  {
    id: 'sales', icon: 'fa-handshake', title: 'Sales & Client Management', subtitle: 'Consultation · Quotation · Retention',
    color: '#27AE60', span: false,
    tools: [
      { icon: 'fa-comments',        name: 'Client Consultation',  color: '#27AE60' },
      { icon: 'fa-file-invoice',    name: 'Quotation Preparation', color: '#C9836A' },
      { icon: 'fa-rotate',          name: 'Repeat Business',       color: '#3B82F6' },
      { icon: 'fa-people-arrows',   name: 'Stakeholder Liaison',   color: '#8B5CF6' },
      { icon: 'fa-chart-line',      name: 'Revenue Growth',        color: '#EF4444' }
    ]
  },
  {
    id: 'tools', icon: 'fa-screwdriver-wrench', title: 'Tools & Software', subtitle: 'Design · Documentation · Planning',
    color: '#E07B39', span: false,
    tools: [
      { icon: 'fa-drafting-compass', name: 'AutoCAD (Basic)',  color: '#C9836A' },
      { icon: 'fa-pen-nib',          name: 'CorelDRAW',        color: '#8B5CF6' },
      { icon: 'fa-table',            name: 'Microsoft Excel',  color: '#27AE60' },
      { icon: 'fa-file-word',        name: 'MS Word / Docs',   color: '#3B82F6' }
    ]
  },
  {
    id: 'verticals', icon: 'fa-city', title: 'Industry Verticals', subtitle: 'Gyms · F&B · Offices · Hospitality · Residential',
    color: '#06B6D4', span: true,
    tools: [
      { icon: 'fa-dumbbell',  name: 'Gyms & Fitness',    color: '#27AE60' },
      { icon: 'fa-utensils',  name: 'Restaurants & Cafés', color: '#F59E0B' },
      { icon: 'fa-building',  name: 'Offices',            color: '#3B82F6' },
      { icon: 'fa-hotel',     name: 'Hotels',             color: '#8B5CF6' },
      { icon: 'fa-store',     name: 'Retail',             color: '#C9836A' },
      { icon: 'fa-city',      name: 'Villa Communities',  color: '#E07B39' }
    ]
  }
];

function loadArsenal() {
  var bento = document.getElementById('arsenalBento');
  if (!bento) return;
  arsenalData.forEach(function (cat, i) {
    var card = document.createElement('div');
    card.className = 'arsenal-category' + (cat.span ? ' span-2' : '');
    card.style.setProperty('--cat-color', cat.color);
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', i * 80);
    card.innerHTML =
      '<div class="ac-head"><div class="ac-icon"><i class="fas ' + cat.icon + '"></i></div>' +
      '<div><div class="ac-title">' + cat.title + '</div><div class="ac-subtitle">' + cat.subtitle + '</div></div></div>' +
      '<div class="ac-tools">' + cat.tools.map(function (t) {
        var fabIcons = ['fa-html5','fa-css3-alt','fa-js','fa-vuejs','fa-python','fa-react','fa-node-js','fa-git-alt','fa-github','fa-linux','fa-windows','fa-apple','fa-android','fa-docker','fa-npm','fa-wordpress','fa-figma','fa-bootstrap','fa-sass','fa-php','fa-java','fa-swift','fa-whatsapp','fa-instagram','fa-linkedin-in','fa-twitter','fa-youtube','fa-facebook'];
        var iconClass = fabIcons.indexOf(t.icon) !== -1 ? 'fab' : 'fas';
        return '<span class="tool-chip" style="--tool-color:' + t.color + '"><i class="' + iconClass + ' ' + t.icon + '"></i>' + t.name + '</span>';
      }).join('') + '</div>';
    bento.appendChild(card);
  });
}


// ============================================================
// SECTION 22 · DATA — LANGUAGES
// ============================================================

var languages = [
  { name: 'English',      level: 'Fluent'        },
  { name: 'Urdu',         level: 'Native'        },
  { name: 'Arabic',       level: 'Basic · Learning' }
];

function loadLanguages() {
  var grid = document.getElementById('langGrid');
  if (!grid) return;
  languages.forEach(function (l) {
    var card = document.createElement('div');
    card.className = 'lang-card';
    card.innerHTML = '<span class="lang-name">' + l.name + '</span><span class="lang-level">' + l.level + '</span>';
    grid.appendChild(card);
  });
}


// ============================================================
// SECTION 23 · DATA — CERTIFICATIONS
// ============================================================

var certData = [
{
  icon: 'fa-graduation-cap', title: 'An Introduction to the Research Process',
  desc: 'Earned certification in the research process, highlighting proficiency in systematic investigation and data analysis.',
  url: 'https://drive.google.com/file/d/1FddU92RtqHZoQT_tY1nIB_Ms-BkWYGa4/view?usp=sharing'
}
];

function loadCertifications() {
var grid = document.getElementById('certsGrid');
if (!grid) return;
certData.forEach(function (cert, i) {
  var frame = document.createElement('div');
  frame.className = 'cert-card';
  frame.setAttribute('data-aos', 'fade-up');
  frame.setAttribute('data-aos-delay', i * 80);
  frame.innerHTML =
    '<div class="cert-card-inner">' +
      '<div class="cc-icon"><i class="fas ' + cert.icon + '"></i></div>' +
      '<div class="cc-title">' + cert.title + '</div>' +
      '<div class="cc-desc">' + cert.desc + '</div>' +
      (cert.url ? '<a href="' + cert.url + '" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-sm"><i class="fas fa-eye"></i> View Certificate</a>' : '') +
    '</div>';
  grid.appendChild(frame);
});
}


// ============================================================
// SECTION 24 · CONSOLE SIGNATURE
// ============================================================

function printSignature() {
  console.log(
    '%c\u2628  AMMAR AHMED MUHAMMAD YOUSAF \u00B7 SALES EXECUTIVE · GRAPHICS SIGN LLC',
    'font-size:14px;font-weight:bold;color:#C9836A;background:#070f0b;padding:10px 22px;border-radius:4px;border-left:3px solid #C9836A;'
  );
  console.log('%cSignage Solutions · Web Development · AI Projects · Sharjah, UAE', 'font-size:11px;color:#4A5470;');
}


// ============================================================
// SECTION 25 · MOBILE NAVIGATION
// ============================================================

(function () {
  'use strict';

  var hamburger = document.getElementById('hamburger');
  var drawer    = document.getElementById('mobileDrawer');
  var panel     = document.getElementById('mobileDrawerPanel');
  var overlay   = document.getElementById('mobileDrawerOverlay');
  var closeBtn  = document.getElementById('mobileDrawerClose');
  var mobLinks  = drawer ? drawer.querySelectorAll('a.mob-link') : [];

  if (!hamburger || !drawer) return;

  var isOpen = false, lastFocused = null, scrollbarW = 0;

  function getScrollbarWidth() { return window.innerWidth - document.documentElement.clientWidth; }

  function openDrawer() {
    if (isOpen) return;
    isOpen = true; lastFocused = document.activeElement;
    scrollbarW = getScrollbarWidth();
    document.documentElement.style.setProperty('--scrollbar-width', scrollbarW + 'px');
    document.body.classList.add('drawer-open');
    drawer.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.removeAttribute('aria-hidden');
    requestAnimationFrame(function () { if (closeBtn) closeBtn.focus(); });
    document.addEventListener('keydown', trapFocus);
  }

  function closeDrawer() {
    if (!isOpen) return;
    isOpen = false;
    drawer.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    document.documentElement.style.removeProperty('--scrollbar-width');
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    document.removeEventListener('keydown', trapFocus);
  }

  function trapFocus(e) {
    if (e.key === 'Escape') { closeDrawer(); return; }
    if (e.key !== 'Tab') return;
    var focusable = panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
    else            { if (document.activeElement === last)  { e.preventDefault(); first.focus(); } }
  }

  function updateActiveLink() {
    var hash = window.location.hash || '#home';
    mobLinks.forEach(function (link) { link.classList.toggle('active', link.getAttribute('href') === hash); });
  }

  function initScrollSpy() {
    var sections = document.querySelectorAll('section[id], div[id]');
    if (!sections.length || !('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          mobLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { threshold: 0.35 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  hamburger.addEventListener('click', function () { isOpen ? closeDrawer() : openDrawer(); });
  if (closeBtn)  closeBtn.addEventListener('click', closeDrawer);
  if (overlay)   overlay.addEventListener('click', closeDrawer);

  mobLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeDrawer();
      mobLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
    });
  });

  document.addEventListener('touchstart', function (e) {
    if (isOpen && panel && !panel.contains(e.target) && e.target !== hamburger) closeDrawer();
  }, { passive: true });

  updateActiveLink();
  initScrollSpy();
  window.addEventListener('hashchange', updateActiveLink);

  window.mobileNav = { open: openDrawer, close: closeDrawer };
})();


// ============================================================
// SECTION 26 · LOGO DROPDOWN — Mobile nav quick-menu
// ============================================================

(function () {
  var wrapper  = document.getElementById('navLogoWrapper');
  var anchor   = document.getElementById('navLogoAnchor');
  var dropdown = document.getElementById('navLogoDropdown');
  var chevron  = document.getElementById('navLogoChevron');
  if (!wrapper || !anchor || !dropdown) return;

  var isOpen = false;
  function isMobile() { return window.innerWidth <= 768; }

  function openDropdown()  { isOpen = true;  dropdown.classList.add('open');    dropdown.setAttribute('aria-hidden','false'); if (chevron) chevron.classList.add('open'); }
  function closeDropdown() { isOpen = false; dropdown.classList.remove('open'); dropdown.setAttribute('aria-hidden','true');  if (chevron) chevron.classList.remove('open'); }

  anchor.addEventListener('click', function (e) {
    if (!isMobile()) return;
    e.preventDefault();
    isOpen ? closeDropdown() : openDropdown();
  });

  dropdown.querySelectorAll('.nld-link, .nld-resume').forEach(function (link) {
    link.addEventListener('click', closeDropdown);
  });

  document.addEventListener('click', function (e) {
    if (isOpen && !wrapper.contains(e.target)) closeDropdown();
  }, true);

  window.addEventListener('resize', function () {
    if (!isMobile() && isOpen) closeDropdown();
  });
})();