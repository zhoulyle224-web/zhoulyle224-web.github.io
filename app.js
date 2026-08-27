const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (!reducedMotion) {
  document.body.classList.add('motion-enabled');

  const entranceSelectors = [
    '.flora-navigation',
    '.flora-corner-title',
    '.flora-bottom-left',
    '.flora-bottom-right',
    '.flora-side-link',
    '.projects-ref-browser',
    '.projects-ref-card',
    '.projects-ref-background',
    '.about-ref-nav',
    '.about-resume-section',
    '.about-ref-visual-source',
    '.about-visual-panel',
    '.about-ref-footer',
    '.detail-clean-nav',
    '.detail-clean-copy > *',
    '.detail-clean-visual',
    '.contact-diagonal-stage',
    '.error-page main'
  ];
  const entranceItems = [...new Set(document.querySelectorAll(entranceSelectors.join(',')))];
  entranceItems.forEach((item, index) => {
    if (item.classList.contains('drift')) return;
    item.classList.add('motion-enter');
    item.style.setProperty('--motion-delay', `${Math.min(index % 7, 6) * 55}ms`);
  });
  const entranceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-motion-visible');
      entranceObserver.unobserve(entry.target);
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -3% 0px' });
  entranceItems.forEach((item) => entranceObserver.observe(item));

  const reactiveItems = document.querySelectorAll([
    '.button',
    '.projects-ref-card',
    '.about-ref-actions a',
    '.about-visual-panel',
    '.zbird-proof-shot',
    '.contact-diagonal-stage'
  ].join(','));
  reactiveItems.forEach((item) => {
    item.classList.add('motion-reactive');
    const sheen = document.createElement('i');
    sheen.className = 'motion-sheen';
    sheen.setAttribute('aria-hidden', 'true');
    item.append(sheen);
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      item.style.setProperty('--sheen-x', `${event.clientX - rect.left}px`);
      item.style.setProperty('--sheen-y', `${event.clientY - rect.top}px`);
    }, { passive: true });
  });

  const particleCanvas = document.createElement('canvas');
  particleCanvas.className = 'motion-particles';
  particleCanvas.setAttribute('aria-hidden', 'true');
  document.body.append(particleCanvas);
  const particleContext = particleCanvas.getContext('2d');
  let pixelRatio = 1;
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let ambientParticles = [];
  const trailParticles = [];

  const makeAmbientParticle = () => ({
    x: Math.random() * viewportWidth,
    y: Math.random() * viewportHeight,
    vx: (Math.random() - 0.5) * 0.16,
    vy: (Math.random() - 0.5) * 0.16 - 0.025,
    radius: 0.7 + Math.random() * 1.25,
    alpha: 0.09 + Math.random() * 0.16,
    phase: Math.random() * Math.PI * 2
  });
  const resizeParticleCanvas = () => {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    particleCanvas.width = Math.round(viewportWidth * pixelRatio);
    particleCanvas.height = Math.round(viewportHeight * pixelRatio);
    particleCanvas.style.width = `${viewportWidth}px`;
    particleCanvas.style.height = `${viewportHeight}px`;
    ambientParticles = Array.from(
      { length: Math.max(18, Math.min(34, Math.round(viewportWidth / 55))) },
      makeAmbientParticle
    );
  };
  resizeParticleCanvas();
  window.addEventListener('resize', resizeParticleCanvas, { passive: true });

  const pointer = { x: viewportWidth / 2, y: viewportHeight / 2, active: false };
  const current = { x: pointer.x, y: pointer.y };
  const lastTrail = { x: pointer.x, y: pointer.y };
  let cursor;
  let trackingLight;

  trackingLight = document.createElement('div');
  trackingLight.className = 'motion-tracking-light';
  trackingLight.setAttribute('aria-hidden', 'true');
  document.body.append(trackingLight);

  if (finePointer) {
    document.body.classList.add('has-custom-cursor');
    cursor = document.createElement('div');
    cursor.className = 'cursor-orbit';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.append(cursor);
  }

  const driftItems = [...document.querySelectorAll('.drift')];
  const addTrailParticle = (x, y) => {
    if (!finePointer || trailParticles.length > 42) return;
    const distance = Math.hypot(x - lastTrail.x, y - lastTrail.y);
    if (distance < 12) return;
    lastTrail.x = x;
    lastTrail.y = y;
    trailParticles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.48,
      vy: (Math.random() - 0.5) * 0.48,
      life: 1,
      size: 1.2 + Math.random() * 2.1,
      spin: Math.random() * Math.PI
    });
  };
  const addClickRing = (x, y) => {
    const ring = document.createElement('i');
    ring.className = 'motion-click-ring';
    ring.style.left = `${x}px`;
    ring.style.top = `${y}px`;
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(ring);
    ring.addEventListener('animationend', () => ring.remove(), { once: true });
  };

  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    document.body.classList.add('motion-pointer-active');
    addTrailParticle(event.clientX, event.clientY);
    if (cursor) {
      cursor.classList.add('is-visible');
      cursor.classList.toggle('is-interactive', Boolean(event.target.closest('a, button, input, textarea, select, [role="button"]')));
    }
  }, { passive: true });
  window.addEventListener('pointerleave', () => {
    pointer.active = false;
    document.body.classList.remove('motion-pointer-active');
    if (cursor) cursor.classList.remove('is-visible');
  });
  window.addEventListener('pointerdown', () => {
    if (cursor) cursor.classList.add('is-down');
  });
  window.addEventListener('pointerup', (event) => {
    if (cursor) {
      cursor.classList.remove('is-down');
      cursor.classList.remove('is-pulse');
      void cursor.offsetWidth;
      cursor.classList.add('is-pulse');
    }
    addClickRing(event.clientX, event.clientY);
  });

  const drawParticles = (time) => {
    particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    particleContext.clearRect(0, 0, viewportWidth, viewportHeight);
    ambientParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < -20) particle.x = viewportWidth + 20;
      if (particle.x > viewportWidth + 20) particle.x = -20;
      if (particle.y < -20) particle.y = viewportHeight + 20;
      if (particle.y > viewportHeight + 20) particle.y = -20;
      const pulse = 0.72 + Math.sin(time * 0.0008 + particle.phase) * 0.28;
      particleContext.beginPath();
      particleContext.fillStyle = `rgba(20, 20, 212, ${particle.alpha * pulse})`;
      particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      particleContext.fill();
    });
    for (let index = trailParticles.length - 1; index >= 0; index -= 1) {
      const particle = trailParticles[index];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy -= 0.008;
      particle.life -= 0.025;
      particle.spin += 0.035;
      if (particle.life <= 0) {
        trailParticles.splice(index, 1);
        continue;
      }
      particleContext.save();
      particleContext.translate(particle.x, particle.y);
      particleContext.rotate(particle.spin);
      particleContext.fillStyle = `rgba(20, 20, 212, ${particle.life * 0.38})`;
      const size = particle.size * particle.life;
      particleContext.fillRect(-size / 2, -size / 2, size, size);
      particleContext.restore();
    }
  };

  const renderMotion = (time) => {
    current.x += (pointer.x - current.x) * 0.16;
    current.y += (pointer.y - current.y) * 0.16;
    if (cursor) cursor.style.translate = `${current.x}px ${current.y}px`;
    trackingLight.style.translate = `${current.x}px ${current.y}px`;
    const normalizedX = (current.x / Math.max(viewportWidth, 1) - 0.5) * 2;
    const normalizedY = (current.y / Math.max(viewportHeight, 1) - 0.5) * 2;
    driftItems.forEach((item) => {
      const depth = Number(item.dataset.depth || 1);
      item.style.translate = `${normalizedX * depth * 9}px ${normalizedY * depth * 7}px`;
    });
    drawParticles(time);
    window.requestAnimationFrame(renderMotion);
  };
  window.requestAnimationFrame(renderMotion);
}

const projectData = {
  websign: {
    index: '01',
    title: 'INTERLINKED',
    description: '这是一个末世生存+回合制卡牌战斗游戏，核心流程是：\n\n玩家先在基地经营设施、制造物品并培养角色，然后组建队伍外出远征。远征途中会探索区域、遭遇事件和敌人，并进入卡牌战斗。',
    summary: '战斗结果会影响角色状态和战利品，玩家需要决定继续冒险还是撤回基地。回到基地后，资源和成长成果会被结算，用于下一轮发展。',
    featureLabel: '游戏主要包含：',
    features: '• 基地经营、设施建设与资源生产\n• 角色生命、体力、饱食度、侵蚀和伤病管理\n• 区域探索、路线选择和随机遭遇\n• 卡牌战斗、敌人 AI 与战斗编组\n• 战利品积累、风险抉择和撤退结算\n• 内容解锁、角色成长与存档读档',
    mediumLabel: '网页说明：',
    mediums: '网页本身是一份游戏开发架构说明，介绍基地、远征和战斗系统如何连接，以及 UI、内容、本地化和存档的开发安排。目前项目已完成基础架构，之后再接通完整的真实游戏循环。',
    linkLabel: 'VISIT INTERLINKED ↗',
    repo: 'https://interlinked.zhoulyle224.workers.dev/',
    prev: 'warehouse',
    next: 'zbird'
  },
  zbird: {
    index: '02',
    title: 'ZBIRD TEMU',
    description: '面向 Temu 商家后台的 Manifest V3 自动化扩展，以每页 50 条处理 SPU，并贯通合规信息、实拍图、SKU 采集、JIT 开通与库存工作簿导入。',
    summary: '控制台集中呈现任务资源、运行状态、暂停、跳过、停止与实时日志；流程在关键节点执行范围校验，异常批次可记录、跳过并继续后续任务。',
    featureLabel: '真实业务流程：',
    features: '• SPU 查询与完整范围校验\n• 合规信息和实拍图批量处理\n• SKU 采集与分页状态恢复\n• JIT 批量开通及成功验证\n• 库存工作簿生成、归档与导入',
    mediumLabel: '交付构成：',
    mediums: '• 业务扩展 v1.4.49\n• Manifest V3\n• 本地文件 SDK 平台 v2.4.1\n• Automation Bridge\n• 实时日志与任务恢复',
    linkLabel: 'VIEW REPOSITORY ↗',
    repo: 'https://github.com/zhoulyle224-web/zbird-temu-automation',
    prev: 'websign',
    next: 'zhixue'
  },
  zhixue: {
    index: '03',
    title: 'ZHIXUE',
    description: '连接学生学习与教师教学的双端智能工作台。学生管理课程、问题与复习任务，教师回应真实需求并规划教学行动；数据保存在浏览器中并支持导出恢复。',
    summary: '以学生问题和教师行动为核心建立双向信息循环，让课程、复习和教学计划在同一套清晰界面中持续更新。',
    features: '[DUAL WORKSPACE]\n[COURSE PLANNING]\n[QUESTION LOOP]\n[LOCAL DATA EXPORT]',
    mediums: '[AI EDUCATION]\n[INTERFACE SYSTEM]\n[LOCAL-FIRST DATA]\n[FRONT-END]',
    linkLabel: 'VISIT ZHIXUE ↗',
    repo: 'https://zhixue-dual-engine-2026.zhoulyle.chatgpt.site/',
    prev: 'zbird',
    next: 'warehouse'
  },
  warehouse: {
    index: '04',
    title: 'OVERSEAS WAREHOUSE',
    description: '跨境电商海外仓库存、销量、在途物流与智能补货管理系统。项目从业务架构、数据库、API、需求验收到部署流程建立清晰分区，为后续前后端实现提供可验证的系统基线。',
    summary: '围绕库存、销量、在途物流和补货决策建立统一数据关系，通过模块分区与清晰状态降低跨境仓储管理复杂度。',
    features: '[INVENTORY CONTROL]\n[SALES FORECAST]\n[INBOUND LOGISTICS]\n[SMART REPLENISHMENT]',
    mediums: '[SYSTEM DESIGN]\n[JAVA + VUE]\n[MYSQL]\n[API ARCHITECTURE]',
    linkLabel: 'VIEW REPOSITORY ↗',
    repo: 'https://github.com/zhoulyle224-web/overseas-warehouse-management-system',
    prev: 'zhixue',
    next: 'websign'
  }
};

if (document.body.dataset.page === 'detail') {
  const key = new URLSearchParams(window.location.search).get('project') || 'websign';
  const project = projectData[key] || projectData.websign;
  document.body.dataset.project = key in projectData ? key : 'websign';
  const setText = (selector, value) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.textContent = value;
    });
  };
  setText('[data-project-title]', project.title);
  setText('[data-project-description]', project.description);
  setText('[data-project-summary]', project.summary);
  setText('[data-project-feature-label]', project.featureLabel || '[FEATURES]');
  setText('[data-project-features]', project.features);
  setText('[data-project-medium-label]', project.mediumLabel || '[MEDIUMS]');
  setText('[data-project-mediums]', project.mediums);
  setText('[data-project-index]', project.index);

  const repositoryLink = document.querySelector('[data-project-repo]');
  if (repositoryLink) {
    repositoryLink.href = project.repo;
    repositoryLink.textContent = project.linkLabel;
    if (repositoryLink.classList.contains('motion-reactive')) {
      const repositorySheen = document.createElement('i');
      repositorySheen.className = 'motion-sheen';
      repositorySheen.setAttribute('aria-hidden', 'true');
      repositoryLink.append(repositorySheen);
    }
  }
  const previous = document.querySelector('[data-prev-project]');
  const next = document.querySelector('[data-next-project]');
  if (previous) previous.href = `project.html?project=${project.prev}`;
  if (next) next.href = `project.html?project=${project.next}`;

  document.title = `${project.title}｜项目详情`;
  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) descriptionMeta.content = project.description;
  const titleMeta = document.querySelector('meta[property="og:title"]');
  if (titleMeta) titleMeta.content = `${project.title}｜项目详情`;
  const descriptionOpenGraph = document.querySelector('meta[property="og:description"]');
  if (descriptionOpenGraph) descriptionOpenGraph.content = project.description;
}
