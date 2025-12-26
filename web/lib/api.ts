import { Message } from '@/types/app';

export class ApiError extends Error {
  status: number;
  retryAfterSeconds?: number;
  bodyText?: string;

  constructor(message: string, opts: { status: number; retryAfterSeconds?: number; bodyText?: string }) {
    super(message);
    this.name = 'ApiError';
    this.status = opts.status;
    this.retryAfterSeconds = opts.retryAfterSeconds;
    this.bodyText = opts.bodyText;
  }
}

async function parseError(res: Response) {
  const text = await res.text().catch(() => '');
  let retryAfterSeconds: number | undefined;
  try {
    const json = JSON.parse(text);
    if (typeof json?.retryAfterSeconds === 'number') retryAfterSeconds = json.retryAfterSeconds;
  } catch {
    // ignore
  }
  return { text, retryAfterSeconds };
}

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
  if (!res.ok) {
    const { text, retryAfterSeconds } = await parseError(res);
    throw new ApiError(`Failed to send message (${res.status})`, {
      status: res.status,
      retryAfterSeconds,
      bodyText: text || res.statusText,
    });
  }
  return res.json();
}

export async function buildProject(projectId: string, messages: Message[]) {
  const res = await fetch('/api/build', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, messages }),
  });
  if (!res.ok) {
    const { text, retryAfterSeconds } = await parseError(res);
    throw new ApiError(`Failed to build project (${res.status})`, {
      status: res.status,
      retryAfterSeconds,
      bodyText: text || res.statusText,
    });
  }
  return res.json();
}
