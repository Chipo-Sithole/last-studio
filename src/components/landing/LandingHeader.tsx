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
        <div className="flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="Heavenly Lash Studio Logo" 
            className="h-12 md:h-14 w-auto object-contain"
          />
        </div>

        <span className="font-sans text-xl md:text-2xl font-medium text-foreground absolute left-1/2 -translate-x-1/2">
          Heavenly Lash Studio
        </span>

        <Button variant="luxury" size="sm" onClick={onBookNow}>
          Book Your Appointment
        </Button>
      </div>
    </motion.header>
  );
};
