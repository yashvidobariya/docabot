import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface mt-auto w-full">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 lg:gap-12 items-start justify-items-center">
          <div className="space-y-4">
            <Link href="/" className="font-bold text-2xl text-primary dark:text-white tracking-tight block">
              Docabot
            </Link>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Smart tools for your documents. Simple, fast, and secure in-browser PDF utilities.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">PDF Tools</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/merge-pdf" className="text-foreground/70 hover:text-primary transition-colors">Merge PDF</Link></li>
              <li><Link href="/compress-pdf" className="text-foreground/70 hover:text-primary transition-colors">Compress PDF</Link></li>
              <li><Link href="/pdf-to-word" className="text-foreground/70 hover:text-primary transition-colors">PDF to Word</Link></li>
              <li><Link href="/word-to-pdf" className="text-foreground/70 hover:text-primary transition-colors">Word to PDF</Link></li>
              <li><Link href="/pdf-to-jpg" className="text-foreground/70 hover:text-primary transition-colors">PDF to JPG</Link></li>
              <li><Link href="/jpg-to-pdf" className="text-foreground/70 hover:text-primary transition-colors">JPG to PDF</Link></li>
              <li><Link href="/split-pdf" className="text-foreground/70 hover:text-primary transition-colors">Split PDF</Link></li>
              <li><Link href="/rotate-pdf" className="text-foreground/70 hover:text-primary transition-colors">Rotate PDF</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-foreground/70 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-foreground/70 hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link href="/tools" className="text-foreground/70 hover:text-primary transition-colors">All Tools</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy-policy" className="text-foreground/70 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-foreground/70 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="text-foreground/70 hover:text-primary transition-colors">Cookie Policy</Link></li>
              <li><Link href="/disclaimer" className="text-foreground/70 hover:text-primary transition-colors">Disclaimer</Link></li>
              <li><Link href="/dmca" className="text-foreground/70 hover:text-primary transition-colors">DMCA Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground/60">
          <p>© {year} Docabot. All rights reserved.</p>
          <p className="text-xs text-foreground/50">100% Private Client-Side Document Processing</p>
        </div>
      </div>
    </footer>
  );
}
