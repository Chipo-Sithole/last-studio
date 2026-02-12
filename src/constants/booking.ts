/**
 * Constants for the booking application.
 * Centralizes all magic strings and configuration values.
 */

// Booking Steps Configuration
export const BOOKING_STEPS = [
  { id: 'services', label: 'Services' },
  { id: 'date', label: 'Date' },
  { id: 'time', label: 'Time' },
  { id: 'addons', label: 'Add-ons' },
  { id: 'details', label: 'Details' },
  { id: 'review', label: 'Review' },
] as const;

export type BookingStepId = typeof BOOKING_STEPS[number]['id'];

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  TIMEOUT: 30000,
} as const;

// Query Configuration
export const QUERY_CONFIG = {
  STALE_TIME: {
    SERVICES: 5 * 60 * 1000, // 5 minutes
    ADDONS: 5 * 60 * 1000, // 5 minutes
    BUSINESS_HOURS: 10 * 60 * 1000, // 10 minutes
    TIME_SLOTS: 0, // Always fetch fresh data
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  LOADING_FAILED: 'Failed to load data. Please try again.',
  BOOKING_FAILED: 'Failed to create booking. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  MISSING_INFO: 'Missing required booking information',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  BOOKING_CONFIRMED: 'Booking confirmed successfully!',
} as const;

// Time Format
export const TIME_FORMAT = {
  HOURS_LABEL: 'h',
  MINUTES_LABEL: 'm',
} as const;

// Currency Format
export const CURRENCY_CONFIG = {
  SYMBOL: '$',
  LOCALE: 'en-US',
  CURRENCY_CODE: 'USD',
} as const;

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideIn: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  slideOut: {
    exit: { opacity: 0, x: -50 },
  },
} as const;

// Client Labels
export const CLIENT_CONFIG = {
  DEFAULT_LABEL_PREFIX: 'Client',
  MIN_CLIENTS: 1,
} as const;

// Date Format
export const DATE_FORMAT = {
  API: 'YYYY-MM-DD', // Format for API requests
  DISPLAY: 'MMM DD, YYYY', // Format for display
} as const;
