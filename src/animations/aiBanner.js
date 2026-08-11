import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * AI webinar banner: tag, headline, date and CTA reveal from the left as
 * the band scrolls into view.
 */
export function initAiBanner({ prefersReducedMotion }) {
  const section = document.getElementById('ai-banner');
  if (!section) return;

  const items = section.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion) {
    gsap.set(items, { opacity: 1, x: 0, y: 0 });
    return;
  }

  gsap.fromTo(
    items,
    { opacity: 0, x: -28 },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
      },
    }
  );
}
