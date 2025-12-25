"use client";
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ChatWindow from '@/components/ChatWindow';
import ChatInput from '@/components/ChatInput';
import { Message, Project } from '@/types/app';
import { sendMessage, buildProject } from '@/lib/api';
import { supabase } from '@/lib/supabase';

const initialProjects: Project[] = [
  { id: '1', name: 'E-commerce App', createdAt: new Date('2024-01-15').toISOString(), updatedAt: new Date('2024-01-20').toISOString(), messages: [], blueprint: null },
  { id: '2', name: 'Task Manager', createdAt: new Date('2024-01-10').toISOString(), updatedAt: new Date('2024-01-18').toISOString(), messages: [], blueprint: null },
];

export default function DashboardPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [canBuild, setCanBuild] = useState(false);
  const [files, setFiles] = useState<{path:string; content:string}[]>([]);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  const currentProject = useMemo(()=> projects.find(p=>p.id===projectId) ?? projects[0], [projects, projectId]);

  useEffect(() => {
    const userCount = messages.filter((m) => m.role === 'user').length;
    setCanBuild(userCount >= 1);
  }, [messages]);

  useEffect(() => {
    try {
      sessionStorage.setItem(`messages:${projectId}`, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages, projectId]);

  // Auth guard: redirect to sign-in if not authenticated
  useEffect(() => {
    supabase.auth.getSession().then((res: any) => {
      if (!res?.data?.session) router.replace('/sign-in');
    });
  }, [router]);

  // Fetch user display name for header
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user;
      if (user) {
        const name = (user.user_metadata as any)?.name || user.email || '';
        setUserName(name);
      }
    });
  }, []);

  const handleNewProject = () => {
    const p: Project = { id: String(Date.now()), name: 'New Project', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), messages: [], blueprint: null };
    setProjects(prev=>[p, ...prev]);
    setMessages([]);
    setFiles([]);
    setPreviewHtml(null);
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = { id: String(Date.now()), role: 'user', content, timestamp: new Date().toISOString() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsLoading(true);
    try {
      const ai = await sendMessage(projectId, nextMessages, 'interview');
      setMessages([...nextMessages, ai]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    try {
      const res = await buildProject(projectId, messages);
      setFiles(res.files || []);
      setPreviewHtml(res.previewHtml || null);

      try {
        sessionStorage.setItem(
          `build:${projectId}`,
          JSON.stringify({ previewHtml: res.previewHtml || null, files: res.files || [] }),
        );
      } catch {
        // ignore
      }

      router.push((`/dashboard/${projectId}/preview`) as any);
    } finally { setIsBuilding(false); }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/sign-in');
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-gray-100">
      <Sidebar 
        projects={projects} 
        currentProjectId={projectId} 
        onNewProject={handleNewProject} 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          title={currentProject?.name || 'New Project'} 
          canBuild={canBuild} 
          isBuilding={isBuilding} 
          onBuild={handleBuild} 
          onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          userName={userName} 
          onSignOut={handleSignOut} 
        />
        
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0 bg-black">
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onSuggestionClick={handleSendMessage}
            />
            <ChatInput
              onSend={handleSendMessage}
              isLoading={isLoading}
              placeholder="Describe the app you want to build..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
