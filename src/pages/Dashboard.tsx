import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppSidebar from '@/components/layout/AppSidebar';
import DashboardHeader from '@/components/layout/DashboardHeader';
import ChatWindow from '@/components/chat/ChatWindow';
import ChatInput from '@/components/chat/ChatInput';
import BuildResultPanel from '@/components/preview/BuildResultPanel';
import { Message, Project } from '@/types/app';
import { toast } from '@/hooks/use-toast';

// Mock initial projects
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce App',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    messages: [],
    blueprint: null,
  },
  {
    id: '2',
    name: 'Task Manager',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    messages: [],
    blueprint: null,
  },
];

const Dashboard = () => {
  const { projectId } = useParams();
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [canBuild, setCanBuild] = useState(false);
  const [showBuildResult, setShowBuildResult] = useState(false);

  const currentProject = projects.find((p) => p.id === projectId);

  // Check if enough context exists to build
  useEffect(() => {
    setCanBuild(messages.length >= 4);
  }, [messages]);

  const handleNewProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: 'New Project',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
      blueprint: null,
    };
    setProjects([newProject, ...projects]);
    setMessages([]);
    setShowBuildResult(false);
    toast({
      title: 'Project Created',
      description: 'Start chatting to describe your app idea.',
    });
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(content, messages.length),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);
  };

  const handleBuild = async () => {
    setIsBuilding(true);
    toast({
      title: 'Building your app...',
      description: 'Generating React starter code from your conversation.',
    });

    // Simulate build process
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsBuilding(false);
    setShowBuildResult(true);
    toast({
      title: 'App Built Successfully! 🚀',
      description: 'Your React starter app is ready for download.',
    });
  };

  const handleDownload = () => {
    toast({
      title: 'Downloading...',
      description: 'Your app is being packaged as a ZIP file.',
    });
    // In production, trigger actual ZIP download
  };

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <AppSidebar
        projects={projects}
        currentProjectId={projectId}
        onNewProject={handleNewProject}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex min-w-0">
        {/* Chat Section */}
        <div className={`flex-1 flex flex-col min-w-0 ${showBuildResult ? 'max-w-[50%]' : ''}`}>
          <DashboardHeader
            title={currentProject?.name || 'New Project'}
            canBuild={canBuild}
            isBuilding={isBuilding}
            onBuild={handleBuild}
            onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatWindow messages={messages} isLoading={isLoading} onSuggestionClick={handleSendMessage} />

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-background/50 backdrop-blur-sm">
              <div className="max-w-3xl mx-auto">
                <ChatInput
                  onSend={handleSendMessage}
                  isLoading={isLoading}
                  placeholder="Describe your app idea..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Build Result Panel */}
        {showBuildResult && (
          <div className="w-1/2 min-w-[400px]">
            <BuildResultPanel
              files={[]}
              onDownload={handleDownload}
              isVisible={showBuildResult}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Simple AI response simulation
function getAIResponse(userMessage: string, messageCount: number): string {
  const responses = [
    "That's an interesting app idea! Let me ask you a few questions to understand it better.\n\nWhat's the primary problem you're trying to solve with this app? And who is your target audience?",
    "Great! Now let's think about the core features.\n\nWhat are the 3-5 most important features this app must have in the MVP? Try to prioritize them.",
    "I'm getting a clearer picture now. Let me understand the user experience:\n\n1. How should users sign up - email, social login, or both?\n2. What's the first thing users should see after logging in?",
    "Excellent! I think I have enough context to help you build this.\n\nBased on our conversation, I'm seeing:\n• A React web app\n• User authentication\n• Main dashboard with key features\n• Clean, modern UI\n\nYou can now click **Build This App** to generate your starter code! 🚀",
    "I can help refine this further. What specific aspect would you like to explore - the data model, UI/UX flow, or additional features?",
  ];

  const index = Math.min(messageCount / 2, responses.length - 1);
  return responses[Math.floor(index)];
}

export default Dashboard;
