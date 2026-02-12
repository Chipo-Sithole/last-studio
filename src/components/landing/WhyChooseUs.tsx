import { motion } from 'framer-motion';
import { Sparkles, Home, Star } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'We use only the finest lash extensions and professional-grade adhesives for lasting results.',
  },
  {
    icon: Home,
    title: 'Mobile Convenience',
    description: 'Enjoy professional lash services in the comfort of your own home. No travel, no hassle—just beautiful lashes.',
  },
  {
    icon: Star,
    title: 'Personalized Service',
    description: 'We tailor each service to your unique eye shape, style preferences, and lifestyle.',
  },
];

export const WhyChooseUs = () => {
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
          <h2 className="font-sans text-4xl sm:text-5xl font-normal text-foreground mb-4">
            Why Choose Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            We're committed to providing exceptional service and stunning results that enhance your natural beauty.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-soft/50 mb-6">
                  <Icon className="w-7 h-7 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="font-sans text-xl font-normal text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
