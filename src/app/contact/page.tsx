import { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Docabot",
  description: "Get in touch with the Docabot team. We'd love to hear your feedback, suggestions, or questions.",
};

export default function ContactPage() {
  return (
    <div className="flex-1 bg-background pt-12 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-foreground">Contact Us</h1>
        <p className="text-lg text-foreground/70 text-center mb-12 max-w-xl mx-auto">
          Have a question, suggestion, or need help? We&apos;d love to hear from you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface border border-border rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Email</h3>
            <a href="mailto:support@docabot.com" className="text-primary hover:underline text-sm">
              support@docabot.com
            </a>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Response Time</h3>
            <p className="text-sm text-foreground/70">Within 24-48 hours</p>
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2 text-foreground">Location</h3>
            <p className="text-sm text-foreground/70">Remote-first team, Worldwide</p>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Send Us a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
