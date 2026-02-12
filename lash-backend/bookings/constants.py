"""
Constants for the bookings application.
Centralizes all magic strings and numbers.
"""

# Appointment Status
class AppointmentStatus:
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    COMPLETED = 'completed'
    CANCELLED = 'cancelled'
    NO_SHOW = 'no_show'
    
    CHOICES = [
        (PENDING, 'Pending'),
        (CONFIRMED, 'Confirmed'),
        (COMPLETED, 'Completed'),
        (CANCELLED, 'Cancelled'),
        (NO_SHOW, 'No Show'),
    ]
    
    ACTIVE_STATUSES = [PENDING, CONFIRMED]


# Service Categories
class ServiceCategory:
    CLASSIC = 'classic'
    VOLUME = 'volume'
    HYBRID = 'hybrid'
    
    CHOICES = [
        (CLASSIC, 'Classic'),
        (VOLUME, 'Volume'),
        (HYBRID, 'Hybrid'),
    ]


# Weekdays
class Weekday:
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6
    
    CHOICES = [
        (MONDAY, 'Monday'),
        (TUESDAY, 'Tuesday'),
        (WEDNESDAY, 'Wednesday'),
        (THURSDAY, 'Thursday'),
        (FRIDAY, 'Friday'),
        (SATURDAY, 'Saturday'),
        (SUNDAY, 'Sunday'),
    ]


# Time Slot Configuration
class TimeSlotConfig:
    SLOT_DURATION_MINUTES = 45
    DEFAULT_OPEN_TIME = '09:00'
    DEFAULT_CLOSE_TIME = '18:00'


# Validation Messages
class ValidationMessages:
    INVALID_DATE_FORMAT = 'Invalid date format. Use YYYY-MM-DD'
    INVALID_TIME_FORMAT = 'Invalid time format. Use HH:MM'
    DATE_REQUIRED = 'date parameter is required'
    TIME_REQUIRED = 'appointment_date and appointment_time are required'
    CODE_REQUIRED = 'code parameter is required'
    APPOINTMENT_NOT_FOUND = 'Appointment not found'
    SLOT_NOT_AVAILABLE = 'Time slot is not available'
    DATE_BLOCKED = 'Date is blocked'
    CLOSED_ON_DAY = 'Closed on this day'
    OUTSIDE_BUSINESS_HOURS = 'Outside business hours'
    SLOT_ALREADY_BOOKED = 'Time slot already booked'


# Confirmation Code Configuration
class ConfirmationCodeConfig:
    LENGTH = 8
    CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'  # Excludes ambiguous chars
