import { NextResponse } from 'next/server';
import { generateText } from '@/app/services/gemini';

export async function POST(request: Request) {
  try {
    const { projectId, messages } = await request.json();

    const conversationText = Array.isArray(messages)
      ? messages
          .slice(-40)
          .map((m: any) => `${m.role?.toUpperCase?.() || 'USER'}: ${m.content || ''}`)
          .join('\n')
      : '';

    const prompt = `You are a senior product engineer.

Based on the user conversation below, generate a small web app blueprint and starter code.

Conversation:
${conversationText}

Return JSON ONLY with this structure:
{
  "blueprint": {
    "app_name": "string",
    "description": "string",
    "components": ["string"],
    "features": ["string"],
    "pages": ["string"]
  },
  "files": [
    { "path": "string", "content": "string" }
  ]
}

Constraints:
- Keep it minimal and consistent.
- Prefer React + Tailwind classes in code.
- IMPORTANT: Do NOT generate authentication that calls real network endpoints (no /api/login, /api/auth, etc.) unless you also generate the server/backend for it.
- If the user asks for sign-in/sign-up, implement a purely client-side mock (e.g. localStorage) that never fails in preview.
- Do not include markdown fences.
`;

    const response = await generateText(prompt);

    const extractJson = (raw: string) => {
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) return null;
      return raw.slice(start, end + 1);
    };

    const safeParse = (raw: string) => {
      try {
        return JSON.parse(raw);
      } catch {
        const extracted = extractJson(raw);
        if (!extracted) return null;
        try {
          return JSON.parse(extracted);
        } catch {
          return null;
        }
      }
    };

    let generatedData: any = safeParse(response);

    if (!generatedData?.blueprint || !Array.isArray(generatedData?.files)) {
      generatedData = {
        blueprint: {
          app_name: 'Generated App',
          description: 'App based on your chat requirements',
          components: ['App'],
          features: ['Core flows based on your answers'],
          pages: ['Home'],
        },
        files: [
          {
            path: 'src/App.tsx',
            content:
              "export default function App() {\n  return (\n    <div className=\"min-h-screen bg-black text-white p-8\">\n      <h1 className=\"text-2xl font-bold\">Generated App</h1>\n      <p className=\"mt-2 text-gray-300\">This is a starter app generated from your requirements.</p>\n    </div>\n  );\n}\n",
          },
        ],
      };
    }

    const files: { path: string; content: string }[] = Array.isArray(generatedData.files)
      ? generatedData.files.filter((f: any) => typeof f?.path === 'string' && typeof f?.content === 'string')
      : [];

    const upsertFile = (path: string, content: string) => {
      const idx = files.findIndex((f) => f.path === path);
      if (idx >= 0) {
        if (!files[idx].content?.trim()) files[idx].content = content;
        return;
      }
      files.push({ path, content });
    };

    const getFile = (path: string) => files.find((f) => f.path === path)?.content;

    const defaultAppTsx =
      "export default function App() {\n  return (\n    <div style={{ padding: 24, fontFamily: 'system-ui' }}>\n      <h1 style={{ margin: 0, fontSize: 22 }}>Generated App</h1>\n      <p style={{ marginTop: 8, opacity: 0.8 }}>Edit src/App.tsx to start building.</p>\n    </div>\n  );\n}\n";

    const hasApp = Boolean(getFile('src/App.tsx')) || Boolean(getFile('src/App.jsx'));
    if (!hasApp) upsertFile('src/App.jsx', defaultAppTsx);

    upsertFile(
      'src/main.jsx',
      `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`,
    );

    upsertFile('src/index.css', `:root { color-scheme: dark; }\nbody { margin: 0; background: #000; color: #fff; }\n`);
    upsertFile('src/vite-env.d.ts', `/// <reference types="vite/client" />\n`);

    upsertFile(
      'index.html',
      `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${generatedData?.blueprint?.app_name || 'App'}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`,
    );

    upsertFile(
      'vite.config.js',
      `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  }
})`,
    );

    upsertFile(
      'package.json',
      JSON.stringify(
        {
          name: 'teamtasker',
          private: true,
          scripts: {
            dev: 'vite --host 0.0.0.0 --port 5173',
            build: 'vite build'
          },
          dependencies: {
            react: '^18.3.1',
            'react-dom': '^18.3.1',
            vite: '^5.0.0',
            '@vitejs/plugin-react': '^4.0.0'
          }
        },
        null,
        2,
      ),
    );

    const escapeHtml = (value: unknown) =>
      String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    const appName = escapeHtml(generatedData.blueprint.app_name || 'Generated App');
    const description = escapeHtml(generatedData.blueprint.description || '');
    const features: string[] = Array.isArray(generatedData.blueprint.features) ? generatedData.blueprint.features : [];
    const pages: string[] = Array.isArray(generatedData.blueprint.pages) ? generatedData.blueprint.pages : [];

    const previewHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName}</title>
    <style>
      :root {
        --bg: #000;
        --panel: #0b0b0c;
        --panel2: #111113;
        --border: #232326;
        --text: #f5f5f5;
        --muted: #a1a1aa;
        --accent: #2563eb;
      }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; background: var(--bg); color: var(--text); }
      .app { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
      .sidebar { background: var(--panel); border-right: 1px solid var(--border); padding: 16px; }
      .brand { font-weight: 700; font-size: 14px; letter-spacing: .2px; }
      .desc { margin-top: 6px; font-size: 12px; color: var(--muted); line-height: 1.4; }
      .nav { margin-top: 14px; display: grid; gap: 8px; }
      .nav button { width: 100%; text-align: left; background: var(--panel2); border: 1px solid var(--border); color: var(--text); padding: 10px 10px; border-radius: 10px; cursor: pointer; font-size: 12px; }
      .nav button.active { border-color: rgba(37, 99, 235, .6); box-shadow: 0 0 0 2px rgba(37, 99, 235, .25) inset; }
      .main { padding: 20px; }
      .card { background: var(--panel); border: 1px solid var(--border); border-radius: 14px; padding: 16px; }
      .title { font-size: 18px; font-weight: 700; margin: 0; }
      .subtitle { margin: 8px 0 0; font-size: 12px; color: var(--muted); }
      .section { margin-top: 14px; }
      .section h3 { margin: 0 0 8px; font-size: 12px; color: #d4d4d8; font-weight: 600; }
      ul { margin: 0; padding-left: 18px; }
      li { margin: 6px 0; color: #e4e4e7; font-size: 12px; }
      .cta { margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap; }
      .cta button { background: var(--accent); border: 1px solid rgba(37, 99, 235, .6); color: white; padding: 10px 12px; border-radius: 10px; cursor: pointer; font-size: 12px; }
      .cta button.secondary { background: transparent; color: #e4e4e7; border: 1px solid var(--border); }
      .toast { position: fixed; bottom: 18px; right: 18px; background: #0b1220; border: 1px solid rgba(37, 99, 235, .35); color: #dbeafe; padding: 10px 12px; border-radius: 12px; font-size: 12px; display: none; }
    </style>
  </head>
  <body>
    <div class="app">
      <aside class="sidebar">
        <div class="brand">${appName}</div>
        <div class="desc">${description}</div>
        <div class="nav" id="nav"></div>
      </aside>
      <main class="main">
        <div class="card">
          <h1 class="title" id="pageTitle"></h1>
          <p class="subtitle" id="pageSubtitle"></p>

          <div class="section">
            <h3>Key features</h3>
            <ul id="features"></ul>
          </div>

          <div class="cta">
            <button id="primaryAction">Primary action</button>
            <button class="secondary" id="secondaryAction">Secondary action</button>
          </div>
        </div>
      </main>
    </div>
    <div class="toast" id="toast"></div>
    <script>
      const pages = ${JSON.stringify(pages.length ? pages : ['Home', 'Dashboard', 'Settings'])};
      const features = ${JSON.stringify(features.length ? features : ['Create items', 'Edit items', 'Search', 'Basic dashboard'])};
      const nav = document.getElementById('nav');
      const pageTitle = document.getElementById('pageTitle');
      const pageSubtitle = document.getElementById('pageSubtitle');
      const featuresEl = document.getElementById('features');
      const toast = document.getElementById('toast');

      function showToast(msg) {
        toast.textContent = msg;
        toast.style.display = 'block';
        clearTimeout(window.__toastTimeout);
        window.__toastTimeout = setTimeout(() => (toast.style.display = 'none'), 1400);
      }

      function renderFeatures() {
        featuresEl.innerHTML = '';
        features.slice(0, 8).forEach((f) => {
          const li = document.createElement('li');
          li.textContent = f;
          featuresEl.appendChild(li);
        });
      }

      function setActive(page) {
        pageTitle.textContent = page;
        pageSubtitle.textContent = 'This is a live preview shell. Your full app code is in the generated files.';

        [...nav.querySelectorAll('button')].forEach((b) => {
          b.classList.toggle('active', b.dataset.page === page);
        });
      }

      function renderNav() {
        nav.innerHTML = '';
        pages.slice(0, 8).forEach((p, i) => {
          const btn = document.createElement('button');
          btn.textContent = p;
          btn.dataset.page = p;
          btn.className = i === 0 ? 'active' : '';
          btn.onclick = () => setActive(p);
          nav.appendChild(btn);
        });
        setActive(pages[0] || 'Home');
      }

      document.getElementById('primaryAction').onclick = () => showToast('Primary action clicked');
      document.getElementById('secondaryAction').onclick = () => showToast('Secondary action clicked');

      renderNav();
      renderFeatures();
    </script>
  </body>
</html>`;

    return NextResponse.json({
      blueprint: generatedData.blueprint,
      files,
      previewHtml,
      zipUrl: null,
    });
  } catch (error) {
    console.error('Error in build API:', error);
    const msg = error instanceof Error ? error.message : String(error ?? 'Unknown error');
    const m = msg.match(/retryDelay"\s*:\s*"(\d+)s"/i);
    const retryAfterSeconds = m ? Number(m[1]) : undefined;
    const isRateLimited = msg.includes('Gemini API Error: 429') || msg.includes('RESOURCE_EXHAUSTED');
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'RATE_LIMITED', details: msg, retryAfterSeconds: retryAfterSeconds ?? 60 },
        {
          status: 429,
          headers: { 'Retry-After': String(retryAfterSeconds ?? 60) },
        },
      );
    }
    return NextResponse.json(
      { error: 'Failed to generate app', details: msg },
      { status: 500 }
    );
  }
}
