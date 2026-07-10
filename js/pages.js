'use strict';

function animateElements(selector) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    setTimeout(() => {
      el.style.transition = 'opacity 400ms ease, transform 400ms ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 60 * i);
  });
}

function initPageReveals() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.page-section').forEach(el => observer.observe(el));
}

async function loadFeatureShowcase() {
  const target = document.getElementById('feature-showcase');
  if (!target) return;

  try {
    const res = await fetch('screenshots.json');
    if (!res.ok) throw new Error('Failed to load screenshots');
    const items = await res.json();

    target.innerHTML = items
      .map(
        item => `
      <article class="feature-showcase-item" data-animate>
        <div class="feature-showcase-item__content">
          <span class="feature-showcase-item__category">${item.category}</span>
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        </div>
        <div class="feature-showcase-item__visual">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
        </div>
      </article>`
      )
      .join('');

    animateElements('#feature-showcase [data-animate]');
  } catch {
    target.innerHTML =
      '<p style="color: var(--page-muted); text-align: center;">Feature showcase loading…</p>';
  }
}

async function loadReleaseTimeline() {
  const target = document.getElementById('release-timeline');
  if (!target) return;

  try {
    const res = await fetch('newupdates.json');
    if (!res.ok) throw new Error('Failed to load updates');
    const releases = await res.json();

    target.innerHTML = releases
      .map(
        release => `
      <article class="release-card" data-animate>
        <div class="release-card__header">
          <span class="release-card__version">${release.version}</span>
          <span class="release-card__date">${release.date}</span>
        </div>
        <h3>${release.title}</h3>
        <div class="release-card__body">
          <ul class="release-card__changelog">
            ${release.changelog.map(item => `<li>${item}</li>`).join('')}
          </ul>
          ${
            release.image
              ? `<div class="release-card__image"><img src="${release.image}" alt="${release.title}" loading="lazy" /></div>`
              : ''
          }
        </div>
      </article>`
      )
      .join('');

    animateElements('#release-timeline [data-animate]');
  } catch {
    target.innerHTML =
      '<p style="color: var(--page-muted); text-align: center;">Release timeline loading…</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPageReveals();
  loadFeatureShowcase();
  loadReleaseTimeline();
  animateElements('[data-animate]');
});
