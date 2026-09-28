import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const isCollapsible = block.classList.contains('collapsible');
  const grid = document.createElement('div');
  grid.className = 'accordion-grid';

  [...block.children].forEach((row) => {
    const [questionCell, answerCell] = row.children;

    const item = document.createElement('div');
    item.className = 'accordion-item';
    moveInstrumentation(row, item);

    if (isCollapsible) {
      const trigger = document.createElement('button');
      trigger.className = 'accordion-trigger';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = `<span>${questionCell?.textContent?.trim() || ''}</span><span class="accordion-icon">+</span>`;

      const panel = document.createElement('div');
      panel.className = 'accordion-panel';
      panel.hidden = true;
      panel.innerHTML = answerCell?.innerHTML || '';

      trigger.addEventListener('click', () => {
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!expanded));
        trigger.querySelector('.accordion-icon').textContent = expanded ? '+' : '−';
        panel.hidden = expanded;
      });

      item.append(trigger, panel);
    } else {
      const h3 = document.createElement('h3');
      h3.textContent = questionCell?.textContent?.trim() || '';

      const p = document.createElement('p');
      p.innerHTML = answerCell?.innerHTML || '';

      item.append(h3, p);
    }

    grid.append(item);
  });

  block.replaceChildren(grid);
}
