export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO string
};

export type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  blueprint: any | null;
};
