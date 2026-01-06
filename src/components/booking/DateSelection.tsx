import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, isBefore, startOfDay } from 'date-fns';
import { useState } from 'react';

interface DateSelectionProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
}

export const DateSelection = ({ selectedDate, onDateSelect }: DateSelectionProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startPadding = monthStart.getDay();
  const paddingDays = Array(startPadding).fill(null);
  
  const today = startOfDay(new Date());

  const goToPreviousMonth = () => {
    const prevMonth = addMonths(currentMonth, -1);
    if (!isBefore(startOfMonth(prevMonth), startOfMonth(today))) {
      setCurrentMonth(prevMonth);
    }
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const canGoPrevious = !isBefore(startOfMonth(addMonths(currentMonth, -1)), startOfMonth(today));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-sm mx-auto"
    >
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
            disabled={!canGoPrevious}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <h3 className="font-serif text-xl font-medium text-foreground">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextMonth}
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div
              key={day}
              className="h-10 flex items-center justify-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {paddingDays.map((_, index) => (
            <div key={`pad-${index}`} className="h-10" />
          ))}
          
          {days.map((day) => {
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isPast = isBefore(day, today);
            const isTodayDate = isToday(day);
            
            return (
              <motion.button
                key={day.toISOString()}
                whileHover={!isPast ? { scale: 1.1 } : undefined}
                whileTap={!isPast ? { scale: 0.95 } : undefined}
                onClick={() => !isPast && onDateSelect(day)}
                disabled={isPast}
                className={cn(
                  "h-10 w-full rounded-full flex items-center justify-center text-sm transition-all duration-200",
                  isSelected && "bg-primary text-primary-foreground shadow-soft",
                  !isSelected && !isPast && "hover:bg-rose-soft",
                  !isSelected && isTodayDate && "ring-1 ring-primary/50",
                  isPast && "text-muted-foreground/40 cursor-not-allowed"
                )}
              >
                {format(day, 'd')}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
