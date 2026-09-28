import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [imageCell, videoCell, textCell, ...focusCells] = block.children;

  // --- video / poster background ---
  const videoUrl = videoCell?.querySelector('a')?.href || videoCell?.textContent?.trim();
  const img = imageCell?.querySelector('img');

  if (videoUrl) {
    const bgVideo = document.createElement('div');
    bgVideo.className = 'hero-bgvideo';
    bgVideo.setAttribute('aria-hidden', 'true');
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('preload', 'none');
    if (img) video.poster = img.src;
    const source = document.createElement('source');
    source.src = videoUrl;
    source.type = 'video/mp4';
    video.append(source);
    bgVideo.append(video);
    block.prepend(bgVideo);

    // lazy-load video
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.preload = 'auto';
        video.play().catch(() => {});
        observer.disconnect();
      }
    });
    observer.observe(block);
  } else if (img) {
    const bgImg = document.createElement('div');
    bgImg.className = 'hero-bgimg';
    const optimized = createOptimizedPicture(img.src, img.alt, true, [{ width: '1440' }]);
    moveInstrumentation(img, optimized.querySelector('img'));
    bgImg.append(optimized);
    block.prepend(bgImg);
  }

  // overlay
  const overlay = document.createElement('div');
  overlay.className = 'hero-overlay';
  block.append(overlay);

  // --- main content ---
  const content = document.createElement('div');
  content.className = 'hero-content';
  if (textCell) {
    content.innerHTML = textCell.innerHTML;
    moveInstrumentation(textCell, content);
  }

  // --- focus cards ---
  if (focusCells.length) {
    const focusGrid = document.createElement('div');
    focusGrid.className = 'hero-focus-grid';
    focusCells.forEach((cell) => {
      const card = document.createElement('a');
      card.className = 'hero-focus-card';
      const link = cell.querySelector('a');
      if (link) card.href = link.href;
      moveInstrumentation(cell, card);
      card.innerHTML = cell.innerHTML;
      focusGrid.append(card);
    });
    content.append(focusGrid);
  }

  // clear original children and rebuild
  [...block.children].forEach((child) => {
    if (!child.classList.contains('hero-bgvideo') && !child.classList.contains('hero-bgimg') && !child.classList.contains('hero-overlay')) {
      child.remove();
    }
  });
  block.append(content);
}
