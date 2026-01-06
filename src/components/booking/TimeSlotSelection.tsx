import { motion } from 'framer-motion';
import { TimeSlot } from '@/types/booking';
import { cn } from '@/lib/utils';

interface TimeSlotSelectionProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export const TimeSlotSelection = ({
  slots,
  selectedTime,
  onTimeSelect,
}: TimeSlotSelectionProps) => {
  const morningSlots = slots.filter(s => parseInt(s.time.split(':')[0]) < 12);
  const afternoonSlots = slots.filter(s => parseInt(s.time.split(':')[0]) >= 12);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const SlotGroup = ({ title, slots: groupSlots }: { title: string; slots: TimeSlot[] }) => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {groupSlots.map((slot, index) => (
          <motion.button
            key={slot.time}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.02 }}
            whileHover={slot.available ? { scale: 1.05 } : undefined}
            whileTap={slot.available ? { scale: 0.95 } : undefined}
            onClick={() => slot.available && onTimeSelect(slot.time)}
            disabled={!slot.available}
            className={cn(
              "py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200",
              selectedTime === slot.time && "bg-primary text-primary-foreground shadow-soft",
              selectedTime !== slot.time && slot.available && "bg-card border border-border hover:border-primary/30 hover:shadow-card",
              !slot.available && "bg-muted text-muted-foreground/50 cursor-not-allowed line-through"
            )}
          >
            {formatTime(slot.time)}
          </motion.button>
        ))}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {morningSlots.length > 0 && (
        <SlotGroup title="Morning" slots={morningSlots} />
      )}
      {afternoonSlots.length > 0 && (
        <SlotGroup title="Afternoon" slots={afternoonSlots} />
      )}
    </motion.div>
  );
};
