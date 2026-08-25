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

const canDrift = window.matchMedia('(pointer:fine) and (prefers-reduced-motion:no-preference)').matches;
if (canDrift) {
  const driftItems = [...document.querySelectorAll('.drift')];
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener('pointermove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    const x = (event.clientX / window.innerWidth - 0.5) * 2;
    const y = (event.clientY / window.innerHeight - 0.5) * 2;
    driftItems.forEach((item) => {
      const depth = Number(item.dataset.depth || 1);
      item.style.translate = `${x * depth * 7}px ${y * depth * 5}px`;
    });
  }, { passive: true });
  window.addEventListener('pointerleave', () => {
    driftItems.forEach((item) => {
      item.style.translate = '0px 0px';
    });
  });

  document.body.classList.add('has-custom-cursor');
  const cursor = document.createElement('div');
  cursor.className = 'cursor-orbit';
  cursor.setAttribute('aria-hidden', 'true');
  document.body.append(cursor);

  const current = { x: pointer.x, y: pointer.y };
  const renderCursor = () => {
    current.x += (pointer.x - current.x) * 0.2;
    current.y += (pointer.y - current.y) * 0.2;
    cursor.style.translate = `${current.x}px ${current.y}px`;
    window.requestAnimationFrame(renderCursor);
  };
  renderCursor();

  window.addEventListener('pointermove', (event) => {
    cursor.classList.add('is-visible');
    cursor.classList.toggle('is-interactive', Boolean(event.target.closest('a, button, input, textarea, select, [role="button"]')));
  }, { passive: true });
  window.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  window.addEventListener('pointerup', () => {
    cursor.classList.remove('is-down');
    cursor.classList.remove('is-pulse');
    void cursor.offsetWidth;
    cursor.classList.add('is-pulse');
  });
}

const projectData = {
  websign: {
    index: '01',
    title: 'INTERLINKED',
    category: 'WEB EXPERIENCE',
    year: '2026',
    role: 'Creative direction, visual system, front-end',
    tools: 'HTML, CSS, JavaScript, Vite',
    status: 'Prototype / Multi-page static site',
    description: '一个围绕游戏艺术指导、视觉系统与世界观研究建立的多页面实验档案。通过 Plan A / Plan B 双路线、模块化内容和动态几何语言，让作品集本身成为被展示的作品。',
    features: '[MULTI-PAGE ARCHIVE]\n[DUAL ROUTE SYSTEM]\n[MODULAR CONTENT]\n[DYNAMIC GEOMETRY]',
    mediums: '[WEB DESIGN]\n[FRONT-END]\n[ART DIRECTION]\n[VISUAL SYSTEM]',
    orbitTop: 'INTERLINKED SYSTEM · VISUAL IDENTITY · MODULAR ARCHIVE ·',
    orbitSide: 'PLAN A / PLAN B · STRUCTURE AND FREEDOM ·',
    linkLabel: 'VISIT INTERLINKED ↗',
    repo: 'https://interlinked.zhoulyle224.workers.dev/',
    image: 'assets/concept-detail.jpeg',
    imageAlt: 'Interlinked 实验性艺术指导拼贴',
    prev: 'warehouse',
    next: 'zbird'
  },
  zbird: {
    index: '02',
    title: 'ZBIRD TEMU',
    category: 'CHROME EXTENSION',
    year: '2026',
    role: 'Product workflow, automation logic, extension UX',
    tools: 'Chrome Manifest V3, JavaScript, Excel workflow',
    status: 'V1.0.21 / Operational automation tool',
    description: '面向 Temu 商家后台的自动化扩展，用于批量处理 50 个 SPU、补充合规信息、上传实拍图、复制 SKU，并根据库存模板导出 Excel。重点解决浏览器环境限制、文件上传和流程硬校验。',
    features: '[BATCH SPU PROCESSING]\n[IMAGE UPLOAD]\n[SKU AUTOMATION]\n[EXCEL EXPORT]',
    mediums: '[CHROME EXTENSION]\n[JAVASCRIPT]\n[WORKFLOW DESIGN]\n[DATA OPERATIONS]',
    orbitTop: 'AUTOMATION FLOW · BATCH OPERATIONS · RELIABLE EXECUTION ·',
    orbitSide: 'EXTENSION UX · INVENTORY DATA · OPERATIONAL CONTROL ·',
    linkLabel: 'VIEW REPOSITORY ↗',
    repo: 'https://github.com/zhoulyle224-web/zbird-temu-automation',
    image: 'assets/concept-projects.jpeg',
    imageAlt: '自动化扩展项目视觉拼贴',
    prev: 'websign',
    next: 'zhixue'
  },
  zhixue: {
    index: '03',
    title: 'ZHIXUE',
    category: 'AI EDUCATION',
    year: '2026',
    role: 'Product design, interface system, front-end',
    tools: 'HTML, CSS, JavaScript, local-first data',
    status: 'Student / Teacher dual workspace',
    description: '连接学生学习与教师教学的双端智能工作台。学生管理课程、问题与复习任务，教师回应真实需求并规划教学行动；数据保存在浏览器中并支持导出恢复。',
    features: '[DUAL WORKSPACE]\n[COURSE PLANNING]\n[QUESTION LOOP]\n[LOCAL DATA EXPORT]',
    mediums: '[AI EDUCATION]\n[INTERFACE SYSTEM]\n[LOCAL-FIRST DATA]\n[FRONT-END]',
    orbitTop: 'STUDENT SIGNALS · TEACHER ACTIONS · LEARNING LOOP ·',
    orbitSide: 'KNOWLEDGE SYSTEM · LOCAL DATA · DUAL PERSPECTIVE ·',
    linkLabel: 'VIEW REPOSITORY ↗',
    repo: 'https://github.com/zhoulyle224-web/zhixue',
    image: 'assets/concept-about.jpeg',
    imageAlt: '智学双擎项目视觉拼贴',
    prev: 'zbird',
    next: 'warehouse'
  },
  warehouse: {
    index: '04',
    title: 'OVERSEAS WAREHOUSE',
    category: 'SYSTEM DESIGN',
    year: '2026',
    role: 'Product architecture, data model, workflow planning',
    tools: 'Java, Vue, MySQL, system documentation',
    status: 'Architecture / Requirements baseline',
    description: '跨境电商海外仓库存、销量、在途物流与智能补货管理系统。项目从业务架构、数据库、API、需求验收到部署流程建立清晰分区，为后续前后端实现提供可验证的系统基线。',
    features: '[INVENTORY CONTROL]\n[SALES FORECAST]\n[INBOUND LOGISTICS]\n[SMART REPLENISHMENT]',
    mediums: '[SYSTEM DESIGN]\n[JAVA + VUE]\n[MYSQL]\n[API ARCHITECTURE]',
    orbitTop: 'WAREHOUSE DATA · INVENTORY FLOW · SYSTEM BASELINE ·',
    orbitSide: 'LOGISTICS NETWORK · REPLENISHMENT · VERIFIABLE MODEL ·',
    linkLabel: 'VIEW REPOSITORY ↗',
    repo: 'https://github.com/zhoulyle224-web/overseas-warehouse-management-system',
    image: 'assets/concept-home-clean.png',
    imageAlt: '海外仓系统项目视觉拼贴',
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
  setText('[data-project-category]', project.category);
  setText('[data-project-year]', project.year);
  setText('[data-project-role]', project.role);
  setText('[data-project-tools]', project.tools);
  setText('[data-project-status]', project.status);
  setText('[data-project-description]', project.description);
  setText('[data-project-features]', project.features);
  setText('[data-project-mediums]', project.mediums);
  setText('.detail-concept-orbit.orbit-top', project.orbitTop);
  setText('.detail-concept-orbit.orbit-side', project.orbitSide);
  setText('[data-project-index]', project.index);

  const repositoryLink = document.querySelector('[data-project-repo]');
  if (repositoryLink) {
    repositoryLink.href = project.repo;
    repositoryLink.textContent = project.linkLabel;
  }
  const projectImage = document.querySelector('[data-project-image]');
  if (projectImage) {
    projectImage.src = project.image;
    projectImage.alt = project.imageAlt;
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
  const imageMeta = document.querySelector('meta[property="og:image"]');
  if (imageMeta) imageMeta.content = new URL(project.image, window.location.href).href;
}
