import { Loader2, Rocket } from 'lucide-react';

export default function BuildButton({ 
  canBuild, 
  isBuilding, 
  onClick 
}: { 
  canBuild: boolean; 
  isBuilding: boolean; 
  onClick: () => void; 
}) {
  return (
    <button 
      disabled={!canBuild || isBuilding} 
      onClick={onClick} 
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${!canBuild 
          ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
          : isBuilding 
            ? 'bg-blue-900 text-blue-100' 
            : 'bg-blue-600 text-white hover:bg-blue-700'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black
        disabled:opacity-70 disabled:cursor-not-allowed
        border border-blue-700
      `}
    >
      {isBuilding ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Building...</span>
        </>
      ) : (
        <>
          <Rocket className="w-4 h-4" />
          <span>Build This App</span>
        </>
      )}
    </button>
  );
}
