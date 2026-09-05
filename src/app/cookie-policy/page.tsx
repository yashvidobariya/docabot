import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy | Docabot",
  description: "Learn about how Docabot uses cookies and similar technologies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <div className="flex-1 bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-foreground">Cookie Policy</h1>
        <p className="text-sm text-foreground/50 text-center mb-12">Last updated: September 2026</p>

        <div className="prose prose-blue dark:prose-invert max-w-none prose-lg">
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the site owners.
          </p>

          <h2>How We Use Cookies</h2>
          <p>Docabot uses cookies for the following purposes:</p>
          
          <h3>Essential Cookies</h3>
          <p>
            These cookies are necessary for the website to function properly. They include cookies that store your theme preference (dark/light mode). Without these cookies, the website would not work correctly.
          </p>
          
          <h3>Analytics Cookies</h3>
          <p>
            We may use analytics cookies (such as those from Google Analytics) to collect anonymous data about how visitors use our website. This helps us understand which pages are most popular and how visitors navigate the site, allowing us to improve the user experience.
          </p>
          <p>
            Analytics cookies collect information such as: the number of visitors, the pages visited, time spent on pages, and how visitors arrived at our site. This data is aggregated and anonymous — it does not identify individual visitors.
          </p>

          <h2>Third-Party Cookies</h2>
          <p>
            Some cookies may be set by third-party services we use, such as analytics providers. These third parties have their own privacy and cookie policies.
          </p>

          <h2>Managing Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings. You can set your browser to refuse cookies or to delete cookies that have already been set. However, please note that disabling essential cookies may affect the functionality of the website.
          </p>
          <p>
            Here are links to cookie management instructions for popular browsers:
          </p>
          <ul>
            <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
            <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Cookies</li>
            <li><strong>Edge:</strong> Settings → Privacy → Cookies</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. We will notify you of any changes by posting the updated policy on this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about our use of cookies, please contact us at <a href="mailto:support@docabot.com">support@docabot.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
