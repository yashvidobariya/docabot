import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
} from 'docx';

// Configure the worker from CDN if not already set
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

/**
 * Converts a DOCX file to HTML using mammoth.js.
 * Returns the HTML string representation of the document.
 */
export async function convertDocxToHtml(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
}

/**
 * Converts a DOCX file to plain text using mammoth.js.
 */
export async function convertDocxToText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

export interface PdfToDocxResult {
  docxBlob: Blob;
  pageCount: number;
  extractedText: string;
  hasImages: boolean;
}

interface TextItemData {
  str: string;
  x: number;
  y: number;
  fontSize: number;
}

interface LineData {
  y: number;
  fontSize: number;
  text: string;
}

/**
 * Converts a PDF file into a real Microsoft Word document (.docx).
 * Extracts text, reconstructs lines & paragraphs, detects headings,
 * preserves page breaks, and falls back to rendering page images if scanned.
 */
export async function convertPdfToDocx(
  file: File,
  onProgress?: (progressPercent: number) => void
): Promise<PdfToDocxResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;

  const docParagraphs: Paragraph[] = [];
  const textPages: string[] = [];
  let totalHasImages = false;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (onProgress) {
      const pct = Math.min(90, Math.round(((pageNum - 1) / numPages) * 80) + 10);
      onProgress(pct);
    }

    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const rawItems = textContent.items as any[];

    // Extract text item coordinates & font size
    const items: TextItemData[] = [];
    for (const raw of rawItems) {
      if (raw && typeof raw.str === 'string' && raw.str.length > 0) {
        const x = Array.isArray(raw.transform) ? raw.transform[4] : 0;
        const y = Array.isArray(raw.transform) ? raw.transform[5] : 0;
        const fontSize = Array.isArray(raw.transform)
          ? Math.max(8, Math.round(Math.abs(raw.transform[0]) || Math.abs(raw.transform[3]) || 12))
          : 12;
        items.push({ str: raw.str, x, y, fontSize });
      }
    }

    const totalTextLength = items.reduce((sum, it) => sum + it.str.trim().length, 0);

    // If page has no selectable text (scanned or image-only PDF), render to image
    if (totalTextLength === 0) {
      try {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          const imageBlob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, 'image/png')
          );
          if (imageBlob) {
            const imgBuffer = await imageBlob.arrayBuffer();
            const uint8 = new Uint8Array(imgBuffer);
            const maxWidth = 550;
            const scale = Math.min(maxWidth / viewport.width, 1);

            docParagraphs.push(
              new Paragraph({
                children: [
                  new ImageRun({
                    data: uint8,
                    transformation: {
                      width: Math.round(viewport.width * scale),
                      height: Math.round(viewport.height * scale),
                    },
                  }),
                ],
                pageBreakBefore: pageNum > 1,
              })
            );
            totalHasImages = true;
            textPages.push(`[Page ${pageNum}: Scanned / Image Page]`);
            continue;
          }
        }
      } catch (err) {
        console.warn(`Could not render image fallback for page ${pageNum}:`, err);
      }
    }

    // Sort items: Top-to-bottom (Y descending), Left-to-right (X ascending)
    items.sort((a, b) => {
      if (Math.abs(a.y - b.y) <= 3) {
        return a.x - b.x;
      }
      return b.y - a.y;
    });

    // Group items on similar Y into lines
    const lines: LineData[] = [];
    let curLineItems: TextItemData[] = [];
    let curLineY: number | null = null;
    let curFontSize = 12;

    for (const item of items) {
      if (curLineY === null) {
        curLineY = item.y;
        curFontSize = item.fontSize;
        curLineItems.push(item);
      } else if (Math.abs(item.y - curLineY) <= Math.max(3, curFontSize * 0.4)) {
        curLineItems.push(item);
      } else {
        curLineItems.sort((a, b) => a.x - b.x);
        let lineText = '';
        for (let i = 0; i < curLineItems.length; i++) {
          const s = curLineItems[i].str;
          if (i === 0) {
            lineText += s;
          } else {
            if (lineText.endsWith(' ') || s.startsWith(' ')) {
              lineText += s;
            } else {
              lineText += ' ' + s;
            }
          }
        }
        if (lineText.trim()) {
          lines.push({ y: curLineY, fontSize: curFontSize, text: lineText.trim() });
        }
        curLineY = item.y;
        curFontSize = item.fontSize;
        curLineItems = [item];
      }
    }

    if (curLineItems.length > 0 && curLineY !== null) {
      curLineItems.sort((a, b) => a.x - b.x);
      let lineText = '';
      for (let i = 0; i < curLineItems.length; i++) {
        const s = curLineItems[i].str;
        if (i === 0) {
          lineText += s;
        } else {
          if (lineText.endsWith(' ') || s.startsWith(' ')) {
            lineText += s;
          } else {
            lineText += ' ' + s;
          }
        }
      }
      if (lineText.trim()) {
        lines.push({ y: curLineY, fontSize: curFontSize, text: lineText.trim() });
      }
    }

    // Append to text summary
    const pageText = lines.map(l => l.text).join('\n');
    textPages.push(pageText || `[Page ${pageNum}: No text]`);

    // Build Word paragraphs from lines
    let isFirstParaOnPage = true;
    for (const line of lines) {
      const isHeading = line.fontSize >= 16;
      const isSubheading = line.fontSize >= 13.5 && line.fontSize < 16;
      const pageBreakBefore = pageNum > 1 && isFirstParaOnPage;
      if (isFirstParaOnPage) isFirstParaOnPage = false;

      if (isHeading) {
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.text,
                bold: true,
                size: Math.min(36, Math.round(line.fontSize * 2)),
              }),
            ],
            spacing: { before: 240, after: 120 },
            pageBreakBefore,
          })
        );
      } else if (isSubheading) {
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.text,
                bold: true,
                size: Math.round(line.fontSize * 2),
              }),
            ],
            spacing: { before: 180, after: 80 },
            pageBreakBefore,
          })
        );
      } else {
        docParagraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.text,
                size: 22, // 11pt
              }),
            ],
            spacing: { after: 100, line: 276 },
            pageBreakBefore,
          })
        );
      }
    }
  }

  // Ensure document has at least one paragraph
  if (docParagraphs.length === 0) {
    docParagraphs.push(
      new Paragraph({
        children: [new TextRun({ text: 'No content could be extracted from this PDF.', size: 22 })],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: docParagraphs,
      },
    ],
  });

  if (onProgress) onProgress(95);
  const docxBlob = await Packer.toBlob(doc);
  if (onProgress) onProgress(100);

  return {
    docxBlob,
    pageCount: numPages,
    extractedText: textPages.map((tp, idx) => `--- Page ${idx + 1} ---\n\n${tp}`).join('\n\n'),
    hasImages: totalHasImages,
  };
}
