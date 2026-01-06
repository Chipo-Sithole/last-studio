import { Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full py-6 px-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container max-w-2xl flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <span className="font-serif text-xl font-medium text-foreground tracking-wide">
          Luxe Lash Studio
        </span>
      </div>
    </header>
  );
};
