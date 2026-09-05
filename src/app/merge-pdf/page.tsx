"use client";

import React, { useState } from "react";
import { TOOLS } from "@/config/tools";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultCard } from "@/components/ResultCard";
import { mergePdfs, downloadPdfBytes } from "@/lib/pdf/pdfUtils";
import { ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function MergePdfPage() {
  const tool = TOOLS.find(t => t.slug === 'merge-pdf')!;
  
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [resultStats, setResultStats] = useState({ originalSize: 0, newSize: 0 });
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);

  const handleUpload = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    setStatus('processing');
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) {
          clearInterval(interval);
          return 90;
        }
        return p + 10;
      });
    }, 300);

    try {
      // Actually merge the uploaded PDFs using pdf-lib copyPages
      const bytes = await mergePdfs(files);

      clearInterval(interval);
      setProgress(100);
      setPdfBytes(bytes);

      const totalOriginalSize = files.reduce((acc, f) => acc + f.size, 0);
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

  const downloadFileName = files.length > 0 ? `merged_${files[0].name}` : 'merged_document.pdf';

  const handleDownload = () => {
    if (pdfBytes) {
      downloadPdfBytes(pdfBytes, downloadFileName);
    }
  };

  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{tool.name}</h1>
          <p className="text-lg text-foreground/70">{tool.description}</p>
        </div>

        {/* Main Interactive Area */}
        <div className="bg-background border border-border rounded-3xl shadow-sm p-6 md:p-10 mb-20">
          {status === 'idle' && (
            <>
              <FileUploader 
                onUpload={handleUpload} 
                accept={{ "application/pdf": [".pdf"] }}
                multiple={true}
              />
              <FileList files={files} onRemove={removeFile} />
              
              {files.length > 0 && (
                <div className="mt-8 pt-8 border-t border-border flex justify-end">
                  <button 
                    onClick={processFiles}
                    className="px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center"
                  >
                    Merge PDF Files
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              )}
            </>
          )}

          {status === 'processing' && (
            <ProgressBar progress={progress} statusText="Merging and optimizing your PDFs..." />
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
                We couldn&apos;t process this file. Please try again or use another PDF.
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

        {/* Content Section */}
        <div className="max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">How to Merge PDF Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Upload</h3>
              <p className="text-sm text-foreground/70">Select two or more PDF files from your device and drag them into the upload area.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Process</h3>
              <p className="text-sm text-foreground/70">Arrange the files in the order you want, then click Merge. Our engine will combine and optimize them.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Download</h3>
              <p className="text-sm text-foreground/70">Download your newly merged PDF document instantly and securely.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <ShieldCheck className="text-primary" />
                Secure PDF Merging
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                We take your privacy seriously. All files uploaded to Docabot are encrypted during transit and processing. They are not stored permanently on our servers and are automatically deleted after processing is complete.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <Zap className="text-primary" />
                Optimized Output
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                Unlike basic merge tools that blindly combine files resulting in massive sizes, Docabot attempts to optimize the underlying structure of the merged PDF, removing duplicate fonts and metadata where technically possible to keep your file size manageable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
