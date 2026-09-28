import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const track = document.createElement('div');
  track.className = 'marquee-track';

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    item.className = 'marquee-item';
    moveInstrumentation(row, item);
    const img = row.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '160' }]);
      moveInstrumentation(img, optimized.querySelector('img'));
      item.append(optimized);
    }
    track.append(item);
  });

  // duplicate for seamless loop
  track.querySelectorAll('.marquee-item').forEach((item) => {
    track.append(item.cloneNode(true));
  });

  block.replaceChildren(track);
}
