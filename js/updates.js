document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.setAttribute('data-animate', 'true');
    item.style.transitionDelay = `${index * 80}ms`;
  });
});
