import { NextResponse } from 'next/server';
import { generateText } from '@/app/services/gemini';

export async function POST(request: Request) {
  try {
    console.log('Chat API called');
    
    const { projectId, messages, mode, uiContext } = await request.json();
    const safeMode: 'interview' | 'build' | 'edit' = mode === 'build' ? 'build' : mode === 'edit' ? 'edit' : 'interview';
    const lastUserMessage = Array.isArray(messages)
      ? [...messages].reverse().find((m: any) => m?.role === 'user')
      : undefined;
    const userText = lastUserMessage?.content || '';

    const systemPrompt = `<identity>
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

Return plain text only.`;

    const conversationText = Array.isArray(messages)
      ? messages
          .slice(-20)
          .map((m: any) => `${m.role?.toUpperCase?.() || 'USER'}: ${m.content || ''}`)
          .join('\n')
      : '';

    const editSystemPrompt = `<edit_role>
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

Return plain text only.`;

    const contextText = uiContext
      ? `\n\nUI CONTEXT (from clicked element):\n- selector: ${uiContext.selector || ''}\n- text: ${uiContext.text || ''}\n- htmlSnippet: ${uiContext.htmlSnippet || ''}\n- url: ${uiContext.url || ''}\n`
      : '';

    const prompt =
      safeMode === 'build'
        ? `The user clicked Build. Summarize the final requirements in 10-20 bullet points.\n\nConversation:\n${conversationText}`
        : safeMode === 'edit'
          ? `${editSystemPrompt}\n\nConversation so far:\n${conversationText}${contextText}\n\nUser request: ${userText}\n\nRespond with the best next step / change proposal.`
          : `${systemPrompt}\n\nConversation so far:\n${conversationText}\n\nLast user message: ${userText}\n\nNow respond with your next single question.`;

    const response = await generateText(prompt);
    console.log('Generated response:', response);
    
    const reply = {
      id: String(Date.now() + 1),
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    };

    console.log('Sending reply:', reply);
    return NextResponse.json(reply);
  } catch (error) {
    console.error('Error in chat API:', error);
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
      { error: 'Failed to generate response', details: msg },
      { status: 500 }
    );
  }
}
