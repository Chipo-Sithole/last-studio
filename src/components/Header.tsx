import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onBack?: () => void;
}

export const Header = ({ onBack }: HeaderProps) => {
  return (
    <header className="w-full py-4 px-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-2xl flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <img 
            src="/logo.png" 
            alt="Heavenly Lash Studio Logo" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </div>
        
        <span className="font-sans text-lg md:text-xl font-medium text-foreground tracking-wide absolute left-1/2 -translate-x-1/2">
          Heavenly Lash Studio
        </span>
      </div>
    </header>
  );
};
