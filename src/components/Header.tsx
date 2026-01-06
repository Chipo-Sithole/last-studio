import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onBack?: () => void;
}

export const Header = ({ onBack }: HeaderProps) => {
  return (
    <header className="w-full py-4 px-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-2xl flex items-center justify-between">
        {onBack ? (
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        ) : (
          <div />
        )}
        
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-serif text-xl font-medium text-foreground tracking-wide">
            Luxe Lash Studio
          </span>
        </div>
        
        <div className="w-16 sm:w-20" />
      </div>
    </header>
  );
};
