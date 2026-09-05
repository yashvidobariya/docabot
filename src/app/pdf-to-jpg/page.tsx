"use client";

import React, { useState } from "react";
import { TOOLS } from "@/config/tools";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { ProgressBar } from "@/components/ProgressBar";
import { downloadBlob } from "@/lib/pdf/pdfUtils";
import { pdfToImages } from "@/lib/pdf/pdfRenderUtils";
import { ArrowRight, ShieldCheck, Image as ImageIcon, Download, RefreshCw, CheckCircle2 } from "lucide-react";

export default function PdfToJpgPage() {
  const tool = TOOLS.find(t => t.slug === 'pdf-to-jpg')!;
  
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [imageBlobs, setImageBlobs] = useState<{ blob: Blob; pageNumber: number }[]>([]);

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

    try {
      const images = await pdfToImages(files[0], 2, 'image/jpeg', 0.92);
      
      setProgress(100);
      setImageBlobs(images);

      setTimeout(() => setStatus('success'), 400);
    } catch (err) {
      console.error('PDF to JPG conversion failed:', err);
      setStatus('error');
    }
  };

  const downloadSingleImage = (blob: Blob, pageNumber: number) => {
    const baseName = files[0]?.name.replace('.pdf', '') || 'page';
    downloadBlob(blob, `${baseName}_page_${pageNumber}.jpg`);
  };

  const downloadAllAsZip = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const baseName = files[0]?.name.replace('.pdf', '') || 'pages';

    for (const img of imageBlobs) {
      zip.file(`${baseName}_page_${img.pageNumber}.jpg`, img.blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    downloadBlob(zipBlob, `${baseName}_images.zip`);
  };

  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{tool.name}</h1>
          <p className="text-lg text-foreground/70">{tool.description}</p>
        </div>

        <div className="bg-background border border-border rounded-3xl shadow-sm p-6 md:p-10 mb-20">
          {status === 'idle' && (
            <>
              {files.length === 0 ? (
                <FileUploader 
                  onUpload={handleUpload} 
                  accept={{ "application/pdf": [".pdf"] }}
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
                      Convert to JPG
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {status === 'processing' && (
            <ProgressBar progress={progress} statusText="Converting PDF pages to images..." />
          )}

          {status === 'success' && (
            <div className="w-full bg-surface border border-border rounded-2xl p-8 text-center shadow-sm">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2 text-foreground">Conversion Complete!</h2>
              <p className="text-foreground/70 mb-8">
                {imageBlobs.length} page{imageBlobs.length !== 1 ? 's' : ''} converted to JPG images.
              </p>

              {/* Image previews */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 max-h-96 overflow-y-auto">
                {imageBlobs.map(img => (
                  <div key={img.pageNumber} className="relative group border border-border rounded-lg overflow-hidden bg-background">
                    <img 
                      src={URL.createObjectURL(img.blob)} 
                      alt={`Page ${img.pageNumber}`}
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => downloadSingleImage(img.blob, img.pageNumber)}
                        className="px-3 py-2 bg-white text-black text-xs font-medium rounded-lg"
                      >
                        Download Page {img.pageNumber}
                      </button>
                    </div>
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                      Page {img.pageNumber}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={downloadAllAsZip}
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center justify-center"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download All as ZIP
                </button>
                <button 
                  onClick={() => {
                    setStatus('idle');
                    setFiles([]);
                    setImageBlobs([]);
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-transparent text-foreground border border-border font-medium rounded-xl hover:bg-secondary dark:hover:bg-secondary-dark transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Convert Another
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center p-8">
              <p className="text-red-500 dark:text-red-400 text-lg font-medium mb-4">
                We couldn&apos;t convert this file. Please try again.
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
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">How to Convert PDF to JPG</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Upload</h3>
              <p className="text-sm text-foreground/70">Select a PDF file from your device.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Convert</h3>
              <p className="text-sm text-foreground/70">Each page is rendered to a high-quality JPG image.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Download</h3>
              <p className="text-sm text-foreground/70">Download individual images or all pages as a ZIP file.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <ShieldCheck className="text-primary" />
                Private & Secure
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                All conversion happens in your browser. Your PDF never leaves your device, ensuring complete privacy.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <ImageIcon className="text-primary" />
                High Quality Output
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                Pages are rendered at 2x resolution for crisp, high-quality JPG images perfect for presentations or sharing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
