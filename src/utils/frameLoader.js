export const TOTAL_FRAMES = 192;
export const frames = [];

export const preloadFrames = (onProgress, onComplete) => {
  let loadedCount = 0;
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    const num = String(i).padStart(4, '0');
    img.src = `/frames/frame_${num}.jpg`;
    
    img.onload = () => {
      loadedCount++;
      onProgress((loadedCount / TOTAL_FRAMES) * 100);
      if (loadedCount === TOTAL_FRAMES) {
        onComplete();
      }
    };
    img.onerror = () => {
      loadedCount++;
      onProgress((loadedCount / TOTAL_FRAMES) * 100);
      if (loadedCount === TOTAL_FRAMES) {
        onComplete();
      }
    };
    frames[i - 1] = img;
  }
};
