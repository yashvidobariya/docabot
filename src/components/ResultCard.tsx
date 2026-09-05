"use client";

import React from "react";
import { Download, RefreshCw, CheckCircle2 } from "lucide-react";

interface ResultCardProps {
  originalSize: number;
  newSize: number;
  fileName: string;
  onReset: () => void;
  onDownload?: () => void;
}

export function ResultCard({ originalSize, newSize, fileName, onReset, onDownload }: ResultCardProps) {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const savedPercentage = originalSize > 0 
    ? Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100))
    : 0;

  return (
    <div className="w-full bg-surface border border-border rounded-2xl p-8 text-center shadow-sm">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-foreground">Processing Complete!</h2>
      <p className="text-foreground/70 mb-8 max-w-md mx-auto truncate">
        {fileName} has been successfully processed.
      </p>

      <div className="flex justify-center items-center gap-8 mb-10 max-w-sm mx-auto">
        <div className="text-center">
          <p className="text-xs text-foreground/50 mb-1 uppercase tracking-wider font-semibold">Original</p>
          <p className="text-lg font-medium text-foreground">{formatSize(originalSize)}</p>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-foreground/50 mb-1 uppercase tracking-wider font-semibold">Saved</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">{savedPercentage}%</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-foreground/50 mb-1 uppercase tracking-wider font-semibold">New Size</p>
          <p className="text-lg font-medium text-foreground">{formatSize(newSize)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button 
          onClick={onDownload}
          className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md flex items-center justify-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Download File
        </button>
        <button 
          onClick={onReset}
          className="w-full sm:w-auto px-8 py-4 bg-transparent text-foreground border border-border font-medium rounded-xl hover:bg-secondary dark:hover:bg-secondary-dark transition-colors flex items-center justify-center"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Process Another
        </button>
      </div>
    </div>
  );
}
