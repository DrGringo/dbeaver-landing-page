import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Ecosystem: the fanned logo cards drop in and settle at their tilt (read
 * from each card's --rot custom property, same pattern as the persona
 * cards), then the heading fades up. The wordmark and CTA are static (no
 * reveal animation).
 */
export function initEcosystem({ prefersReducedMotion }) {
  const section = document.getElementById('ecosystem');
  if (!section) return;

  const title = section.querySelector('.ecosystem__title');
  const cards = gsap.utils.toArray('.eco-card');
  const wordmark = section.querySelector('.ecosystem__wordmark-wrap');
  const cta = section.querySelector('.btn');

  if (prefersReducedMotion) {
    gsap.set([title, cards, wordmark, cta], { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
    },
  });

  tl.fromTo(
    title,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
  );

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
      i === 0 ? '-=0.1' : '-=0.45'
    );
  });

  gsap.set([wordmark, cta], { opacity: 1, y: 0 });
}
