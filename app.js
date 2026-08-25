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
