import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const grid = document.createElement('div');
  grid.className = 'accelerator-cards-grid';

  [...block.children].forEach((row) => {
    const [
      catCell, statValueCell, statLabelCell, titleCell, descCell, ttvCell, linkCell, linkTextCell,
    ] = row.children;

    const href = linkCell?.querySelector('a')?.href || '#';
    const card = document.createElement('a');
    card.className = 'accelerator-card';
    card.href = href;
    moveInstrumentation(row, card);

    const head = document.createElement('div');
    head.className = 'accelerator-card-head';

    const cat = document.createElement('span');
    cat.className = 'accelerator-card-category';
    cat.textContent = catCell?.textContent?.trim() || '';

    const stat = document.createElement('div');
    stat.className = 'accelerator-card-stat';
    stat.innerHTML = `<b>${statValueCell?.textContent?.trim() || ''}</b><small>${statLabelCell?.textContent?.trim() || ''}</small>`;

    head.append(cat, stat);

    const title = document.createElement('h3');
    title.textContent = titleCell?.textContent?.trim() || '';

    const desc = document.createElement('p');
    desc.className = 'accelerator-card-desc';
    desc.textContent = descCell?.textContent?.trim() || '';

    const foot = document.createElement('div');
    foot.className = 'accelerator-card-foot';

    const ttv = document.createElement('span');
    ttv.className = 'accelerator-card-ttv';
    const ttvText = ttvCell?.textContent?.trim() || '';
    ttv.innerHTML = `Time to value · <em>${ttvText}</em>`;

    const cta = document.createElement('span');
    cta.className = 'accelerator-card-link';
    cta.textContent = linkTextCell?.textContent?.trim() || 'See the playbook →';

    foot.append(ttv, cta);
    card.append(head, title, desc, foot);
    grid.append(card);
  });

  block.replaceChildren(grid);
}
