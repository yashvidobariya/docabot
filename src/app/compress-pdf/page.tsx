"use client";

import React, { useState } from "react";
import { TOOLS } from "@/config/tools";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultCard } from "@/components/ResultCard";
import { compressPdf, downloadPdfBytes } from "@/lib/pdf/pdfUtils";
import { ArrowRight, Settings2 } from "lucide-react";

export default function CompressPdfPage() {
  const tool = TOOLS.find(t => t.slug === 'compress-pdf')!;
  
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState<'balanced' | 'high' | 'maximum'>('balanced');
  const [resultStats, setResultStats] = useState({ originalSize: 0, newSize: 0 });
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);

  const handleUpload = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
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
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 15;
      });
    }, 250);

    try {
      // Actually compress the uploaded PDF using pdf-lib
      const bytes = await compressPdf(files[0]);

      clearInterval(interval);
      setProgress(100);
      setPdfBytes(bytes);

      const totalOriginalSize = files[0].size;
      setResultStats({
        originalSize: totalOriginalSize,
        newSize: bytes.length
      });

      setTimeout(() => setStatus('success'), 400);
    } catch {
      clearInterval(interval);
      setStatus('error');
    }
  };

  const downloadFileName = files.length > 0 ? `compressed_${files[0].name}` : 'compressed_document.pdf';

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
                      <Settings2 className="w-5 h-5 text-primary" />
                      Compression Level
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button 
                        onClick={() => setCompressionLevel('high')}
                        className={`p-4 rounded-xl text-left border-2 transition-colors ${compressionLevel === 'high' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                      >
                        <div className="font-medium mb-1 text-foreground">High Quality</div>
                        <div className="text-xs text-foreground/60">Less compression, maximum visual quality</div>
                      </button>
                      <button 
                        onClick={() => setCompressionLevel('balanced')}
                        className={`p-4 rounded-xl text-left border-2 transition-colors relative ${compressionLevel === 'balanced' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                      >
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">Recommended</div>
                        <div className="font-medium mb-1 text-foreground">Balanced</div>
                        <div className="text-xs text-foreground/60">Good compression, good quality</div>
                      </button>
                      <button 
                        onClick={() => setCompressionLevel('maximum')}
                        className={`p-4 rounded-xl text-left border-2 transition-colors ${compressionLevel === 'maximum' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                      >
                        <div className="font-medium mb-1 text-foreground">Maximum</div>
                        <div className="text-xs text-foreground/60">High compression, noticeable quality loss</div>
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={processFiles}
                      className="px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center w-full sm:w-auto justify-center"
                    >
                      Compress PDF
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {status === 'processing' && (
            <ProgressBar progress={progress} statusText="Compressing your PDF..." />
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
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">How to Compress PDF Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Upload</h3>
              <p className="text-sm text-foreground/70">Select a PDF file from your device and upload it.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Choose Quality</h3>
              <p className="text-sm text-foreground/70">Select a compression level based on your needs — quality or file size.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Download</h3>
              <p className="text-sm text-foreground/70">Download your compressed PDF file instantly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
