import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { api, APIError, type AppointmentResponse } from '@/lib/api';
import type { BookingData } from '@/types/booking';
import { QUERY_CONFIG } from '@/constants/booking';

// Query Keys
export const queryKeys = {
  services: ['services'] as const,
  addOns: ['addOns'] as const,
  businessHours: ['businessHours'] as const,
  appointments: ['appointments'] as const,
  appointment: (code: string) => ['appointment', code] as const,
  availableSlots: (date: string) => ['availableSlots', date] as const,
};

// Services Hook
export function useServices() {
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: api.services.getAll,
    staleTime: QUERY_CONFIG.STALE_TIME.SERVICES,
  });
}

// Add-Ons Hook
export function useAddOns() {
  return useQuery({
    queryKey: queryKeys.addOns,
    queryFn: api.addOns.getAll,
    staleTime: QUERY_CONFIG.STALE_TIME.ADDONS,
  });
}

// Business Hours Hook
export function useBusinessHours() {
  return useQuery({
    queryKey: queryKeys.businessHours,
    queryFn: api.businessHours.getAll,
    staleTime: QUERY_CONFIG.STALE_TIME.BUSINESS_HOURS,
  });
}

// Available Slots Hook
export function useAvailableSlots(date: string | null) {
  return useQuery({
    queryKey: queryKeys.availableSlots(date || ''),
    queryFn: () => api.appointments.getAvailableSlots(date!),
    enabled: !!date,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}

// Appointment by Confirmation Hook
export function useAppointment(confirmationCode: string) {
  return useQuery({
    queryKey: queryKeys.appointment(confirmationCode),
    queryFn: () => api.appointments.getByConfirmation(confirmationCode),
    enabled: !!confirmationCode,
  });
}

// Create Appointment Mutation
export function useCreateAppointment(): UseMutationResult<AppointmentResponse, APIError, BookingData> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: BookingData) => api.appointments.create(bookingData),
    onSuccess: () => {
      // Invalidate appointments list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
    },
  });
}

// Check Availability Mutation
export function useCheckAvailability() {
  return useMutation({
    mutationFn: ({ date, time, duration }: { date: string; time: string; duration: number }) =>
      api.appointments.checkAvailability(date, time, duration),
  });
}

// Export APIError for error handling
export { APIError };
