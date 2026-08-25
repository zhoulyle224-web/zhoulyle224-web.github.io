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
    description: '一个围绕游戏艺术指导、视觉系统与世界观研究建立的多页面实验档案。通过 Plan A / Plan B 双路线、模块化内容和动态几何语言，让作品集本身成为被展示的作品。',
    summary: '以多页面结构组织复杂内容，通过清晰网格、粗体排版与克莱因蓝建立统一视觉语言，并让导航、信息和作品展示形成连续体验。',
    features: '[MULTI-PAGE ARCHIVE]\n[DUAL ROUTE SYSTEM]\n[MODULAR CONTENT]\n[DYNAMIC GEOMETRY]',
    mediums: '[WEB DESIGN]\n[FRONT-END]\n[ART DIRECTION]\n[VISUAL SYSTEM]',
    linkLabel: 'VISIT INTERLINKED ↗',
    repo: 'https://interlinked.zhoulyle224.workers.dev/',
    prev: 'warehouse',
    next: 'zbird'
  },
  zbird: {
    index: '02',
    title: 'ZBIRD TEMU',
    description: '面向 Temu 商家后台的自动化扩展，用于批量处理 50 个 SPU、补充合规信息、上传实拍图、复制 SKU，并根据库存模板导出 Excel。重点解决浏览器环境限制、文件上传和流程硬校验。',
    summary: '将重复且容易出错的后台操作拆解成可验证步骤，通过批量处理、状态反馈和文件导出缩短商品运营流程。',
    features: '[BATCH SPU PROCESSING]\n[IMAGE UPLOAD]\n[SKU AUTOMATION]\n[EXCEL EXPORT]',
    mediums: '[CHROME EXTENSION]\n[JAVASCRIPT]\n[WORKFLOW DESIGN]\n[DATA OPERATIONS]',
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
    linkLabel: 'VIEW REPOSITORY ↗',
    repo: 'https://github.com/zhoulyle224-web/zhixue',
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
  setText('[data-project-features]', project.features);
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
