import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Policy | Docabot",
  description: "Read Docabot's DMCA policy regarding copyright infringement claims.",
};

export default function DmcaPage() {
  return (
    <div className="flex-1 bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-foreground">DMCA Policy</h1>
        <p className="text-sm text-foreground/50 text-center mb-12">Last updated: September 2026</p>

        <div className="prose prose-blue dark:prose-invert max-w-none prose-lg">
          <h2>Introduction</h2>
          <p>
            Docabot respects the intellectual property rights of others and expects our users to do the same. This policy outlines our procedures for responding to claims of copyright infringement under the Digital Millennium Copyright Act (DMCA).
          </p>

          <h2>Important Note About Our Service</h2>
          <p>
            Docabot is a client-side document processing tool. All file processing occurs entirely within your browser. <strong>We do not upload, store, host, or have access to any files that users process through our tools.</strong> As such, we do not host any user-generated content that could potentially infringe on copyrights.
          </p>

          <h2>Reporting Copyright Infringement</h2>
          <p>
            If you believe that content hosted on our website (such as text, images, or design elements) infringes your copyright, please send a DMCA takedown notice to our designated agent with the following information:
          </p>
          <ol>
            <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
            <li>Identification of the copyrighted work claimed to have been infringed</li>
            <li>Identification of the material that is claimed to be infringing and its location on our website</li>
            <li>Your contact information (name, address, telephone number, and email address)</li>
            <li>A statement that you have a good faith belief that use of the material is not authorized by the copyright owner</li>
            <li>A statement, made under penalty of perjury, that the information in the notice is accurate and that you are the copyright owner or authorized to act on the copyright owner&apos;s behalf</li>
          </ol>

          <h2>DMCA Agent</h2>
          <p>
            Please send all DMCA notices to:
          </p>
          <p>
            <strong>Email:</strong> <a href="mailto:dmca@docabot.com">dmca@docabot.com</a>
          </p>

          <h2>Counter-Notification</h2>
          <p>
            If you believe that your content was removed or access to it was disabled by mistake or misidentification, you may send a counter-notification to our DMCA Agent with the following information:
          </p>
          <ol>
            <li>Your physical or electronic signature</li>
            <li>Identification of the material that was removed or disabled</li>
            <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification</li>
            <li>Your name, address, telephone number, and a statement that you consent to the jurisdiction of the federal court in your district</li>
          </ol>

          <h2>Contact</h2>
          <p>
            For any questions about this DMCA Policy, please contact us at <a href="mailto:support@docabot.com">support@docabot.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
