import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Logo strip: the eyebrow rises and fades in when the section scrolls into
 * view. The logo cards themselves are static (no reveal animation).
 */
export function initLogos({ prefersReducedMotion }) {
  const section = document.getElementById('companies');
  if (!section) return;

  const title = section.querySelector('[data-reveal]');
  const cards = section.querySelectorAll('[data-logo]');

  gsap.set(cards, { opacity: 1, y: 0 });

  if (prefersReducedMotion) {
    gsap.set(title, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    title,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 78%',
      },
    }
  );
}
