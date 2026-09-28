import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const isIndustries = block.classList.contains('industries');
  const wrapper = document.createElement('div');
  wrapper.className = isIndustries ? 'tabs-industries-split' : 'tabs-wrapper';

  if (isIndustries) {
    const list = document.createElement('div');
    list.className = 'tabs-industry-list';
    const view = document.createElement('div');
    view.className = 'tabs-industry-view';

    [...block.children].forEach((row, i) => {
      const [labelCell, descCell, linkCell, imgCell] = row.children;

      // list item
      const item = document.createElement('div');
      item.className = `tabs-industry-item${i === 0 ? ' active' : ''}`;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.dataset.i = i;
      moveInstrumentation(row, item);

      const no = document.createElement('span');
      no.className = 'tabs-industry-no';
      no.textContent = `/${String(i + 1).padStart(2, '0')}`;

      const nm = document.createElement('span');
      nm.className = 'tabs-industry-name';
      nm.textContent = labelCell?.textContent?.trim() || '';

      const go = document.createElement('span');
      go.className = 'tabs-industry-go';
      go.textContent = '→';

      item.append(no, nm, go);
      list.append(item);

      // view pane
      const pane = document.createElement('div');
      pane.className = `tabs-industry-pane${i === 0 ? ' active' : ''}`;
      pane.dataset.p = i;

      const img = imgCell?.querySelector('img');
      if (img) {
        const bg = document.createElement('div');
        bg.className = 'tabs-industry-bg';
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '900' }]);
        bg.append(optimized);
        pane.append(bg);
      }

      const scrim = document.createElement('div');
      scrim.className = 'tabs-industry-scrim';

      const tx = document.createElement('div');
      tx.className = 'tabs-industry-text';

      const h3 = document.createElement('h3');
      h3.textContent = labelCell?.textContent?.trim() || '';

      const p = document.createElement('p');
      p.textContent = descCell?.textContent?.trim() || '';

      const href = linkCell?.querySelector('a')?.href || '#';
      const a = document.createElement('a');
      a.href = href;
      a.textContent = `See ${labelCell?.textContent?.trim() || ''} work →`;

      tx.append(h3, p, a);
      pane.append(scrim, tx);
      view.append(pane);
    });

    const activate = (idx) => {
      list.querySelectorAll('.tabs-industry-item').forEach((el, i) => el.classList.toggle('active', i === idx));
      view.querySelectorAll('.tabs-industry-pane').forEach((el, i) => el.classList.toggle('active', i === idx));
    };

    list.querySelectorAll('.tabs-industry-item').forEach((item) => {
      const handler = () => activate(+item.dataset.i);
      item.addEventListener('click', handler);
      item.addEventListener('mouseenter', handler);
      item.addEventListener('keydown', (e) => { if (e.key === 'Enter') handler(); });
    });

    wrapper.append(list, view);
  } else {
    // standard tabs
    const nav = document.createElement('div');
    nav.className = 'tabs-nav';
    const panels = document.createElement('div');
    panels.className = 'tabs-panels';

    [...block.children].forEach((row, i) => {
      const [labelCell, contentCell, imgCell] = row.children;

      const btn = document.createElement('button');
      btn.className = 'tabs-nav-btn';
      btn.textContent = labelCell?.textContent?.trim() || `Tab ${i + 1}`;
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.dataset.index = i;
      nav.append(btn);

      const panel = document.createElement('div');
      panel.className = 'tabs-panel';
      panel.hidden = i !== 0;
      moveInstrumentation(row, panel);

      if (imgCell?.querySelector('picture')) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'tabs-panel-image';
        imgWrap.append(imgCell.querySelector('picture'));
        panel.append(imgWrap);
      }

      if (contentCell) {
        const textWrap = document.createElement('div');
        textWrap.className = 'tabs-panel-content';
        textWrap.innerHTML = contentCell.innerHTML;
        panel.append(textWrap);
      }

      panels.append(panel);
    });

    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('.tabs-nav-btn');
      if (!btn) return;
      const idx = +btn.dataset.index;
      nav.querySelectorAll('.tabs-nav-btn').forEach((b, i) => b.setAttribute('aria-selected', i === idx ? 'true' : 'false'));
      panels.querySelectorAll('.tabs-panel').forEach((p, i) => { p.hidden = i !== idx; });
    });

    wrapper.append(nav, panels);
  }

  block.replaceChildren(wrapper);
}
