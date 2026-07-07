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

/* ── Bootstrap ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  injectFonts();

  await loadComponent('navbar', 'components/navbar.html');
  await loadComponent('footer', 'components/footer.html');

  initNav();
  initEntranceAnimations();
});
