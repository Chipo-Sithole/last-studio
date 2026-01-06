import { Service, AddOn, TimeSlot } from '@/types/booking';

export const services: Service[] = [
  {
    id: 'classic-natural',
    name: 'Classic Natural',
    description: 'Perfect for everyday elegance. One extension per natural lash for a subtle, refined look.',
    duration: 90,
    price: 120,
    category: 'classic',
  },
  {
    id: 'classic-glamour',
    name: 'Classic Glamour',
    description: 'Fuller coverage with dramatic length. Ideal for special occasions.',
    duration: 105,
    price: 145,
    category: 'classic',
  },
  {
    id: 'volume-light',
    name: 'Light Volume',
    description: 'Handcrafted fans of 2-3 ultra-fine extensions for soft, fluffy fullness.',
    duration: 120,
    price: 175,
    category: 'volume',
  },
  {
    id: 'volume-full',
    name: 'Full Volume',
    description: 'Luxurious density with 4-6 lash fans. Bold, dramatic, unforgettable.',
    duration: 150,
    price: 220,
    category: 'volume',
  },
  {
    id: 'hybrid',
    name: 'Hybrid Set',
    description: 'The best of both worlds. Classic and volume techniques blended seamlessly.',
    duration: 120,
    price: 185,
    category: 'hybrid',
  },
  {
    id: 'mega-volume',
    name: 'Mega Volume',
    description: 'Maximum impact with 8-16 ultra-fine fans per lash. Red carpet ready.',
    duration: 180,
    price: 280,
    category: 'mega',
  },
];

export const addOns: AddOn[] = [
  {
    id: 'lash-bath',
    name: 'Lash Bath & Clean',
    description: 'Deep cleanse to maintain lash health',
    duration: 10,
    price: 15,
  },
  {
    id: 'colored-tips',
    name: 'Colored Tips',
    description: 'Add a pop of color to your look',
    duration: 15,
    price: 25,
  },
  {
    id: 'bottom-lashes',
    name: 'Bottom Lash Extensions',
    description: 'Complete your look with lower lash enhancements',
    duration: 20,
    price: 35,
  },
  {
    id: 'lash-serum',
    name: 'Growth Serum Treatment',
    description: 'Nourishing serum for healthier natural lashes',
    duration: 5,
    price: 20,
  },
];

export const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const baseHour = 9;
  const endHour = 18;
  
  // Simulate some unavailable slots based on date
  const dayOfWeek = date.getDay();
  const unavailablePattern = dayOfWeek % 3;
  
  for (let hour = baseHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const slotIndex = (hour - baseHour) * 2 + (min === 30 ? 1 : 0);
      const available = !(
        (unavailablePattern === 0 && slotIndex % 4 === 0) ||
        (unavailablePattern === 1 && slotIndex % 5 === 1) ||
        (unavailablePattern === 2 && slotIndex % 3 === 2)
      );
      
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
        available,
      });
    }
  }
  
  return slots;
};
