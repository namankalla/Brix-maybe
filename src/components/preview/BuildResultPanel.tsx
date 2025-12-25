import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Code2,
  Eye,
  Download,
  FileCode,
  FolderTree,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import CodePreview from './CodePreview';
import { cn } from '@/lib/utils';

interface GeneratedFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

interface BuildResultPanelProps {
  files: GeneratedFile[];
  onDownload: () => void;
  isVisible: boolean;
}

// Sample generated files for demonstration
const sampleFiles: GeneratedFile[] = [
  {
    name: 'App.tsx',
    path: 'src/App.tsx',
    language: 'typescript',
    content: `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`,
  },
  {
    name: 'Home.tsx',
    path: 'src/pages/Home.tsx',
    language: 'typescript',
    content: `import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Your App
        </h1>
        <Link 
          to="/dashboard"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Home;`,
  },
  {
    name: 'package.json',
    path: 'package.json',
    language: 'json',
    content: `{
  "name": "my-app",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}`,
  },
];

const BuildResultPanel = ({ files = sampleFiles, onDownload, isVisible }: BuildResultPanelProps) => {
  const [selectedFile, setSelectedFile] = useState<GeneratedFile>(files[0]);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/pages']));

  if (!isVisible) return null;

  // Build folder structure
  const folderStructure = buildFolderStructure(files);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <div className="h-full flex flex-col bg-background border-l border-border animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Generated Code</h2>
          <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
            {files.length} files
          </span>
        </div>
        <Button variant="glow" size="sm" onClick={onDownload} className="gap-2">
          <Download className="w-4 h-4" />
          Download ZIP
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'code' | 'preview')} className="flex-1 flex flex-col">
        <div className="border-b border-border px-4">
          <TabsList className="h-10 bg-transparent">
            <TabsTrigger value="code" className="gap-2 data-[state=active]:bg-secondary">
              <Code2 className="w-4 h-4" />
              Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-secondary">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="code" className="flex-1 m-0 flex overflow-hidden">
          {/* File Tree */}
          <div className="w-64 border-r border-border overflow-y-auto bg-muted/30">
            <div className="p-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 py-2">
                Files
              </p>
              <FileTree
                structure={folderStructure}
                expandedFolders={expandedFolders}
                selectedPath={selectedFile.path}
                onToggleFolder={toggleFolder}
                onSelectFile={(file) => setSelectedFile(file)}
                files={files}
              />
            </div>
          </div>

          {/* Code View */}
          <div className="flex-1 overflow-auto p-4">
            <CodePreview
              code={selectedFile.content}
              fileName={selectedFile.name}
              language={selectedFile.language}
            />
          </div>
        </TabsContent>

        <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
          <div className="h-full flex items-center justify-center bg-muted/20">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
                <Eye className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Live Preview</h3>
              <p className="text-muted-foreground text-sm max-w-sm">
                Download the code and run it locally to see the live preview.
                <br />
                Run <code className="px-1.5 py-0.5 rounded bg-secondary font-mono text-xs">npm run dev</code> to start.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper types and components
interface FolderNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: FolderNode[];
  file?: GeneratedFile;
}

function buildFolderStructure(files: GeneratedFile[]): FolderNode[] {
  const root: FolderNode[] = [];

  files.forEach((file) => {
    const parts = file.path.split('/');
    let current = root;

    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const path = parts.slice(0, index + 1).join('/');

      let existing = current.find((n) => n.name === part);

      if (!existing) {
        existing = {
          name: part,
          path,
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
          file: isFile ? file : undefined,
        };
        current.push(existing);
      }

      if (!isFile && existing.children) {
        current = existing.children;
      }
    });
  });

  return root;
}

interface FileTreeProps {
  structure: FolderNode[];
  expandedFolders: Set<string>;
  selectedPath: string;
  onToggleFolder: (path: string) => void;
  onSelectFile: (file: GeneratedFile) => void;
  files: GeneratedFile[];
  depth?: number;
}

const FileTree = ({
  structure,
  expandedFolders,
  selectedPath,
  onToggleFolder,
  onSelectFile,
  files,
  depth = 0,
}: FileTreeProps) => {
  return (
    <div className="space-y-0.5">
      {structure.map((node) => (
        <div key={node.path}>
          {node.type === 'folder' ? (
            <>
              <button
                onClick={() => onToggleFolder(node.path)}
                className={cn(
                  'w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm hover:bg-secondary/50 transition-colors',
                  'text-foreground'
                )}
                style={{ paddingLeft: `${depth * 12 + 8}px` }}
              >
                {expandedFolders.has(node.path) ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <FolderTree className="w-4 h-4 text-primary/70" />
                <span>{node.name}</span>
              </button>
              {expandedFolders.has(node.path) && node.children && (
                <FileTree
                  structure={node.children}
                  expandedFolders={expandedFolders}
                  selectedPath={selectedPath}
                  onToggleFolder={onToggleFolder}
                  onSelectFile={onSelectFile}
                  files={files}
                  depth={depth + 1}
                />
              )}
            </>
          ) : (
            <button
              onClick={() => node.file && onSelectFile(node.file)}
              className={cn(
                'w-full flex items-center gap-1.5 px-2 py-1.5 rounded-md text-sm transition-colors',
                selectedPath === node.path
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
              <FileCode className="w-4 h-4" />
              <span>{node.name}</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default BuildResultPanel;
