import './styles/tokens.css';
import './styles/base.css';
import './styles/sections.css';
import './styles/quiz.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

import { initNav } from './animations/nav.js';
import { initHero } from './animations/hero.js';
import { initHeroSlides } from './animations/heroSlides.js';
import { initLogos } from './animations/logos.js';
import { initAiBanner } from './animations/aiBanner.js';
import { initProductSelector } from './animations/productSelector.js';
import { initHowItWorks } from './animations/howItWorks.js';
import { initHiwStack } from './animations/hiwStack.js';
import { initRoles } from './animations/roles.js';
import { initUseCases } from './animations/useCases.js';
import { initEcosystem } from './animations/ecosystem.js';
import { initTestimonials } from './animations/testimonials.js';
import { initNewsletter } from './animations/newsletter.js';
import { initFooterReveal } from './animations/footerReveal.js';
import { initQuiz } from './quiz.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

/* ------------------------------------------------------------------ *
 * Smooth scroll (Lenis) wired into GSAP's ticker + ScrollTrigger.
 * Disabled entirely when the user prefers reduced motion.
 * ------------------------------------------------------------------ */
function initSmoothScroll() {
  if (prefersReducedMotion) return;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

function init() {
  initSmoothScroll();

  const ctx = { prefersReducedMotion };

  initNav(ctx);
  initQuiz();

  if (prefersReducedMotion) {
    // Reveal everything immediately, skip motion.
    gsap.set('[data-reveal], [data-logo], [data-splitlines] .line', {
      opacity: 1,
      clearProps: 'transform',
    });
    // Split-lines are wrapped after DOM ready; ensure hero text is visible.
    initHero(ctx);
    initHeroSlides(ctx);
    initLogos(ctx);
    initAiBanner(ctx);
    initProductSelector(ctx);
    initHowItWorks(ctx);
    initHiwStack(ctx);
    initRoles(ctx);
    initUseCases(ctx);
    initEcosystem(ctx);
    initTestimonials(ctx);
    initNewsletter(ctx);
    initFooterReveal(ctx);
    return;
  }

  initHero(ctx);
  initHeroSlides(ctx);
  initLogos(ctx);
  initAiBanner(ctx);
  initProductSelector(ctx);
  initHowItWorks(ctx);
  initHiwStack(ctx);
  initRoles(ctx);
  initUseCases(ctx);
  initEcosystem(ctx);
  initTestimonials(ctx);
  initNewsletter(ctx);
  initFooterReveal(ctx);

  // Recalculate triggers once fonts/images settle.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
