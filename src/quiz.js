import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Product Match — an inline Y/N decision tree that swaps in place inside the
 * Product Selector section, ending on a recommended product with a
 * "Compare products" table. Copy/pricing/features transcribed from the
 * DBeaver-IO-AI Figma file (node 84:4976 tree, nodes 84:5175/5274/5401/
 * 5528/5678 result screens); Lite's figures are extrapolated to fit the
 * tier pattern since that result screen wasn't available to fetch.
 */

const TREE = {
  cli: {
    question: 'Do you want to work with databases from a CLI instead of a GUI?',
    no: 'team',
    yes: 'dbvr',
  },
  team: {
    question: 'Do you work on data with your team?',
    no: 'cloudInfra',
    yes: 'granularAccess',
  },
  cloudInfra: {
    question: 'Do you have infrastructure in AWS, GCP, or Azure?',
    no: 'adminDev',
    yes: 'ultimate',
  },
  adminDev: {
    question: 'Do you handle database admin or development tasks?',
    no: 'lite',
    yes: 'enterprise',
  },
  granularAccess: {
    question: 'Do you need granular access to data for your teammates?',
    no: 'cloudbeaverEnterprise',
    yes: 'teamEdition',
  },
};

const ROOT = 'cli';
const FILL_STEPS = ['2.2%', '40%', '80%', '100%'];

/**
 * Decorative 5x5 icon-badge grids flanking the first question's card (Figma
 * node 9641:59516, "Left grid" / "Right grid"). Every cell is a plain
 * light-grey square except the few listed here, which render as a white
 * shadowed badge holding one of the exported tool/database mark SVGs.
 */
const QUIZ_GRID_WHITE_CELLS = [
  { col: 2, row: 1 },
  { col: 1, row: 2 },
  { col: 5, row: 2 },
  { col: 3, row: 3 },
  { col: 4, row: 3 },
  { col: 1, row: 4 },
  { col: 4, row: 4 },
  { col: 2, row: 5 },
  { col: 5, row: 5 },
];

const QUIZ_GRID_ICONS = {
  left: [
    { col: 1, row: 3, src: '/assets/icons/quiz-grid/grid-1234.svg', w: 60, h: 50 },
    { col: 3, row: 1, src: '/assets/icons/quiz-grid/grid-iso-1.svg', w: 60, h: 59 },
    { col: 2, row: 4, src: '/assets/icons/quiz-grid/grid-iso-2.svg', w: 60, h: 59 },
    { col: 4, row: 5, src: '/assets/icons/quiz-grid/grid-group.svg', w: 60, h: 38 },
  ],
  right: [
    { col: 2, row: 1, src: '/assets/icons/quiz-grid/db-icon-logo.svg', w: 56, h: 56 },
    { col: 4, row: 2, src: '/assets/icons/quiz-grid/grid-iso-3.svg', w: 60, h: 59 },
    { col: 3, row: 5, src: '/assets/icons/quiz-grid/grid-iso-4.svg', w: 60, h: 60 },
  ],
};

function quizGrid(side) {
  const icons = QUIZ_GRID_ICONS[side];
  let cells = '';
  for (let row = 1; row <= 5; row++) {
    for (let col = 1; col <= 5; col++) {
      const badge = icons.find((i) => i.col === col && i.row === row);
      const isWhite = QUIZ_GRID_WHITE_CELLS.some((c) => c.col === col && c.row === row);
      cells += badge
        ? `<div class="quiz-grid__badge${badge.circle ? ' quiz-grid__badge--circle' : ''}"><img src="${badge.src}" alt="" style="width:${badge.w}px;height:${badge.h}px" /></div>`
        : `<div class="quiz-grid__cell${isWhite ? ' quiz-grid__cell--white' : ''}"></div>`;
    }
  }
  return `<div class="quiz-grid">${cells}</div>`;
}

const ICONS = {
  dbvr: '<img src="/assets/icons/quiz-results/dbvr.svg" alt="" />',
  ultimate: '<img src="/assets/icons/quiz-results/ultimate.svg" alt="" />',
  enterprise: '<img src="/assets/icons/quiz-results/enterprise.svg" alt="" />',
  lite: '<img src="/assets/icons/quiz-results/lite.svg" alt="" />',
  cloudbeaverEnterprise: '<img src="/assets/icons/quiz-results/cloudbeaver-enterprise.svg" alt="" />',
  teamEdition: '<img src="/assets/icons/quiz-results/team-edition.svg" alt="" />',
};

const COMPARE = {
  dbvr: {
    label: 'dbvr',
    price: '800',
    features: {
      Connectivity: ['SQL database support', 'NoSQL/BigData database support', 'MCP Server integration'],
      'Administration & Security': ['Advanced security'],
    },
  },
  dbvrCommunity: {
    label: 'dbvr Community',
    price: '0',
    features: {
      Connectivity: ['SQL database support'],
    },
  },
  ultimate: {
    label: 'DBeaver Ultimate',
    price: '510',
    features: {
      Connectivity: ['SQL database support', 'NoSQL/BigData database support', 'AWS, GCP and Azure native support', 'Cloud Explorer & Cloud Storage'],
      'Data & SQL Management': ['SQL Editor & Query History', 'Visual Query Builder', 'Data Editor', 'AI assistant (OpenAI, GitHub Copilot, Gemini, Ollama, Azure, Bedrock, Claude)', '@ai command', 'Tableau integration'],
      Development: ['Entity Relationship Diagrams', 'Mock data generation', 'Schema compare/migration', 'Sync projects to the Git repository'],
      'Administration & Security': ['Advanced security', 'Task management', 'Task scheduler', 'Data migration'],
    },
  },
  enterprise: {
    label: 'DBeaver Enterprise',
    price: '255',
    features: {
      Connectivity: ['SQL database support', 'NoSQL/BigData database support'],
      'Data & SQL Management': ['SQL Editor & Query History', 'Visual Query Builder', 'Data Editor', 'AI assistant (OpenAI, GitHub Copilot, Gemini, Ollama, Azure, Bedrock, Claude)', '@ai command', 'Tableau integration'],
      Development: ['Entity Relationship Diagrams', 'Mock data generation', 'Schema compare/migration', 'Sync projects to the Git repository'],
      'Administration & Security': ['Advanced security', 'Task management', 'Task scheduler', 'Data migration'],
    },
  },
  lite: {
    label: 'DBeaver Lite',
    price: '113',
    features: {
      Connectivity: ['SQL database support', 'NoSQL/BigData database support'],
      'Data & SQL Management': ['SQL Editor & Query History', 'Visual Query Builder', 'Data Editor', 'AI assistant (OpenAI, GitHub Copilot, Gemini, Ollama, Azure, Bedrock, Claude)', '@ai command'],
      Development: ['Entity Relationship Diagrams'],
      'Administration & Security': ['Advanced security'],
    },
  },
  dbeaverCommunity: {
    label: 'DBeaver Community',
    price: '0',
    features: {
      Connectivity: ['SQL database support'],
      'Data & SQL Management': ['SQL Editor & Query History', 'Data Editor', '@ai command'],
      Development: ['Entity Relationship Diagrams', 'Sync projects to the Git repository (plugin)'],
      'Administration & Security': ['Task management', 'Data migration'],
    },
  },
  cloudbeaverCommunity: {
    label: 'CloudBeaver Community',
    price: '0',
    features: {
      Connectivity: ['SQL database support'],
      'Data & SQL Management': ['SQL Editor & Query History', 'Data Editor'],
      Collaboration: ['Data collaboration in real time', 'Shared scripts and database connections'],
    },
  },
  cloudbeaverEnterprise: {
    label: 'CloudBeaver Enterprise',
    price: '1,025',
    features: {
      Connectivity: ['SQL database support', 'NoSQL/BigData database support', 'AWS, GCP and Azure native support', 'Cloud Explorer & Cloud Storage', 'MCP Server integration'],
      'Data & SQL Management': ['SQL Editor & Query History', 'Visual Query Builder', 'Data Editor', 'AI assistant (OpenAI, GitHub Copilot, Gemini, Ollama, Azure, Bedrock, Claude)', '@ai command'],
      Collaboration: ['Data collaboration in real time', 'Shared scripts and database connections'],
      Development: ['Entity Relationship Diagrams'],
      'Administration & Security': ['Advanced security', 'Audit logging & Query Manager'],
    },
  },
  teamEdition: {
    label: 'DBeaver Team Edition',
    price: '810',
    features: {
      Connectivity: ['SQL database support', 'NoSQL/BigData database support', 'AWS, GCP and Azure native support', 'Cloud Explorer & Cloud Storage', 'MCP Server integration'],
      'Data & SQL Management': ['SQL Editor & Query History', 'Visual Query Builder', 'Data Editor', 'AI assistant (OpenAI, GitHub Copilot, Gemini, Ollama, Azure, Bedrock, Claude)', '@ai command', 'Tableau integration'],
      Collaboration: ['Data collaboration in real time', 'Shared scripts and database connections', 'Advanced role management'],
      Development: ['Entity Relationship Diagrams', 'Mock data generation', 'Schema compare/migration', 'Sync projects to the Git repository'],
      'Administration & Security': ['Advanced security', 'Audit logging & Query Manager', 'Task management', 'Task scheduler', 'Data migration'],
    },
  },
};

// Canonical category order. Both compare columns place a given category on
// the same grid row (see .quiz-compare__cols), so "Connectivity" in one column
// lines up with "Connectivity" in the other even when the two products have
// different numbers of features — matching the Figma result screens, where
// both columns share identical category y positions (e.g. node 9665:13863).
const CATEGORY_ORDER = [
  'Connectivity',
  'Data & SQL Management',
  'Collaboration',
  'Development',
  'Administration & Security',
];

const RESULTS = {
  dbvr: {
    name: 'dbvr',
    description: 'A lightweight command-line client for scripting and automating database workflows without a GUI.',
    url: 'https://dbeaver.com/dbvr/',
    vs: 'dbvrCommunity',
  },
  ultimate: {
    name: 'DBeaver Ultimate',
    description: 'Work faster with your data using a streamlined desktop database management tool designed for individual users. Write SQL, analyze results, and create reports with a simplified interface. Skip administrative complexity while gaining powerful features like AI assistance and NoSQL support.',
    url: 'https://dbeaver.com/dbeaver-ultimate/',
    vs: 'enterprise',
  },
  enterprise: {
    name: 'DBeaver Enterprise',
    description: 'Adds enterprise-grade security, task management, and governance on top of the full admin and development toolset, so your DBAs can operate with confidence at scale.',
    url: 'https://dbeaver.com/dbeaver-enterprise/',
    vs: 'lite',
  },
  lite: {
    name: 'DBeaver Lite',
    description: 'A streamlined, easy-to-adopt desktop client for everyday querying and browsing across your databases, with the essentials for solo work at no cost.',
    url: 'https://dbeaver.com/dbeaver-lite/',
    vs: 'enterprise',
  },
  cloudbeaverEnterprise: {
    name: 'CloudBeaver Enterprise',
    description: 'Manage all your databases from anywhere securely with a single browser-based interface. No desktop setup required. Your team can connect through web browsers to work on the same databases together. It’s easy to control user group permissions in one place.',
    url: 'https://dbeaver.com/cloudbeaver-enterprise/',
    vs: 'teamEdition',
  },
  teamEdition: {
    name: 'DBeaver Team Edition',
    description: 'Transform how your team collaborates with data while maintaining enterprise-grade security and compliance. DBeaver Team Edition uses a client-server architecture. This gives your team a private, single database management solution in a web version and desktop app. Team Edition has granular access controls and comprehensive audit capabilities.',
    url: 'https://dbeaver.com/dbeaver-team-edition/',
    vs: 'cloudbeaverEnterprise',
  },
};

export function initQuiz() {
  const root = document.querySelector('[data-quiz-root]');
  if (!root) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let history = [];
  let gridScrollTrigger = null;
  // True while a step crossfade is in flight. Handlers pop `history` before
  // calling swapTo, so a second click landing mid-transition would pop twice
  // and hand renderStep an undefined key — TREE[undefined].question throws.
  // The result screen always shows Back, which makes a double-click there the
  // easiest way to hit it.
  let swapping = false;

  // The section's static "See detailed comparison" button only belongs on the
  // opening screen — every later step is mid-decision, and the result screen
  // ships its own "Detailed comparison page" link, so keeping it would show
  // two competing links to the same page. Driven off whichever step is
  // actually mounted rather than a counter, so Back restores it correctly.
  const compareBtn = document.querySelector('.product__compare-btn');

  function syncCompareBtn() {
    if (!compareBtn) return;
    const onFirstScreen = root.firstElementChild?.dataset.quizFirst !== undefined;
    compareBtn.classList.toggle('is-hidden', !onFirstScreen);
  }

  // Reveal the decorative badges in random order as the first screen's grid
  // scrolls into view (ScrollTrigger's stagger `from: "random"`), instead of
  // just being present on load. Deferred a frame so the trigger element is
  // actually attached/laid out before ScrollTrigger measures it.
  function animateGridBadges(stepEl) {
    const badges = stepEl.querySelectorAll('.quiz-grid__badge');
    if (!badges.length) return;

    if (prefersReducedMotion) {
      gsap.set(badges, { opacity: 1, scale: 1 });
      return;
    }

    gsap.set(badges, { opacity: 0, scale: 0.5 });

    requestAnimationFrame(() => {
      gridScrollTrigger?.kill();

      const tween = gsap.to(badges, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        stagger: { each: 0.06, from: 'random' },
        scrollTrigger: {
          trigger: stepEl.querySelector('.quiz-grid-row'),
          start: 'top 85%',
        },
      });
      gridScrollTrigger = tween.scrollTrigger;
    });
  }

  function progressBar(fillIndex, showBack) {
    return `
      <div class="quiz-progress">
        <div class="quiz-progress__track">
          <div class="quiz-progress__fill" style="width:${FILL_STEPS[Math.min(fillIndex, FILL_STEPS.length - 1)]}"></div>
        </div>
        ${showBack ? `<button class="quiz-back" type="button" data-back><img class="quiz-back__icon" src="/assets/icons/quiz-back-arrow.svg" alt="" />Back</button>` : ''}
      </div>
    `;
  }

  function renderStep(nodeKey) {
    const node = TREE[nodeKey];
    const isFirstScreen = nodeKey === ROOT && history.length === 0;
    const el = document.createElement('div');
    el.className = 'quiz-step';
    if (isFirstScreen) el.dataset.quizFirst = '';

    const card = `
      <div class="quiz-card">
        <p class="quiz-card__question">${node.question}</p>
        <div class="quiz-card__choices">
          <button class="quiz-pill quiz-pill--yes" type="button" data-answer="yes">Yes</button>
          <button class="quiz-pill quiz-pill--no" type="button" data-answer="no">No</button>
        </div>
      </div>
    `;

    // Always wrap the card in the same .quiz-grid-row box (see its
    // min-height in quiz.css) so the card/progress/title sit at the exact
    // same position on every step, whether or not this step shows the
    // decorative grid.
    el.innerHTML = `
      ${progressBar(history.length, history.length > 0)}
      <div class="quiz-grid-row">${isFirstScreen ? quizGrid('left') : ''}${card}${isFirstScreen ? quizGrid('right') : ''}</div>
    `;

    el.querySelectorAll('[data-answer]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (swapping) return;
        const next = node[btn.dataset.answer];
        history.push(nodeKey);
        if (TREE[next]) {
          swapTo(renderStep(next), 1);
        } else {
          swapTo(renderResult(next), 1);
        }
      });
    });

    const backBtn = el.querySelector('[data-back]');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        if (swapping || !history.length) return;
        const prev = history.pop();
        swapTo(renderStep(prev), -1);
      });
    }

    if (isFirstScreen) {
      animateGridBadges(el);
    }

    return el;
  }

  // One column of the comparison. Header is the product name on the left and
  // its price on the right (Figma "Frame 1250", e.g. node 9665:13534).
  function compareColumn(key) {
    const data = COMPARE[key];
    // `--row` drives grid-row so both columns share a row per category. Row 1
    // is the name/price header, so categories start at 2. Anything not in
    // CATEGORY_ORDER still renders, parked after the known rows.
    const categories = Object.entries(data.features)
      .map(([cat, items]) => {
        const idx = CATEGORY_ORDER.indexOf(cat);
        const row = (idx === -1 ? CATEGORY_ORDER.length : idx) + 2;
        return `
        <div class="quiz-compare__group" style="--row: ${row}">
          <p class="quiz-compare__cat">${cat}</p>
          <div class="quiz-compare__list">${items.map((f) => `<p>${f}</p>`).join('')}</div>
        </div>
      `;
      })
      .join('');

    return `
      <div class="quiz-compare__col">
        <div class="quiz-compare__pricing" style="--row: 1">
          <p class="quiz-compare__pricing-label">${data.label}</p>
          <div class="quiz-compare__price">
            <p><span>$</span>${data.price}</p>
          </div>
        </div>
        ${categories}
      </div>
    `;
  }

  function renderResult(key) {
    const result = RESULTS[key];
    const el = document.createElement('div');
    el.className = 'quiz-result';

    el.innerHTML = `
      ${progressBar(FILL_STEPS.length - 1, true)}
      <div class="quiz-grid-row">
        <div class="quiz-card quiz-card--result">
          <div class="quiz-result__icon-col">
            <div class="quiz-result__icon">${ICONS[key]}</div>
            <a class="quiz-pill quiz-pill--yes" href="${result.url}" target="_blank" rel="noopener">More</a>
          </div>
          <div class="quiz-result__body">
            <p class="quiz-result__name">${result.name}</p>
            <p class="quiz-result__desc">${result.description}</p>
          </div>
        </div>
      </div>
      <div class="quiz-compare">
        <p class="quiz-compare__title display">Compare products</p>
        <div class="quiz-compare__cols">
          ${compareColumn(key)}
          ${compareColumn(result.vs)}
        </div>
        <a class="quiz-detailed" href="https://dbeaver.com/edition/" target="_blank" rel="noopener">Detailed comparison page</a>
      </div>
    `;

    el.querySelector('[data-back]').addEventListener('click', () => {
      if (swapping || !history.length) return;
      const prev = history.pop();
      swapTo(renderStep(prev), -1);
    });
    return el;
  }

  // Everything except .quiz-progress crossfades between steps — the
  // progress bar/back button update instantly with no fade, since it's the
  // one piece of chrome that should read as "always there", not swapped.
  function stepBody(el) {
    return [...el.children].filter((child) => !child.classList.contains('quiz-progress'));
  }

  function swapTo(nextEl, direction) {
    if (prefersReducedMotion) {
      root.replaceChildren(nextEl);
      syncCompareBtn();
      return;
    }
    swapping = true;
    const current = root.firstElementChild;
    const tl = gsap.timeline({ onComplete: () => { swapping = false; } });
    if (current) {
      tl.to(stepBody(current), { opacity: 0, y: -12 * direction, duration: 0.18, ease: 'power2.in' });
    }
    const nextBody = stepBody(nextEl);
    tl.set(nextBody, { opacity: 0, y: 12 * direction });
    tl.add(() => {
      root.replaceChildren(nextEl);
      syncCompareBtn();
    });
    tl.to(nextBody, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'opacity' });
  }

  root.replaceChildren(renderStep(ROOT));
  syncCompareBtn();

  // Swapping steps changes this section's height — the result screen adds the
  // whole "Compare products" block (~1500px) — which pushes every later
  // section down. ScrollTrigger resolves its start/end to absolute pixel
  // offsets once and caches them, so without a refresh the How it works pin
  // still fires at the old offset and lands its card on top of the quiz.
  // rAF-debounced: refresh() recalculates every trigger, and ResizeObserver
  // fires on first observation and repeatedly during the crossfade.
  let refreshRaf;
  new ResizeObserver(() => {
    cancelAnimationFrame(refreshRaf);
    refreshRaf = requestAnimationFrame(() => ScrollTrigger.refresh());
  }).observe(root);
}
