import { motion } from 'framer-motion';
import { Calendar, Clock, Mail, Phone, User, Sparkles, MapPin, Truck } from 'lucide-react';
import { ClientBooking, CustomerDetails } from '@/types/booking';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { formatDuration, formatPrice, formatCurrency } from '@/lib/format';

const TRANSPORT_FEE = 2; // $2 transport fee

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Appointment Details */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <h3 className="font-sans text-lg font-normal text-foreground">
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
                <User className="w-3 h-3 text-primary" />
              </div>
              <h4 className="font-normal text-foreground">{client.label}</h4>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{client.service?.name}</p>
                <p className="text-sm text-muted-foreground">{formatDuration(client.service?.duration || 0)}</p>
              </div>
              <span className="font-medium text-primary">{formatCurrency(client.service?.price || 0)}</span>
            </div>
            
            {client.addOns.length > 0 && (
              <div className="pt-3 border-t border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Add-ons
                </p>
                {client.addOns.map((addon) => (
                  <div key={addon.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{addon.name}</span>
                    <span className="text-foreground">+{formatCurrency(addon.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Contact Details */}
      <div className="bg-card rounded-2xl border border-border p-5 space-y-4">
        <h3 className="font-sans text-lg font-normal text-foreground">
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
        
        <div className="flex items-center gap-3 text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{customerDetails.location}</span>
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
      <div className="bg-rose-soft rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Services Subtotal</span>
          <span className="font-medium text-foreground">{formatCurrency(totalPrice)}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Truck className="w-4 h-4" />
            <span>Transport Fee</span>
          </div>
          <span className="font-medium text-foreground">+{formatCurrency(transportFee)}</span>
        </div>
        
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Duration</p>
              <p className="font-medium text-foreground">{formatDuration(totalDuration)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-sans font-medium text-foreground">{formatCurrency(grandTotal)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
