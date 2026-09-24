export default function decorate(block) {
    const rows = [...block.children];

    const backgroundVideo = rows[0]?.textContent.trim();
    const backgroundImage = rows[1]?.textContent.trim();
    const imageAlt = rows[2]?.textContent.trim() || '';
    const text = rows[3]?.innerHTML || '';

    block.textContent = '';

    const mediaWrapper = document.createElement('div');
    mediaWrapper.className = 'hero-media';

    if (backgroundVideo) {
        const video = document.createElement('video');

        video.className = 'hero-video';
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        if (backgroundImage) {
            video.poster = backgroundImage;
        }

        const source = document.createElement('source');
        source.src = backgroundVideo;
        source.type = 'video/mp4';

        video.append(source);
        mediaWrapper.append(video);
    } else if (backgroundImage) {
        const image = document.createElement('img');

        image.className = 'hero-image';
        image.src = backgroundImage;
        image.alt = imageAlt;

        mediaWrapper.append(image);
    }

    const overlay = document.createElement('div');
    overlay.className = 'hero-overlay';

    const content = document.createElement('div');
    content.className = 'hero-content';
    content.innerHTML = text;

    block.append(
        mediaWrapper,
        overlay,
        content,
    );
}