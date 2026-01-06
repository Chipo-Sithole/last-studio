import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  label: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressIndicator = ({ steps, currentStep }: ProgressIndicatorProps) => {
  return (
    <div className="w-full py-6 px-4">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted || isCurrent 
                      ? 'hsl(var(--primary))' 
                      : 'hsl(var(--secondary))',
                  }}
                  transition={{ duration: 0.3 }}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-300",
                    isCompleted && "bg-primary text-primary-foreground",
                    isCurrent && "bg-primary text-primary-foreground shadow-glow",
                    !isCompleted && !isCurrent && "bg-secondary text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                <span className={cn(
                  "text-[10px] mt-2 text-center max-w-[60px] leading-tight hidden sm:block",
                  (isCompleted || isCurrent) ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 h-[2px] bg-secondary relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="absolute inset-0 bg-primary"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
