export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
  blueprint: AppBlueprint | null;
}

export interface AppBlueprint {
  app_name: string;
  platform: 'web';
  framework: 'react';
  screens: Screen[];
  features: Feature[];
  auth: boolean;
  ui_style: string;
}

export interface Screen {
  name: string;
  path: string;
  description: string;
  components: string[];
}

export interface Feature {
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  canBuild: boolean;
}
