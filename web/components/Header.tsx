import { Menu, LogOut, ChevronDown, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import BuildButton from './BuildButton';

export default function Header({ 
  title, 
  canBuild, 
  isBuilding, 
  onBuild, 
  onMenuToggle, 
  userName, 
  onSignOut 
}: { 
  title: string; 
  canBuild: boolean; 
  isBuilding: boolean; 
  onBuild: () => void; 
  onMenuToggle: () => void; 
  userName?: string; 
  onSignOut?: () => void; 
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between h-16 px-4 border-b border-gray-900 bg-black">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuToggle} 
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-600"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-medium text-white">{title}</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        <BuildButton canBuild={canBuild} isBuilding={isBuilding} onClick={onBuild} />
        
        {userName && onSignOut && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm rounded-md hover:bg-gray-900 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300">
                <User size={16} />
              </div>
              {!isBuilding && (
                <span className="hidden md:inline text-sm text-gray-300">{userName}</span>
              )}
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 border border-gray-800 z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-800">
                    <p className="font-medium">{userName}</p>
                    <p className="text-xs text-gray-500">Free Plan</p>
                  </div>
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 flex items-center space-x-2"
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
