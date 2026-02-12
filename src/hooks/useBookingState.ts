/**
 * Custom hook for managing booking state using useReducer.
 * Follows clean architecture by separating state management logic.
 */

import { useReducer, useCallback } from 'react';
import { ClientBooking, CustomerDetails, Service, AddOn } from '@/types/booking';
import { CLIENT_CONFIG } from '@/constants/booking';

// State Interface
export interface BookingState {
  currentStep: number;
  clients: ClientBooking[];
  activeClientId: string;
  selectedDate: Date | null;
  selectedTime: string | null;
  customerDetails: CustomerDetails | null;
  isConfirmed: boolean;
  confirmationCode: string | null;
}

// Action Types
type BookingAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'ADD_CLIENT'; payload: ClientBooking }
  | { type: 'REMOVE_CLIENT'; payload: string }
  | { type: 'SET_ACTIVE_CLIENT'; payload: string }
  | { type: 'UPDATE_CLIENT'; payload: { clientId: string; updates: Partial<ClientBooking> } }
  | { type: 'SELECT_SERVICE'; payload: { clientId: string; service: Service } }
  | { type: 'TOGGLE_ADDON'; payload: { clientId: string; addOn: AddOn } }
  | { type: 'SET_DATE'; payload: Date | null }
  | { type: 'SET_TIME'; payload: string | null }
  | { type: 'SET_CUSTOMER_DETAILS'; payload: CustomerDetails }
  | { type: 'SET_CONFIRMATION'; payload: { code: string } }
  | { type: 'RESET_BOOKING' };

// Reducer Function
function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };

    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };

    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };

    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload],
        activeClientId: action.payload.id,
      };

    case 'REMOVE_CLIENT': {
      if (state.clients.length <= CLIENT_CONFIG.MIN_CLIENTS) return state;

      const filtered = state.clients.filter((c) => c.id !== action.payload);
      // Relabel remaining clients
      const relabeled = filtered.map((c, i) => ({
        ...c,
        label: `${CLIENT_CONFIG.DEFAULT_LABEL_PREFIX} ${i + 1}`,
      }));

      const newActiveId =
        state.activeClientId === action.payload
          ? relabeled[0]?.id || state.activeClientId
          : state.activeClientId;

      return {
        ...state,
        clients: relabeled,
        activeClientId: newActiveId,
      };
    }

    case 'SET_ACTIVE_CLIENT':
      return { ...state, activeClientId: action.payload };

    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map((c) =>
          c.id === action.payload.clientId ? { ...c, ...action.payload.updates } : c
        ),
      };

    case 'SELECT_SERVICE':
      return {
        ...state,
        clients: state.clients.map((c) =>
          c.id === action.payload.clientId ? { ...c, service: action.payload.service } : c
        ),
      };

    case 'TOGGLE_ADDON': {
      return {
        ...state,
        clients: state.clients.map((c) => {
          if (c.id !== action.payload.clientId) return c;

          const hasAddOn = c.addOns.some((a) => a.id === action.payload.addOn.id);
          return {
            ...c,
            addOns: hasAddOn
              ? c.addOns.filter((a) => a.id !== action.payload.addOn.id)
              : [...c.addOns, action.payload.addOn],
          };
        }),
      };
    }

    case 'SET_DATE':
      return { ...state, selectedDate: action.payload };

    case 'SET_TIME':
      return { ...state, selectedTime: action.payload };

    case 'SET_CUSTOMER_DETAILS':
      return {
        ...state,
        customerDetails: action.payload,
        currentStep: 5, // Go to review step
      };

    case 'SET_CONFIRMATION':
      return {
        ...state,
        confirmationCode: action.payload.code,
        isConfirmed: true,
      };

    case 'RESET_BOOKING': {
      const newClient = createClient(0);
      return {
        currentStep: 0,
        clients: [newClient],
        activeClientId: newClient.id,
        selectedDate: null,
        selectedTime: null,
        customerDetails: null,
        isConfirmed: false,
        confirmationCode: null,
      };
    }

    default:
      return state;
  }
}

// Helper function to create client
export const createClient = (index: number): ClientBooking => ({
  id: `client-${Date.now()}-${index}`,
  label: `${CLIENT_CONFIG.DEFAULT_LABEL_PREFIX} ${index + 1}`,
  service: null,
  addOns: [],
});

// Initial State
const getInitialState = (): BookingState => {
  const initialClient = createClient(0);
  return {
    currentStep: 0,
    clients: [initialClient],
    activeClientId: initialClient.id,
    selectedDate: null,
    selectedTime: null,
    customerDetails: null,
    isConfirmed: false,
    confirmationCode: null,
  };
};

/**
 * Custom hook for managing booking state
 */
export function useBookingState() {
  const [state, dispatch] = useReducer(bookingReducer, getInitialState());

  // Action creators
  const actions = {
    setStep: useCallback((step: number) => {
      dispatch({ type: 'SET_STEP', payload: step });
    }, []),

    nextStep: useCallback(() => {
      dispatch({ type: 'NEXT_STEP' });
    }, []),

    prevStep: useCallback(() => {
      dispatch({ type: 'PREV_STEP' });
    }, []),

    addClient: useCallback(() => {
      const newClient = createClient(state.clients.length);
      dispatch({ type: 'ADD_CLIENT', payload: newClient });
    }, [state.clients.length]),

    removeClient: useCallback((clientId: string) => {
      dispatch({ type: 'REMOVE_CLIENT', payload: clientId });
    }, []),

    setActiveClient: useCallback((clientId: string) => {
      dispatch({ type: 'SET_ACTIVE_CLIENT', payload: clientId });
    }, []),

    selectService: useCallback((clientId: string, service: Service) => {
      dispatch({ type: 'SELECT_SERVICE', payload: { clientId, service } });
    }, []),

    toggleAddOn: useCallback((clientId: string, addOn: AddOn) => {
      dispatch({ type: 'TOGGLE_ADDON', payload: { clientId, addOn } });
    }, []),

    setDate: useCallback((date: Date | null) => {
      dispatch({ type: 'SET_DATE', payload: date });
    }, []),

    setTime: useCallback((time: string | null) => {
      dispatch({ type: 'SET_TIME', payload: time });
    }, []),

    setCustomerDetails: useCallback((details: CustomerDetails) => {
      dispatch({ type: 'SET_CUSTOMER_DETAILS', payload: details });
    }, []),

    setConfirmation: useCallback((code: string) => {
      dispatch({ type: 'SET_CONFIRMATION', payload: { code } });
    }, []),

    resetBooking: useCallback(() => {
      dispatch({ type: 'RESET_BOOKING' });
    }, []),
  };

  // Derived state
  const activeClient = state.clients.find((c) => c.id === state.activeClientId);

  return {
    state,
    actions,
    activeClient,
  };
}
