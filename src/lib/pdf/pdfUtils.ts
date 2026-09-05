import { PDFDocument, degrees } from 'pdf-lib';

/**
 * Parses a page range string like "1-3, 5, 7-9" into a 0-indexed array of page numbers.
 */
function parsePageRanges(rangeStr: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = rangeStr.split(',').map(s => s.trim()).filter(Boolean);
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map(s => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end)) continue;
      for (let i = Math.max(1, start); i <= Math.min(totalPages, end); i++) {
        pages.add(i - 1); // 0-indexed
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        pages.add(pageNum - 1);
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
}

/**
 * Splits a PDF by extracting the given page ranges into a new document.
 * @param rangeStr e.g. "1-3, 5, 7-9" (1-indexed, inclusive)
 */
export async function splitPdf(file: File, rangeStr: string): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const totalPages = srcPdf.getPageCount();
    const pageIndices = parsePageRanges(rangeStr, totalPages);
    
    if (pageIndices.length === 0) {
      throw new Error('No valid pages selected.');
    }
    
    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
    for (const page of copiedPages) {
      newPdf.addPage(page);
    }
    
    return await newPdf.save();
  } catch (err) {
    console.error('Failed to split PDF:', err);
    throw new Error('Could not split this file. It may be corrupted or password-protected.');
  }
}

/**
 * Returns the total page count of a PDF file.
 */
export async function getPdfPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  return pdf.getPageCount();
}

/**
 * Rotates all pages of a PDF by the given angle.
 * @param angle Rotation in degrees (90, 180, 270)
 */
export async function rotatePdf(file: File, angle: number): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const pages = pdf.getPages();
    
    for (const page of pages) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees(currentRotation + angle));
    }
    
    return await pdf.save();
  } catch (err) {
    console.error('Failed to rotate PDF:', err);
    throw new Error('Could not rotate this file. It may be corrupted or password-protected.');
  }
}

/**
 * Converts multiple JPG images into a single PDF document.
 * Each image gets its own page sized to the image dimensions.
 */
export async function jpgToPdf(files: File[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    const uint8 = new Uint8Array(imageBytes);
    
    let image;
    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.png')) {
      image = await pdfDoc.embedPng(uint8);
    } else {
      image = await pdfDoc.embedJpg(uint8);
    }
    
    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }
  
  return await pdfDoc.save();
}

/**
 * Triggers a browser download of an arbitrary Blob.
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 2000);
}

/**
 * Merges multiple PDF files into a single PDF document.
 * Uses structural merging (copyPages) — preserves text, vectors, images.
 */
export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      for (const page of copiedPages) {
        mergedPdf.addPage(page);
      }
    } catch (err) {
      console.error(`Failed to process file: ${file.name}`, err);
      throw new Error(`Could not process "${file.name}". It may be corrupted or password-protected.`);
    }
  }

  // Save with object streams for smaller file size
  const pdfBytes = await mergedPdf.save();
  return pdfBytes;
}

/**
 * Compresses a PDF by loading and re-saving it through pdf-lib.
 * pdf-lib removes unused objects, deduplicates streams, and rebuilds xref.
 * Note: This is structural optimization, not image recompression.
 */
export async function compressPdf(file: File): Promise<Uint8Array> {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    
    // Remove metadata to save space
    pdf.setTitle('');
    pdf.setAuthor('');
    pdf.setSubject('');
    pdf.setKeywords([]);
    pdf.setProducer('Docabot');
    pdf.setCreator('Docabot');
    
    // Save — pdf-lib rebuilds the PDF structure which removes unused objects
    const pdfBytes = await pdf.save();
    return pdfBytes;
  } catch (err) {
    console.error('Failed to compress PDF:', err);
    throw new Error('Could not process this file. It may be corrupted or password-protected.');
  }
}

/**
 * Triggers a browser download of the given bytes as a PDF file.
 */
export function downloadPdfBytes(pdfBytes: Uint8Array, filename: string) {
  const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 2000);
}
