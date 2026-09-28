import { moveInstrumentation } from '../../scripts/scripts.js';

function buildModal() {
  const modal = document.createElement('div');
  modal.className = 'testimonials-modal';
  modal.hidden = true;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  const backdrop = document.createElement('div');
  backdrop.className = 'testimonials-modal-backdrop';

  const box = document.createElement('div');
  box.className = 'testimonials-modal-box';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'testimonials-modal-close';
  closeBtn.setAttribute('aria-label', 'Close video');
  closeBtn.innerHTML = '&times;';

  const frame = document.createElement('div');
  frame.className = 'testimonials-modal-frame';

  box.append(closeBtn, frame);
  modal.append(backdrop, box);

  let opener = null;

  const open = (btn) => {
    const ytId = btn.dataset.yt;
    if (!ytId) return;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
    iframe.title = btn.getAttribute('aria-label') || 'Testimonial video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    frame.innerHTML = '';
    frame.append(iframe);
    opener = btn;
    modal.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    closeBtn.focus();
  };

  const close = () => {
    if (modal.hidden) return;
    frame.innerHTML = '';
    modal.hidden = true;
    document.documentElement.style.overflow = '';
    if (opener) opener.focus();
    opener = null;
  };

  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  return { modal, open };
}

export default function decorate(block) {
  const { modal, open } = buildModal();
  const layout = document.createElement('div');
  layout.className = 'testimonials-layout';

  const rows = [...block.children];
  const [featuredRow, quoteRow, ...miniRows] = rows;

  // ── featured video ──
  const [ytIdCell, posterCell, whoNameCell, whoRoleCell] = featuredRow?.children || [];
  const ytId = ytIdCell?.textContent?.trim();
  const posterImg = posterCell?.querySelector('img');

  const vidBtn = document.createElement('button');
  vidBtn.className = 'testimonials-video';
  vidBtn.type = 'button';
  vidBtn.dataset.yt = ytId || '';
  vidBtn.setAttribute('aria-label', `Play testimonial: ${whoNameCell?.textContent?.trim() || ''}`);
  moveInstrumentation(featuredRow, vidBtn);

  const vFrame = document.createElement('span');
  vFrame.className = 'testimonials-video-frame';
  if (posterImg) {
    const img = document.createElement('img');
    img.src = posterImg.src;
    img.alt = posterImg.alt || '';
    img.loading = 'lazy';
    vFrame.append(img);
  }
  const vOverlay = document.createElement('span');
  vOverlay.className = 'testimonials-video-overlay';
  const vPlay = document.createElement('span');
  vPlay.className = 'testimonials-play';
  vFrame.append(vOverlay, vPlay);

  const vWho = document.createElement('span');
  vWho.className = 'testimonials-video-who';
  vWho.innerHTML = `<b>${whoNameCell?.textContent?.trim() || ''}</b><span>${whoRoleCell?.textContent?.trim() || ''}</span>`;

  vidBtn.append(vFrame, vWho);
  vidBtn.addEventListener('click', () => open(vidBtn));

  // ── side: quote + mini videos ──
  const side = document.createElement('div');
  side.className = 'testimonials-side';

  const [quoteCell, attrNameCell, attrRoleCell] = quoteRow?.children || [];
  const quote = document.createElement('blockquote');
  quote.className = 'testimonials-quote';
  quote.innerHTML = quoteCell?.innerHTML || '';

  const attr = document.createElement('div');
  attr.className = 'testimonials-attr';
  attr.innerHTML = `<b>${attrNameCell?.textContent?.trim() || ''}</b><span>${attrRoleCell?.textContent?.trim() || ''}</span>`;

  const ctaWrap = document.createElement('p');
  ctaWrap.className = 'testimonials-cta';
  ctaWrap.innerHTML = '<a class="button primary" href="/clients-reviews/">Read more client reviews →</a>';

  const miniGrid = document.createElement('div');
  miniGrid.className = 'testimonials-mini-grid';

  miniRows.forEach((row) => {
    const [miniYtCell, miniPosterCell, miniNameCell, miniRoleCell] = row.children;
    const miniYt = miniYtCell?.textContent?.trim();
    const miniPoster = miniPosterCell?.querySelector('img');

    const miniBtn = document.createElement('button');
    miniBtn.className = 'testimonials-mini';
    miniBtn.type = 'button';
    miniBtn.dataset.yt = miniYt || '';
    miniBtn.setAttribute('aria-label', `Play: ${miniNameCell?.textContent?.trim() || ''}`);
    moveInstrumentation(row, miniBtn);

    const mFrame = document.createElement('span');
    mFrame.className = 'testimonials-mini-frame';
    if (miniPoster) {
      const img = document.createElement('img');
      img.src = miniPoster.src;
      img.alt = miniPoster.alt || '';
      img.loading = 'lazy';
      mFrame.append(img);
    }
    const mPlay = document.createElement('span');
    mPlay.className = 'testimonials-mini-play';
    mFrame.append(mPlay);

    const mInfo = document.createElement('span');
    mInfo.className = 'testimonials-mini-info';
    mInfo.innerHTML = `<b>${miniNameCell?.textContent?.trim() || ''}</b>${miniRoleCell?.textContent?.trim() || ''}`;

    miniBtn.append(mFrame, mInfo);
    miniBtn.addEventListener('click', () => open(miniBtn));
    miniGrid.append(miniBtn);
  });

  side.append(quote, attr, ctaWrap, miniGrid);
  layout.append(vidBtn, side);
  block.replaceChildren(layout, modal);
}
