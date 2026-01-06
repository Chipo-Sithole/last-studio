import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    name: 'Classic',
    description: 'Timeless elegance with one extension per natural lash',
    duration: '90 min',
    price: 'From $120',
    image: '✨',
  },
  {
    name: 'Volume',
    description: 'Luxurious fullness with handcrafted lash fans',
    duration: '120 min',
    price: 'From $175',
    image: '💫',
  },
  {
    name: 'Hybrid',
    description: 'The best of both worlds, perfectly blended',
    duration: '120 min',
    price: 'From $185',
    image: '🌟',
  },
  {
    name: 'Mega Volume',
    description: 'Maximum impact for the bold and beautiful',
    duration: '180 min',
    price: 'From $280',
    image: '⭐',
  },
];

interface ServicesPreviewProps {
  onBookNow: () => void;
}

export const ServicesPreview = ({ onBookNow }: ServicesPreviewProps) => {
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
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-foreground mb-4">
            Tailored to Perfection
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Every set is customized to complement your unique eye shape, 
            lifestyle, and personal style.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-elevated transition-all duration-300"
            >
              <div className="text-4xl mb-4">{service.image}</div>
              <h3 className="font-serif text-xl font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{service.duration}</span>
                </div>
                <span className="font-medium text-primary">{service.price}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Button variant="luxury" size="lg" onClick={onBookNow}>
            View All Services
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
