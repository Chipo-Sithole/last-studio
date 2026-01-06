import { motion } from 'framer-motion';
import { Calendar, Clock, Mail, Phone, User, Sparkles } from 'lucide-react';
import { ClientBooking, CustomerDetails } from '@/types/booking';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface BookingReviewProps {
  clients: ClientBooking[];
  selectedDate: Date;
  selectedTime: string;
  customerDetails: CustomerDetails;
}

export const BookingReview = ({
  clients,
  selectedDate,
  selectedTime,
  customerDetails,
}: BookingReviewProps) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Appointment Details */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <h3 className="font-serif text-lg font-medium text-foreground">
          Appointment Details
        </h3>
        
        <div className="flex items-center gap-3 text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center gap-3 text-muted-foreground">
          <Clock className="w-4 h-4 text-primary" />
          <span>{formatTime(selectedTime)}</span>
        </div>
      </div>

      {/* Services */}
      <div className="space-y-3">
        {clients.filter(c => c.service).map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-2xl border border-border p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-rose-soft flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-primary" />
              </div>
              <h4 className="font-medium text-foreground">{client.label}</h4>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{client.service?.name}</p>
                <p className="text-sm text-muted-foreground">{client.service?.duration} min</p>
              </div>
              <span className="font-medium text-primary">${client.service?.price}</span>
            </div>
            
            {client.addOns.length > 0 && (
              <div className="pt-3 border-t border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Add-ons
                </p>
                {client.addOns.map((addon) => (
                  <div key={addon.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{addon.name}</span>
                    <span className="text-foreground">+${addon.price}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Contact Details */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <h3 className="font-serif text-lg font-medium text-foreground">
          Contact Information
        </h3>
        
        <div className="flex items-center gap-3 text-muted-foreground">
          <User className="w-4 h-4 text-primary" />
          <span>{customerDetails.firstName} {customerDetails.lastName}</span>
        </div>
        
        <div className="flex items-center gap-3 text-muted-foreground">
          <Mail className="w-4 h-4 text-primary" />
          <span>{customerDetails.email}</span>
        </div>
        
        <div className="flex items-center gap-3 text-muted-foreground">
          <Phone className="w-4 h-4 text-primary" />
          <span>{customerDetails.phone}</span>
        </div>
        
        {customerDetails.notes && (
          <div className="pt-3 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Notes
            </p>
            <p className="text-sm text-foreground">{customerDetails.notes}</p>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="bg-rose-soft rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Duration</p>
            <p className="font-medium text-foreground">{totalDuration} minutes</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-serif font-medium text-foreground">${totalPrice}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
