import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesPreview } from '@/components/landing/ServicesPreview';
import { AboutSection } from '@/components/landing/AboutSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/Header';
import { BookingFlow } from '@/components/booking/BookingFlow';

const Index = () => {
  const [showBooking, setShowBooking] = useState(false);

  const handleBookNow = () => {
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
            <Header onBack={handleBackToLanding} />
            <BookingFlow />
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
              <div id="about">
                <AboutSection />
              </div>
              <div id="testimonials">
                <TestimonialsSection />
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
