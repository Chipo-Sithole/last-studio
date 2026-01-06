export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: 'classic' | 'volume' | 'hybrid' | 'mega';
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface ClientBooking {
  id: string;
  label: string;
  service: Service | null;
  addOns: AddOn[];
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}

export interface BookingState {
  step: number;
  clients: ClientBooking[];
  selectedDate: Date | null;
  selectedTime: string | null;
  customerDetails: CustomerDetails | null;
}

export type BookingStep = 
  | 'services'
  | 'date'
  | 'time'
  | 'addons'
  | 'details'
  | 'review'
  | 'confirmation';
