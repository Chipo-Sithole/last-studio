import { Header } from '@/components/Header';
import { BookingFlow } from '@/components/booking/BookingFlow';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <BookingFlow />
    </div>
  );
};

export default Index;
