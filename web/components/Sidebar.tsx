import Link from 'next/link';
import type { Project } from '@/types/app';
import { PlusIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({ 
  projects, 
  currentProjectId, 
  onNewProject, 
  collapsed, 
  onToggle 
}: { 
  projects: Project[]; 
  currentProjectId?: string | string[]; 
  onNewProject: () => void; 
  collapsed: boolean; 
  onToggle: () => void; 
}) {
  return (
    <aside className={`
      h-full flex flex-col 
      ${collapsed ? 'w-16' : 'w-64'} 
      transition-all duration-200 
      bg-black border-r border-gray-900
      text-gray-200
    `}>
      <div className="p-4 flex items-center justify-between border-b border-gray-900 h-16">
        {!collapsed && <span className="font-semibold text-white">AI App Builder</span>}
        <button 
          onClick={onToggle} 
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <button 
          onClick={onNewProject} 
          className={`flex items-center justify-center space-x-2 w-full mb-3 px-3 py-2.5 rounded-lg 
            bg-gray-900 hover:bg-gray-800 text-white 
            transition-colors duration-200
            ${collapsed ? 'px-3' : 'px-4'}
          `}
        >
          <PlusIcon size={18} className="flex-shrink-0" />
          {!collapsed && <span>New Project</span>}
        </button>
        
        <div className="space-y-1">
          {projects.map(p => (
            <Link 
              key={p.id} 
              href={`/dashboard/${p.id}`} 
              className={`
                flex items-center px-3 py-2.5 rounded-lg text-sm 
                ${String(currentProjectId) === p.id 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'}
                transition-colors duration-200
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? p.name : ''}
            >
              <div className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${String(currentProjectId) === p.id ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
              {!collapsed && <span className="truncate">{p.name}</span>}
            </Link>
          ))}
        </div>
      </div>
      
      {!collapsed && (
        <div className="p-3 border-t border-gray-900 text-xs text-gray-500">
          <p>AI App Builder v1.0</p>
          <p className="mt-1">© {new Date().getFullYear()}</p>
        </div>
      )}
    </aside>
  );
}
