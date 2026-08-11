import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Newsletter: the card rises and fades in as it scrolls into view.
 */
export function initNewsletter({ prefersReducedMotion }) {
  const section = document.getElementById('newsletter');
  if (!section) return;

  const form = section.querySelector('.newsletter__form');
  form?.addEventListener('submit', (e) => e.preventDefault());

  const card = section.querySelector('[data-reveal]');
  if (!card) return;

  if (prefersReducedMotion) {
    gsap.set(card, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    card,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
      },
    }
  );
}
