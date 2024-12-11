import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const html = Prism.highlight(
    code,
    Prism.languages[language] || Prism.languages.text,
    language,
  );

  return (
    <div className="relative group">
      <div
        role="code-container"
        className={`rounded-lg bg-gradient-to-br from-muted to-muted/90 transition-all duration-500 ease-in-out ${
          isCollapsed ? "max-h-16" : "max-h-[2000px]"
        } overflow-hidden`}
      >
        <div className="p-4 relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">{language}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                onClick={copyCode}
                aria-label="Copy code"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label={isCollapsed ? "Expand code" : "Collapse code"}
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <pre className="transition-all duration-500 ease-in-out">
            <code
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </pre>
        </div>
      </div>
      {isCollapsed && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/90 pointer-events-none" />
      )}
    </div>
  );
}
