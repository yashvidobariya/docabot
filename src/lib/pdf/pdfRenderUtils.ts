import * as pdfjsLib from 'pdfjs-dist';

// Configure the worker from CDN
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

/**
 * Renders all pages of a PDF to image blobs (JPG).
 * Returns an array of { blob, pageNumber } objects.
 */
export async function pdfToImages(
  file: File,
  scale: number = 2,
  format: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality: number = 0.92
): Promise<{ blob: Blob; pageNumber: number }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const results: { blob: Blob; pageNumber: number }[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error(`Failed to render page ${i}`));
        },
        format,
        quality
      );
    });

    results.push({ blob, pageNumber: i });
  }

  return results;
}

/**
 * Extracts text content from all pages of a PDF.
 * Returns an array of { text, pageNumber } objects.
 */
export async function extractTextFromPdf(
  file: File
): Promise<{ text: string; pageNumber: number }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const results: { text: string; pageNumber: number }[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    results.push({ text, pageNumber: i });
  }

  return results;
}
