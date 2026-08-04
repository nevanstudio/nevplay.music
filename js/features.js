document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.feature-card').forEach((card, index) => {
    card.setAttribute('data-animate', 'true');
    card.style.transitionDelay = `${index * 70}ms`;
  });
});
