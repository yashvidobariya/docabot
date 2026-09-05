import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Docabot",
  description: "Read Docabot's privacy policy. Learn how we handle your data and protect your documents.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-foreground">Privacy Policy</h1>
        <p className="text-sm text-foreground/50 text-center mb-12">Last updated: September 2026</p>

        <div className="prose prose-blue dark:prose-invert max-w-none prose-lg">
          <h2>Introduction</h2>
          <p>
            At Docabot, your privacy is our top priority. This Privacy Policy explains how we collect, use, and protect your information when you use our website and PDF processing tools.
          </p>

          <h2>Information We Collect</h2>
          <h3>Files You Upload</h3>
          <p>
            When you use our tools, you may upload PDF, Word, or image files for processing. These files are processed directly in your browser using client-side technology. <strong>Your files are not uploaded to our servers.</strong> All processing occurs locally on your device.
          </p>
          <h3>Usage Information</h3>
          <p>
            We may collect anonymous usage data such as page views, feature usage patterns, browser type, and device information. This data helps us improve our services and is never linked to your personal identity.
          </p>
          <h3>Cookies</h3>
          <p>
            We use essential cookies to maintain your preferences (such as dark/light theme). We may also use analytics cookies to understand how our website is used. See our <a href="/cookie-policy">Cookie Policy</a> for more details.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To provide and maintain our PDF processing services</li>
            <li>To improve our tools and user experience</li>
            <li>To detect and prevent technical issues</li>
            <li>To communicate with you if you contact us</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            Because all file processing happens in your browser, your documents never leave your device. We do not have access to the files you process. Our website uses HTTPS encryption to protect all communications.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We may use third-party analytics services (such as Google Analytics) to understand usage patterns. These services collect anonymous data and have their own privacy policies.
          </p>

          <h2>Your Rights</h2>
          <p>
            You have the right to access, correct, or delete any personal information we hold about you. Since we do not store your uploaded files, there is no file data to delete. For any other data-related requests, please contact us at <a href="mailto:support@docabot.com">support@docabot.com</a>.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@docabot.com">support@docabot.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
