import { Sparkles } from 'lucide-react';

const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
        <Sparkles className="w-4 h-4" />
      </div>

      {/* Typing dots */}
      <div className="bg-card border border-border rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1">
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot-1" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot-2" />
        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-typing-dot-3" />
      </div>
    </div>
  );
};

export default TypingIndicator;
