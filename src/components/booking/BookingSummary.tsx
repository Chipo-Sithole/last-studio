import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';
import { ClientBooking } from '@/types/booking';
import { cn } from '@/lib/utils';

interface BookingSummaryProps {
  clients: ClientBooking[];
  className?: string;
}

export const BookingSummary = ({ clients, className }: BookingSummaryProps) => {
  const totalPrice = clients.reduce((acc, client) => {
    const servicePrice = client.service?.price || 0;
    const addOnsPrice = client.addOns.reduce((sum, addon) => sum + addon.price, 0);
    return acc + servicePrice + addOnsPrice;
  }, 0);

  const totalDuration = clients.reduce((acc, client) => {
    const serviceDuration = client.service?.duration || 0;
    const addOnsDuration = client.addOns.reduce((sum, addon) => sum + addon.duration, 0);
    return acc + serviceDuration + addOnsDuration;
  }, 0);

  const hasSelection = clients.some(client => client.service);

  if (!hasSelection) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border p-4 md:p-6 z-40",
        className
      )}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{totalDuration} min</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>{clients.filter(c => c.service).length} {clients.filter(c => c.service).length === 1 ? 'client' : 'clients'}</span>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={totalPrice}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl font-serif font-medium text-foreground"
              >
                ${totalPrice}
              </motion.span>
            </AnimatePresence>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            {clients.filter(c => c.service).map((client, index) => (
              <span key={client.id} className="text-xs text-muted-foreground">
                {client.label}: {client.service?.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
