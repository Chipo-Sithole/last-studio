import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onBookNow: () => void;
}

export const CTASection = ({ onBookNow }: CTASectionProps) => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/10 via-background to-rose-soft/50">
      <div className="container max-w-6xl px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl sm:text-5xl font-medium text-foreground mb-6 leading-tight">
              Ready for Your
              <span className="text-primary"> Transformation?</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Book your appointment today and discover why our clients keep coming back. 
              Your dream lashes are just a click away.
            </p>
            <Button variant="luxury" size="xl" onClick={onBookNow} className="group">
              Book Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-card rounded-2xl p-8 border border-border shadow-elevated"
          >
            <h3 className="font-serif text-2xl font-medium text-foreground mb-6">
              Visit Our Studio
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">
                    123 Beauty Lane, Suite 100<br />
                    New York, NY 10001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    (555) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-rose-soft flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Mon - Sat: 9:00 AM - 6:00 PM<br />
                    Sun: Closed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
