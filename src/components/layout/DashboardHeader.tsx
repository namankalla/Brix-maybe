import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Download } from 'lucide-react';
import BuildButton from '../chat/BuildButton';

interface DashboardHeaderProps {
  title: string;
  canBuild: boolean;
  isBuilding: boolean;
  onBuild: () => void;
  onMenuToggle: () => void;
}

const DashboardHeader = ({
  title,
  canBuild,
  isBuilding,
  onBuild,
  onMenuToggle,
}: DashboardHeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold truncate">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <BuildButton
          canBuild={canBuild}
          isBuilding={isBuilding}
          onBuild={onBuild}
        />
      </div>
    </header>
  );
};

export default DashboardHeader;
