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

  const interactiveItems = document.querySelectorAll('a[href], button, [role="button"]');
  interactiveItems.forEach((item) => {
    item.classList.add('motion-clickable');
    const release = () => item.classList.remove('is-motion-pressed');
    item.addEventListener('pointerdown', () => item.classList.add('is-motion-pressed'));
    item.addEventListener('pointerup', release);
    item.addEventListener('pointercancel', release);
    item.addEventListener('pointerleave', release);
    item.addEventListener('click', () => {
      item.classList.remove('is-motion-activated');
      void item.offsetWidth;
      item.classList.add('is-motion-activated');
      window.setTimeout(() => item.classList.remove('is-motion-activated'), 420);
    });
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
  let geometryBodies = [];

  const makeAmbientParticle = () => {
    const scaleRoll = Math.random();
    const radius = scaleRoll < 0.7
      ? 0.8 + Math.random() * 1.6
      : scaleRoll < 0.9
        ? 2.6 + Math.random() * 3.4
        : 6.5 + Math.random() * 5.5;
    return {
      x: Math.random() * viewportWidth,
      y: Math.random() * viewportHeight,
      vx: (Math.random() - 0.5) * (0.2 + 3 / Math.max(radius, 2)),
      vy: (Math.random() - 0.5) * (0.2 + 3 / Math.max(radius, 2)),
      radius,
      alpha: radius > 6 ? 0.12 + Math.random() * 0.1 : 0.18 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      kind: scaleRoll > 0.82 ? (Math.random() > 0.48 ? 'ring' : 'diamond') : 'dot'
    };
  };
  const geometryTypes = ['circle', 'triangle', 'diamond', 'hexagon', 'cross'];
  const makeGeometryBody = (index) => {
    const radius = 11 + Math.random() * 47;
    const direction = Math.random() * Math.PI * 2;
    const speed = 0.15 + Math.random() * 0.24;
    return {
      x: radius + Math.random() * Math.max(1, viewportWidth - radius * 2),
      y: radius + Math.random() * Math.max(1, viewportHeight - radius * 2),
      vx: Math.cos(direction) * speed,
      vy: Math.sin(direction) * speed,
      radius,
      angle: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.005,
      alpha: 0.12 + Math.random() * 0.14,
      type: geometryTypes[index % geometryTypes.length],
      hit: 0
    };
  };
  const largeGeometryAnchors = [
    [0.12, 0.2],
    [0.88, 0.3],
    [0.76, 0.82],
    [0.24, 0.78]
  ];
  const makeLargeGeometryBody = (index) => {
    const baseRadius = Math.max(34, Math.min(viewportWidth * 0.1, viewportHeight * 0.16));
    const radius = baseRadius * (0.88 + Math.random() * 0.24);
    const [anchorX, anchorY] = largeGeometryAnchors[index % largeGeometryAnchors.length];
    const direction = Math.random() * Math.PI * 2;
    const speed = 0.045 + Math.random() * 0.07;
    return {
      x: Math.max(radius, Math.min(viewportWidth - radius, viewportWidth * anchorX)),
      y: Math.max(radius, Math.min(viewportHeight - radius, viewportHeight * anchorY)),
      vx: Math.cos(direction) * speed,
      vy: Math.sin(direction) * speed,
      radius,
      angle: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.0018,
      alpha: 0.085 + Math.random() * 0.055,
      type: geometryTypes[(index + 1) % geometryTypes.length],
      hit: 0,
      large: true
    };
  };
  const resizeParticleCanvas = () => {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    particleCanvas.width = Math.round(viewportWidth * pixelRatio);
    particleCanvas.height = Math.round(viewportHeight * pixelRatio);
    particleCanvas.style.width = `${viewportWidth}px`;
    particleCanvas.style.height = `${viewportHeight}px`;
    ambientParticles = Array.from(
      { length: Math.max(68, Math.min(126, Math.round(viewportWidth / 13))) },
      makeAmbientParticle
    );
    const standardGeometryBodies = Array.from(
      { length: Math.max(10, Math.min(18, Math.round(viewportWidth / 86))) },
      (_, index) => makeGeometryBody(index)
    );
    const largeGeometryBodies = Array.from(
      { length: viewportWidth < 720 ? 2 : 4 },
      (_, index) => makeLargeGeometryBody(index)
    );
    geometryBodies = [...largeGeometryBodies, ...standardGeometryBodies];
  };
  resizeParticleCanvas();
  window.addEventListener('resize', resizeParticleCanvas, { passive: true });

  const pointer = { x: viewportWidth / 2, y: viewportHeight / 2 };
  const current = { x: pointer.x, y: pointer.y };
  let cursor;

  if (finePointer) {
    document.body.classList.add('has-custom-cursor');
    cursor = document.createElement('div');
    cursor.className = 'cursor-orbit';
    cursor.setAttribute('aria-hidden', 'true');
    document.body.append(cursor);
  }

  const driftItems = [...document.querySelectorAll('.drift')];
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
    if (cursor) {
      cursor.classList.add('is-visible');
      cursor.classList.toggle('is-interactive', Boolean(event.target.closest('a, button, input, textarea, select, [role="button"]')));
    }
  }, { passive: true });
  window.addEventListener('pointerleave', () => {
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

  const resolveGeometryCollisions = () => {
    for (let firstIndex = 0; firstIndex < geometryBodies.length; firstIndex += 1) {
      const first = geometryBodies[firstIndex];
      for (let secondIndex = firstIndex + 1; secondIndex < geometryBodies.length; secondIndex += 1) {
        const second = geometryBodies[secondIndex];
        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const minimumDistance = first.radius + second.radius;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared >= minimumDistance * minimumDistance) continue;
        const distance = Math.sqrt(distanceSquared) || 0.001;
        const normalX = dx / distance;
        const normalY = dy / distance;
        const overlap = minimumDistance - distance;
        const firstInverseMass = first.large ? 0.16 : 1;
        const secondInverseMass = second.large ? 0.16 : 1;
        const inverseMassTotal = firstInverseMass + secondInverseMass;
        first.x -= normalX * overlap * (firstInverseMass / inverseMassTotal);
        first.y -= normalY * overlap * (firstInverseMass / inverseMassTotal);
        second.x += normalX * overlap * (secondInverseMass / inverseMassTotal);
        second.y += normalY * overlap * (secondInverseMass / inverseMassTotal);
        const relativeVelocity = (second.vx - first.vx) * normalX + (second.vy - first.vy) * normalY;
        if (relativeVelocity < 0) {
          const impulse = -(1.72 * relativeVelocity) / inverseMassTotal;
          first.vx -= impulse * normalX * firstInverseMass;
          first.vy -= impulse * normalY * firstInverseMass;
          second.vx += impulse * normalX * secondInverseMass;
          second.vy += impulse * normalY * secondInverseMass;
        }
        first.hit = 1;
        second.hit = 1;
      }
    }
  };

  const traceGeometryPath = (body, scale = 0.78) => {
    particleContext.beginPath();
    if (body.type === 'circle') {
      particleContext.arc(0, 0, body.radius * scale, 0, Math.PI * 2);
    } else if (body.type === 'cross') {
      const arm = body.radius * scale;
      particleContext.moveTo(-arm, 0);
      particleContext.lineTo(arm, 0);
      particleContext.moveTo(0, -arm);
      particleContext.lineTo(0, arm);
    } else {
      const sides = body.type === 'triangle' ? 3 : body.type === 'diamond' ? 4 : 6;
      const offset = body.type === 'diamond' ? Math.PI / 4 : -Math.PI / 2;
      for (let side = 0; side < sides; side += 1) {
        const angle = offset + (Math.PI * 2 * side) / sides;
        const x = Math.cos(angle) * body.radius * scale;
        const y = Math.sin(angle) * body.radius * scale;
        if (side === 0) particleContext.moveTo(x, y);
        else particleContext.lineTo(x, y);
      }
      particleContext.closePath();
    }
  };

  const drawGeometryBody = (body) => {
    particleContext.save();
    particleContext.translate(body.x, body.y);
    particleContext.rotate(body.angle);
    traceGeometryPath(body, body.large ? 0.88 : 0.78);
    particleContext.lineWidth = (body.large ? 1.15 : 0.85) + body.hit * 0.8;
    particleContext.strokeStyle = `rgba(20, 20, 212, ${body.alpha + body.hit * 0.18})`;
    particleContext.stroke();
    if (body.large) {
      particleContext.setLineDash([5, 9]);
      traceGeometryPath(body, 0.62);
      particleContext.lineWidth = 0.7;
      particleContext.strokeStyle = `rgba(20, 20, 212, ${body.alpha * 0.65})`;
      particleContext.stroke();
    }
    particleContext.restore();
  };

  const drawParticles = (time) => {
    particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    particleContext.clearRect(0, 0, viewportWidth, viewportHeight);

    geometryBodies.forEach((body) => {
      body.x += body.vx;
      body.y += body.vy;
      body.angle += body.angularVelocity;
      body.hit *= 0.92;
      if (body.x < body.radius) {
        body.x = body.radius;
        body.vx = Math.abs(body.vx);
        body.hit = 1;
      } else if (body.x > viewportWidth - body.radius) {
        body.x = viewportWidth - body.radius;
        body.vx = -Math.abs(body.vx);
        body.hit = 1;
      }
      if (body.y < body.radius) {
        body.y = body.radius;
        body.vy = Math.abs(body.vy);
        body.hit = 1;
      } else if (body.y > viewportHeight - body.radius) {
        body.y = viewportHeight - body.radius;
        body.vy = -Math.abs(body.vy);
        body.hit = 1;
      }
    });
    resolveGeometryCollisions();

    ambientParticles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      if (particle.x < particle.radius || particle.x > viewportWidth - particle.radius) {
        particle.vx *= -1;
        particle.x = Math.max(particle.radius, Math.min(viewportWidth - particle.radius, particle.x));
      }
      if (particle.y < particle.radius || particle.y > viewportHeight - particle.radius) {
        particle.vy *= -1;
        particle.y = Math.max(particle.radius, Math.min(viewportHeight - particle.radius, particle.y));
      }
      geometryBodies.forEach((body) => {
        const dx = particle.x - body.x;
        const dy = particle.y - body.y;
        const minimumDistance = body.radius + particle.radius;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared >= minimumDistance * minimumDistance) return;
        const distance = Math.sqrt(distanceSquared) || 0.001;
        const normalX = dx / distance;
        const normalY = dy / distance;
        particle.x = body.x + normalX * minimumDistance;
        particle.y = body.y + normalY * minimumDistance;
        const incomingVelocity = (particle.vx - body.vx) * normalX + (particle.vy - body.vy) * normalY;
        if (incomingVelocity < 0) {
          particle.vx -= 1.65 * incomingVelocity * normalX;
          particle.vy -= 1.65 * incomingVelocity * normalY;
        }
        body.hit = Math.max(body.hit, 0.62);
      });
    });

    for (let firstIndex = 0; firstIndex < ambientParticles.length; firstIndex += 1) {
      const first = ambientParticles[firstIndex];
      for (let secondIndex = firstIndex + 1; secondIndex < ambientParticles.length; secondIndex += 1) {
        const second = ambientParticles[secondIndex];
        const dx = second.x - first.x;
        const dy = second.y - first.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 122) continue;
        particleContext.beginPath();
        particleContext.moveTo(first.x, first.y);
        particleContext.lineTo(second.x, second.y);
        particleContext.lineWidth = 0.62;
        particleContext.strokeStyle = `rgba(20, 20, 212, ${(1 - distance / 122) * 0.075})`;
        particleContext.stroke();
      }
    }

    ambientParticles.forEach((particle) => {
      const pulse = 0.72 + Math.sin(time * 0.0008 + particle.phase) * 0.28;
      particleContext.save();
      particleContext.translate(particle.x, particle.y);
      particleContext.beginPath();
      if (particle.kind === 'diamond') {
        particleContext.rotate(Math.PI / 4 + time * 0.00008);
        particleContext.rect(-particle.radius * 0.7, -particle.radius * 0.7, particle.radius * 1.4, particle.radius * 1.4);
        particleContext.strokeStyle = `rgba(20, 20, 212, ${particle.alpha * pulse})`;
        particleContext.lineWidth = 0.8;
        particleContext.stroke();
      } else if (particle.kind === 'ring') {
        particleContext.arc(0, 0, particle.radius, 0, Math.PI * 2);
        particleContext.strokeStyle = `rgba(20, 20, 212, ${particle.alpha * pulse})`;
        particleContext.lineWidth = 0.85;
        particleContext.stroke();
      } else {
        particleContext.arc(0, 0, particle.radius, 0, Math.PI * 2);
        particleContext.fillStyle = `rgba(20, 20, 212, ${particle.alpha * pulse})`;
        particleContext.fill();
      }
      particleContext.restore();
    });
    geometryBodies.forEach(drawGeometryBody);
  };

  const renderMotion = (time) => {
    current.x += (pointer.x - current.x) * 0.16;
    current.y += (pointer.y - current.y) * 0.16;
    if (cursor) cursor.style.translate = `${current.x}px ${current.y}px`;
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
