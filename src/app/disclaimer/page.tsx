import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Docabot",
  description: "Read the disclaimer for Docabot's PDF tools and services.",
};

export default function DisclaimerPage() {
  return (
    <div className="flex-1 bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-foreground">Disclaimer</h1>
        <p className="text-sm text-foreground/50 text-center mb-12">Last updated: September 2026</p>

        <div className="prose prose-blue dark:prose-invert max-w-none prose-lg">
          <h2>General Disclaimer</h2>
          <p>
            The information and services provided by Docabot are for general informational and utility purposes only. While we strive to provide accurate and reliable tools, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or the tools provided.
          </p>

          <h2>No Professional Advice</h2>
          <p>
            Docabot is a document processing utility and does not provide professional, legal, or financial advice. The output of our tools should be reviewed for accuracy before being used in any official, legal, or critical context.
          </p>

          <h2>File Processing</h2>
          <p>
            While our tools are designed to process your files accurately, we cannot guarantee that the output will be error-free or that the original document&apos;s quality, formatting, or content will be perfectly preserved in all cases. We recommend:
          </p>
          <ul>
            <li>Always keeping a backup of your original files</li>
            <li>Reviewing the output before using it for critical purposes</li>
            <li>Testing with non-sensitive documents first</li>
          </ul>

          <h2>External Links</h2>
          <p>
            Our website may contain links to external websites. We have no control over the content, privacy policies, or practices of third-party websites and assume no responsibility for them.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            In no event shall Docabot, its operators, or its contributors be liable for any loss or damage including, without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website and its tools.
          </p>

          <h2>Contact</h2>
          <p>
            If you have any questions about this Disclaimer, please contact us at <a href="mailto:support@docabot.com">support@docabot.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
