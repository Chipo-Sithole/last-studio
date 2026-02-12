export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: 'classic' | 'volume' | 'hybrid';
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
  location: string;
  needsTransport?: boolean;
  isReturning?: boolean;
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

export interface BookingData {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    needsTransport: boolean;
    isReturning: boolean;
  };
  date: string;
  timeSlot: string;
  clients: Array<{
    serviceId: string;
    addOns: string[];
  }>;
  notes?: string;
}

export interface Appointment {
  id: number;
  confirmationCode: string;
  customerName: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  totalDuration: number;
  totalPrice: number;
  clients: Array<{
    clientNumber: number;
    service: Service;
    addOns: AddOn[];
  }>;
  notes?: string;
}
