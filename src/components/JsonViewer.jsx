import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const JsonViewer = ({ data, isLoading = false, error = null }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="glow-border rounded-lg p-8 bg-card">
        <div className="flex items-center justify-center gap-3">
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
          <span className="ml-2 text-muted-foreground font-mono">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glow-border rounded-lg p-6 bg-card border-destructive">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="text-destructive text-sm">!</span>
          </div>
          <div className="flex-1">
            <h4 className="text-destructive font-semibold mb-1">Error Loading Data</h4>
            <p className="text-sm text-muted-foreground font-mono">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glow-border rounded-lg p-6 bg-card">
        <p className="text-muted-foreground font-mono text-center">No data available</p>
      </div>
    );
  }

  return (
    <div className="relative glow-border rounded-lg bg-card overflow-hidden">
      {/* Header with Copy Button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-secondary/50">
        <span className="text-xs font-mono text-muted-foreground">JSON Response</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary border border-border hover:border-primary text-foreground text-xs font-mono transition-all duration-300"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-primary" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* JSON Content */}
      <pre className="p-6 overflow-x-auto text-sm font-mono">
        <code className="text-foreground">{syntaxHighlight(data)}</code>
      </pre>
    </div>
  );
};

// Syntax highlighting function
const syntaxHighlight = (json) => {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, null, 2);
  }

  // Split into lines for rendering
  const lines = json.split('\n');
  
  return (
    <div>
      {lines.map((line, index) => (
        <div key={index} className="hover:bg-secondary/30 transition-colors">
          <span className="inline-block w-12 text-muted-foreground select-none text-right pr-4">
            {index + 1}
          </span>
          <span dangerouslySetInnerHTML={{ __html: highlightLine(line) }} />
        </div>
      ))}
    </div>
  );
};

const highlightLine = (line) => {
  // Escape HTML
  line = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Highlight different parts
  line = line.replace(
    /"(.*?)":/g,
    '<span style="color: hsl(var(--primary-glow))">"$1"</span>:'
  ); // Keys
  
  line = line.replace(
    /: "(.*?)"/g,
    ': <span style="color: hsl(var(--success))">"$1"</span>'
  ); // String values
  
  line = line.replace(
    /: (true|false)/g,
    ': <span style="color: hsl(var(--accent))">$1</span>'
  ); // Booleans
  
  line = line.replace(
    /: (null)/g,
    ': <span style="color: hsl(var(--muted-foreground))">$1</span>'
  ); // Null
  
  line = line.replace(
    /: (\d+\.?\d*)/g,
    ': <span style="color: hsl(var(--warning))">$1</span>'
  ); // Numbers
  
  return line;
};