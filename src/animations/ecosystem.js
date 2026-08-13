import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Ecosystem: the fanned logo cards drop in and settle at their tilt (read
 * from each card's --rot custom property, same pattern as the persona
 * cards). The wordmark and CTA are static (no reveal animation).
 */
export function initEcosystem({ prefersReducedMotion }) {
  const section = document.getElementById('ecosystem');
  if (!section) return;

  const cards = gsap.utils.toArray('.eco-card');
  const wordmark = section.querySelector('.ecosystem__wordmark-wrap');
  const cta = section.querySelector('.btn');

  if (prefersReducedMotion) {
    gsap.set([cards, wordmark, cta], { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
    },
  });

  cards.forEach((card, i) => {
    const targetRotate = parseFloat(getComputedStyle(card).getPropertyValue('--rot')) || 0;
    tl.fromTo(
      card,
      { opacity: 0, y: 30, rotate: 0 },
      {
        opacity: 1,
        y: 0,
        rotate: targetRotate,
        duration: 0.6,
        ease: 'back.out(1.6)',
      },
      // First card opens the timeline; the rest overlap the one before it.
      i === 0 ? 0 : '-=0.45'
    );
  });

  gsap.set([wordmark, cta], { opacity: 1, y: 0 });
}
