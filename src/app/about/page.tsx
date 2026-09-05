import { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Cpu, Heart, CheckCircle2, Lock, FileCode, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Docabot | Our Mission & Privacy-First Document Architecture",
  description: "Learn about Docabot, our client-side document processing technology, and our commitment to providing free, private PDF utilities without server uploads.",
};

export default function AboutPage() {
  return (
    <div className="flex-1 bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground tracking-tight">About Docabot</h1>
          <p className="text-lg md:text-xl text-foreground/75 max-w-2xl mx-auto leading-relaxed">
            Building private, accessible, and fast document utilities that run entirely where they belong: on your own device.
          </p>
        </div>
        
        <div className="prose prose-blue dark:prose-invert max-w-none prose-lg space-y-8 text-foreground/80 leading-relaxed">
          <section className="bg-surface p-8 rounded-3xl border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-4 mt-0 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" /> The Problem with Traditional PDF Converters
            </h2>
            <p>
              Most online document utilities require you to upload your sensitive contracts, tax returns, personal identification documents, and financial statements to remote cloud servers. Often, users have no visibility into how long those documents are retained, who has access to them, or what automated logging pipelines process their content.
            </p>
            <p className="mb-0">
              Furthermore, traditional converters are frequently cluttered with confusing download buttons, deceptive ads, forced email collection, and restrictive daily paywalls. We created Docabot to provide a clean, modern, and genuinely private alternative.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Technology: 100% Client-Side Processing</h2>
            <p>
              Docabot is built on modern web standards, leveraging advanced JavaScript and WebAssembly libraries including <code>pdf-lib</code>, <code>pdfjs-dist</code>, and <code>docx</code>. When you interact with any Docabot utility:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Zero Remote Uploads:</strong> Your documents are processed entirely inside your web browser’s memory sandbox. Files are never transmitted across the internet to any external server.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Complete Confidentiality:</strong> Because Docabot has no central file storage backend, there is literally no data for unauthorized third parties to intercept or compromise.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span><strong>Instant Execution:</strong> No waiting in file upload queues or downloading large remote files. Processing begins immediately using your device’s local computing power.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">What We Offer</h2>
            <p>
              Docabot currently focuses on eight essential document utilities designed to solve everyday personal and business administrative needs:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-6">
              <div className="p-4 rounded-xl border border-border bg-surface">
                <h3 className="font-semibold text-foreground mb-1">Organization</h3>
                <p className="text-sm text-foreground/70"><Link href="/merge-pdf" className="text-primary hover:underline">Merge PDF</Link>, <Link href="/split-pdf" className="text-primary hover:underline">Split PDF</Link>, <Link href="/rotate-pdf" className="text-primary hover:underline">Rotate PDF</Link></p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-surface">
                <h3 className="font-semibold text-foreground mb-1">Optimization</h3>
                <p className="text-sm text-foreground/70"><Link href="/compress-pdf" className="text-primary hover:underline">Compress PDF</Link> file size</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-surface">
                <h3 className="font-semibold text-foreground mb-1">Conversion to PDF</h3>
                <p className="text-sm text-foreground/70"><Link href="/word-to-pdf" className="text-primary hover:underline">Word to PDF</Link>, <Link href="/jpg-to-pdf" className="text-primary hover:underline">JPG to PDF</Link></p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-surface">
                <h3 className="font-semibold text-foreground mb-1">Conversion from PDF</h3>
                <p className="text-sm text-foreground/70"><Link href="/pdf-to-word" className="text-primary hover:underline">PDF to Word (.docx)</Link>, <Link href="/pdf-to-jpg" className="text-primary hover:underline">PDF to JPG</Link></p>
              </div>
            </div>
            <p className="text-sm text-foreground/70 italic">
              Note: We only list features that are actively operational on our site. We do not claim support for formats we do not currently handle.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Core Principles</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">1. Privacy by Architecture, Not Just Promises</h3>
                <p className="text-sm text-foreground/70">
                  Rather than asking you to trust our privacy policy while uploading your documents to our servers, we designed the entire technical system so that we never receive your files in the first place.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">2. Transparent, Honest Functionality</h3>
                <p className="text-sm text-foreground/70">
                  We don’t use deceptive download buttons or trick users into accidental subscriptions. The tools do exactly what they describe.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">3. Free Accessibility</h3>
                <p className="text-sm text-foreground/70">
                  We believe basic document productivity utilities should be universally accessible to students, freelancers, job applicants, and small business owners without costly monthly software licenses.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-surface p-8 rounded-3xl border border-border mt-12 text-center not-prose">
            <h3 className="text-2xl font-bold mb-3 text-foreground">Have Questions or Suggestions?</h3>
            <p className="text-foreground/70 mb-6 text-sm max-w-md mx-auto">
              We actively maintain Docabot and welcome feedback on new features, browser compatibility, and bug reports.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center px-8 py-3.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors shadow-md"
            >
              Get in Touch with Our Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
