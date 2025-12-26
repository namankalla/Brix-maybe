"use strict";(()=>{var e={};e.id=279,e.ids=[279],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5929:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>m,patchFetch:()=>b,requestAsyncStorage:()=>c,routeModule:()=>d,serverHooks:()=>g,staticGenerationAsyncStorage:()=>u});var n={};r.r(n),r.d(n,{POST:()=>l});var i=r(9303),a=r(8716),o=r(670),s=r(7070),p=r(9876);async function l(e){try{let{projectId:t,messages:r}=await e.json(),n=Array.isArray(r)?r.slice(-40).map(e=>`${e.role?.toUpperCase?.()||"USER"}: ${e.content||""}`).join("\n"):"",i=`You are a senior product engineer.

Based on the user conversation below, generate a small web app blueprint and starter code.

Conversation:
${n}

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
`,a=await (0,p._)(i),o=e=>{let t=e.indexOf("{"),r=e.lastIndexOf("}");return -1===t||-1===r||r<=t?null:e.slice(t,r+1)},l=(e=>{try{return JSON.parse(e)}catch{let t=o(e);if(!t)return null;try{return JSON.parse(t)}catch{return null}}})(a);l?.blueprint&&Array.isArray(l?.files)||(l={blueprint:{app_name:"Generated App",description:"App based on your chat requirements",components:["App"],features:["Core flows based on your answers"],pages:["Home"]},files:[{path:"src/App.tsx",content:'export default function App() {\n  return (\n    <div className="min-h-screen bg-black text-white p-8">\n      <h1 className="text-2xl font-bold">Generated App</h1>\n      <p className="mt-2 text-gray-300">This is a starter app generated from your requirements.</p>\n    </div>\n  );\n}\n'}]});let d=Array.isArray(l.files)?l.files.filter(e=>"string"==typeof e?.path&&"string"==typeof e?.content):[],c=(e,t)=>{let r=d.findIndex(t=>t.path===e);if(r>=0){d[r].content?.trim()||(d[r].content=t);return}d.push({path:e,content:t})},u=e=>d.find(t=>t.path===e)?.content;u("src/App.tsx")||u("src/App.jsx")||c("src/App.tsx","export default function App() {\n  return (\n    <div style={{ padding: 24, fontFamily: 'system-ui' }}>\n      <h1 style={{ margin: 0, fontSize: 22 }}>Generated App</h1>\n      <p style={{ marginTop: 8, opacity: 0.8 }}>Edit src/App.tsx to start building.</p>\n    </div>\n  );\n}\n"),c("src/main.tsx",`import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`),c("src/index.css",`:root { color-scheme: dark; }
body { margin: 0; background: #000; color: #fff; }
`),c("src/vite-env.d.ts",`/// <reference types="vite/client" />
`),c("index.html",`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${l?.blueprint?.app_name||"App"}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`),c("vite.config.ts",`import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
`),c("package.json",JSON.stringify({name:String(l?.blueprint?.app_name||"generated-app").toLowerCase().replace(/[^a-z0-9\-]+/g,"-"),private:!0,version:"0.0.0",type:"module",scripts:{dev:"vite",build:"vite build",preview:"vite preview"},dependencies:{react:"^18.3.1","react-dom":"^18.3.1"},devDependencies:{"@types/react":"^18.3.7","@types/react-dom":"^18.3.0","@vitejs/plugin-react":"^4.3.1",typescript:"^5.6.3",vite:"^5.4.0"}},null,2));let g=e=>String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),m=g(l.blueprint.app_name||"Generated App"),b=g(l.blueprint.description||""),f=Array.isArray(l.blueprint.features)?l.blueprint.features:[],h=Array.isArray(l.blueprint.pages)?l.blueprint.pages:[],v=`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${m}</title>
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
        <div class="brand">${m}</div>
        <div class="desc">${b}</div>
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
      const pages = ${JSON.stringify(h.length?h:["Home","Dashboard","Settings"])};
      const features = ${JSON.stringify(f.length?f:["Create items","Edit items","Search","Basic dashboard"])};
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
</html>`;return s.NextResponse.json({blueprint:l.blueprint,files:d,previewHtml:v,zipUrl:null})}catch(n){console.error("Error in build API:",n);let e=n instanceof Error?n.message:String(n??"Unknown error"),t=e.match(/retryDelay"\s*:\s*"(\d+)s"/i),r=t?Number(t[1]):void 0;if(e.includes("Gemini API Error: 429")||e.includes("RESOURCE_EXHAUSTED"))return s.NextResponse.json({error:"RATE_LIMITED",details:e,retryAfterSeconds:r??60},{status:429,headers:{"Retry-After":String(r??60)}});return s.NextResponse.json({error:"Failed to generate app",details:e},{status:500})}}let d=new i.AppRouteRouteModule({definition:{kind:a.x.APP_ROUTE,page:"/api/build/route",pathname:"/api/build",filename:"route",bundlePath:"app/api/build/route"},resolvedPagePath:"E:\\AI App Builder\\FGH\\Brix-maybe\\web\\app\\api\\build\\route.ts",nextConfigOutput:"",userland:n}),{requestAsyncStorage:c,staticGenerationAsyncStorage:u,serverHooks:g}=d,m="/api/build/route";function b(){return(0,o.patchFetch)({serverHooks:g,staticGenerationAsyncStorage:u})}},9876:(e,t,r)=>{r.d(t,{_:()=>n});async function n(e){try{console.log("Calling Gemini API with prompt:",e);let t=process.env.GEMINI_API_KEY;if(!t)throw Error("Missing GEMINI_API_KEY. Set it in your environment (.env.local) and restart the dev server.");let r=t.length<=8?"***":`${t.slice(0,4)}...${t.slice(-4)}`;console.log("Gemini API key loaded (redacted):",r);let n=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}]})});if(console.log("Gemini API response status:",n.status),!n.ok){let e=await n.text();throw console.error("Gemini API error response:",e),Error(`Gemini API Error: ${n.status} - ${e}`)}let i=await n.json();console.log("Gemini API response data:",i);let a=i.candidates?.[0]?.content?.parts?.[0]?.text;if(!a)throw console.error("No text in Gemini response:",i),Error("No valid response from Gemini");return a}catch(e){throw console.error("Error generating text with Gemini:",e),e}}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),n=t.X(0,[276,972],()=>r(5929));module.exports=n})();