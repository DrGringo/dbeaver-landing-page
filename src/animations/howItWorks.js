import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * How it works: the card stack wrapper rises and fades in as the section
 * scrolls into view, before the sticky pin/crossfade (hiwStack.js) takes
 * over.
 */
export function initHowItWorks({ prefersReducedMotion }) {
  const section = document.getElementById('how-it-works');
  if (!section) return;

  const cards = section.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion) {
    gsap.set(cards, { opacity: 1, y: 0 });
    return;
  }

  gsap.fromTo(
    cards,
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.15,
      // Leaves no inline transform once settled — an ancestor transform
      // (even an identity one) creates a containing block that breaks
      // position:fixed for the hiw-stack pin nested inside it.
      clearProps: 'transform',
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
      },
    }
  );
}
