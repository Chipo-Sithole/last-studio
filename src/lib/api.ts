import { Service, AddOn, TimeSlot, BookingData, Appointment } from '@/types/booking';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// API Response types
interface AppointmentResponse {
  id: number;
  confirmation_code: string;
  customer_name: string;
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_duration: number;
  total_price: string;
  clients: Array<{
    client_number: number;
    service: Service;
    add_ons: AddOn[];
  }>;
  notes?: string;
}

interface AvailabilityResponse {
  available: boolean;
  reason?: string;
  message?: string;
}

interface AvailableSlotsResponse {
  slots: Array<{
    time: string;
    available: boolean;
  }>;
}

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new APIError(
      response.status,
      errorData.error || errorData.detail || 'Request failed'
    );
  }
  return response.json();
}

// Services API
export const servicesAPI = {
  getAll: async (): Promise<Service[]> => {
    const response = await fetch(`${API_BASE_URL}/services/`);
    return handleResponse<Service[]>(response);
  },
};

// Add-Ons API
export const addOnsAPI = {
  getAll: async (): Promise<AddOn[]> => {
    const response = await fetch(`${API_BASE_URL}/addons/`);
    return handleResponse<AddOn[]>(response);
  },
};

// Business Hours API
export const businessHoursAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/business-hours/`);
    return handleResponse(response);
  },
};

// Appointments API
export const appointmentsAPI = {
  create: async (bookingData: BookingData): Promise<AppointmentResponse> => {
    // Transform frontend booking data to backend format
    const payload = {
      first_name: bookingData.customer.firstName,
      last_name: bookingData.customer.lastName,
      email: bookingData.customer.email,
      phone: bookingData.customer.phone,
      location: bookingData.customer.location,
      needs_transport: bookingData.customer.needsTransport,
      is_returning: bookingData.customer.isReturning,
      appointment_date: bookingData.date,
      appointment_time: bookingData.timeSlot,
      notes: bookingData.notes || '',
      clients: bookingData.clients.map((client, index) => ({
        client_number: index + 1,
        service_id: client.serviceId,
        add_on_ids: client.addOns,
      })),
    };

    const response = await fetch(`${API_BASE_URL}/appointments/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return handleResponse<AppointmentResponse>(response);
  },

  getByConfirmation: async (code: string): Promise<AppointmentResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/appointments/by_confirmation/?code=${code}`
    );
    return handleResponse<AppointmentResponse>(response);
  },

  checkAvailability: async (
    date: string,
    time: string,
    duration: number
  ): Promise<AvailabilityResponse> => {
    const response = await fetch(`${API_BASE_URL}/appointments/check_availability/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        appointment_date: date,
        appointment_time: time,
        total_duration: duration,
      }),
    });
    return handleResponse<AvailabilityResponse>(response);
  },

  getAvailableSlots: async (date: string): Promise<TimeSlot[]> => {
    const response = await fetch(
      `${API_BASE_URL}/appointments/available_slots/?date=${date}`
    );
    const data = await handleResponse<AvailableSlotsResponse>(response);
    
    // Transform to frontend TimeSlot format
    return data.slots.map((slot) => ({
      time: slot.time,
      available: slot.available,
    }));
  },

  getAll: async (): Promise<AppointmentResponse[]> => {
    const response = await fetch(`${API_BASE_URL}/appointments/`);
    return handleResponse<AppointmentResponse[]>(response);
  },
};

// Export all APIs
export const api = {
  services: servicesAPI,
  addOns: addOnsAPI,
  businessHours: businessHoursAPI,
  appointments: appointmentsAPI,
};

export { APIError };
export type { AppointmentResponse, AvailabilityResponse };
