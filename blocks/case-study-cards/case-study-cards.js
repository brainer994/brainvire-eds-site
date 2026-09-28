import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const stack = document.createElement('div');
  stack.className = 'case-study-stack';

  [...block.children].forEach((row, i) => {
    const [
      logoCell, metricCell, metricLabelCell, titleCell, descCell, metaCell, linkCell, imgCell,
    ] = row.children;

    const href = linkCell?.querySelector('a')?.href || '#';
    const card = document.createElement('a');
    card.className = 'case-study-card';
    card.href = href;
    card.style.top = `${104 + i * 18}px`;
    moveInstrumentation(row, card);

    // left content
    const left = document.createElement('div');
    left.className = 'case-study-left';

    const logoImg = logoCell?.querySelector('img');
    if (logoImg) {
      const logoWrap = document.createElement('span');
      logoWrap.className = 'case-study-logo';
      const optimized = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '200' }]);
      logoWrap.append(optimized);
      left.append(logoWrap);
    }

    const metric = document.createElement('span');
    metric.className = 'case-study-metric';
    metric.textContent = metricCell?.textContent?.trim() || '';

    const metricLbl = document.createElement('span');
    metricLbl.className = 'case-study-metric-label';
    metricLbl.textContent = metricLabelCell?.textContent?.trim() || '';

    const title = document.createElement('h3');
    title.textContent = titleCell?.textContent?.trim() || '';

    const desc = document.createElement('p');
    desc.className = 'case-study-desc';
    desc.textContent = descCell?.textContent?.trim() || '';

    const meta = document.createElement('span');
    meta.className = 'case-study-meta';
    meta.textContent = metaCell?.textContent?.trim() || '';

    const cta = document.createElement('span');
    cta.className = 'case-study-cta';
    cta.textContent = 'Read the case →';

    left.append(metric, metricLbl, title, desc, meta, cta);

    // right image
    const right = document.createElement('div');
    right.className = 'case-study-image';
    const img = imgCell?.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '800' }, { width: '1600' }]);
      moveInstrumentation(img, optimized.querySelector('img'));
      right.append(optimized);
    }

    card.append(left, right);
    stack.append(card);
  });

  block.replaceChildren(stack);
}
