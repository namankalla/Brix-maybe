"use strict";(()=>{var e={};e.id=744,e.ids=[744],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3795:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>h,patchFetch:()=>g,requestAsyncStorage:()=>c,routeModule:()=>d,serverHooks:()=>m,staticGenerationAsyncStorage:()=>p});var o={};r.r(o),r.d(o,{POST:()=>u});var n=r(9303),i=r(8716),s=r(670),a=r(7070),l=r(9876);async function u(e){try{console.log("Chat API called");let{projectId:t,messages:r,mode:o,uiContext:n}=await e.json(),i="build"===o?"build":"edit"===o?"edit":"interview",s=Array.isArray(r)?[...r].reverse().find(e=>e?.role==="user"):void 0,u=s?.content||"",d=`<identity>
You are an AI App Builder.

Your purpose is to help non-technical users design, refine, and build complete applications
through natural conversation.

You are NOT a generic chatbot.
You behave like a thoughtful product manager + senior engineer combined.
</identity>

<core_mission>
Your job is to:
1) Interview users to deeply understand their app idea
2) Convert vague ideas into clear product requirements
3) Help refine UI/UX decisions
4) Prepare clean, structured build plans
5) Assist with edits after the app is generated

You do NOT rush to code.
You build understanding first.
</core_mission>

<modes>
You operate in THREE modes only:

1) INTERVIEW MODE
2) BUILD MODE
3) EDIT MODE
</modes>

--------------------------------------------------
INTERVIEW MODE
--------------------------------------------------

<interview_role>
In interview mode, you act like a patient and curious product manager.

The user is assumed to be NON-TECHNICAL.
They may not know correct terms.
They may be confused.
That is expected.

Your job is to guide them.
</interview_role>

<interview_rules>
1) Ask ONLY ONE clear question at a time
2) Use simple, human language
3) Never overwhelm the user
4) Never generate code
5) Be curious and ask follow-ups
6) Keep responses short and friendly
7) If something is missing, ask for it
</interview_rules>

<interview_coverage>
Over the course of the conversation, you MUST uncover:

- App type and main goal
- Problem it solves
- Target users
- Primary user flows
- Key screens or pages
- Data entities and fields
- Actions (create, edit, delete, search)
- Authentication (yes or no, methods)
- Roles and permissions (admin, user, etc.)
- Integrations (payments, email, SMS, maps, AI, etc.)
- Design style (colors, vibe, inspiration)
- Platforms (web, mobile, both)
- Constraints (deadline, budget, complexity)
</interview_coverage>

<interview_boundary>
If the user asks for code or says "build":
Politely explain that the app will be built only when they click Build.
Then continue the interview.
</interview_boundary>

Return plain text only.`,c=Array.isArray(r)?r.slice(-20).map(e=>`${e.role?.toUpperCase?.()||"USER"}: ${e.content||""}`).join("\n"):"",p=`<edit_role>
In edit mode, you help refine or improve an already-generated app.

You behave like a UI/UX-focused product engineer.
</edit_role>

<edit_rules>
1) Be direct and actionable
2) Prefer proposing a concrete change
3) Ask a clarifying question ONLY if required
4) Use provided UI context from clicked elements
5) Avoid huge explanations
</edit_rules>

<edit_output>
Your response should include:
- A short plan OR
- A specific UI/UX suggestion OR
- A focused improvement proposal
</edit_output>

Return plain text only.`,m=n?`

UI CONTEXT (from clicked element):
- selector: ${n.selector||""}
- text: ${n.text||""}
- htmlSnippet: ${n.htmlSnippet||""}
- url: ${n.url||""}
`:"",h="build"===i?`The user clicked Build. Summarize the final requirements in 10-20 bullet points.

Conversation:
${c}`:"edit"===i?`${p}

Conversation so far:
${c}${m}

User request: ${u}

Respond with the best next step / change proposal.`:`${d}

Conversation so far:
${c}

Last user message: ${u}

Now respond with your next single question.`,g=await (0,l._)(h);console.log("Generated response:",g);let v={id:String(Date.now()+1),role:"assistant",content:g,timestamp:new Date().toISOString()};return console.log("Sending reply:",v),a.NextResponse.json(v)}catch(o){console.error("Error in chat API:",o);let e=o instanceof Error?o.message:String(o??"Unknown error"),t=e.match(/retryDelay"\s*:\s*"(\d+)s"/i),r=t?Number(t[1]):void 0;if(e.includes("Gemini API Error: 429")||e.includes("RESOURCE_EXHAUSTED"))return a.NextResponse.json({error:"RATE_LIMITED",details:e,retryAfterSeconds:r??60},{status:429,headers:{"Retry-After":String(r??60)}});return a.NextResponse.json({error:"Failed to generate response",details:e},{status:500})}}let d=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/chat/route",pathname:"/api/chat",filename:"route",bundlePath:"app/api/chat/route"},resolvedPagePath:"E:\\AI App Builder\\FGH\\Brix-maybe\\web\\app\\api\\chat\\route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:c,staticGenerationAsyncStorage:p,serverHooks:m}=d,h="/api/chat/route";function g(){return(0,s.patchFetch)({serverHooks:m,staticGenerationAsyncStorage:p})}},9876:(e,t,r)=>{r.d(t,{_:()=>o});async function o(e){try{console.log("Calling Gemini API with prompt:",e);let t=process.env.GEMINI_API_KEY;if(!t)throw Error("Missing GEMINI_API_KEY. Set it in your environment (.env.local) and restart the dev server.");let r=t.length<=8?"***":`${t.slice(0,4)}...${t.slice(-4)}`;console.log("Gemini API key loaded (redacted):",r);let o=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:e}]}]})});if(console.log("Gemini API response status:",o.status),!o.ok){let e=await o.text();throw console.error("Gemini API error response:",e),Error(`Gemini API Error: ${o.status} - ${e}`)}let n=await o.json();console.log("Gemini API response data:",n);let i=n.candidates?.[0]?.content?.parts?.[0]?.text;if(!i)throw console.error("No text in Gemini response:",n),Error("No valid response from Gemini");return i}catch(e){throw console.error("Error generating text with Gemini:",e),e}}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[276,972],()=>r(3795));module.exports=o})();