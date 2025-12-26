"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  getWebContainer,
  listProjectFiles,
  mountProject,
  npmInstall,
  readProjectFile,
  startDevServer,
  writeProjectFile,
  type ProjectFile,
} from '@/lib/webcontainerRuntime';

export type UiElementContext = {
  selector?: string;
  text?: string;
  htmlSnippet?: string;
  url?: string;
};

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

function normalizePath(p: string) {
  const s = String(p || '').replace(/\\/g, '/');
  return s.startsWith('/') ? s : `/${s}`;
}

export default function PreviewPanel({
  projectId,
  files,
  previewHtml,
  forceWebContainer,
  title,
}: {
  projectId: string;
  files: ProjectFile[];
  previewHtml?: string | null;
  forceWebContainer?: boolean;
  title?: string;
}) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>('Idle');
  const [logs, setLogs] = useState<string>('');
  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  const [fileList, setFileList] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string>('/src/App.tsx');
  const [activeFileContent, setActiveFileContent] = useState<string>('');
  const writeDebounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!Array.isArray(files) || files.length === 0) return;

    const normalized = new Set(files.map((f) => normalizePath(f.path)));
    const current = normalizePath(activeFile);
    if (normalized.has(current)) return;

    const preferred = ['/src/App.tsx', '/src/App.jsx', '/src/main.tsx', '/src/main.jsx', '/index.html'];
    const pick = preferred.find((p) => normalized.has(p)) || normalizePath(files[0].path);
    setActiveFile(pick);
  }, [activeFile, files]);

  useEffect(() => {
  console.log(
    'WebContainer Client ID:',
    process.env.NEXT_PUBLIC_WEBCONTAINER_CLIENT_ID
  );
}, []);


  useEffect(() => {
    setPreviewUrl(null);
    setRuntimeError(null);
  }, [projectId]);

  const hasProject = useMemo(() => {
    return Array.isArray(files) && files.some((f) => f?.path === 'package.json' || f?.path === '/package.json');
  }, [files]);

  const mountKey = useMemo(() => {
    const parts: string[] = [projectId];
    for (const f of files || []) {
      parts.push(`${f.path}:${(f.content || '').length}`);
    }
    return parts.join('|');
  }, [files, projectId]);

  useEffect(() => {
    if (!hasProject) return;

    let cancelled = false;
    let detachServerListener: (() => void) | null = null;

    const appendLog = (chunk: string) => {
      setLogs((prev) => {
        const next = `${prev}${chunk}`;
        return next.length > 20000 ? next.slice(next.length - 20000) : next;
      });
    };

    const run = async () => {
      try {
        setStatusText('Booting WebContainer...');
        const wc = await getWebContainer();

        const onServerReady = (port: number, url: string) => {
          if (cancelled) return;
          if (port === 5173) {
            setPreviewUrl(url);
            setStatusText('Dev server running');
          }
        };

        wc.on('server-ready', onServerReady);
        detachServerListener = () => {
          try {
            // @ts-expect-error stackblitz api
            wc.off?.('server-ready', onServerReady);
          } catch {
            // ignore
          }
        };

        setStatusText('Mounting files...');
        await mountProject(files, mountKey);

        const installedKey = `wc:installed:${mountKey}`;
        const alreadyInstalled = (() => {
          try {
            return sessionStorage.getItem(installedKey) === '1';
          } catch {
            return false;
          }
        })();

        if (!alreadyInstalled) {
          setStatusText('Installing dependencies (npm install)...');
          const code = await npmInstall({ onOutput: appendLog });
          if (code !== 0) {
            setStatusText(`npm install failed (exit ${code})`);
            return;
          }
          try {
            sessionStorage.setItem(installedKey, '1');
          } catch {
            // ignore
          }
        }

        setStatusText('Starting dev server...');
        await startDevServer({ onOutput: appendLog });

        const list = await listProjectFiles();
        if (!cancelled) {
          setFileList(list.filter((p) => !p.includes('/node_modules/') && !p.includes('/.git/')));
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Unknown error';
        setRuntimeError(msg);
        setStatusText(`Runtime error: ${msg}`);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (detachServerListener) detachServerListener();
    };
  }, [files, hasProject, mountKey]);

  useEffect(() => {
    if (!hasProject) return;

    let cancelled = false;
    const load = async () => {
      try {
        const content = await readProjectFile(activeFile);
        if (!cancelled) setActiveFileContent(content);
      } catch {
        if (!cancelled) setActiveFileContent('');
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [activeFile, files, hasProject]);

  const handleEditorChange = (value: string | undefined) => {
    const next = value ?? '';
    setActiveFileContent(next);

    if (writeDebounceRef.current) window.clearTimeout(writeDebounceRef.current);
    writeDebounceRef.current = window.setTimeout(() => {
      writeProjectFile(activeFile, next).catch(() => {
        // ignore
      });
    }, 250);
  };

  return (
    <div className="h-full border-l border-gray-800 bg-gray-900 flex flex-col min-w-[420px]">
      <div className="h-14 px-4 border-b border-gray-800 flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-gray-100 truncate">{title || 'Live Preview'}</div>
          <div className="text-xs text-gray-400 truncate">
            {hasProject ? statusText : 'Build to generate a runnable React app.'}
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
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1.5 text-xs ${activeTab === 'code' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700/60'}`}
              type="button"
            >
              Code
            </button>
          </div>

          <button
            type="button"
            disabled={!previewUrl}
            onClick={() => {
              if (previewUrl) window.open(previewUrl, '_blank', 'noopener,noreferrer');
            }}
            className={`px-3 py-1.5 text-xs rounded-lg border ${previewUrl ? 'bg-black border-gray-700 text-gray-200 hover:bg-gray-950' : 'bg-gray-800 border-gray-800 text-gray-500 cursor-not-allowed'}`}
          >
            Open
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {hasProject ? (
          activeTab === 'preview' ? (
            <div className="h-full w-full bg-black">
              {previewUrl ? (
                <iframe
                  title="preview"
                  className="w-full h-full bg-black"
                  sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts"
                  src={previewUrl}
                />
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="max-w-md w-full space-y-3">
                    <div className="text-sm font-medium text-gray-200">WebContainer preview failed</div>
                    <div className="text-xs text-gray-400">{statusText}</div>
                    <div className="text-xs text-gray-400">
                      Set <span className="font-mono">NEXT_PUBLIC_WEBCONTAINER_CLIENT_ID</span> and restart the dev server.
                    </div>
                    {logs ? (
                      <pre className="mt-3 max-h-72 overflow-y-auto rounded-lg border border-gray-800 bg-gray-950 p-3 text-[11px] leading-relaxed text-gray-200">{logs}</pre>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full w-full grid grid-cols-[260px_1fr] bg-black">
              <div className="h-full overflow-y-auto border-r border-gray-800">
                <div className="px-3 py-2 text-xs text-gray-300 border-b border-gray-800 bg-gray-950">Files</div>
                <div className="p-2 space-y-1">
                  {(fileList.length ? fileList : (files || []).map((f) => (f.path.startsWith('/') ? f.path : `/${f.path}`)))
                    .filter((p) => p.endsWith('.ts') || p.endsWith('.tsx') || p.endsWith('.js') || p.endsWith('.jsx') || p.endsWith('.css') || p.endsWith('.html') || p.endsWith('.json'))
                    .slice(0, 500)
                    .map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setActiveFile(p)}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-mono truncate ${p === activeFile ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-900'}`}
                        title={p}
                      >
                        {p}
                      </button>
                    ))}
                </div>
              </div>
              <div className="h-full overflow-hidden">
                <div className="px-3 py-2 text-xs text-gray-300 border-b border-gray-800 bg-gray-950 font-mono truncate">{activeFile}</div>
                <div className="h-[calc(100%-33px)]">
                  <MonacoEditor
                    height="100%"
                    theme="vs-dark"
                    language={activeFile.endsWith('.tsx') ? 'typescript' : activeFile.endsWith('.ts') ? 'typescript' : activeFile.endsWith('.jsx') ? 'javascript' : activeFile.endsWith('.js') ? 'javascript' : activeFile.endsWith('.css') ? 'css' : activeFile.endsWith('.html') ? 'html' : 'json'}
                    value={activeFileContent}
                    onChange={handleEditorChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 12,
                      wordWrap: 'on',
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                    }}
                  />
                </div>
              </div>
            </div>
          )
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
