import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Service } from '@/types/booking';
import { cn } from '@/lib/utils';
import { formatDuration, formatCurrency } from '@/lib/format';

const serviceImages: Record<string, string> = {
  'classic-natural': '/sets images/classic-lashes.jpg',
  'classic-glamour': '/sets images/glamour-lashes.jpg',
  'volume-light': '/sets images/natural-volume-lashes.jpg',
  'volume-full': '/sets images/mega-volume-lashes.jpg',
  'hybrid': '/sets images/hybrid-lashes.jpg',
};

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (service: Service) => void;
}

export const ServiceCard = ({ service, isSelected, onSelect }: ServiceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group relative rounded-2xl border bg-card transition-all duration-300 cursor-pointer overflow-hidden flex",
        isSelected 
          ? "border-primary shadow-glow" 
          : "border-border hover:border-primary/30 hover:shadow-card"
      )}
      onClick={() => onSelect(service)}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 z-10 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg"
        >
          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
      
      {/* Image Section */}
      <div className="w-40 flex-shrink-0 relative">
        <img
          src={serviceImages[service.id]}
          alt={service.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20" />
      </div>

      {/* Content Section */}
      <div className="flex-1 p-6 space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-sans text-xl font-normal text-foreground group-hover:text-primary transition-colors">
            {service.name}
          </h3>
          <span className="text-lg font-medium text-primary">
            {formatCurrency(service.price)}
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed">
          {service.description}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(service.duration)}</span>
          </div>
          
          <Button
            variant={isSelected ? "luxury" : "soft"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(service);
            }}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
