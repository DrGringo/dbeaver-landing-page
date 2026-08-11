import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Testimonials: header and card track reveal on scroll; the prev/next
 * arrows scroll the card track by one card width at a time.
 */
export function initTestimonials({ prefersReducedMotion }) {
  const section = document.getElementById('testimonials');
  if (!section) return;

  const items = section.querySelectorAll('[data-reveal]');
  const track = section.querySelector('[data-track]');
  const prevBtn = section.querySelector('[data-prev]');
  const nextBtn = section.querySelector('[data-next]');

  if (prefersReducedMotion) {
    gsap.set(items, { opacity: 1, y: 0 });
  } else {
    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
        },
      }
    );
  }

  if (track && prevBtn && nextBtn) {
    const scrollByCard = (dir) => {
      const card = track.querySelector('.testimonial-card');
      if (!card) return;
      const amount = card.getBoundingClientRect().width + 32; // + gap
      track.scrollBy({ left: dir * amount, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    };
    prevBtn.addEventListener('click', () => scrollByCard(-1));
    nextBtn.addEventListener('click', () => scrollByCard(1));
  }
}
