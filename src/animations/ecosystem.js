import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Cards filling the visible row at any moment; the rest wait off-stage. */
const VISIBLE = 5;
/** Seconds a card holds its slot before the row steps along. */
const HOLD = 6;
/** Seconds one step takes. */
const SLIDE = 0.9;
/** Seconds the arriving card waits before it starts fading in. */
const FADE_IN_DELAY = 0.3;
/** Seconds each card lags the one before it, so the row moves as a ripple. */
const CARD_STAGGER = 0.15;
/** Below this the cards fall back to a static wrapped grid. */
const MIN_WIDTH = 900;
const CARD_W = 200;
const CARD_GAP = 24;

/**
 * Ecosystem: the cards sit on the red guide arc drawn in index.html and
 * travel along it, each tilted to the curve's tangent so the row reads as a
 * fan. Every HOLD seconds the row steps one slot to the left; the card that
 * runs off the end fades out and reappears off-stage on the right.
 */
export function initEcosystem({ prefersReducedMotion }) {
  const section = document.getElementById('ecosystem');
  if (!section) return;

  const track = section.querySelector('[data-eco-track]');
  const cards = gsap.utils.toArray('.eco-card');
  const arcPath = section.querySelector('.ecosystem__arc-guide path');
  const wordmark = section.querySelector('.ecosystem__wordmark-wrap');
  const cta = section.querySelector('.btn');
  if (!track || !cards.length) return;

  gsap.set([wordmark, cta], { opacity: 1, y: 0 });

  // No arc to follow, or no room for the fan: leave the cards to the static
  // layout in sections.css.
  if (prefersReducedMotion || window.innerWidth < MIN_WIDTH || !arcPath) {
    gsap.set(cards, { opacity: 1, clearProps: 'transform' });
    return;
  }

  section.classList.add('is-arced');

  /* ---------------------------------------------------------------- *
   * Arc geometry
   *
   * The guide is "M x0 y0 Q cx cy x1 y1" inside a 0-100 viewBox that's
   * stretched to the section, so its numbers are percentages of section
   * width and height. Reading them back off the path (rather than
   * duplicating them here) means editing the arc in the markup moves the
   * cards with it.
   * ---------------------------------------------------------------- */
  const d = arcPath.getAttribute('d').match(/-?[\d.]+/g).map(Number);
  const [px0, py0, pcx, pcy, px1, py1] = d;

  let W = 0;
  let H = 0;
  let trackOffsetX = 0;
  let trackOffsetY = 0;
  let cardH = 200;

  function measure() {
    const s = section.getBoundingClientRect();
    const t = track.getBoundingClientRect();
    W = s.width;
    H = s.height;
    // The arc is expressed in section space but cards are positioned inside
    // the track, which sits inside the section's padding - so both axes need
    // shifting by the gap between the two boxes, not just y.
    trackOffsetX = t.left - s.left;
    trackOffsetY = t.top - s.top;
    cardH = cards[0].offsetHeight || 200;
  }

  /**
   * Point and tangent on the arc at `t`. Evaluated in pixels, and valid
   * outside 0..1 as well - that's how the cards waiting off-stage to the
   * right get their positions.
   */
  function pointAt(t) {
    const mt = 1 - t;
    const x = ((mt * mt * px0 + 2 * mt * t * pcx + t * t * px1) / 100) * W;
    const y = ((mt * mt * py0 + 2 * mt * t * pcy + t * t * py1) / 100) * H;
    // The tangent has to be taken after scaling: x and y are scaled by
    // different factors (W vs H), so the angle in viewBox space is not the
    // angle on screen.
    const dx = ((2 * mt * (pcx - px0) + 2 * t * (px1 - pcx)) / 100) * W;
    const dy = ((2 * mt * (pcy - py0) + 2 * t * (py1 - pcy)) / 100) * H;
    return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
  }

  /**
   * Where slot `s` sits on the arc. Slots 0..VISIBLE-1 are the visible row,
   * centred in the section; higher slots continue off to the right and
   * negative ones off to the left. Assumes x runs linearly along the arc,
   * which holds for the symmetric guide in the markup.
   */
  function tForSlot(s) {
    const rowW = VISIBLE * CARD_W + (VISIBLE - 1) * CARD_GAP;
    const left = (W - rowW) / 2;
    return (left + CARD_W / 2 + s * (CARD_W + CARD_GAP)) / W;
  }

  function place(card, t) {
    const p = pointAt(t);
    gsap.set(card, {
      x: p.x - trackOffsetX - CARD_W / 2,
      y: p.y - trackOffsetY - cardH / 2,
      rotation: p.angle,
    });
  }

  /**
   * Only the five cards in the row are shown. The ones queued behind them
   * can't be left visible and clipped: the arc spans the whole section, so
   * slot 5 still lands inside it and would show at the right edge.
   */
  const restOpacity = (slot) => (slot >= 0 && slot < VISIBLE ? 1 : 0);

  /* ---------------------------------------------------------------- *
   * Carousel
   * ---------------------------------------------------------------- */
  const slotOf = cards.map((_, i) => i);
  let timer = null;
  let running = false;
  let revealed = false;

  function layout() {
    measure();
    cards.forEach((card, i) => place(card, tForSlot(slotOf[i])));
  }

  function layoutWithOpacity() {
    layout();
    cards.forEach((card, i) => gsap.set(card, { opacity: restOpacity(slotOf[i]) }));
  }

  function step() {
    // Re-read the box each step: the section's height settles after first
    // paint (fonts, images), and a stale H puts every card slightly off the
    // arc it's supposed to be riding.
    measure();

    const tl = gsap.timeline({
      onComplete: () => {
        // The card that ran off the left end goes round to the last slot,
        // where it waits out of sight until it works its way back into the
        // row and fades in.
        cards.forEach((card, i) => {
          if (slotOf[i] === -1) {
            slotOf[i] = cards.length - 1;
            place(card, tForSlot(slotOf[i]));
            gsap.set(card, { opacity: 0 });
          }
        });
      },
    });

    cards.forEach((card, i) => {
      const from = slotOf[i];
      const to = from - 1;
      // Ripple: each card sets off a beat after the one to its left.
      const at = Math.max(0, from) * CARD_STAGGER;

      // Animating a proxy and writing the transform on update, rather than
      // tweening x/y directly, is what keeps the card ON the curve for the
      // whole trip instead of cutting the chord between its endpoints.
      const state = { t: tForSlot(from) };
      const end = tForSlot(to);
      tl.to(
        state,
        {
          t: end,
          duration: SLIDE,
          ease: 'circ.inOut',
          onUpdate: () => place(card, state.t),
        },
        at
      );

      if (from === 0) {
        tl.to(card, { opacity: 0, duration: SLIDE, ease: 'circ.inOut' }, at);
      }
      if (from === VISIBLE) {
        tl.fromTo(
          card,
          { opacity: 0 },
          { opacity: 1, duration: SLIDE, ease: 'circ.inOut' },
          at + FADE_IN_DELAY
        );
      }

      slotOf[i] = to;
    });
  }

  function schedule() {
    timer = gsap.delayedCall(HOLD, () => {
      step();
      schedule();
    });
  }

  function start() {
    if (running || !revealed) return;
    running = true;
    schedule();
  }

  function stop() {
    running = false;
    timer?.kill();
    timer = null;
  }

  layoutWithOpacity();

  // Reveal: the cards fly in along the arc from off-stage right, so the
  // entrance uses the same path they'll travel from then on.
  gsap.set(cards, { opacity: 0 });
  const intro = gsap.timeline({
    scrollTrigger: { trigger: section, start: 'top 70%', once: true },
    onComplete: () => {
      revealed = true;
      start();
    },
  });
  cards.forEach((card, i) => {
    const state = { t: tForSlot(slotOf[i] + cards.length) };
    const end = tForSlot(slotOf[i]);
    intro.to(
      state,
      {
        t: end,
        duration: 0.9,
        ease: 'circ.inOut',
        onUpdate: () => place(card, state.t),
      },
      i * CARD_STAGGER
    );
    // Cards landing in a queue slot stay hidden - only the row fades up.
    if (restOpacity(slotOf[i])) {
      intro.to(card, { opacity: 1, duration: 0.6, ease: 'circ.inOut' }, i * CARD_STAGGER);
    }
  });

  // No point cycling cards nobody can see.
  ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (self.isActive ? start() : stop()),
  });

  // Fonts and images can still change the section's height after init, which
  // shifts the arc under the cards.
  window.addEventListener('load', layout);

  let resizeRaf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(layout);
  });
}
