(() => {
  const body = document.body;
  if (!body || body.dataset.page !== 'about') return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const introItems = [
    document.querySelector('.about-ref-copy h1'),
    document.querySelector('.about-resume-tagline'),
    document.querySelector('.about-resume-contact')
  ].filter(Boolean);
  const sections = [...document.querySelectorAll('.about-resume-section')];
  const visualSource = document.querySelector('.about-ref-visual-source');
  const panels = [...document.querySelectorAll('.about-visual-panel')];
  const actions = document.querySelector('.about-ref-actions');
  const footer = document.querySelector('.about-ref-footer');

  introItems.forEach((item, index) => {
    item.classList.add('about-fx-enter', 'about-fx-intro');
    item.style.setProperty('--about-delay', `${index * 90}ms`);
  });
  sections.forEach((section, index) => {
    section.classList.add('about-fx-enter', 'about-fx-section');
    section.style.setProperty('--about-delay', `${(index % 2) * 65}ms`);
  });
  if (visualSource) visualSource.classList.add('about-fx-enter');
  panels.forEach((panel, index) => {
    panel.classList.add('about-fx-panel');
    panel.style.setProperty('--about-delay', `${(index % 2) * 70}ms`);
  });
  [actions, footer].filter(Boolean).forEach((item) => item.classList.add('about-fx-enter'));

  body.classList.add('about-motion-ready');

  requestAnimationFrame(() => {
    introItems.forEach((item) => item.classList.add('is-about-visible'));
    if (visualSource) visualSource.classList.add('is-about-visible');
  });

  const revealTargets = [...sections, ...panels, actions, footer].filter(Boolean);
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-about-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  revealTargets.forEach((item) => revealObserver.observe(item));

  const counterDefinitions = [
    { value: 95, decimals: 0, suffix: '%' },
    { value: 10, decimals: 0, suffix: 'K+' },
    { value: 30, decimals: 0, suffix: '+' },
    { value: 4.08, decimals: 2, suffix: '' },
    { value: 5, decimals: 0, suffix: '', pad: 2 }
  ];
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const panelIndex = panels.indexOf(element.closest('.about-visual-panel'));
      const definition = counterDefinitions[panelIndex];
      if (!definition) return;
      const finalNumber = definition.value.toFixed(definition.decimals);
      const finalText = `${finalNumber.padStart(definition.pad || 0, '0')}${definition.suffix}`;
      element.setAttribute('aria-label', finalText);
      const start = performance.now();
      const duration = 900;
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentValue = definition.value * eased;
        const numberText = definition.decimals
          ? currentValue.toFixed(definition.decimals)
          : String(Math.round(currentValue)).padStart(definition.pad || 0, '0');
        element.textContent = `${numberText}${definition.suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
        else {
          element.textContent = finalText;
          element.classList.add('is-counted');
        }
      };
      requestAnimationFrame(tick);
      observer.unobserve(element);
    });
  }, { threshold: 0.55 });
  panels.forEach((panel) => {
    const number = panel.querySelector('strong');
    if (number) counterObserver.observe(number);
  });

  const theory = document.querySelector('.about-ref-theory');
  if (theory && !theory.querySelector('.about-theory-track')) {
    const originalItems = [...theory.children];
    const track = document.createElement('div');
    track.className = 'about-theory-track';
    originalItems.forEach((item) => track.append(item));
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.append(clone);
    });
    theory.append(track);
  }
})();
