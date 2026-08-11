import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Who is it for: header reveals first, then each ID-badge card "drops"
 * onto the line and settles into its final tilt (read from the --rot
 * custom property set inline per card in the markup).
 */
export function initRoles({ prefersReducedMotion }) {
  const section = document.getElementById('roles');
  if (!section) return;

  const header = section.querySelector('.roles__header');
  const cards = gsap.utils.toArray('.role-card');

  if (prefersReducedMotion) {
    gsap.set(header, { opacity: 1, y: 0 });
    gsap.set(cards, { opacity: 1, y: 0 });
    return;
  }

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 65%',
    },
  });

  tl.fromTo(
    header,
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
  );

  cards.forEach((card, i) => {
    const targetRotate = parseFloat(getComputedStyle(card).getPropertyValue('--rot')) || 0;
    tl.fromTo(
      card,
      { opacity: 0, y: -36, rotate: 0 },
      {
        opacity: 1,
        y: 0,
        rotate: targetRotate,
        duration: 0.7,
        ease: 'back.out(1.6)',
      },
      i === 0 ? '-=0.2' : '-=0.5'
    );
  });
}
