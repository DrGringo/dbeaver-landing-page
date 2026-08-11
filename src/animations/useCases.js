import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const CASES = [
  {
    title: 'Secure data hub',
    paragraphs: [
      'A large insurance company needed a secure, centralized Redshift Serverless data hub with complex AWS IAM authentication, but DBeaver Community did not support the required drivers and IAM setup, and retraining hundreds of users on a new tool was unacceptable.',
      'They moved to DBeaver Lite Edition, which supports Redshift Serverless and advanced IAM, used standardized connection templates and documentation, and kept the familiar DBeaver interface so users could add the new Data Hub connection without any retraining.',
    ],
    buttonText: 'Read a story of a leading U.S. insurance company',
    buttonHref:
      'https://dbeaver.com/2026/01/08/how-an-insurance-company-built-a-secure-data-hub-without-retraining-hundreds-of-users/',
    illustration: '/assets/illustrations/usecase-secure-data-hub.svg',
    imgScale: 0.9,
  },
  {
    title: 'Secure web workspace',
    paragraphs: [
      'Fivetran engineers needed a secure, centralized way to troubleshoot customer data issues across many databases, without risking sensitive information or juggling multiple local tools.',
      'They adopted CloudBeaver as a web based, IAM friendly workspace with built in drivers, which lets engineers securely access diverse data sources, collaborate, and resolve customer issues faster while reducing risk of data leaks.',
    ],
    buttonText: "Read Fivetran's story",
    buttonHref:
      'https://dbeaver.com/2024/07/18/customer-story-aman-singh-the-senior-staff-software-engineer-at-fivetran/',
    illustration: '/assets/illustrations/usecase-secure-web-workspace.svg',
  },
];

/**
 * Use cases: tag/controls, text block and illustration reveal with a
 * stagger as the card scrolls into view, plus prev/next arrows that
 * crossfade between the two case studies above.
 */
export function initUseCases({ prefersReducedMotion }) {
  const section = document.getElementById('usecases');
  if (!section) return;

  const items = section.querySelectorAll('[data-reveal]');

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

  const textEl = section.querySelector('[data-usecase-text]');
  const imgEl = section.querySelector('[data-usecase-img]');
  const prevBtn = section.querySelector('[data-usecase-prev]');
  const nextBtn = section.querySelector('[data-usecase-next]');
  if (!textEl || !imgEl || !prevBtn || !nextBtn) return;

  let index = 0;
  let animating = false;

  function render(nextIndex) {
    if (animating || nextIndex === index) return;
    animating = true;
    const data = CASES[nextIndex];

    const applyContent = () => {
      textEl.querySelector('.usecases__title').textContent = data.title;
      const paras = textEl.querySelectorAll('p');
      paras.forEach((p, i) => {
        p.textContent = data.paragraphs[i] ?? '';
      });
      const link = textEl.querySelector('a');
      link.textContent = data.buttonText;
      link.href = data.buttonHref;
      imgEl.src = data.illustration;
      imgEl.style.transform = data.imgScale ? `scale(${data.imgScale})` : '';
      index = nextIndex;
    };

    if (prefersReducedMotion) {
      applyContent();
      animating = false;
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        animating = false;
      },
    });
    tl.to([textEl, imgEl], { opacity: 0, duration: 0.25, ease: 'power2.in' })
      .add(applyContent)
      .to([textEl, imgEl], { opacity: 1, duration: 0.35, ease: 'power2.out' });
  }

  prevBtn.addEventListener('click', () => {
    render((index - 1 + CASES.length) % CASES.length);
  });
  nextBtn.addEventListener('click', () => {
    render((index + 1) % CASES.length);
  });
}
