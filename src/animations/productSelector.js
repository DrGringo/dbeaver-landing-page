import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Product selector: heading, subhead, progress bar, CTA card and comparison
 * link reveal on scroll.
 */
export function initProductSelector({ prefersReducedMotion }) {
  const section = document.getElementById('product');
  if (!section) return;

  const items = section.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion) {
    gsap.set(items, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    items,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: section,
        start: 'top 72%',
      },
    }
  );
}
