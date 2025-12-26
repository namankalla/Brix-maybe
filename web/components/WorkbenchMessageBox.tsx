"use client";

import { useEffect, useRef, useState } from 'react';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

export default function WorkbenchMessageBox({
  onSend,
  isLoading,
  placeholder,
}: {
  onSend: (text: string) => void;
  isLoading: boolean;
  placeholder?: string;
}) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [text]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <div className="rounded-2xl border border-gray-800 bg-[#111113] p-3">
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-400">
        <button
          type="button"
          className="w-8 h-8 rounded-lg border border-gray-800 bg-black flex items-center justify-center hover:bg-gray-950"
          aria-label="Add"
        >
          +
        </button>
        <button type="button" className="px-2 py-1 rounded-md border border-gray-800 bg-black">
          Sonnet 4.5
        </button>
        <button type="button" className="px-2 py-1 rounded-md border border-gray-800 bg-black">
          Select
        </button>
        <button type="button" className="px-2 py-1 rounded-md border border-gray-800 bg-black">
          Plan
        </button>
        <div className="flex-1" />
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          disabled={isLoading}
          placeholder={placeholder || 'How can Bolt help you today? (or /command)'}
          className="w-full min-h-[48px] max-h-[160px] pr-12 px-3 py-3 rounded-xl bg-transparent text-sm text-gray-100 placeholder:text-gray-500 resize-none outline-none"
        />
        <button
          type="button"
          onClick={submit}
          disabled={isLoading || !text.trim()}
          className={`absolute right-2 bottom-2 p-2 rounded-lg transition-colors ${
            isLoading || !text.trim() ? 'text-gray-600' : 'text-white bg-blue-600 hover:bg-blue-700'
          }`}
          aria-label="Send"
        >
          {isLoading ? <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" /> : <PaperPlaneIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
