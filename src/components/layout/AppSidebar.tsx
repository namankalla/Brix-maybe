import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Plus,
  FolderOpen,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { Project } from '@/types/app';

interface AppSidebarProps {
  projects: Project[];
  currentProjectId?: string;
  onNewProject: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

const AppSidebar = ({
  projects,
  currentProjectId,
  onNewProject,
  collapsed,
  onToggle,
}: AppSidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-lg">AppForge</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mx-auto">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn('text-muted-foreground', collapsed && 'mx-auto mt-2')}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* New Project Button */}
      <div className="p-3">
        <Button
          variant="glow"
          className={cn('w-full gap-2', collapsed && 'px-0')}
          onClick={onNewProject}
        >
          <Plus className="w-4 h-4" />
          {!collapsed && <span>New Project</span>}
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {!collapsed && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            Projects
          </p>
        )}
        <div className="space-y-1">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/dashboard/${project.id}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                currentProjectId === project.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{project.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-1">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground',
            collapsed && 'justify-center px-0'
          )}
        >
          <Settings className="w-4 h-4" />
          {!collapsed && <span>Settings</span>}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground hover:text-destructive',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
