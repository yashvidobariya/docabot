import Link from "next/link";
import { type ToolConfig } from "@/config/tools";

export function ToolCard({ tool }: { tool: ToolConfig }) {
  const Icon = tool.icon;
  
  return (
    <Link 
      href={tool.route}
      className="group flex flex-col items-start p-6 bg-surface border border-border rounded-2xl hover:border-primary hover:shadow-md transition-all duration-300"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
        {tool.name}
      </h3>
      <p className="text-sm text-foreground/70 mb-4 line-clamp-2 flex-grow">
        {tool.description}
      </p>
      <div className="text-sm font-medium text-primary mt-auto flex items-center">
        Try now 
        <span className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          →
        </span>
      </div>
    </Link>
  );
}
