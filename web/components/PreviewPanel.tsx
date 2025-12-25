"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import { nightOwl } from '@codesandbox/sandpack-themes';

export type UiElementContext = {
  selector?: string;
  text?: string;
  htmlSnippet?: string;
  url?: string;
};

export default function PreviewPanel({
  previewHtml,
  files,
  title,
  inspectEnabled,
  onElementSelected,
}: {
  previewHtml: string | null;
  files: { path: string; content: string }[];
  title?: string;
  inspectEnabled?: boolean;
  onElementSelected?: (ctx: UiElementContext) => void;
}) {
  const [activeTab, setActiveTab] = useState<'preview' | 'files'>('preview');
  const previewContainerRef = useRef<HTMLDivElement | null>(null);
  const previewIframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (previewHtml) {
      setActiveTab('preview');
    }
  }, [previewHtml]);

  const sandpackFiles = useMemo(() => {
    const map: Record<string, string> = {};
    for (const f of files || []) {
      if (!f?.path) continue;
      const normalized = f.path.startsWith('/') ? f.path : `/${f.path}`;
      map[normalized] = String(f.content ?? '');
    }
    return map;
  }, [files]);

  const hasSandpackProject = useMemo(() => {
    return Boolean(sandpackFiles['/package.json'] || sandpackFiles['/src/main.tsx'] || sandpackFiles['/index.html']);
  }, [sandpackFiles]);

  useEffect(() => {
    if (activeTab !== 'preview') return;
    const container = previewContainerRef.current;
    if (!container) return;

    const findIframe = () => {
      const iframe = container.querySelector('iframe');
      previewIframeRef.current = iframe as HTMLIFrameElement | null;
    };

    findIframe();

    const obs = new MutationObserver(() => findIframe());
    obs.observe(container, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [activeTab, hasSandpackProject]);

  useEffect(() => {
    if (!inspectEnabled) return;
    if (activeTab !== 'preview') return;
    if (!hasSandpackProject) return;

    const iframe = previewIframeRef.current;
    if (!iframe) return;

    let cleanupPrevOutline: (() => void) | null = null;

    const getSelector = (el: Element) => {
      const parts: string[] = [];
      let current: Element | null = el;
      let depth = 0;
      while (current && depth < 5 && current.nodeType === 1) {
        let part = current.tagName.toLowerCase();
        const id = (current as HTMLElement).id;
        if (id) {
          part += `#${CSS.escape(id)}`;
          parts.unshift(part);
          break;
        }
        const className = (current as HTMLElement).className;
        if (className && typeof className === 'string') {
          const first = className
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((c) => `.${CSS.escape(c)}`)
            .join('');
          if (first) part += first;
        }
        const parent = current.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter((c) => c.tagName === current!.tagName);
          if (siblings.length > 1) {
            const index = siblings.indexOf(current) + 1;
            part += `:nth-of-type(${index})`;
          }
        }
        parts.unshift(part);
        current = current.parentElement;
        depth++;
      }
      return parts.join(' > ');
    };

    const attach = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      const onMove = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target || !(target instanceof doc.defaultView!.HTMLElement)) return;

        if (cleanupPrevOutline) cleanupPrevOutline();

        const prevOutline = target.style.outline;
        const prevOutlineOffset = target.style.outlineOffset;
        target.style.outline = '2px solid rgba(37, 99, 235, 0.9)';
        target.style.outlineOffset = '2px';

        cleanupPrevOutline = () => {
          target.style.outline = prevOutline;
          target.style.outlineOffset = prevOutlineOffset;
        };
      };

      const onClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const target = e.target as HTMLElement | null;
        if (!target || !(target instanceof doc.defaultView!.HTMLElement)) return;

        const selector = getSelector(target);
        const text = (target.innerText || target.textContent || '').trim().slice(0, 160);
        const htmlSnippet = (target.outerHTML || '').trim().slice(0, 800);
        const url = doc.defaultView?.location?.href;

        onElementSelected?.({ selector, text, htmlSnippet, url });
      };

      doc.addEventListener('mousemove', onMove, true);
      doc.addEventListener('click', onClick, true);

      return () => {
        doc.removeEventListener('mousemove', onMove, true);
        doc.removeEventListener('click', onClick, true);
        if (cleanupPrevOutline) cleanupPrevOutline();
      };
    };

    let detach: (() => void) | undefined;

    const tryAttach = () => {
      try {
        detach = attach();
      } catch {
        // ignore
      }
    };

    tryAttach();
    iframe.addEventListener('load', tryAttach);

    return () => {
      iframe.removeEventListener('load', tryAttach);
      if (detach) detach();
    };
  }, [inspectEnabled, activeTab, hasSandpackProject, onElementSelected]);

  return (
    <div className="h-full border-l border-gray-800 bg-gray-900 flex flex-col min-w-[420px]">
      <div className="h-14 px-4 border-b border-gray-800 flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-100 truncate">{title || 'Live Preview'}</div>
          <div className="text-xs text-gray-400 truncate">
            {hasSandpackProject ? 'Live preview updates as you edit files.' : 'Build to generate a live preview.'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 text-xs ${activeTab === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/60'}`}
              type="button"
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`px-3 py-1.5 text-xs ${activeTab === 'files' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/60'}`}
              type="button"
            >
              Files
            </button>
          </div>

          <button
            type="button"
            disabled={!previewIframeRef.current?.src}
            onClick={() => {
              const src = previewIframeRef.current?.src;
              if (src) window.open(src, '_blank', 'noopener,noreferrer');
            }}
            className={`px-3 py-1.5 text-xs rounded-lg border ${previewIframeRef.current?.src ? 'bg-black border-gray-700 text-gray-200 hover:bg-gray-950' : 'bg-gray-800 border-gray-800 text-gray-500 cursor-not-allowed'}`}
          >
            Open
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {hasSandpackProject ? (
          <SandpackProvider
            template="react-ts"
            theme={nightOwl}
            files={sandpackFiles}
            options={{
              recompileMode: 'immediate',
              recompileDelay: 200,
              visibleFiles: Object.keys(sandpackFiles).slice(0, 50),
              activeFile: sandpackFiles['/src/App.tsx'] ? '/src/App.tsx' : undefined,
            }}
          >
            <SandpackLayout style={{ height: '100%', background: 'transparent' }}>
              {activeTab === 'preview' ? (
                <div className="h-full w-full" ref={previewContainerRef}>
                  <SandpackPreview style={{ height: '100%', border: 'none' }} />
                </div>
              ) : (
                <div className="h-full w-full grid grid-cols-[240px_1fr]">
                  <div className="h-full overflow-hidden border-r border-gray-800 bg-black">
                    <SandpackFileExplorer style={{ height: '100%' }} />
                  </div>
                  <div className="h-full overflow-hidden bg-black">
                    <SandpackCodeEditor style={{ height: '100%' }} showLineNumbers showInlineErrors />
                  </div>
                </div>
              )}
            </SandpackLayout>
          </SandpackProvider>
        ) : (
          <div className="h-full flex items-center justify-center p-8">
            <div className="max-w-sm w-full text-center space-y-3">
              <div className="text-sm font-medium text-gray-200">No preview yet</div>
              <div className="text-xs text-gray-400">Click Build to generate a runnable React app.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
