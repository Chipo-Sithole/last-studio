import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LandingHeaderProps {
  onBookNow: () => void;
}

export const LandingHeader = ({ onBookNow }: LandingHeaderProps) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="container max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-serif text-xl font-medium text-foreground">
            Luxe Lash Studio
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Services
          </a>
          <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </a>
          <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Reviews
          </a>
          <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </a>
        </nav>

        <Button variant="luxury" size="sm" onClick={onBookNow}>
          Book Now
        </Button>
      </div>
    </motion.header>
  );
};
