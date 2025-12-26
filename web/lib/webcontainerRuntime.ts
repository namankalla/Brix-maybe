import { WebContainer, auth, type FileSystemTree } from '@webcontainer/api';

export type ProjectFile = { path: string; content: string };

type RuntimeState = {
  containerPromise: Promise<WebContainer> | null;
  devProcess: any | null;
  lastMountedKey: string | null;
};

const state: RuntimeState = {
  containerPromise: null,
  devProcess: null,
  lastMountedKey: null,
};

let authInitialized = false;

function ensureAuthInit() {
  if (authInitialized) return;
  if (typeof window === 'undefined') return;
  authInitialized = true;
  const clientId = process.env.NEXT_PUBLIC_WEBCONTAINER_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      'Missing NEXT_PUBLIC_WEBCONTAINER_CLIENT_ID. WebContainer preview cannot start without a valid client ID for this domain.',
    );
  }
  auth.init({
    clientId,
    scope: '',
  });
}

function normalizePath(path: string) {
  const p = String(path || '').replace(/\\/g, '/');
  if (!p) return '/';
  return p.startsWith('/') ? p : `/${p}`;
}

function filesToTree(files: ProjectFile[]): FileSystemTree {
  const root: any = {};

  const ensureDir = (node: any, name: string) => {
    if (!node[name]) node[name] = { directory: {} };
    if (!node[name].directory) node[name] = { directory: {} };
    return node[name].directory;
  };

  for (const f of files) {
    const full = normalizePath(f.path);
    const parts = full.split('/').filter(Boolean);
    if (!parts.length) continue;

    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      if (isLast) {
        current[part] = { file: { contents: String(f.content ?? '') } };
      } else {
        current = ensureDir(current, part);
      }
    }
  }

  return root as FileSystemTree;
}

export async function getWebContainer() {
  if (!state.containerPromise) {
    ensureAuthInit();
    state.containerPromise = WebContainer.boot({
      coep: 'credentialless',
      workdirName: 'project',
      forwardPreviewErrors: true,
    });
  }
  return state.containerPromise;
}

export async function mountProject(files: ProjectFile[], key: string) {
  const wc = await getWebContainer();
  const tree = filesToTree(files);
  await wc.mount(tree);
  state.lastMountedKey = key;
  return wc;
}

export async function npmInstall(options: { onOutput?: (chunk: string) => void } = {}) {
  const wc = await getWebContainer();
  const proc = await wc.spawn('npm', ['install']);

  proc.output.pipeTo(
    new WritableStream({
      write(data) {
        options.onOutput?.(String(data));
      },
    }),
  );

  const exitCode = await proc.exit;
  return exitCode;
}

export async function startDevServer(options: { onOutput?: (chunk: string) => void } = {}) {
  const wc = await getWebContainer();

  if (state.devProcess) {
    try {
      state.devProcess.kill();
    } catch {
      // ignore
    }
    state.devProcess = null;
  }

  const proc = await wc.spawn('npm', ['run', 'dev', '--', '--host', '0.0.0.0', '--port', '5173']);
  state.devProcess = proc;

  proc.output.pipeTo(
    new WritableStream({
      write(data) {
        options.onOutput?.(String(data));
      },
    }),
  );

  return proc;
}

export async function writeProjectFile(path: string, content: string) {
  const wc = await getWebContainer();
  const p = normalizePath(path);
  await wc.fs.writeFile(p, content, 'utf-8');
}

export async function readProjectFile(path: string) {
  const wc = await getWebContainer();
  const p = normalizePath(path);
  const buf = await wc.fs.readFile(p, 'utf-8');
  return String(buf);
}

export async function listProjectFiles() {
  const wc = await getWebContainer();

  const walk = async (dir: string, acc: string[]) => {
    const entries = (await wc.fs.readdir(dir)) as unknown as string[];
    for (const name of entries) {
      const full = dir === '/' ? `/${name}` : `${dir}/${name}`;
      try {
        await wc.fs.readdir(full);
        await walk(full, acc);
      } catch {
        acc.push(full);
      }
    }
  };
  

  const out: string[] = [];
  await walk('/', out);
  return out.sort();
}
// Ensure WebContainer auth is initialized as soon as this module loads (client-side only)
if (typeof window !== 'undefined') {
  try {
    ensureAuthInit();
  } catch {
    // swallow error here; UI will show it later if needed
  }
}

