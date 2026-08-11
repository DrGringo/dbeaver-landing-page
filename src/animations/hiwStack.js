import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * How it works — sticky-pinned card stack, the same treatment as
 * motherduck.com's "data warehouse + AI" section: the viewport pins in
 * place while scrolling, and each card swaps to the front (rising into
 * place, scale/opacity in) while the previous one sinks back behind it.
 * Falls back to the static 2x2 grid (see sections.css) for reduced motion
 * and narrow viewports, where a pinned single-card deck doesn't fit well.
 */
export function initHiwStack({ prefersReducedMotion }) {
  const stack = document.querySelector('[data-hiw-stack]');
  if (!stack) return;

  const viewport = stack.querySelector('[data-hiw-viewport]');
  const cards = gsap.utils.toArray(stack.querySelectorAll('.hiw-card'));
  if (!viewport || cards.length < 2) return;

  if (prefersReducedMotion || window.innerWidth < 900) return;

  const setHeight = () => {
    // Measure natural (in-flow) heights before switching cards to
    // position:absolute, otherwise the stack collapses and every card
    // reports ~0 height.
    stack.classList.remove('is-stacked');
    const tallest = Math.max(...cards.map((card) => card.offsetHeight));
    stack.classList.add('is-stacked');
    viewport.style.height = `${tallest}px`;
  };
  setHeight();

  // Illustrations load async, so an initial measurement can undercount
  // height (card still shows its placeholder box). Recheck once every
  // image has actually loaded and refresh the pin so it doesn't clip.
  const images = stack.querySelectorAll('img');
  Promise.all(
    [...images].map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          })
    )
  ).then(() => {
    setHeight();
    ScrollTrigger.refresh();
  });

  gsap.set(cards, { position: 'absolute', inset: 0 });
  gsap.set(cards.slice(1), { autoAlpha: 0, y: 40, scale: 0.96 });
  gsap.set(cards[0], { autoAlpha: 1, y: 0, scale: 1, zIndex: cards.length });

  const screensPerCard = 0.7;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: viewport,
      start: 'top top+=200',
      end: () => `+=${window.innerHeight * screensPerCard * (cards.length - 1)}`,
      pin: viewport,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  cards.forEach((card, i) => {
    if (i === 0) return;
    const prev = cards[i - 1];
    tl.set(card, { zIndex: cards.length + i })
      .to(prev, { autoAlpha: 0, y: -30, scale: 0.96, duration: 1, ease: 'power1.inOut' }, '<')
      .to(card, { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'power1.inOut' }, '<');
  });

  let resizeRaf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      setHeight();
      ScrollTrigger.refresh();
    });
  });
}
