/* ═══════════════════════════════════════════════════════════
   NevPlay · main.js
   Component loader + Liquid Glass navigation controller
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Component loader ─────────────────────────────────── */
async function loadComponent(targetId, file) {
  const target = document.getElementById(targetId);
  if (!target) return;
  try {
    const res = await fetch(file);
    if (!res.ok) return;
    target.innerHTML = await res.text();
  } catch {
    /* silently ignore fetch errors (e.g. file:// protocol in some browsers) */
  }
}

/* ── Google Fonts preconnect ─────────────────────────── */
function injectFonts() {
  if (document.querySelector('link[href*="fonts.googleapis.com"]')) return;

  const pc1 = Object.assign(document.createElement('link'), {
    rel: 'preconnect', href: 'https://fonts.googleapis.com',
  });
  const pc2 = Object.assign(document.createElement('link'), {
    rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous',
  });
  document.head.append(pc1, pc2);
}

/* ── Liquid Glass Navigation controller ───────────────── */
function initNav() {
  /* ── Element references ─────────────────────────────── */
  const bar            = document.getElementById('np-bar');
  const linksRow       = document.getElementById('np-links-row');
  const glider         = document.getElementById('np-glider');
  const menuToggle     = document.getElementById('np-menu-toggle');
  const drawer         = document.getElementById('np-drawer');
  const drawerClose    = document.getElementById('np-drawer-close');
  const backdrop       = document.getElementById('np-backdrop');
  const searchTrigger  = document.getElementById('np-search-trigger');

  if (!bar || !menuToggle || !drawer || !backdrop) return;

  /* ══════════════════════════════════════════════════════
     1. Active link detection
     ══════════════════════════════════════════════════════ */
  const markActive = () => {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    const allLinks = document.querySelectorAll('.np-link, .np-dlink');
    allLinks.forEach(link => {
      const href = link.getAttribute('href') || '';
      if (!href || href.startsWith('mailto:') || href.startsWith('http')) return;
      const match = href === page || (page === '' && href === 'index.html');
      link.classList.toggle('active', match);
    });

    /* Position glider under the active desktop link */
    positionGlider();
  };

  /* ══════════════════════════════════════════════════════
     2. Active-indicator glider
     ══════════════════════════════════════════════════════ */
  const positionGlider = () => {
    if (!glider || !linksRow) return;

    const activeLink = linksRow.querySelector('.np-link.active');
    if (!activeLink) {
      glider.style.opacity = '0';
      return;
    }

    const rowRect  = linksRow.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    const leftOffset = linkRect.left - rowRect.left;

    glider.style.width   = `${linkRect.width}px`;
    glider.style.height  = `${linkRect.height}px`;
    glider.style.top     = `${linkRect.top - rowRect.top}px`;
    glider.style.left    = `${leftOffset}px`;
    glider.style.opacity = '1';
  };

  /* Reposition glider when hovering links */
  if (linksRow) {
    linksRow.querySelectorAll('.np-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        if (!glider) return;
        const rowRect  = linksRow.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        glider.style.width   = `${linkRect.width}px`;
        glider.style.height  = `${linkRect.height}px`;
        glider.style.top     = `${linkRect.top - rowRect.top}px`;
        glider.style.left    = `${linkRect.left - rowRect.left}px`;
        glider.style.opacity = '1';
      });
    });

    linksRow.addEventListener('mouseleave', () => {
      positionGlider();   /* snap back to active link on leave */
    });
  }

  /* ══════════════════════════════════════════════════════
     3. Scroll behaviour
     ══════════════════════════════════════════════════════ */
  const onScroll = () => {
    const scrolled = window.scrollY > 12;
    bar.classList.toggle('np-scrolled', scrolled);
    if (linksRow) linksRow.classList.toggle('np-scrolled', scrolled);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();   /* run once on load to capture initial scroll position */

  /* ══════════════════════════════════════════════════════
     4. Drawer open / close
     ══════════════════════════════════════════════════════ */
  const openDrawer = () => {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-visible');
    document.body.classList.add('np-drawer-open');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');

    /* Cascade nav items in with stagger */
    cascadeIn();
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-visible');
    document.body.classList.remove('np-drawer-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');

    /* Reset cascade so it re-plays next open */
    resetCascade();
  };

  menuToggle.addEventListener('click', () => {
    drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ── Close on resize to desktop ─────────────────────── */
  const mq = window.matchMedia('(min-width: 901px)');
  mq.addEventListener('change', e => { if (e.matches) closeDrawer(); });

  /* ══════════════════════════════════════════════════════
     5. Swipe-to-close (right-to-left swipe on drawer)
     ══════════════════════════════════════════════════════ */
  let touchStartX = 0;
  let touchStartY = 0;

  drawer.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  drawer.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
    /* Only swipe-close if horizontal motion is dominant and > 70px right */
    if (dx > 70 && dy < 60) closeDrawer();
  }, { passive: true });

  /* ══════════════════════════════════════════════════════
     6. Mobile search trigger — open drawer & focus search
     ══════════════════════════════════════════════════════ */
  if (searchTrigger) {
    searchTrigger.addEventListener('click', () => {
      openDrawer();
      requestAnimationFrame(() => {
        const inp = drawer.querySelector('.np-drawer__search input');
        if (inp) inp.focus();
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     7. Stagger cascade animation
     ══════════════════════════════════════════════════════ */
  const cascadeIn = () => {
    const items = drawer.querySelectorAll('[data-nav-item]');
    // Apply cascade-in class immediately to all items so they're all visible
    items.forEach((item, i) => {
      setTimeout(() => {
        item.classList.add('np-cascade-in');
      }, i * 46);  /* Reduced base delay to 0, faster stagger */
    });
  };

  const resetCascade = () => {
    const items = drawer.querySelectorAll('[data-nav-item]');
    items.forEach(item => item.classList.remove('np-cascade-in'));
  };

  /* ══════════════════════════════════════════════════════
     8. Ripple effect on drawer links
     ══════════════════════════════════════════════════════ */
  drawer.querySelectorAll('.np-dlink').forEach(link => {
    link.addEventListener('click', e => {
      const rect = link.getBoundingClientRect();
      const rx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      const ry = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      link.style.setProperty('--rx', rx);
      link.style.setProperty('--ry', ry);
    });
  });

  /* ══════════════════════════════════════════════════════
     9. Initialise
     ══════════════════════════════════════════════════════ */
  markActive();

  /* Reposition glider on window resize */
  window.addEventListener('resize', positionGlider, { passive: true });
}

/* ── [data-animate] entrance reveals ─────────────────── */
function initEntranceAnimations() {
  document.querySelectorAll('[data-animate]').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(12px)';
    setTimeout(() => {
      el.style.transition = 'opacity 240ms ease, transform 240ms ease';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
    }, 80 * i);
  });
}

/* ── Dynamic Hero Renderer & Interactive Animations ──────── */
async function initDynamicHero() {
  const heroLeftTarget = document.getElementById('hero-left-target');
  const heroRightTarget = document.getElementById('hero-right-target');
  const heroBgTarget = document.getElementById('hero-bg-target');
  const scrollIndicator = document.getElementById('hero-scroll-indicator');
  const canvas = document.getElementById('hero-canvas');

  if (!heroLeftTarget || !heroRightTarget) return;

  try {
    const res = await fetch('hero.json');
    if (!res.ok) throw new Error('Failed to load hero configuration');
    const data = await res.json();

    // 1. Select random background & mockup
    const randomBg = data.backgrounds[Math.floor(Math.random() * data.backgrounds.length)];
    const randomMockup = data.mockups[Math.floor(Math.random() * data.mockups.length)];

    // 2. Set Background
    if (heroBgTarget) {
      const bgImg = new Image();
      bgImg.src = randomBg;
      bgImg.onload = () => {
        heroBgTarget.style.backgroundImage = `url('${randomBg}')`;
        heroBgTarget.classList.add('is-loaded');
      };
    }

    // 3. Render Left Side Content
    let buttonsHtml = '';
    data.buttons.forEach(btn => {
      if (btn.primary) {
        buttonsHtml += `
          <a href="${btn.href}" class="hero-btn hero-btn--primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            ${btn.text}
          </a>
        `;
      } else {
        buttonsHtml += `
          <a href="${btn.href}" class="hero-btn hero-btn--secondary">
            ${btn.text}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        `;
      }
    });

    let pillsHtml = '';
    data.pills.forEach(pill => {
      pillsHtml += `<span class="hero-pill">${pill}</span>`;
    });

    let statsHtml = '';
    data.stats.forEach(stat => {
      statsHtml += `
        <div class="hero-stat-card">
          <strong>${stat.value}</strong>
          <span>${stat.label}</span>
        </div>
      `;
    });

    heroLeftTarget.innerHTML = `
      <div class="hero-badge">
        <span class="hero-badge-dot"></span>
        ${data.badge.text}
        <span class="hero-badge-version">${data.badge.version}</span>
      </div>
      <h1 class="hero-title">
        ${data.heading.prefix} <span class="hero-title-highlight">${data.heading.highlight}</span> ${data.heading.suffix}
      </h1>
      <p class="hero-desc">${data.description}</p>
      <div class="hero-buttons">
        ${buttonsHtml}
      </div>
      <div class="hero-pills">
        ${pillsHtml}
      </div>
      <div class="hero-stats">
        ${statsHtml}
      </div>
    `;

    // 4. Render Right Side (Phone Mockup & Floating Cards)
    let lyricsHtml = '';
    data.floating_cards.lyrics.forEach(lyric => {
      lyricsHtml += `<div class="lyric-row ${lyric.active ? 'active' : ''}">${lyric.text}</div>`;
    });

    heroRightTarget.innerHTML = `
      <div class="hero-phone-wrap" id="hero-phone-wrap">
        <div class="hero-phone">
          <img src="${randomMockup}" alt="NevPlay Android App Mockup" />
          <div class="phone-home-indicator"></div>
        </div>

        <!-- Float Card 1: Now Playing -->
        <div class="hero-float-card card-nowplaying" id="float-card-np">
          <div class="np-header">
            <div class="np-cover"></div>
            <div class="np-details">
              <strong>${data.floating_cards.now_playing.title}</strong>
              <span>${data.floating_cards.now_playing.artist}</span>
            </div>
          </div>
          <div class="np-progress-bar">
            <div class="np-progress-fill" style="width: ${data.floating_cards.now_playing.progress}"></div>
          </div>
          <div class="np-time">
            <span>${data.floating_cards.now_playing.time_current}</span>
            <span>${data.floating_cards.now_playing.time_total}</span>
          </div>
        </div>

        <!-- Float Card 2: Synced Lyrics -->
        <div class="hero-float-card card-lyrics" id="float-card-lyrics">
          ${lyricsHtml}
        </div>

        <!-- Float Card 3: AI recommendation -->
        <div class="hero-float-card card-recommend" id="float-card-recommend">
          <span class="ai-tag">${data.floating_cards.ai_recommendation.tag}</span>
          <div class="ai-song">
            <div class="ai-art"></div>
            <div class="ai-details">
              <strong>${data.floating_cards.ai_recommendation.title}</strong>
              <span>${data.floating_cards.ai_recommendation.match}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Trigger reveal class for floating cards
    setTimeout(() => {
      document.querySelectorAll('.hero-float-card').forEach(card => {
        card.classList.add('is-active');
      });
    }, 400);

    // 5. Interactive Canvas Particles
    if (canvas) {
      initParticles(canvas);
    }

    // 6. Interactive Mouse Parallax & Scroll Parallax
    initParallax();

    // 7. Scroll Indicator Fade Out
    window.addEventListener('scroll', () => {
      if (scrollIndicator) {
        const scrolled = window.scrollY > 40;
        scrollIndicator.classList.toggle('scrolled', scrolled);
      }
    }, { passive: true });

    // 8. Info Card Reveal Observer
    initRevealObserver();

  } catch (err) {
    console.error('Error rendering hero section:', err);
    // Graceful fallback content if JSON is missing or fails to parse
    heroLeftTarget.innerHTML = `
      <h1 class="hero-title">Your Local Music. <span class="hero-title-highlight">Beautifully Reimagined.</span></h1>
      <p class="hero-desc">Discover the premium local offline music experience on Android.</p>
      <div class="hero-buttons">
        <a href="download.html" class="hero-btn hero-btn--primary">Download Now</a>
      </div>
    `;
    heroRightTarget.innerHTML = `
      <div class="hero-phone-wrap">
        <div class="hero-phone">
          <div class="phone-home-indicator"></div>
        </div>
      </div>
    `;
  }
}

/* ── Lightweight Canvas Particle System ────────────────── */
function initParticles(canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const maxParticles = window.innerWidth < 768 ? 20 : 45;

  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + Math.random() * 20;
      this.size = Math.random() * 2.8 + 0.6;
      this.speed = Math.random() * 0.4 + 0.15;
      this.alpha = Math.random() * 0.4 + 0.15;
      this.decay = Math.random() * 0.002 + 0.0005;
      this.oscillationSpeed = Math.random() * 0.02 + 0.005;
      this.oscillationRange = Math.random() * 1.5 + 0.5;
      this.angle = Math.random() * Math.PI * 2;
    }

    update() {
      this.y -= this.speed;
      this.angle += this.oscillationSpeed;
      this.x += Math.sin(this.angle) * this.oscillationRange;
      this.alpha -= this.decay;

      if (this.y < -10 || this.alpha <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(122, 217, 80, ${this.alpha})`;
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = '#7ad950';
      ctx.fill();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }

  const loop = () => {
    const rect = canvas.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.shadowBlur = 0;
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
    }
    requestAnimationFrame(loop);
  };
  loop();
}

/* ── Mouse-move and Scroll Parallax ────────────────────── */
function initParallax() {
  const phoneWrap = document.getElementById('hero-phone-wrap');
  const orbs = document.querySelectorAll('.orb');
  const cardNp = document.getElementById('float-card-np');
  const cardLyrics = document.getElementById('float-card-lyrics');
  const cardRecommend = document.getElementById('float-card-recommend');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  const lerp = 0.08;

  window.addEventListener('mousemove', e => {
    targetX = (e.clientX / window.innerWidth) - 0.5;
    targetY = (e.clientY / window.innerHeight) - 0.5;
  }, { passive: true });

  const updateMouseParallax = () => {
    mouseX += (targetX - mouseX) * lerp;
    mouseY += (targetY - mouseY) * lerp;

    if (phoneWrap) {
      phoneWrap.style.transform = `rotateY(${mouseX * 16}deg) rotateX(${-mouseY * 12}deg) translate3d(${mouseX * 10}px, ${mouseY * 10}px, 0)`;
    }

    if (cardNp) cardNp.style.transform = `translate3d(${-mouseX * 25}px, ${-mouseY * 25}px, 0) rotate(1deg)`;
    if (cardLyrics) cardLyrics.style.transform = `translate3d(${-mouseX * 35}px, ${-mouseY * 35}px, 0) rotate(-1.5deg)`;
    if (cardRecommend) cardRecommend.style.transform = `translate3d(${-mouseX * 20}px, ${-mouseY * 20}px, 0) rotate(0.5deg)`;

    orbs.forEach((orb, index) => {
      const multiplier = (index + 1) * 35;
      orb.style.transform = `translate3d(${mouseX * multiplier}px, ${mouseY * multiplier}px, 0)`;
    });

    requestAnimationFrame(updateMouseParallax);
  };
  requestAnimationFrame(updateMouseParallax);

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;

    if (phoneWrap) {
      phoneWrap.style.transform = `translateY(${scrollY * 0.12}px)`;
    }
  }, { passive: true });
}

/* ── Section Reveal Observer ───────────────────────────── */
function initRevealObserver() {
  const options = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, options);

  document.querySelectorAll('.section-reveal').forEach(el => {
    observer.observe(el);
  });
}

/* ── Bootstrap ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  injectFonts();

  await loadComponent('navbar', 'components/navbar.html');
  await loadComponent('footer', 'components/footer.html');

  initNav();
  initEntranceAnimations();
  initDynamicHero();
});
