"use client";

import React, { useState } from "react";
import { TOOLS } from "@/config/tools";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { ProgressBar } from "@/components/ProgressBar";
import { ResultCard } from "@/components/ResultCard";
import { splitPdf, getPdfPageCount, downloadPdfBytes } from "@/lib/pdf/pdfUtils";
import { ArrowRight, ShieldCheck, Scissors } from "lucide-react";

export default function SplitPdfPage() {
  const tool = TOOLS.find(t => t.slug === 'split-pdf')!;
  
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [pageRange, setPageRange] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [resultStats, setResultStats] = useState({ originalSize: 0, newSize: 0 });
  const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpload = async (newFiles: File[]) => {
    setFiles(newFiles);
    try {
      const count = await getPdfPageCount(newFiles[0]);
      setTotalPages(count);
      setPageRange(`1-${count}`);
    } catch {
      setTotalPages(0);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setTotalPages(0);
    setPageRange('');
  };

  const processFiles = async () => {
    if (files.length === 0 || !pageRange.trim()) return;

    setStatus('processing');
    setProgress(0);
    setErrorMessage('');

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + 15;
      });
    }, 250);

    try {
      const bytes = await splitPdf(files[0], pageRange);

      clearInterval(interval);
      setProgress(100);
      setPdfBytes(bytes);

      setResultStats({
        originalSize: files[0].size,
        newSize: bytes.length,
      });

      setTimeout(() => setStatus('success'), 400);
    } catch (err: any) {
      clearInterval(interval);
      setErrorMessage(err.message || 'Failed to split PDF.');
      setStatus('error');
    }
  };

  const downloadFileName = files.length > 0 ? `split_${files[0].name}` : 'split_document.pdf';

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
                      <Scissors className="w-5 h-5 text-primary" />
                      Select Pages to Extract
                    </h3>
                    <p className="text-sm text-foreground/60 mb-4">
                      This PDF has <span className="font-bold text-foreground">{totalPages}</span> pages. Enter the page ranges you want to keep.
                    </p>
                    <input
                      type="text"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      placeholder="e.g. 1-3, 5, 7-9"
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    />
                    <p className="text-xs text-foreground/50 mt-2">Use commas to separate ranges. Example: 1-3, 5, 8-10</p>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={processFiles}
                      className="px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center w-full sm:w-auto justify-center"
                    >
                      Split PDF
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {status === 'processing' && (
            <ProgressBar progress={progress} statusText="Extracting selected pages..." />
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
                setTotalPages(0);
                setPageRange('');
              }}
              onDownload={handleDownload}
            />
          )}

          {status === 'error' && (
            <div className="text-center p-8">
              <p className="text-red-500 dark:text-red-400 text-lg font-medium mb-4">
                {errorMessage || "We couldn't process this file. Please try again."}
              </p>
              <button 
                onClick={() => { setStatus('idle'); setFiles([]); setTotalPages(0); setPageRange(''); }}
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">How to Split PDF Files</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Upload</h3>
              <p className="text-sm text-foreground/70">Select a PDF file from your device.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Select Pages</h3>
              <p className="text-sm text-foreground/70">Enter the page numbers or ranges you want to extract.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Download</h3>
              <p className="text-sm text-foreground/70">Download your new PDF with only the selected pages.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <ShieldCheck className="text-primary" />
                Secure Processing
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                All files are processed directly in your browser. Nothing is uploaded to any server, so your documents remain completely private.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <Scissors className="text-primary" />
                Flexible Page Selection
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                Extract a single page, multiple pages, or complex ranges. Use comma-separated values and hyphens to specify exactly which pages you need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
