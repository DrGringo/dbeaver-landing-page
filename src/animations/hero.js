import { gsap } from 'gsap';
import { splitLines } from './splitLines.js';

/**
 * Hero load timeline:
 *  - rating badges pop in
 *  - headline reveals line-by-line out of its masked wrappers
 *  - the showcase card fades/scales up alongside them
 * CTA buttons are static (no reveal animation).
 */
export function initHero({ prefersReducedMotion }) {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const title = hero.querySelector('[data-splitlines]');
  const lineInners = title ? splitLines(title) : [];
  const badges = hero.querySelectorAll('.hero__ratings .rating-badge');
  const buttons = hero.querySelectorAll('.hero__cta .btn');
  const showcase = hero.querySelector('.hero__showcase');

  gsap.set(buttons, { opacity: 1, y: 0 });

  if (prefersReducedMotion) {
    gsap.set([lineInners, badges, showcase], {
      opacity: 1,
      yPercent: 0,
      y: 0,
      scale: 1,
    });
    return;
  }

  gsap.set(lineInners, { yPercent: 110 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo(
    badges,
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
  )
    .to(lineInners, { yPercent: 0, duration: 0.9, stagger: 0.12 }, '-=0.2')
    .fromTo(
      showcase,
      { opacity: 0, y: 30, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9 },
      '-=1.1'
    );
}
