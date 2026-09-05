"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-2xl text-primary dark:text-white tracking-tight">
            Docabot
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">Home</Link>
            <Link href="/tools" className="text-foreground/80 hover:text-primary transition-colors">PDF Tools</Link>
            <Link href="/compress-pdf" className="text-foreground/80 hover:text-primary transition-colors">Compress PDF</Link>
            <Link href="/merge-pdf" className="text-foreground/80 hover:text-primary transition-colors">Merge PDF</Link>
            <Link href="/pdf-to-word" className="text-foreground/80 hover:text-primary transition-colors">PDF to Word</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <Link 
            href="/tools" 
            className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-white hover:bg-primary-dark h-9 px-4 py-2"
          >
            All Tools
          </Link>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -mr-2 text-foreground"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="flex flex-col p-4 bg-background shadow-lg gap-4">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">Home</Link>
            <Link href="/tools" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">PDF Tools</Link>
            <Link href="/compress-pdf" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">Compress PDF</Link>
            <Link href="/merge-pdf" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">Merge PDF</Link>
            <Link href="/pdf-to-word" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">PDF to Word</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
