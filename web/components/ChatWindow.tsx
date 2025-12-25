// components/ChatWindow.tsx
"use client";
import { useRef, useEffect } from 'react';
import { Message } from '@/types/app';
import MessageBubble from './MessageBubble';

export default function ChatWindow({
  messages,
  isLoading,
  onSuggestionClick,
}: {
  messages: Message[];
  isLoading: boolean;
  onSuggestionClick?: (text: string) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-black text-gray-100">
      <div className="max-w-3xl mx-auto py-6 px-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-6 max-w-2xl">
              <h1 className="text-3xl font-bold">What do you want to build?</h1>
              <p className="text-sm text-gray-400">
                I’ll ask you a bunch of quick questions (like a product manager) and then generate the app when you click
                Build.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'A simple expense tracker for my family',
                  'A task manager for a small team',
                  'A fitness habit tracker with streaks',
                  'A food ordering app for my restaurant'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => onSuggestionClick?.(suggestion)}
                    className="px-4 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 text-left text-sm transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} role={message.role} content={message.content} />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-400 text-sm py-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}