import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Logo strip: eyebrow + client pill rise and fade in with a stagger when
 * the section scrolls into view. The logo cards themselves are static (no
 * reveal animation).
 */
export function initLogos({ prefersReducedMotion }) {
  const section = document.getElementById('companies');
  if (!section) return;

  const title = section.querySelector('[data-reveal]');
  const cards = section.querySelectorAll('[data-logo]');
  const pill = section.querySelector('.companies__pill');

  gsap.set(cards, { opacity: 1, y: 0 });

  if (prefersReducedMotion) {
    gsap.set([title, pill], { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 78%',
    },
    defaults: { ease: 'power3.out' },
  });

  tl.fromTo(title, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 })
    .fromTo(pill, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.1');
}
