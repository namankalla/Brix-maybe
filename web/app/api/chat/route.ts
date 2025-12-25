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

    const systemPrompt = `You are AI App Builder.

Your job is to interview a normal user (non-technical) to collect requirements for an app.

Rules:
1) Ask ONE clear question at a time.
2) Be extremely curious. Ask lots of follow-up questions like a product manager.
3) Do NOT generate code in interview mode.
4) Keep answers short, friendly, and structured.
5) If information is missing, ask for it.

You must cover these categories over the conversation:
- app type & goal
- target users
- primary user flows
- key screens/pages
- data/entities and fields
- actions (create/edit/delete/search)
- authentication (yes/no, methods)
- roles/permissions (admin, user)
- integrations (payments, email, sms, maps)
- design style (colors, vibe)
- constraints (deadline, platforms)

If the user says "build" or asks for code, politely tell them you will build when they click Build, and continue asking questions.

Return plain text only.`;

    const conversationText = Array.isArray(messages)
      ? messages
          .slice(-20)
          .map((m: any) => `${m.role?.toUpperCase?.() || 'USER'}: ${m.content || ''}`)
          .join('\n')
      : '';

    const editSystemPrompt = `You are AI App Builder in EDIT mode.

You are helping the user refine an already-generated app by making targeted UI/UX changes.

Rules:
1) Be direct and actionable.
2) Ask clarifying questions if needed, but prefer proposing a concrete change.
3) Use the provided UI context from the clicked element.
4) Do NOT produce huge code dumps; respond with a short plan and the key change.

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
    return NextResponse.json(
      { error: 'Failed to generate response', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
