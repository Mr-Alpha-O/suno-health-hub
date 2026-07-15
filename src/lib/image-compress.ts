// Client-side image compression + thumbnail generation using Canvas.
// Keeps aspect ratio. Falls back to the original file when the browser
// cannot decode it (e.g. SVG, HEIC without support).

export type CompressResult = { main: Blob; thumb: Blob | null; mime: string };

async function fileToImage(file: Blob): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

function drawToBlob(img: HTMLImageElement, maxDim: number, mime: string, quality: number): Promise<Blob | null> {
  const ratio = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * ratio));
  const h = Math.max(1, Math.round(img.naturalHeight * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(null);
  ctx.drawImage(img, 0, 0, w, h);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime, quality));
}

export async function compressImage(file: File, opts?: { maxDim?: number; thumbDim?: number; quality?: number }): Promise<CompressResult> {
  const maxDim = opts?.maxDim ?? 1920;
  const thumbDim = opts?.thumbDim ?? 400;
  const quality = opts?.quality ?? 0.85;

  // Do not try to compress svg / non-raster
  if (!/^image\/(jpeg|jpg|png|webp)$/i.test(file.type)) {
    return { main: file, thumb: null, mime: file.type };
  }

  const img = await fileToImage(file);
  if (!img) return { main: file, thumb: null, mime: file.type };

  const outMime = file.type === "image/png" ? "image/png" : "image/jpeg";
  const [main, thumb] = await Promise.all([
    drawToBlob(img, maxDim, outMime, quality),
    drawToBlob(img, thumbDim, outMime, 0.75),
  ]);
  return { main: main ?? file, thumb: thumb ?? null, mime: outMime };
}
