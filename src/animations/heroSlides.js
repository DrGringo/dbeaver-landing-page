import { gsap } from 'gsap';

/**
 * Hero showcase switcher: the dots under the card are the slide switch points.
 * One entry per slide — the dots are generated from this array, so adding a
 * slide here is all it takes for its switch point (and autoplay) to include it.
 *
 * Only "Cloud engineer" (node 9607:49796) has real hero-specific
 * caption/illustration from Figma. The other four reuse this project's real
 * "Who is it for" persona copy/art (src/index.html "roles" section) rather
 * than invented captions, until hero-specific slides 2-5 are exported.
 */
const SLIDES = [
  {
    label: 'Cloud engineer',
    caption:
      'View data side-by-side and query in one place. AI in DBeaver helps you write SQL faster and troubleshoot errors.',
    illustration: '/assets/illustrations/hero-cloud-engineer.svg',
    contain: true,
    textPosition: 'bottom-right-offset',
    artWidth: 'full',
    offsetY: -40,
    textOffsetY: -20,
  },
  {
    label: 'Developer',
    caption:
      'Query through a central server so passwords stay hidden and queries are logged. Control when AI is on and what metadata is sent.',
    illustration: '/assets/illustrations/developer.svg',
    contain: true,
    textPosition: 'top-right-offset',
    artWidth: 'full-80',
    textOffsetX: -20,
    textOffsetY: 20,
  },
  {
    label: 'Data engineer',
    caption:
      'Write a script once, then use AI in DBeaver to generate or adapt the SQL against different databases.',
    illustration: '/assets/illustrations/data-engineer.svg',
    contain: true,
    textPosition: 'top-right-down',
    artWidth: 'full-90-bottom',
    textOffsetX: -20,
    textOffsetY: 20,
  },
  {
    label: 'DBA',
    caption:
      'View data side-by-side and query in one place. AI in DBeaver helps you write SQL faster and troubleshoot errors.',
    illustration: '/assets/illustrations/dba.svg',
    contain: true,
    textPosition: 'top-center',
    artWidth: 'full-90',
    offsetY: 40,
    textOffsetY: 20,
  },
  {
    label: 'Analyst',
    caption:
      'Set up the SSH tunnel inside the connection itself, so a private database opens like any other.',
    illustration: '/assets/illustrations/analyst.svg',
    contain: true,
    textPosition: 'bottom-left',
    artWidth: 'full',
    offsetY: -10,
    scale: 1.1,
    textOffsetX: 20,
    textOffsetY: -20,
  },
];

const AUTOPLAY_MS = 4000;

export function initHeroSlides({ prefersReducedMotion }) {
  const showcase = document.querySelector('.hero__showcase');
  if (!showcase) return;

  const slide = showcase.querySelector('.hero__slide');
  const art = showcase.querySelector('[data-hero-art]');
  const caption = showcase.querySelector('[data-hero-caption]');
  const dotsWrap = showcase.querySelector('[data-hero-dots]');
  if (!slide || !art || !caption || !dotsWrap) return;

  function applyContainment(isContained) {
    slide.classList.toggle('is-contained', isContained);
    art.classList.toggle('hero__slide-art--contained', isContained);
  }

  function applyArtWidth(artWidth) {
    art.classList.toggle('hero__slide-art--full', artWidth === 'full');
    art.classList.toggle('hero__slide-art--full-80', artWidth === 'full-80');
    art.classList.toggle('hero__slide-art--full-90', artWidth === 'full-90');
    art.classList.toggle('hero__slide-art--full-90-bottom', artWidth === 'full-90-bottom');
  }

  function applyArtOffset(offsetY, scale) {
    const transforms = [];
    if (scale) {
      transforms.push(`scale(${scale})`);
    }
    if (offsetY) {
      transforms.push(`translateY(${offsetY}px)`);
    }
    art.style.transform = transforms.length ? transforms.join(' ') : '';
  }

  // Per-slide nudge on top of whatever corner the textPosition class parks
  // the caption in. `top-center` centres itself with translateX(-50%), so
  // that has to be folded into the inline transform or the caption jumps
  // right by half its width the moment an offset is applied.
  function applyTextOffset(offsetX, offsetY, textPosition) {
    const x = offsetX || 0;
    const y = offsetY || 0;
    if (!x && !y) {
      caption.style.transform = '';
      return;
    }
    const tx = textPosition === 'top-center' ? `calc(-50% + ${x}px)` : `${x}px`;
    caption.style.transform = `translate(${tx}, ${y}px)`;
  }

  function applyTextPosition(textPosition) {
    caption.classList.toggle('hero__slide-text--bottom-right', textPosition === 'bottom-right');
    caption.classList.toggle('hero__slide-text--bottom-right-offset', textPosition === 'bottom-right-offset');
    caption.classList.toggle('hero__slide-text--top-right', textPosition === 'top-right');
    caption.classList.toggle('hero__slide-text--top-right-offset', textPosition === 'top-right-offset');
    caption.classList.toggle('hero__slide-text--top-right-down', textPosition === 'top-right-down');
    caption.classList.toggle('hero__slide-text--bottom-left', textPosition === 'bottom-left');
    caption.classList.toggle('hero__slide-text--top-center', textPosition === 'top-center');
  }

  let index = 0;
  let animating = false;

  const dots = SLIDES.map((slideData) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'hero__dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', slideData.label);
    dotsWrap.appendChild(dot);
    return dot;
  });

  function syncDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  }

  function show(next) {
    if (animating || next === index) return;
    const data = SLIDES[next];

    const apply = () => {
      caption.textContent = data.caption;
      art.src = data.illustration;
      applyContainment(data.contain !== false);
      applyArtWidth(data.artWidth);
      applyArtOffset(data.offsetY, data.scale);
      applyTextPosition(data.textPosition);
      applyTextOffset(data.textOffsetX, data.textOffsetY, data.textPosition);
      index = next;
      syncDots();
    };

    if (prefersReducedMotion) {
      apply();
      return;
    }

    animating = true;
    gsap
      .timeline({ onComplete: () => { animating = false; } })
      .to([art, caption], { opacity: 0, duration: 0.2, ease: 'power2.in' })
      .add(apply)
      .to([art, caption], { opacity: 1, duration: 0.3, ease: 'power2.out' });
  }

  // Arrow keys move between switch points once one has focus.
  dotsWrap.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const dir = e.key === 'ArrowRight' ? 1 : -1;
    const next = (index + dir + SLIDES.length) % SLIDES.length;
    show(next);
    dots[next].focus();
    restartAutoplay();
  });

  // Autoplay: advance every 4s. Skipped entirely for reduced motion (a
  // self-running carousel is exactly the kind of motion that preference asks
  // us to avoid). `holds` tracks *why* it's currently paused (hovering, tab
  // hidden) so a manual dot-click can resume it without fighting a hold
  // that's still active — a plain stop/start pair can't tell the difference
  // between "resume because the user picked a slide" and "stay paused
  // because the mouse never left the card".
  let autoplayTimer = null;
  const holds = new Set();

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function startAutoplay() {
    if (prefersReducedMotion || SLIDES.length < 2 || autoplayTimer || holds.size) return;
    autoplayTimer = setInterval(() => {
      show((index + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
  }

  function pauseAutoplay(reason) {
    holds.add(reason);
    stopAutoplay();
  }

  function resumeAutoplay(reason) {
    holds.delete(reason);
    startAutoplay();
  }

  // Restart the 4s countdown after a manual pick, without overriding an
  // active hover/hidden-tab hold.
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (!prefersReducedMotion) {
    showcase.addEventListener('mouseenter', () => pauseAutoplay('hover'));
    showcase.addEventListener('mouseleave', () => resumeAutoplay('hover'));
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseAutoplay('hidden');
      else resumeAutoplay('hidden');
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      show(i);
      restartAutoplay();
    });
  });

  // The markup ships slide 0's caption/art already in place (no flash of
  // empty content before JS runs) — just match its contain state here.
  applyContainment(SLIDES[0].contain !== false);
  applyArtWidth(SLIDES[0].artWidth);
  applyArtOffset(SLIDES[0].offsetY, SLIDES[0].scale);
  applyTextPosition(SLIDES[0].textPosition);
  applyTextOffset(SLIDES[0].textOffsetX, SLIDES[0].textOffsetY, SLIDES[0].textPosition);

  syncDots();
  startAutoplay();
}
