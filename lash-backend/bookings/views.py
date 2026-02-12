from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta, time
from bookings.models import (
    Service, AddOn, Customer, Appointment, 
    AppointmentClient, BusinessHours, BlockedDate
)
from bookings.serializers import (
    ServiceSerializer, AddOnSerializer, CustomerSerializer,
    AppointmentDetailSerializer, AppointmentListSerializer,
    AppointmentCreateSerializer, BusinessHoursSerializer,
    BlockedDateSerializer
)
from bookings.services import AvailabilityService, AppointmentService
from bookings.email_service import send_appointment_confirmation, send_admin_notification
from bookings.exceptions import (
    AppointmentNotFoundException,
    MissingRequiredParameterException,
    InvalidDateFormatException,
    BookingBaseException
)
from bookings.constants import ValidationMessages


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving services.
    GET /api/services/ - List all active services
    GET /api/services/{id}/ - Get specific service
    """
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer


class AddOnViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving add-ons.
    GET /api/addons/ - List all active add-ons
    GET /api/addons/{id}/ - Get specific add-on
    """
    queryset = AddOn.objects.filter(is_active=True)
    serializer_class = AddOnSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing appointments.
    GET /api/appointments/ - List all appointments
    POST /api/appointments/ - Create new appointment
    GET /api/appointments/{id}/ - Get appointment details
    PUT/PATCH /api/appointments/{id}/ - Update appointment
    DELETE /api/appointments/{id}/ - Cancel appointment
    GET /api/appointments/by_confirmation/{code}/ - Get appointment by confirmation code
    POST /api/appointments/check_availability/ - Check time slot availability
    GET /api/appointments/available_slots/ - Get available time slots for a date
    """
    queryset = Appointment.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        elif self.action == 'list':
            return AppointmentListSerializer
        return AppointmentDetailSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new appointment with customer and clients"""
        # Transform nested customer data to flat structure
        data = request.data.copy()
        
        if 'customer' in data:
            customer_data = data.pop('customer')
            # Map camelCase to snake_case
            data['first_name'] = customer_data.get('firstName')
            data['last_name'] = customer_data.get('lastName')
            data['email'] = customer_data.get('email')
            data['phone'] = customer_data.get('phone')
            data['location'] = customer_data.get('location')
            data['needs_transport'] = customer_data.get('needsTransport', False)
            data['is_returning'] = customer_data.get('isReturning', False)
        
        # Map frontend field names to backend (if needed)
        if 'date' in data:
            data['appointment_date'] = data.pop('date')
        if 'timeSlot' in data:
            data['appointment_time'] = data.pop('timeSlot')
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        
        # Send confirmation email to customer
        try:
            send_appointment_confirmation(appointment)
        except Exception as e:
            # Log error but don't fail the booking
            print(f'Failed to send confirmation email: {str(e)}')
        
        # Send notification email to admin
        try:
            send_admin_notification(appointment)
        except Exception as e:
            # Log error but don't fail the booking
            print(f'Failed to send admin notification: {str(e)}')
        
        # Return detailed appointment data
        response_serializer = AppointmentDetailSerializer(appointment)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def by_confirmation(self, request, code=None):
        """Get appointment by confirmation code"""
        code = request.query_params.get('code')
        if not code:
            raise MissingRequiredParameterException('code')
        
        appointment = AppointmentService.get_by_confirmation_code(code)
        if not appointment:
            raise AppointmentNotFoundException()
        
        serializer = AppointmentDetailSerializer(appointment)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def check_availability(self, request):
        """
        Check if a specific date and time is available.
        POST body: {
            "appointment_date": "2024-01-15",
            "appointment_time": "10:00",
            "duration": 120
        }
        """
        date_str = request.data.get('appointment_date')
        time_str = request.data.get('appointment_time')
        duration = request.data.get('duration', 90)
        
        if not date_str or not time_str:
            raise MissingRequiredParameterException('appointment_date and appointment_time')
        
        # Parse date and time using service layer
        appointment_date = AvailabilityService.parse_date(date_str)
        appointment_time = AvailabilityService.parse_time(time_str)
        
        try:
            is_available, reason = AvailabilityService.check_availability(
                appointment_date, 
                appointment_time, 
                duration
            )
            return Response({'available': is_available})
        except BookingBaseException as e:
            return Response({
                'available': False,
                'reason': str(e.detail)
            })
    
    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        """
        Get available time slots for a specific date.
        Query params: date (YYYY-MM-DD)
        """
        date_str = request.query_params.get('date')
        
        if not date_str:
            raise MissingRequiredParameterException('date')
        
        # Parse date using service layer
        target_date = AvailabilityService.parse_date(date_str)
        
        # Get slots using service layer
        slots = AvailabilityService.get_available_slots(target_date)
        
        return Response({'slots': slots})


class CustomerViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving customer information.
    GET /api/customers/ - List customers
    GET /api/customers/{id}/ - Get customer details
    """
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class BusinessHoursViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving business hours.
    GET /api/business-hours/ - Get all business hours
    """
    queryset = BusinessHours.objects.all()
    serializer_class = BusinessHoursSerializer


class BlockedDateViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving blocked dates.
    GET /api/blocked-dates/ - Get all blocked dates
    """
    queryset = BlockedDate.objects.all()
    serializer_class = BlockedDateSerializer

