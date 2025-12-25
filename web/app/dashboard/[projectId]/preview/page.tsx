"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import PreviewPanel, { type UiElementContext } from '@/components/PreviewPanel';
import type { Message } from '@/types/app';
import { sendMessage } from '@/lib/api';

type BuildPayload = {
  previewHtml: string | null;
  files: { path: string; content: string }[];
};

export default function ProjectPreviewPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const router = useRouter();

  const [payload, setPayload] = useState<BuildPayload>({ previewHtml: null, files: [] });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [inspectEnabled, setInspectEnabled] = useState(false);
  const [selectedUiContext, setSelectedUiContext] = useState<UiElementContext | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`build:${projectId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as BuildPayload;
      setPayload({
        previewHtml: parsed?.previewHtml ?? null,
        files: Array.isArray(parsed?.files) ? parsed.files : [],
      });
    } catch {
      // ignore
    }
  }, [projectId]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`messages:${projectId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Message[];
      setMessages(Array.isArray(parsed) ? parsed : []);
    } catch {
      // ignore
    }
  }, [projectId]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`messages:${projectId}`, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages, projectId]);

  const hasPreview = useMemo(() => Boolean(payload.previewHtml), [payload.previewHtml]);

  const handleSend = async (content: string) => {
    const userMessage: Message = { id: String(Date.now()), role: 'user', content, timestamp: new Date().toISOString() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);
    try {
      const ai = await sendMessage(projectId, nextMessages, selectedUiContext ? 'edit' : 'interview', selectedUiContext ?? undefined);
      setMessages([...nextMessages, ai]);
      setSelectedUiContext(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-gray-100 flex flex-col">
      <div className="h-14 px-4 border-b border-gray-800 bg-black flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold truncate">Preview</div>
          <div className="text-xs text-gray-400 truncate">Project: {projectId}</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setChatOpen((v) => !v)}
            className={`px-3 py-2 rounded-lg text-xs border ${chatOpen ? 'bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700' : 'bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800'}`}
          >
            {chatOpen ? 'Hide Chat' : 'Open Chat'}
          </button>
          <button
            type="button"
            onClick={() => {
              setInspectEnabled((v) => !v);
              setSelectedUiContext(null);
              setChatOpen(true);
            }}
            className={`px-3 py-2 rounded-lg text-xs border ${inspectEnabled ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-700' : 'bg-gray-900 border-gray-700 text-gray-200 hover:bg-gray-800'}`}
          >
            {inspectEnabled ? 'Inspect: ON' : 'Inspect'}
          </button>
          <button
            type="button"
            onClick={() => router.push((`/dashboard/${projectId}`) as any)}
            className="px-3 py-2 rounded-lg text-xs bg-gray-900 border border-gray-700 text-gray-200 hover:bg-gray-800"
          >
            Back to Chat
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex overflow-hidden">
        {chatOpen ? (
          <div className="w-[40%] min-w-[420px] bg-black border-r border-gray-800 flex flex-col">
            {selectedUiContext && (
              <div className="px-4 py-3 border-b border-gray-800 bg-gray-950">
                <div className="text-xs text-gray-400">Selected element</div>
                <div className="mt-1 text-xs text-gray-200 font-mono truncate">{selectedUiContext.selector || '(no selector)'}</div>
                {selectedUiContext.text ? (
                  <div className="mt-1 text-xs text-gray-300 truncate">“{selectedUiContext.text}”</div>
                ) : null}
              </div>
            )}

            <ChatWindow messages={messages} isLoading={isLoading} />
            <ChatInput
              onSend={handleSend}
              isLoading={isLoading}
              placeholder={
                selectedUiContext
                  ? 'Describe the change for the selected element...'
                  : 'Continue chatting (or click Inspect to select a UI element)...'
              }
            />
          </div>
        ) : null}

        <div className="flex-1 min-w-0">
          <PreviewPanel
            previewHtml={payload.previewHtml}
            files={payload.files}
            title={hasPreview ? 'Live Preview' : 'No Preview'}
            inspectEnabled={inspectEnabled}
            onElementSelected={(ctx: UiElementContext) => {
              setSelectedUiContext(ctx);
              setInspectEnabled(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
