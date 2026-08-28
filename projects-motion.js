(() => {
  const body = document.body;
  if (!body || body.dataset.page !== 'projects') return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = [...document.querySelectorAll('.projects-ref-card')];
  const header = document.querySelector('.projects-ref-browser');
  const backgroundTitle = document.querySelector('.projects-ref-background');
  const accents = [...document.querySelectorAll('.projects-ref-cross, .projects-ref-note')];
  const animatedElements = [header, ...cards, backgroundTitle, ...accents].filter(Boolean);
  const projectInteractive = [...cards, ...document.querySelectorAll('.projects-ref-browser nav a')];

  // Projects owns its entrance choreography. Remove the older generic entrance
  // classes so both systems can never animate the same element at once.
  animatedElements.forEach((element) => {
    element.classList.remove('motion-enter', 'is-motion-visible');
    element.style.removeProperty('--motion-delay');
  });
  projectInteractive.forEach((element) => {
    element.classList.remove('motion-clickable', 'is-motion-pressed', 'is-motion-activated');
  });

  const prepare = (element, type, delay = 0) => {
    if (!element) return;
    element.classList.add('project-element-enter', type);
    element.style.setProperty('--project-delay', `${delay}ms`);
  };

  prepare(header, 'project-element-header');
  cards.forEach((card, index) => {
    prepare(card, 'project-element-card', 90 + index * 85);
    card.style.setProperty('--project-entry-x', `${index % 2 === 0 ? -10 : 10}px`);
  });
  prepare(backgroundTitle, 'project-element-title', 180);
  accents.forEach((accent, index) => prepare(accent, 'project-element-accent', 140 + index * 45));

  body.classList.add('projects-elements-ready');

  const reveal = (element) => element.classList.add('is-project-element-visible');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    animatedElements.forEach(reveal);
    return;
  }

  requestAnimationFrame(() => reveal(header));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -3% 0px' });

  [...cards, backgroundTitle, ...accents].filter(Boolean).forEach((element) => observer.observe(element));
})();
