import { Button } from '@/components/ui/button';
import { Rocket, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BuildButtonProps {
  canBuild: boolean;
  isBuilding: boolean;
  onBuild: () => void;
}

const BuildButton = ({ canBuild, isBuilding, onBuild }: BuildButtonProps) => {
  return (
    <Button
      variant={canBuild ? 'glow' : 'outline'}
      size="lg"
      onClick={onBuild}
      disabled={!canBuild || isBuilding}
      className={cn(
        'gap-2 transition-all duration-300',
        canBuild && 'animate-pulse-glow'
      )}
    >
      {isBuilding ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Building...</span>
        </>
      ) : (
        <>
          <Rocket className="w-5 h-5" />
          <span>Build This App</span>
        </>
      )}
    </Button>
  );
};

export default BuildButton;
