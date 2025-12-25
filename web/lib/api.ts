import { Message } from '@/types/app';

export async function sendMessage(
  projectId: string,
  messages: Message[],
  mode: 'interview' | 'build' | 'edit' = 'interview',
  uiContext?: {
    selector?: string;
    text?: string;
    htmlSnippet?: string;
    url?: string;
  },
): Promise<Message> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, messages, mode, uiContext }),
  });
  if (!res.ok) throw new Error('Failed to send message');
  return res.json();
}

export async function buildProject(projectId: string, messages: Message[]) {
  const res = await fetch('/api/build', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, messages }),
  });
  if (!res.ok) throw new Error('Failed to build project');
  return res.json();
}
