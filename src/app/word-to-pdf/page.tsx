"use client";

import React, { useState } from "react";
import { TOOLS } from "@/config/tools";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultCard } from "@/components/ResultCard";
import { downloadPdfBytes } from "@/lib/pdf/pdfUtils";
import { convertDocxToText } from "@/lib/pdf/docxUtils";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ArrowRight, ShieldCheck, FileOutput, Info } from "lucide-react";

export default function WordToPdfPage() {
  const tool = TOOLS.find(t => t.slug === 'word-to-pdf')!;
  
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [resultStats, setResultStats] = useState({ originalSize: 0, newSize: 0 });
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);

  const handleUpload = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    setStatus('processing');
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + 15;
      });
    }, 300);

    try {
      // Extract text from DOCX using mammoth
      const text = await convertDocxToText(files[0]);
      
      // Create PDF from extracted text
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontSize = 11;
      const lineHeight = fontSize * 1.6;
      const margin = 60;
      const pageWidth = 595.28; // A4
      const pageHeight = 841.89;
      const maxWidth = pageWidth - margin * 2;
      
      // Split text into lines that fit the page width
      const paragraphs = text.split('\n');
      const allLines: string[] = [];
      
      for (const para of paragraphs) {
        if (para.trim() === '') {
          allLines.push('');
          continue;
        }
        
        const words = para.split(' ');
        let currentLine = '';
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (testWidth > maxWidth && currentLine) {
            allLines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) allLines.push(currentLine);
      }
      
      // Paginate
      const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
      
      for (let i = 0; i < allLines.length; i += linesPerPage) {
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        const pageLines = allLines.slice(i, i + linesPerPage);
        
        // Add title on first page
        if (i === 0) {
          const title = files[0].name.replace(/\.(docx?|doc)$/i, '');
          page.drawText(title, {
            x: margin,
            y: pageHeight - margin,
            size: 18,
            font: boldFont,
            color: rgb(0.1, 0.1, 0.1),
          });
        }
        
        let y = pageHeight - margin - (i === 0 ? 40 : 0);
        for (const line of pageLines) {
          if (y < margin) break;
          page.drawText(line, {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0.15, 0.15, 0.15),
          });
          y -= lineHeight;
        }
      }
      
      if (pdfDoc.getPageCount() === 0) {
        pdfDoc.addPage([pageWidth, pageHeight]);
      }
      
      const bytes = await pdfDoc.save();

      clearInterval(interval);
      setProgress(100);
      setPdfBytes(bytes);

      setResultStats({
        originalSize: files[0].size,
        newSize: bytes.length,
      });

      setTimeout(() => setStatus('success'), 400);
    } catch (err) {
      console.error('Word to PDF conversion failed:', err);
      clearInterval(interval);
      setStatus('error');
    }
  };

  const downloadFileName = files.length > 0 
    ? files[0].name.replace(/\.(docx?|doc)$/i, '.pdf') 
    : 'converted_document.pdf';

  const handleDownload = () => {
    if (pdfBytes) {
      downloadPdfBytes(pdfBytes, downloadFileName);
    }
  };

  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{tool.name}</h1>
          <p className="text-lg text-foreground/70">{tool.description}</p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Note:</strong> This tool converts text content from DOCX files to PDF. Basic text and paragraphs are preserved. Complex formatting like tables, images, and advanced styling may not transfer perfectly.
          </p>
        </div>

        <div className="bg-background border border-border rounded-3xl shadow-sm p-6 md:p-10 mb-20">
          {status === 'idle' && (
            <>
              {files.length === 0 ? (
                <FileUploader 
                  onUpload={handleUpload} 
                  accept={{ 
                    "application/msword": [".doc"],
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] 
                  }}
                  multiple={false}
                  maxFiles={1}
                />
              ) : (
                <div className="space-y-8">
                  <FileList files={files} onRemove={removeFile} />
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={processFiles}
                      className="px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center w-full sm:w-auto justify-center"
                    >
                      Convert to PDF
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {status === 'processing' && (
            <ProgressBar progress={progress} statusText="Converting your Word document to PDF..." />
          )}

          {status === 'success' && (
            <ResultCard 
              originalSize={resultStats.originalSize}
              newSize={resultStats.newSize}
              fileName={downloadFileName}
              onReset={() => {
                setStatus('idle');
                setFiles([]);
                setPdfBytes(null);
              }}
              onDownload={handleDownload}
            />
          )}

          {status === 'error' && (
            <div className="text-center p-8">
              <p className="text-red-500 dark:text-red-400 text-lg font-medium mb-4">
                We couldn&apos;t convert this file. Make sure it&apos;s a valid Word document (.docx).
              </p>
              <button 
                onClick={() => { setStatus('idle'); setFiles([]); }}
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">How to Convert Word to PDF</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Upload</h3>
              <p className="text-sm text-foreground/70">Select a Word document (.docx) from your device.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Convert</h3>
              <p className="text-sm text-foreground/70">The text content is extracted and formatted into a clean PDF.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Download</h3>
              <p className="text-sm text-foreground/70">Download your new PDF document.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <ShieldCheck className="text-primary" />
                Secure Conversion
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                All processing happens in your browser. Your Word document never leaves your device.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <FileOutput className="text-primary" />
                Clean PDF Output
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                The output is a properly formatted A4 PDF with clean typography, making it ideal for sharing or printing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
