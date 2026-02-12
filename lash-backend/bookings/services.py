"""
Service layer for appointments business logic.
Separates business logic from views following clean architecture principles.
"""
from datetime import datetime, timedelta, time
from typing import List, Dict, Optional, Tuple
from django.db.models import QuerySet
from bookings.models import Appointment, BlockedDate, BusinessHours, Service, AddOn
from bookings.constants import (
    AppointmentStatus, 
    TimeSlotConfig, 
    ValidationMessages
)
from bookings.exceptions import (
    DateBlockedException,
    BusinessClosedException,
    OutsideBusinessHoursException,
    SlotNotAvailableException,
    InvalidDateFormatException,
    InvalidTimeFormatException,
)


class AvailabilityService:
    """
    Service for checking appointment availability.
    Encapsulates all business logic related to scheduling availability.
    """
    
    @staticmethod
    def parse_date(date_str: str) -> datetime.date:
        """Parse date string to date object"""
        try:
            return datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            raise InvalidDateFormatException()
    
    @staticmethod
    def parse_time(time_str: str) -> time:
        """Parse time string to time object"""
        try:
            return datetime.strptime(time_str, '%H:%M').time()
        except ValueError:
            raise InvalidTimeFormatException()
    
    @staticmethod
    def is_date_blocked(date: datetime.date) -> bool:
        """Check if a date is blocked"""
        return BlockedDate.objects.filter(date=date).exists()
    
    @staticmethod
    def get_business_hours(weekday: int) -> Optional[BusinessHours]:
        """Get business hours for a specific weekday"""
        try:
            return BusinessHours.objects.get(weekday=weekday)
        except BusinessHours.DoesNotExist:
            return None
    
    @staticmethod
    def is_within_business_hours(
        appointment_time: time, 
        business_hours: BusinessHours
    ) -> bool:
        """Check if time is within business hours"""
        if not business_hours or not business_hours.is_open:
            return False
        
        return (business_hours.open_time <= appointment_time < business_hours.close_time)
    
    @staticmethod
    def has_overlapping_appointments(
        date: datetime.date,
        start_time: time,
        duration: int,
        exclude_appointment_id: Optional[int] = None
    ) -> bool:
        """Check if there are overlapping appointments"""
        end_time = (
            datetime.combine(date, start_time) + 
            timedelta(minutes=duration)
        ).time()
        
        query = Appointment.objects.filter(
            appointment_date=date,
            status__in=AppointmentStatus.ACTIVE_STATUSES
        ).exclude(
            appointment_time__gte=end_time
        ).exclude(
            appointment_time__lt=start_time
        )
        
        if exclude_appointment_id:
            query = query.exclude(id=exclude_appointment_id)
        
        return query.exists()
    
    @classmethod
    def check_availability(
        cls,
        date: datetime.date,
        appointment_time: time,
        duration: int,
        exclude_appointment_id: Optional[int] = None
    ) -> Tuple[bool, Optional[str]]:
        """
        Check if a time slot is available.
        Returns: (is_available, reason_if_not_available)
        """
        # Check if date is blocked
        if cls.is_date_blocked(date):
            raise DateBlockedException()
        
        # Check business hours
        weekday = date.weekday()
        business_hours = cls.get_business_hours(weekday)
        
        if business_hours and not business_hours.is_open:
            raise BusinessClosedException()
        
        if business_hours and not cls.is_within_business_hours(appointment_time, business_hours):
            raise OutsideBusinessHoursException()
        
        # Check for overlapping appointments
        if cls.has_overlapping_appointments(date, appointment_time, duration, exclude_appointment_id):
            raise SlotNotAvailableException(ValidationMessages.SLOT_ALREADY_BOOKED)
        
        return True, None
    
    @classmethod
    def get_available_slots(cls, date: datetime.date) -> List[Dict[str, any]]:
        """
        Get all available time slots for a specific date.
        Returns list of {time: str, available: bool}
        """
        # Check if date is blocked
        if cls.is_date_blocked(date):
            return []
        
        # Get business hours
        weekday = date.weekday()
        business_hours = cls.get_business_hours(weekday)
        
        if not business_hours or not business_hours.is_open:
            return []
        
        # Generate time slots
        slots = []
        current_time = datetime.combine(date, business_hours.open_time)
        end_datetime = datetime.combine(date, business_hours.close_time)
        
        while current_time < end_datetime:
            slot_time = current_time.time()
            
            # Check if slot is available (using simplified check for single slot)
            is_available = not Appointment.objects.filter(
                appointment_date=date,
                appointment_time=slot_time,
                status__in=AppointmentStatus.ACTIVE_STATUSES
            ).exists()
            
            slots.append({
                'time': slot_time.strftime('%H:%M'),
                'available': is_available
            })
            
            current_time += timedelta(minutes=TimeSlotConfig.SLOT_DURATION_MINUTES)
        
        return slots


class AppointmentService:
    """
    Service for appointment business logic.
    Handles appointment-related operations.
    """
    
    @staticmethod
    def get_by_confirmation_code(code: str) -> Optional[Appointment]:
        """Get appointment by confirmation code"""
        try:
            return Appointment.objects.get(confirmation_code=code)
        except Appointment.DoesNotExist:
            return None
    
    @staticmethod
    def get_active_appointments(date: Optional[datetime.date] = None) -> QuerySet:
        """Get active appointments, optionally filtered by date"""
        query = Appointment.objects.filter(
            status__in=AppointmentStatus.ACTIVE_STATUSES
        )
        
        if date:
            query = query.filter(appointment_date=date)
        
        return query.order_by('appointment_date', 'appointment_time')
    
    @staticmethod
    def calculate_total_duration(service_ids: List[str], addon_ids: List[List[str]]) -> int:
        """Calculate total duration for all clients"""
        total = 0
        
        # Get all services
        services = Service.objects.filter(id__in=service_ids)
        total += sum(s.duration for s in services)
        
        # Get all add-ons
        flat_addon_ids = [aid for client_addons in addon_ids for aid in client_addons]
        addons = AddOn.objects.filter(id__in=flat_addon_ids)
        total += sum(a.duration for a in addons)
        
        return total
    
    @staticmethod
    def calculate_total_price(service_ids: List[str], addon_ids: List[List[str]]) -> float:
        """Calculate total price for all clients"""
        total = 0
        
        # Get all services
        services = Service.objects.filter(id__in=service_ids)
        total += sum(float(s.price) for s in services)
        
        # Get all add-ons
        flat_addon_ids = [aid for client_addons in addon_ids for aid in client_addons]
        addons = AddOn.objects.filter(id__in=flat_addon_ids)
        total += sum(float(a.price) for a in addons)
        
        return total
