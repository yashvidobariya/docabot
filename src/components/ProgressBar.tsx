"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ProgressBarProps {
  progress?: number; // 0-100, if undefined it's indeterminate
  statusText?: string;
}

export function ProgressBar({ progress, statusText = "Processing..." }: ProgressBarProps) {
  const isIndeterminate = progress === undefined;

  return (
    <div className="w-full p-8 border border-border rounded-2xl bg-surface text-center">
      <div className="flex justify-center mb-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
      
      <h3 className="text-xl font-semibold mb-6 text-foreground">{statusText}</h3>
      
      <div className="w-full max-w-md mx-auto h-2 bg-secondary dark:bg-secondary-dark rounded-full overflow-hidden">
        {isIndeterminate ? (
          <div className="h-full bg-primary animate-pulse w-full rounded-full"></div>
        ) : (
          <div 
            className="h-full bg-primary transition-all duration-300 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        )}
      </div>
      
      {!isIndeterminate && (
        <p className="mt-3 text-sm font-medium text-foreground/60">{Math.round(progress)}%</p>
      )}
    </div>
  );
}
