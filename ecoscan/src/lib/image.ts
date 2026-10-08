export async function resizeImage(
  source: Blob | HTMLVideoElement,
  maxWidth = 1024,
  quality = 0.8,
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  let width: number;
  let height: number;

  if (source instanceof HTMLVideoElement) {
    width = source.videoWidth;
    height = source.videoHeight;
  } else {
    const img = await createImageBitmap(source);
    width = img.width;
    height = img.height;
  }

  const ratio = Math.min(1, maxWidth / width);
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);

  if (source instanceof HTMLVideoElement) {
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  } else {
    const img = await createImageBitmap(source);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', quality);
  });
}