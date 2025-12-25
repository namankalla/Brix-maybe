"use client";
import { useState, useRef, useEffect } from 'react';
import { PaperPlaneIcon, StopIcon } from '@radix-ui/react-icons';

export default function ChatInput({ onSend, isLoading, placeholder }: { onSend: (c: string) => void; isLoading: boolean; placeholder?: string; }) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (!trimmedText || isLoading) return;
    onSend(trimmedText);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
      <div className="max-w-3xl mx-auto py-4 px-4">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={1}
              className="w-full max-h-[200px] min-h-[60px] px-4 py-3 pr-16 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none outline-none transition-all duration-200"
              placeholder={placeholder || 'Message AI App Builder...'}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !text.trim()}
              className={`absolute right-2 bottom-2 p-2 rounded-lg ${isLoading || !text.trim() ? 'text-gray-500' : 'text-white bg-blue-600 hover:bg-blue-700'} transition-colors`}
              aria-label="Send message"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <PaperPlaneIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-center text-gray-400">
            AI can make mistakes. Consider checking important information.
          </p>
        </form>
      </div>
    </div>
  );
}
