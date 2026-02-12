import { motion } from 'framer-motion';
import { Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useServices } from '@/hooks/useApi';
import { formatDuration, formatCurrency } from '@/lib/format';

// Service category images from public/sets images folder
const serviceImages: Record<string, string> = {
  'classic-natural': '/sets images/classic-lashes.jpg',
  'classic-glamour': '/sets images/glamour-lashes.jpg',
  'volume-light': '/sets images/natural-volume-lashes.jpg',
  'volume-full': '/sets images/mega-volume-lashes.jpg',
  'hybrid': '/sets images/hybrid-lashes.jpg',
};

interface ServicesPreviewProps {
  onBookNow: (serviceId?: string) => void;
}

export const ServicesPreview = ({ onBookNow }: ServicesPreviewProps) => {
  // Fetch services from API
  const { data: services = [], isLoading, error } = useServices();

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-4 block">
            Our Services
          </span>
          <h2 className="font-sans text-4xl sm:text-5xl font-normal text-foreground mb-4">
            Tailored to Perfection
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Every set is customized to complement your unique eye shape, 
            lifestyle, and personal style.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-10 text-red-500">
            Failed to load services. Please try again later.
          </div>
        )}

        {/* Services Grid */}
        {!isLoading && !error && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {/* Service Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={serviceImages[service.id]}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Service Details */}
                <div className="p-6 space-y-1">
                  <h3 className="font-sans text-2xl font-light text-gray-900 text-center">
                    {service.name}
                  </h3>
                  
                  {/* Price and Duration - Horizontal Layout */}
                  <div className="pb-4 space-y-1">
                    {/* Price - Centered */}
                    <p className="text-xl font-medium text-gray-900 text-center">
                      {formatCurrency(service.price)}
                    </p>
                    
                    {/* Duration - Centered Below */}
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{formatDuration(service.duration)}</span>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => onBookNow(service.id)}
                    variant="luxury"
                    className="w-full rounded-full h-10 text-sm font-normal"
                  >
                    SELECT
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button variant="luxury" size="lg" onClick={() => onBookNow()}>
            View All Services
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
