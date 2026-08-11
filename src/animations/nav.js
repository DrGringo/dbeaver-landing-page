import { gsap } from 'gsap';

/**
 * Nav: slide down on load, and switch to a solid, condensed bar once
 * the user scrolls past the hero fold.
 */
export function initNav({ prefersReducedMotion }) {
  const nav = document.getElementById('nav');
  if (!nav) return;

  if (!prefersReducedMotion) {
    gsap.from(nav, {
      y: -80,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.1,
    });
  }

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
