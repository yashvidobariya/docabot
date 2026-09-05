import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Docabot",
  description: "Read Docabot's terms of service. Understand the terms and conditions for using our PDF tools.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex-1 bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-foreground">Terms of Service</h1>
        <p className="text-sm text-foreground/50 text-center mb-12">Last updated: September 2026</p>

        <div className="prose prose-blue dark:prose-invert max-w-none prose-lg">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Docabot (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Docabot provides browser-based PDF processing tools including merging, compressing, converting, splitting, and rotating PDF documents. All file processing occurs locally in your web browser. We do not upload, store, or process your files on our servers.
          </p>

          <h2>3. Use of the Service</h2>
          <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul>
            <li>Use the Service to process documents you do not have the right to access or modify</li>
            <li>Attempt to interfere with or disrupt the Service</li>
            <li>Use automated means to access the Service without our consent</li>
            <li>Use the Service in any way that violates applicable laws or regulations</li>
          </ul>

          <h2>4. Intellectual Property</h2>
          <p>
            The Service, including its design, text, graphics, and code, is owned by Docabot and is protected by intellectual property laws. You retain all rights to the documents you process using our tools.
          </p>

          <h2>5. Disclaimer of Warranties</h2>
          <p>
            The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, error-free, or that the output of any tool will be perfectly accurate.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Docabot shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service. This includes, but is not limited to, damages for loss of data, profits, or other intangible losses.
          </p>

          <h2>7. Privacy</h2>
          <p>
            Your use of the Service is also governed by our <a href="/privacy-policy">Privacy Policy</a>, which is incorporated into these Terms by reference.
          </p>

          <h2>8. Modifications to the Service</h2>
          <p>
            We reserve the right to modify, suspend, or discontinue any part of the Service at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation.
          </p>

          <h2>9. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. We will notify you of changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2>10. Contact</h2>
          <p>
            If you have questions about these Terms, please contact us at <a href="mailto:support@docabot.com">support@docabot.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
