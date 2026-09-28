import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'service-cards-grid';

  [...block.children].forEach((row) => {
    const [
      indexCell, titleCell, subtitleCell, descCell, bulletsCell, linkCell, linkTextCell,
    ] = row.children;

    const card = document.createElement('article');
    card.className = 'service-card';
    moveInstrumentation(row, card);

    const idx = document.createElement('span');
    idx.className = 'service-card-index';
    idx.textContent = indexCell?.textContent?.trim() || '';

    const heading = document.createElement('h3');
    heading.textContent = titleCell?.textContent?.trim() || '';

    const sub = document.createElement('small');
    sub.textContent = subtitleCell?.textContent?.trim() || '';
    heading.append(sub);

    const desc = document.createElement('p');
    desc.className = 'service-card-desc';
    desc.textContent = descCell?.textContent?.trim() || '';

    const ul = document.createElement('ul');
    ul.className = 'service-card-bullets';
    const rawBullets = bulletsCell?.querySelectorAll('li, p');
    if (rawBullets?.length) {
      rawBullets.forEach((b) => {
        const li = document.createElement('li');
        li.textContent = b.textContent.trim();
        ul.append(li);
      });
    }

    const href = linkCell?.querySelector('a')?.href || '#';
    const cta = document.createElement('a');
    cta.className = 'service-card-cta';
    cta.href = href;
    cta.textContent = linkTextCell?.textContent?.trim() || 'Learn more →';

    card.append(idx, heading, desc, ul, cta);
    grid.append(card);
  });

  block.replaceChildren(grid);
}
