"use client";

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import ChatWindow from '@/components/ChatWindow';
import WorkbenchMessageBox from '@/components/WorkbenchMessageBox';
import PreviewPanel from '@/components/PreviewPanel';
import type { Message } from '@/types/app';
import { ApiError, sendMessage } from '@/lib/api';

type BuildPayload = {
  previewHtml: string | null;
  files: { path: string; content: string }[];
};

export default function ProjectPreviewWebContainerPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const [payload, setPayload] = useState<BuildPayload>({ previewHtml: null, files: [] });
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

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

  const cooldownRemainingSec = useMemo(() => {
    if (!cooldownUntil) return 0;
    return Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
  }, [cooldownUntil]);

  useEffect(() => {
    if (!cooldownUntil) return;
    if (cooldownRemainingSec <= 0) {
      setCooldownUntil(null);
      setErrorBanner(null);
      return;
    }
    const t = window.setInterval(() => {
      setCooldownUntil((v) => v);
    }, 250);
    return () => window.clearInterval(t);
  }, [cooldownUntil, cooldownRemainingSec]);

  const handleSend = async (content: string) => {
    const userMessage: Message = { id: String(Date.now()), role: 'user', content, timestamp: new Date().toISOString() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);
    try {
      const ai = await sendMessage(projectId, nextMessages, 'edit');
      setMessages([...nextMessages, ai]);
      setErrorBanner(null);
    } catch (e) {
      if (e instanceof ApiError && e.status === 429) {
        const secs = e.retryAfterSeconds ?? 60;
        setCooldownUntil(Date.now() + secs * 1000);
        setErrorBanner(`Rate limit reached. Try again in ${secs}s.`);
      } else {
        setErrorBanner(e instanceof ApiError ? e.bodyText || e.message : e instanceof Error ? e.message : 'Failed to send');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasPreview = useMemo(() => Boolean(payload.previewHtml), [payload.previewHtml]);

  return (
    <div className="h-screen w-full bg-black text-gray-100 flex overflow-hidden">
      <div className="w-[420px] min-w-[420px] max-w-[520px] border-r border-gray-800 bg-[#0b0b0c] flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <div className="text-xs text-gray-400">Start application</div>
          <div className="mt-2 rounded-lg border border-gray-800 bg-black px-3 py-2 font-mono text-xs text-gray-200">
            npm run dev
          </div>
          <div className="mt-3 text-xs text-gray-500 truncate">Project: {projectId}</div>
          <div className="mt-3 text-[11px] text-gray-500">WebContainer preview mode.</div>
        </div>

        <div className="flex-1 min-h-0">
          {errorBanner ? (
            <div className="p-3 border-b border-gray-800 bg-black">
              <div className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-gray-200">
                {cooldownRemainingSec > 0 ? `Rate limited. Retry in ${cooldownRemainingSec}s.` : errorBanner}
              </div>
            </div>
          ) : null}
          <ChatWindow messages={messages} isLoading={isLoading} />
        </div>

        <div className="border-t border-gray-800 bg-[#0b0b0c] p-3">
          <WorkbenchMessageBox
            onSend={handleSend}
            isLoading={isLoading || cooldownRemainingSec > 0}
            placeholder={cooldownRemainingSec > 0 ? `Rate limited. Try again in ${cooldownRemainingSec}s...` : 'How can Bolt help you today? (or /command)'}
          />
        </div>
      </div>

      <div className="flex-1 min-w-0 bg-black">
        <PreviewPanel
          projectId={projectId}
          files={payload.files}
          previewHtml={payload.previewHtml}
          forceWebContainer
          title={hasPreview ? 'Workbench (WebContainer)' : 'Workbench (WebContainer)'}
        />
      </div>
    </div>
  );
}
