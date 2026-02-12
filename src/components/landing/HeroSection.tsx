import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Award, Heart, Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onBookNow: () => void;
}

export const HeroSection = ({ onBookNow }: HeroSectionProps) => {

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-6 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-rose-soft/20 to-gold-light/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="container max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left side - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 max-w-xl mx-auto lg:mx-0"
          >
            {/* Mobile Service Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Mobile Lash Service - We Come to You</span>
            </motion.div>
            
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.2] text-foreground">
              Confidence Starts With A
              <span className="block bg-gradient-to-r from-primary via-rose-dark to-primary bg-clip-text text-transparent">
                Perfect Lash
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Experience bespoke lash extensions in the comfort of your own home. 
              Professional mobile service bringing luxury and convenience to you.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                variant="luxury"
                size="lg"
                onClick={onBookNow}
                className="group shadow-glow"
              >
                Book Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" asChild className="hover:shadow-soft">
                <a href="#work">View Our Work</a>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50"
            >
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <p className="text-2xl font-sans font-medium text-foreground">1+</p>
                  <p className="text-sm text-muted-foreground">Years Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <p className="text-2xl font-sans font-medium text-foreground">100+</p>
                  <p className="text-sm text-muted-foreground">Happy Clients</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <p className="text-2xl font-sans font-medium text-foreground">6</p>
                  <p className="text-sm text-muted-foreground">Lash Styles</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-card">
              <img
                src="/hero1.jpg"
                alt="Heavenly Lash Studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
};
