(() => {
  const body = document.body;
  if (!body || body.dataset.page !== 'about') return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const introItems = [
    document.querySelector('.about-ref-copy h1'),
    document.querySelector('.about-resume-tagline'),
    document.querySelector('.about-resume-contact')
  ].filter(Boolean);
  const sections = [...document.querySelectorAll('.about-resume-section')];
  const visualFrame = document.querySelector('.about-ref-visual-source');
  const panels = [...document.querySelectorAll('.about-visual-panel')];
  const actions = document.querySelector('.about-ref-actions');
  const footer = document.querySelector('.about-ref-footer');
  const nav = document.querySelector('.about-ref-nav');

  const prepare = (element, type, delay = 0) => {
    if (!element) return;
    element.classList.add('about-element-enter', type);
    element.style.setProperty('--about-element-delay', `${delay}ms`);
  };

  introItems.forEach((item, index) => prepare(item, index === 0 ? 'about-element-title' : 'about-element-intro', index * 70));
  sections.forEach((section, index) => prepare(section, 'about-element-section', (index % 2) * 45));
  panels.forEach((panel, index) => prepare(panel, 'about-element-panel', (index % 3) * 55));
  prepare(visualFrame, 'about-element-frame', 110);
  prepare(actions, 'about-element-actions');
  prepare(footer, 'about-element-footer');
  prepare(nav, 'about-element-nav');

  body.classList.add('about-elements-ready');

  const targets = [...introItems, visualFrame, nav, ...sections, ...panels, actions, footer].filter(Boolean);
  if (reducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((item) => item.classList.add('is-about-element-visible'));
    return;
  }

  requestAnimationFrame(() => {
    [nav, ...introItems, visualFrame].filter(Boolean).forEach((item) => item.classList.add('is-about-element-visible'));
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-about-element-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  [...sections, ...panels, actions, footer].filter(Boolean).forEach((item) => observer.observe(item));
})();
