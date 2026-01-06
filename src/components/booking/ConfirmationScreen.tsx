import { motion } from 'framer-motion';
import { Check, Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ClientBooking, CustomerDetails } from '@/types/booking';
import { format } from 'date-fns';

interface ConfirmationScreenProps {
  clients: ClientBooking[];
  selectedDate: Date;
  selectedTime: string;
  customerDetails: CustomerDetails;
  onNewBooking: () => void;
}

export const ConfirmationScreen = ({
  clients,
  selectedDate,
  selectedTime,
  customerDetails,
  onNewBooking,
}: ConfirmationScreenProps) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8 py-8"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-glow"
        >
          <Check className="w-7 h-7 text-primary-foreground" />
        </motion.div>
      </motion.div>

      {/* Confirmation Message */}
      <div className="space-y-2">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="font-serif text-3xl font-medium text-foreground"
        >
          Booking Confirmed!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground"
        >
          A confirmation has been sent to {customerDetails.email}
        </motion.p>
      </div>

      {/* Appointment Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-card rounded-2xl border border-border p-6 text-left space-y-4 max-w-sm mx-auto"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium text-foreground">
                {format(selectedDate, 'EEEE, MMMM d')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="font-medium text-foreground">
                {formatTime(selectedTime)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium text-foreground">
                Luxe Lash Studio
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Services
          </p>
          {clients.filter(c => c.service).map((client) => (
            <div key={client.id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{client.label}</span>
              <span className="text-foreground">{client.service?.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="space-y-3 pt-4"
      >
        <Button
          variant="luxury"
          size="lg"
          className="w-full max-w-xs mx-auto"
          onClick={onNewBooking}
        >
          Book Another Appointment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        
        <p className="text-xs text-muted-foreground">
          Need to reschedule? Contact us at hello@luxelash.com
        </p>
      </motion.div>
    </motion.div>
  );
};
