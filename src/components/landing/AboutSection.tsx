import { motion } from 'framer-motion';
import { Award, Heart, Leaf } from 'lucide-react';

const features = [
  {
    icon: Award,
    title: 'Expert Artistry',
    description: 'Certified lash artists with 5+ years of experience in luxury lash application.',
  },
  {
    icon: Leaf,
    title: 'Premium Products',
    description: 'We use only the finest, cruelty-free materials sourced from ethical suppliers.',
  },
  {
    icon: Heart,
    title: 'Personalized Care',
    description: 'Every client receives a customized consultation for their perfect lash look.',
  },
];

export const AboutSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium tracking-widest uppercase text-primary mb-4 block">
              About Us
            </span>
            <h2 className="font-sans text-4xl sm:text-5xl font-normal text-foreground mb-6 leading-tight">
              Where Artistry Meets
              <span className="text-primary"> Precision</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              At Heavenly Lash Studio, we believe that beautiful lashes are an art form. 
              Our certified lash artist combines technical expertise with creative vision 
              to create stunning, personalized looks that enhance your natural beauty.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              As a mobile lash service, we bring the luxury experience directly to you. 
              Enjoy professional lash extensions in the comfort and privacy of your own home. 
              Every detail, from our premium materials to our meticulous application technique, 
              is designed to give you the lashes of your dreams—all without leaving your door.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex gap-5 p-6 rounded-2xl bg-rose-soft/50 border border-border"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-sans text-lg font-normal text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
