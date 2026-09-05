"use client";

import React from "react";
import { File as FileIcon, X, GripVertical } from "lucide-react";

interface FileListProps {
  files: File[];
  onRemove: (index: number) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  if (files.length === 0) return null;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Selected Files ({files.length})</h3>
      </div>
      
      <ul className="space-y-3">
        {files.map((file, index) => (
          <li 
            key={`${file.name}-${index}`}
            className="flex items-center gap-4 p-3 bg-surface border border-border rounded-lg hover:border-primary/30 transition-colors group"
          >
            <div className="text-foreground/30 cursor-grab active:cursor-grabbing">
              <GripVertical className="w-5 h-5" />
            </div>
            
            <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
              <FileIcon className="w-5 h-5 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{file.name}</p>
              <p className="text-xs text-foreground/50">{formatSize(file.size)}</p>
            </div>
            
            <button 
              onClick={() => onRemove(index)}
              className="p-2 text-foreground/40 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              aria-label="Remove file"
            >
              <X className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
