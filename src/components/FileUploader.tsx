"use client";

import React, { useCallback, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { UploadCloud, AlertCircle } from "lucide-react";

interface FileUploaderProps {
  onUpload: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSizeMB?: number;
  multiple?: boolean;
}

export function FileUploader({ 
  onUpload, 
  accept = { "application/pdf": [".pdf"] }, 
  maxFiles = 20,
  maxSizeMB = 50,
  multiple = true 
}: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);
    
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError(`File is larger than ${maxSizeMB} MB limit.`);
      } else if (rejection.errors[0].code === 'too-many-files') {
        setError(`You can only upload a maximum of ${maxFiles} files.`);
      } else {
        setError("Invalid file type. Please upload a valid document.");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles);
    }
  }, [maxSizeMB, maxFiles, onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: maxSizeMB * 1024 * 1024,
    maxFiles,
    multiple
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-2xl p-10 md:p-16 text-center cursor-pointer transition-colors duration-300 flex flex-col items-center justify-center min-h-[300px]
          ${isDragActive 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <UploadCloud className="w-8 h-8 text-primary" />
        </div>
        
        {isDragActive ? (
          <p className="text-2xl font-bold text-primary">Drop your files here...</p>
        ) : (
          <>
            <p className="text-2xl font-bold mb-2 text-foreground">Drag and drop your files here</p>
            <p className="text-foreground/60 mb-6">or click to browse from your device</p>
            <button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
              Choose Files
            </button>
          </>
        )}
        
        <p className="mt-6 text-sm text-foreground/50">
          Max file size: {maxSizeMB} MB. {multiple && `Max files: ${maxFiles}.`}
        </p>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-3 text-sm font-medium border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}
      
      <p className="text-center text-xs text-foreground/40 mt-4 max-w-lg mx-auto">
        Your documents are processed securely. Files are not retained longer than necessary for processing.
      </p>
    </div>
  );
}
