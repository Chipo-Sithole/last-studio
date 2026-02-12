/**
 * Custom hook for booking validation logic.
 * Separates validation concerns from UI components.
 */

import { useMemo } from 'react';
import { ClientBooking } from '@/types/booking';

export interface ValidationResult {
  canProceed: boolean;
  reason?: string;
}

/**
 * Hook to validate booking step completion
 */
export function useBookingValidation(
  currentStep: number,
  clients: ClientBooking[],
  selectedDate: Date | null,
  selectedTime: string | null
): ValidationResult {
  return useMemo(() => {
    switch (currentStep) {
      case 0: // Services
        if (!clients.every((c) => c.service !== null)) {
          return {
            canProceed: false,
            reason: 'Please select a service for all clients',
          };
        }
        return { canProceed: true };

      case 1: // Date
        if (selectedDate === null) {
          return {
            canProceed: false,
            reason: 'Please select a date',
          };
        }
        return { canProceed: true };

      case 2: // Time
        if (selectedTime === null) {
          return {
            canProceed: false,
            reason: 'Please select a time',
          };
        }
        return { canProceed: true };

      case 3: // Add-ons (optional)
        return { canProceed: true };

      case 4: // Details
        // Handled by form submission
        return { canProceed: false };

      case 5: // Review
        return { canProceed: true };

      default:
        return { canProceed: false };
    }
  }, [currentStep, clients, selectedDate, selectedTime]);
}

/**
 * Hook to calculate total duration for all clients
 */
export function useTotalDuration(clients: ClientBooking[]): number {
  return useMemo(() => {
    return clients.reduce((total, client) => {
      if (!client.service) return total;

      const serviceDuration = client.service.duration;
      const addOnsDuration = client.addOns.reduce(
        (sum, addOn) => sum + addOn.duration,
        0
      );

      return total + serviceDuration + addOnsDuration;
    }, 0);
  }, [clients]);
}

/**
 * Hook to calculate total price for all clients
 */
export function useTotalPrice(clients: ClientBooking[]): number {
  return useMemo(() => {
    return clients.reduce((total, client) => {
      if (!client.service) return total;

      const servicePrice = parseFloat(String(client.service.price));
      const addOnsPrice = client.addOns.reduce(
        (sum, addOn) => sum + parseFloat(String(addOn.price)),
        0
      );

      return total + servicePrice + addOnsPrice;
    }, 0);
  }, [clients]);
}
