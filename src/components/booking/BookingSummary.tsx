import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, Truck } from 'lucide-react';
import { ClientBooking, CustomerDetails } from '@/types/booking';
import { cn } from '@/lib/utils';
import { formatDuration, formatPrice, formatCurrency } from '@/lib/format';

const TRANSPORT_FEE = 2; // $2 transport fee

interface BookingSummaryProps {
  clients: ClientBooking[];
  customerDetails?: CustomerDetails | null;
  className?: string;
}

export const BookingSummary = ({ clients, customerDetails, className }: BookingSummaryProps) => {
  const totalPrice = clients.reduce((acc, client) => {
    const servicePrice = formatPrice(client.service?.price || 0);
    const addOnsPrice = client.addOns.reduce((sum, addon) => sum + formatPrice(addon.price), 0);
    return acc + servicePrice + addOnsPrice;
  }, 0);

  // Transport fee is always included (mandatory for mobile service)
  const transportFee = TRANSPORT_FEE;
  const grandTotal = totalPrice + transportFee;

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
                <span>{formatDuration(totalDuration)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>{clients.filter(c => c.service).length} {clients.filter(c => c.service).length === 1 ? 'client' : 'clients'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Truck className="w-4 h-4" />
                <span>+{formatCurrency(transportFee)}</span>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.span
                key={grandTotal}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl font-sans font-medium text-foreground"
              >
                {formatCurrency(grandTotal)}
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
