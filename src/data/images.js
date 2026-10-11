// Shrinks a chosen photo to a web-friendly JPEG so it fits in browser storage.
// Returns { dataUrl, ratio } where ratio looks like "4/3". Use mime "image/png" to keep transparency (logos).
export function processImage(file, maxSize = 1200, quality = 0.82, mime = "image/jpeg") {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file (JPG or PNG)."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Could not open that image. Try a JPG or PNG."));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (mime === "image/jpeg") {
          ctx.fillStyle = "#ffffff"; // transparent PNGs get a white background instead of black
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve({ dataUrl: canvas.toDataURL(mime, quality), ratio: `${w}/${h}` });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// Turns a data URL (from processImage) into a file-like Blob that can be uploaded.
export async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}
