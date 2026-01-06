import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Regular Client',
    content: 'The best lash experience I\'ve ever had. My extensions look so natural and last for weeks. I\'m completely obsessed!',
    rating: 5,
  },
  {
    name: 'Emily R.',
    role: 'First-Time Client',
    content: 'I was nervous about getting lash extensions, but the team made me feel so comfortable. The results exceeded my expectations.',
    rating: 5,
  },
  {
    name: 'Jessica L.',
    role: 'Regular Client',
    content: 'Luxe Lash is my go-to for all things lashes. The quality and attention to detail is unmatched. Worth every penny!',
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-rose-soft/30">
      <div className="container max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium tracking-widest uppercase text-primary mb-4 block">
            Testimonials
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-medium text-foreground mb-4">
            Loved by Our Clients
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Don't just take our word for it. Here's what our clients have to say 
            about their Luxe Lash experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative bg-card rounded-2xl p-8 border border-border shadow-card"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              
              <p className="text-foreground leading-relaxed mb-6 italic">
                "{testimonial.content}"
              </p>
              
              <div>
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
