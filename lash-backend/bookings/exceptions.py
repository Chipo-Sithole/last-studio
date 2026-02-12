"""
Custom exceptions for the bookings application.
Provides meaningful error handling and clear exception hierarchy.
"""
from rest_framework.exceptions import APIException
from rest_framework import status


class BookingBaseException(APIException):
    """Base exception for all booking-related errors"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'A booking error occurred'
    default_code = 'booking_error'


class SlotNotAvailableException(BookingBaseException):
    """Raised when a time slot is not available"""
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'The selected time slot is not available'
    default_code = 'slot_not_available'
    
    def __init__(self, reason=None):
        detail = reason if reason else self.default_detail
        super().__init__(detail)


class DateBlockedException(BookingBaseException):
    """Raised when trying to book on a blocked date"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'The selected date is blocked'
    default_code = 'date_blocked'


class OutsideBusinessHoursException(BookingBaseException):
    """Raised when time is outside business hours"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'The selected time is outside business hours'
    default_code = 'outside_business_hours'


class BusinessClosedException(BookingBaseException):
    """Raised when business is closed on selected day"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Business is closed on the selected day'
    default_code = 'business_closed'


class InvalidDateFormatException(BookingBaseException):
    """Raised when date format is invalid"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid date format. Use YYYY-MM-DD'
    default_code = 'invalid_date_format'


class InvalidTimeFormatException(BookingBaseException):
    """Raised when time format is invalid"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid time format. Use HH:MM'
    default_code = 'invalid_time_format'


class AppointmentNotFoundException(BookingBaseException):
    """Raised when appointment is not found"""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Appointment not found'
    default_code = 'appointment_not_found'


class MissingRequiredParameterException(BookingBaseException):
    """Raised when a required parameter is missing"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_code = 'missing_parameter'
    
    def __init__(self, parameter_name):
        detail = f'{parameter_name} is required'
        super().__init__(detail)


class ServiceNotFoundException(BookingBaseException):
    """Raised when service is not found"""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Service not found'
    default_code = 'service_not_found'


class AddOnNotFoundException(BookingBaseException):
    """Raised when add-on is not found"""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Add-on not found'
    default_code = 'addon_not_found'
