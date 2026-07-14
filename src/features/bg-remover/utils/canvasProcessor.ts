/**
 * Canvas-based high-performance image segmentation and chromakey extraction processor.
 * Smooths boundaries and supports auto-background color detection.
 */

// Convert hex string to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
}

// Automatically detect the dominant background color by sampling the four corners
export function detectBackgroundColor(imgData: ImageData): string {
  const { data, width, height } = imgData;
  const corners = [
    { x: 0, y: 0 },
    { x: width - 1, y: 0 },
    { x: 0, y: height - 1 },
    { x: width - 1, y: height - 1 }
  ];

  let rSum = 0, gSum = 0, bSum = 0;
  for (const corner of corners) {
    const idx = (corner.y * width + corner.x) * 4;
    rSum += data[idx];
    gSum += data[idx + 1];
    bSum += data[idx + 2];
  }

  const r = Math.round(rSum / 4).toString(16).padStart(2, '0');
  const g = Math.round(gSum / 4).toString(16).padStart(2, '0');
  const b = Math.round(bSum / 4).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`;
}

// High-fidelity chromakey matting with edge feather smoothing
export function removeBackgroundImage(
  imageEl: HTMLImageElement,
  targetColorHex: string,
  tolerance: number, // 1 to 100
  smoothing: number, // 0 to 10
  autoDetect: boolean = false
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return imageEl.src;

  canvas.width = imageEl.naturalWidth || imageEl.width;
  canvas.height = imageEl.naturalHeight || imageEl.height;

  // Draw original image
  ctx.drawImage(imageEl, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data } = imgData;

  // Detect color if set to auto
  const finalHex = autoDetect ? detectBackgroundColor(imgData) : targetColorHex;
  const target = hexToRgb(finalHex);

  const tVal = (tolerance / 100) * 441; // Max color distance in 3D RGB space is sqrt(255^2 * 3) ~ 441.67

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Compute Euclidean distance in RGB color space
    const dist = Math.sqrt(
      Math.pow(r - target.r, 2) +
      Math.pow(g - target.g, 2) +
      Math.pow(b - target.b, 2)
    );

    if (dist < tVal) {
      // Inside complete removal threshold
      data[i + 3] = 0;
    } else if (smoothing > 0 && dist < tVal + smoothing * 4) {
      // Transition smoothing zone
      const ratio = (dist - tVal) / (smoothing * 4);
      data[i + 3] = Math.round(ratio * 255);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}
