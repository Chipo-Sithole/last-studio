import { Sparkles, Instagram, Facebook } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container max-w-6xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-serif text-xl font-medium">Luxe Lash Studio</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-background/70 hover:text-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-background/70 hover:text-primary transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
          </div>

          <p className="text-sm text-background/60">
            © 2024 Luxe Lash Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
