import { motion } from 'framer-motion';
import { Check, Clock, Plus } from 'lucide-react';
import { AddOn } from '@/types/booking';
import { cn } from '@/lib/utils';

interface AddOnSelectionProps {
  addOns: AddOn[];
  selectedAddOns: AddOn[];
  onToggleAddOn: (addOn: AddOn) => void;
  clientLabel: string;
}

export const AddOnSelection = ({
  addOns,
  selectedAddOns,
  onToggleAddOn,
  clientLabel,
}: AddOnSelectionProps) => {
  const isSelected = (addOn: AddOn) => selectedAddOns.some(a => a.id === addOn.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="text-center mb-6">
        <p className="text-sm text-muted-foreground">
          Enhance {clientLabel}'s experience
        </p>
      </div>

      <div className="grid gap-3">
        {addOns.map((addOn, index) => {
          const selected = isSelected(addOn);
          
          return (
            <motion.button
              key={addOn.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onToggleAddOn(addOn)}
              className={cn(
                "w-full p-4 rounded-xl border text-left transition-all duration-300",
                selected
                  ? "border-primary bg-rose-soft shadow-soft"
                  : "border-border bg-card hover:border-primary/30 hover:shadow-card"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}>
                  {selected ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-foreground">
                      {addOn.name}
                    </h4>
                    <span className="text-sm font-medium text-primary whitespace-nowrap">
                      +${addOn.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {addOn.description}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>+{addOn.duration} min</span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
