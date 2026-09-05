import Link from "next/link";
import { ToolGrid } from "@/components/ToolGrid";
import { ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-28 md:pt-32 md:pb-40 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            All Your <span className="text-primary dark:text-primary-light">PDF Tools</span> in One Place
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl mx-auto">
            Merge, compress, convert, split and manage your PDF files quickly and easily with Docabot.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/tools" 
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl flex items-center justify-center group"
            >
              Explore PDF Tools
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/merge-pdf" 
              className="w-full sm:w-auto px-8 py-4 bg-surface text-foreground font-medium rounded-xl border border-border hover:border-primary transition-colors hover:shadow-md flex items-center justify-center"
            >
              Merge PDF
            </Link>
          </div>
        </div>
      </section>

      {/* Tool Grid Section */}
      <section className="py-20 bg-background" id="tools">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Most Popular Tools</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Choose from our selection of easy-to-use tools to quickly process your PDF documents.
            </p>
          </div>
          <ToolGrid />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-surface border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Why Choose Docabot?</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              We focus on speed, quality, and simplicity so you can get your work done faster.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Lightning Fast</h3>
              <p className="text-foreground/70">
                Process your files in seconds. Our tools are optimized for maximum speed and efficiency.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">High Quality</h3>
              <p className="text-foreground/70">
                We prioritize document correctness and visual quality without unnecessary file bloat.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Privacy First</h3>
              <p className="text-foreground/70">
                Your files are processed securely. We don&apos;t store your documents longer than necessary.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
