import { moveInstrumentation } from '../../scripts/scripts.js';

function animateCount(el, target, suffix) {
  const duration = 2000;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(progress * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.className = 'stats-counter-wrapper';

  [...block.children].forEach((row) => {
    const stat = document.createElement('div');
    stat.className = 'stat-item';
    moveInstrumentation(row, stat);

    const [valueEl, labelEl] = row.children;
    const rawValue = valueEl?.textContent?.trim() || '';
    const suffix = rawValue.replace(/[\d,]/g, '');
    const numericTarget = parseInt(rawValue.replace(/\D/g, ''), 10) || 0;

    const valueDiv = document.createElement('div');
    valueDiv.className = 'stat-value';
    valueDiv.textContent = rawValue;

    const labelDiv = document.createElement('div');
    labelDiv.className = 'stat-label';
    labelDiv.textContent = labelEl?.textContent?.trim() || '';

    stat.append(valueDiv, labelDiv);
    wrapper.append(stat);

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animateCount(valueDiv, numericTarget, suffix);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(stat);
  });

  block.replaceChildren(wrapper);
}
