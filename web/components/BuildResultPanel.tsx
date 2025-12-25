export default function BuildResultPanel({ files, onDownload, isVisible }: { files: { path: string; content: string }[]; onDownload: () => void; isVisible: boolean; }) {
  if (!isVisible) return null;
  return (
    <div className="h-full border-l border-border bg-card flex flex-col">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="font-semibold">Build Output</h3>
        <button onClick={onDownload} className="px-3 py-2 rounded-md bg-primary text-white">Download ZIP</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {files.length ? files.map(f => (
          <div key={f.path} className="border rounded-md">
            <div className="px-3 py-2 border-b text-sm bg-muted font-mono">{f.path}</div>
            <pre className="p-3 text-sm overflow-x-auto">{f.content}</pre>
          </div>
        )) : <p className="text-sm text-muted-foreground">No files generated yet.</p>}
      </div>
    </div>
  );
}
