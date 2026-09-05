"use client";

import React, { useState } from "react";
import { TOOLS } from "@/config/tools";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultCard } from "@/components/ResultCard";
import { rotatePdf, downloadPdfBytes } from "@/lib/pdf/pdfUtils";
import { ArrowRight, RotateCw, ShieldCheck } from "lucide-react";

export default function RotatePdfPage() {
  const tool = TOOLS.find(t => t.slug === 'rotate-pdf')!;
  
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [rotation, setRotation] = useState<number>(90);
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
    }, 250);

    try {
      const bytes = await rotatePdf(files[0], rotation);

      clearInterval(interval);
      setProgress(100);
      setPdfBytes(bytes);

      setResultStats({
        originalSize: files[0].size,
        newSize: bytes.length,
      });

      setTimeout(() => setStatus('success'), 400);
    } catch {
      clearInterval(interval);
      setStatus('error');
    }
  };

  const downloadFileName = files.length > 0 ? `rotated_${files[0].name}` : 'rotated_document.pdf';

  const handleDownload = () => {
    if (pdfBytes) {
      downloadPdfBytes(pdfBytes, downloadFileName);
    }
  };

  const rotationOptions = [
    { value: 90, label: '90° Clockwise' },
    { value: 180, label: '180°' },
    { value: 270, label: '270° Clockwise' },
  ];

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
                  
                  <div className="border border-border rounded-xl p-6 bg-surface/50">
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-4 text-foreground">
                      <RotateCw className="w-5 h-5 text-primary" />
                      Rotation Angle
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {rotationOptions.map(opt => (
                        <button 
                          key={opt.value}
                          onClick={() => setRotation(opt.value)}
                          className={`p-4 rounded-xl text-left border-2 transition-colors ${rotation === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                        >
                          <div className="font-medium mb-1 text-foreground flex items-center gap-2">
                            <RotateCw className={`w-4 h-4 ${opt.value === 90 ? '' : opt.value === 180 ? 'rotate-90' : 'rotate-180'}`} />
                            {opt.label}
                          </div>
                          <div className="text-xs text-foreground/60">
                            Rotate all pages {opt.label.toLowerCase()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={processFiles}
                      className="px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center w-full sm:w-auto justify-center"
                    >
                      Rotate PDF
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {status === 'processing' && (
            <ProgressBar progress={progress} statusText="Rotating your PDF pages..." />
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
                We couldn&apos;t process this file. Please try again.
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
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">How to Rotate PDF Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Upload</h3>
              <p className="text-sm text-foreground/70">Select a PDF file from your device.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Choose Rotation</h3>
              <p className="text-sm text-foreground/70">Select the rotation angle — 90°, 180°, or 270° clockwise.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Download</h3>
              <p className="text-sm text-foreground/70">Download your rotated PDF instantly.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <ShieldCheck className="text-primary" />
                Secure & Private
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                All processing happens directly in your browser. Your files are never uploaded to any server, ensuring complete privacy.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <RotateCw className="text-primary" />
                Batch Rotation
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                All pages in your PDF are rotated at once. Perfect for fixing scanned documents that were saved in the wrong orientation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
