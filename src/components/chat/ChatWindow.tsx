import { useRef, useEffect } from 'react';
import { Message } from '@/types/app';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Sparkles } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSuggestionClick?: (suggestion: string) => void;
}

const ChatWindow = ({ messages, isLoading, onSuggestionClick }: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">
            What do you want to <span className="gradient-text">build</span>?
          </h2>
          <p className="text-muted-foreground mb-8">
            Describe your app idea in plain English. I'll help you refine it and generate production-ready React code.
          </p>
          
          <div className="grid gap-3">
            <SuggestionCard 
              title="Task Manager"
              description="A simple todo app with categories and due dates"
              onClick={() => onSuggestionClick?.("I want to build a task manager app with categories, due dates, and the ability to mark tasks as complete.")}
            />
            <SuggestionCard 
              title="E-commerce Store"
              description="Product listing with cart and checkout flow"
              onClick={() => onSuggestionClick?.("I want to build an e-commerce store with product listings, a shopping cart, and a checkout flow.")}
            />
            <SuggestionCard 
              title="Dashboard"
              description="Analytics dashboard with charts and data tables"
              onClick={() => onSuggestionClick?.("I want to build an analytics dashboard with charts, graphs, and data tables.")}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isLoading && <TypingIndicator />}
    </div>
  );
};

const SuggestionCard = ({ title, description, onClick }: { title: string; description: string; onClick?: () => void }) => {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-200 group"
    >
      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </button>
  );
};

export default ChatWindow;
