import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesPreview } from '@/components/landing/ServicesPreview';
import { WhyChooseUs } from '@/components/landing/WhyChooseUs';
import { OurWork } from '@/components/landing/OurWork';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { BookingFlow } from '@/components/booking/BookingFlow';

const Index = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);

  const handleBookNow = (serviceId?: string) => {
    setPreselectedServiceId(serviceId || null);
    setShowBooking(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setShowBooking(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {showBooking ? (
          <motion.div
            key="booking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BookingFlow 
              onBackToLanding={handleBackToLanding} 
              preselectedServiceId={preselectedServiceId}
            />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LandingHeader onBookNow={handleBookNow} />
            <main>
              <HeroSection onBookNow={handleBookNow} />
              <div id="services">
                <ServicesPreview onBookNow={handleBookNow} />
              </div>
              <WhyChooseUs />
              <div id="work">
                <OurWork />
              </div>
              <div id="contact">
                <CTASection onBookNow={handleBookNow} />
              </div>
            </main>
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
