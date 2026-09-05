"use client";

import React, { useState } from "react";
import { TOOLS } from "@/config/tools";
import { FileUploader } from "@/components/FileUploader";
import { FileList } from "@/components/FileList";
import { ProgressBar } from "@/components/ProgressBar";
import { downloadBlob } from "@/lib/pdf/pdfUtils";
import { convertPdfToDocx } from "@/lib/pdf/docxUtils";
import { ArrowRight, ShieldCheck, FileText, Download, RefreshCw, CheckCircle2, Info, FileOutput } from "lucide-react";

export default function PdfToWordPage() {
  const tool = TOOLS.find(t => t.slug === 'pdf-to-word')!;
  
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [docxBlob, setDocxBlob] = useState<Blob | null>(null);
  const [docxSize, setDocxSize] = useState(0);
  const [originalSize, setOriginalSize] = useState(0);
  const [extractedText, setExtractedText] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [hasImages, setHasImages] = useState(false);

  const handleUpload = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) return;

    setStatus('processing');
    setProgress(5);

    try {
      const result = await convertPdfToDocx(files[0], (p) => {
        setProgress(p);
      });
      
      setDocxBlob(result.docxBlob);
      setDocxSize(result.docxBlob.size);
      setOriginalSize(files[0].size);
      setPageCount(result.pageCount);
      setExtractedText(result.extractedText);
      setHasImages(result.hasImages);
      setProgress(100);

      setTimeout(() => setStatus('success'), 300);
    } catch (err) {
      console.error('PDF to Word conversion failed:', err);
      setStatus('error');
    }
  };

  const downloadFileName = files.length > 0
    ? `${files[0].name.replace(/\.pdf$/i, '')}.docx`
    : 'converted_document.docx';

  const handleDownload = () => {
    if (!docxBlob) return;
    downloadBlob(docxBlob, downloadFileName);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">{tool.name}</h1>
          <p className="text-lg text-foreground/70">{tool.description}</p>
        </div>

        {/* Info banner about conversion */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Convert to Word (.docx):</strong> Your PDF will be converted to an editable Microsoft Word document. Text, headings, and paragraphs are extracted and preserved.
          </p>
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
                      className="px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center w-full sm:w-auto justify-center cursor-pointer"
                    >
                      Convert to Word
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {status === 'processing' && (
            <ProgressBar progress={progress} statusText="Converting PDF to Word document (.docx)..." />
          )}

          {status === 'success' && (
            <div className="w-full bg-surface border border-border rounded-2xl p-8 text-center shadow-sm">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mb-2 text-foreground">Conversion Complete!</h2>
              <p className="text-foreground/70 mb-6">
                Your PDF has been converted into an editable Microsoft Word document (.docx).
              </p>

              {/* File details stats */}
              <div className="flex justify-center items-center gap-6 sm:gap-10 mb-8 max-w-md mx-auto">
                <div className="text-center">
                  <p className="text-xs text-foreground/50 mb-1 uppercase tracking-wider font-semibold">Original PDF</p>
                  <p className="text-base sm:text-lg font-medium text-foreground">{formatSize(originalSize)}</p>
                </div>
                
                <div className="text-center">
                  <p className="text-xs text-foreground/50 mb-1 uppercase tracking-wider font-semibold">Pages</p>
                  <p className="text-base sm:text-lg font-bold text-primary">{pageCount}</p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-foreground/50 mb-1 uppercase tracking-wider font-semibold">Word File</p>
                  <p className="text-base sm:text-lg font-medium text-foreground">{formatSize(docxSize)}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={handleDownload}
                  className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center justify-center cursor-pointer"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Word Document (.docx)
                </button>
                <button 
                  onClick={() => {
                    setStatus('idle');
                    setFiles([]);
                    setDocxBlob(null);
                    setExtractedText('');
                  }}
                  className="w-full sm:w-auto px-8 py-4 bg-transparent text-foreground border border-border font-medium rounded-xl hover:bg-secondary dark:hover:bg-secondary-dark transition-colors flex items-center justify-center cursor-pointer"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Convert Another PDF
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center p-8">
              <p className="text-red-500 dark:text-red-400 text-lg font-medium mb-4">
                We couldn&apos;t convert this file. Make sure it is a valid PDF document.
              </p>
              <button 
                onClick={() => { setStatus('idle'); setFiles([]); }}
                className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="max-w-none">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">How to Convert PDF to Word</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Upload PDF</h3>
              <p className="text-sm text-foreground/70">Select or drop a PDF file from your device.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Convert</h3>
              <p className="text-sm text-foreground/70">Our engine parses text, headings, and structure into a Word document.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl border border-border">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4">3</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">Download DOCX</h3>
              <p className="text-sm text-foreground/70">Download your editable Microsoft Word (.docx) file instantly.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <ShieldCheck className="text-primary" />
                Browser-Based & Secure
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                All conversion takes place directly in your web browser. Your PDF never leaves your device, guaranteeing 100% privacy and confidentiality.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <FileOutput className="text-primary" />
                Editable Word (.docx) Output
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                Receive genuine Microsoft Word (.docx) files ready for editing in Microsoft Word, Google Docs, LibreOffice, or Office 365.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
