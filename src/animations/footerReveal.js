/**
 * Sticky-pin footer reveal (same technique used on chkstepan.com):
 * measure the footer's natural height, expose it as --footer-h, and flip
 * on the CSS (see sections.css .footer-reveal) that pins the footer to
 * the bottom of the viewport for one scroll-viewport's worth of distance
 * before it releases into normal flow.
 *
 * Skipped entirely for prefers-reduced-motion — the pin/release motion
 * is disorienting for some users, and a plain static footer is a fine
 * fallback.
 */
export function initFooterReveal({ prefersReducedMotion }) {
  const root = document.getElementById('footerReveal');
  if (!root || prefersReducedMotion) return;

  const sticky = root.querySelector('.footer-reveal__sticky');
  if (!sticky) return;

  const measure = () => {
    // Drop the reveal layout first so the sticky wrapper measures its
    // natural content height, not a stale --footer-h from a previous pass.
    root.classList.remove('is-ready');
    const height = sticky.getBoundingClientRect().height;
    root.style.setProperty('--footer-h', `${height}px`);
    root.classList.add('is-ready');
  };

  measure();

  let resizeRaf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(measure);
  });

  // Re-measure once fonts/images settle (layout can shift after load).
  window.addEventListener('load', measure);
}
