import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, FileCode, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodePreviewProps {
  code: string;
  fileName: string;
  language?: string;
}

const CodePreview = ({ code, fileName, language = 'typescript' }: CodePreviewProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-primary" />
          <span className="text-sm font-mono text-foreground">{fileName}</span>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded bg-secondary">
            {language}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-1.5"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed">
          <code className="text-foreground">{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodePreview;
