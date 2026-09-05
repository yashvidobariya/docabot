import { Metadata } from "next";
import { TOOLS } from "@/config/tools";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "All PDF Tools | Docabot",
  description: "Browse all of Docabot's PDF tools. Merge, compress, convert, split, rotate and manage your PDF documents online.",
};

export default function ToolsPage() {
  const categories = Array.from(new Set(TOOLS.map(t => t.category)));

  return (
    <div className="flex-1 bg-background">
      <section className="pt-16 pb-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-foreground">
            All PDF Tools
          </h1>
          <p className="text-lg text-foreground/70">
            Everything you need to work with PDFs. Choose a tool below to get started.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {categories.map(category => {
            const categoryTools = TOOLS.filter(t => t.category === category);
            return (
              <div key={category} className="mb-16">
                <h2 className="text-2xl font-bold mb-6 text-foreground">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryTools.map(tool => (
                    <ToolCard key={tool.slug} tool={tool} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
