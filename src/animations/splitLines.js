/**
 * Split an element's text into lines wrapped for masked reveal.
 * Preserves inline children flagged with `.accent` (keeps their class so
 * colour styling survives). Returns the array of inner line elements to
 * animate (each sits inside an overflow:hidden line wrapper).
 */
export function splitLines(el) {
  // If the markup already declares explicit lines (`.ln`), honour them
  // verbatim instead of measuring auto-wrap positions. Each `.ln` becomes one
  // masked line; an `accent` class is carried onto its inner element.
  const explicit = [...el.querySelectorAll(':scope > .ln')];
  if (explicit.length) {
    el.innerHTML = '';
    return explicit.map((src) => {
      const line = document.createElement('span');
      line.className = 'line';
      line.style.display = 'block';
      line.style.overflow = 'hidden';

      const inner = document.createElement('span');
      inner.className = 'line-inner';
      inner.style.display = 'block';
      inner.style.willChange = 'transform';
      if (src.classList.contains('accent')) inner.classList.add('accent');
      inner.textContent = src.textContent.trim();

      line.appendChild(inner);
      el.appendChild(line);
      return inner;
    });
  }

  const words = [];
  el.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent
        .split(/\s+/)
        .filter(Boolean)
        .forEach((text) => words.push({ text, accent: false }));
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const accent = node.classList.contains('accent');
      node.textContent
        .split(/\s+/)
        .filter(Boolean)
        .forEach((text) => words.push({ text, accent }));
    }
  });

  // First pass: lay words out inline so we can read their line positions.
  el.innerHTML = '';
  const wordSpans = words.map(({ text, accent }) => {
    const span = document.createElement('span');
    span.textContent = text + ' ';
    span.style.display = 'inline-block';
    if (accent) span.classList.add('accent');
    el.appendChild(span);
    return span;
  });

  // Group words into lines by their vertical offset.
  const lines = [];
  let current = null;
  let currentTop = null;
  wordSpans.forEach((span) => {
    const top = span.offsetTop;
    if (currentTop === null || Math.abs(top - currentTop) > 6) {
      current = [];
      lines.push(current);
      currentTop = top;
    }
    current.push(span);
  });

  // Second pass: rebuild with masked line wrappers.
  el.innerHTML = '';
  const inners = [];
  lines.forEach((group) => {
    const line = document.createElement('span');
    line.className = 'line';
    line.style.display = 'block';
    line.style.overflow = 'hidden';

    const inner = document.createElement('span');
    inner.className = 'line-inner';
    inner.style.display = 'block';
    inner.style.willChange = 'transform';

    group.forEach((span) => inner.appendChild(span));
    line.appendChild(inner);
    el.appendChild(line);
    inners.push(inner);
  });

  return inners;
}
