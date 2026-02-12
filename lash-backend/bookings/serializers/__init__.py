from rest_framework import serializers
from bookings.models import (
    Service, AddOn, Customer, Appointment, 
    AppointmentClient, BusinessHours, BlockedDate
)
import secrets


class ServiceSerializer(serializers.ModelSerializer):
    """Serializer for Service model"""
    
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'duration', 'price', 'category', 'is_active']
        read_only_fields = ['created_at', 'updated_at']


class AddOnSerializer(serializers.ModelSerializer):
    """Serializer for AddOn model"""
    
    class Meta:
        model = AddOn
        fields = ['id', 'name', 'description', 'duration', 'price', 'is_active']
        read_only_fields = ['created_at', 'updated_at']


class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for Customer model"""
    
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = Customer
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 
            'email', 'phone', 'is_returning', 'notes'
        ]
        read_only_fields = ['created_at', 'updated_at']


class AppointmentClientSerializer(serializers.ModelSerializer):
    """Serializer for individual clients within an appointment"""
    
    service = ServiceSerializer(read_only=True)
    service_id = serializers.CharField(write_only=True)
    add_ons = AddOnSerializer(many=True, read_only=True)
    add_on_ids = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        required=False,
        allow_empty=True
    )
    total_duration = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()
    
    class Meta:
        model = AppointmentClient
        fields = [
            'id', 'client_number', 'service', 'service_id', 
            'add_ons', 'add_on_ids', 'total_duration', 'total_price'
        ]


class AppointmentDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Appointments including all related data"""
    
    customer = CustomerSerializer(read_only=True)
    clients = AppointmentClientSerializer(many=True, read_only=True)
    is_upcoming = serializers.ReadOnlyField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'customer', 'appointment_date', 'appointment_time',
            'location', 'needs_transport', 'status', 'confirmation_code',
            'total_duration', 'total_price', 'notes', 'clients',
            'is_upcoming', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'confirmation_code', 'created_at', 'updated_at']


class AppointmentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing appointments"""
    
    customer_name = serializers.CharField(source='customer.full_name', read_only=True)
    customer_email = serializers.EmailField(source='customer.email', read_only=True)
    client_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'customer_name', 'customer_email', 'appointment_date',
            'appointment_time', 'status', 'confirmation_code', 
            'total_duration', 'total_price', 'client_count'
        ]
        read_only_fields = ['id', 'confirmation_code']
    
    def get_client_count(self, obj):
        return obj.clients.count()


class AppointmentCreateSerializer(serializers.Serializer):
    """Serializer for creating new appointments"""
    
    # Customer data
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    location = serializers.CharField(max_length=255)
    needs_transport = serializers.BooleanField(default=False)
    is_returning = serializers.BooleanField(default=False)
    
    # Appointment data
    appointment_date = serializers.DateField()
    appointment_time = serializers.TimeField()
    notes = serializers.CharField(required=False, allow_blank=True)
    
    # Clients data (array of service + add-ons)
    clients = serializers.ListField(
        child=serializers.DictField(),
        min_length=1
    )
    
    def validate_clients(self, value):
        """Validate clients data structure"""
        for client in value:
            if 'service_id' not in client:
                raise serializers.ValidationError("Each client must have a service_id")
        return value
    
    def create(self, validated_data):
        """Create customer, appointment, and appointment clients"""
        clients_data = validated_data.pop('clients')
        
        # Create or get customer
        customer_data = {
            'first_name': validated_data.pop('first_name'),
            'last_name': validated_data.pop('last_name'),
            'email': validated_data.pop('email'),
            'phone': validated_data.pop('phone'),
            'is_returning': validated_data.pop('is_returning'),
        }
        
        # Try to find existing customer by email
        customer, created = Customer.objects.get_or_create(
            email=customer_data['email'],
            defaults=customer_data
        )
        
        if not created:
            # Update existing customer
            for key, value in customer_data.items():
                setattr(customer, key, value)
            customer.save()
        
        # Calculate total duration and price
        total_duration = 0
        total_price = 0
        
        for client_data in clients_data:
            service = Service.objects.get(id=client_data['service_id'])
            total_duration += service.duration
            total_price += float(service.price)
            
            add_on_ids = client_data.get('add_on_ids', [])
            for addon_id in add_on_ids:
                addon = AddOn.objects.get(id=addon_id)
                total_duration += addon.duration
                total_price += float(addon.price)
        
        # Add transport fee if needed ($2)
        if validated_data.get('needs_transport', False):
            total_price += 2.0
        
        # Generate confirmation code
        confirmation_code = f"HLS-{secrets.token_hex(4).upper()}"
        
        # Create appointment
        appointment = Appointment.objects.create(
            customer=customer,
            appointment_date=validated_data['appointment_date'],
            appointment_time=validated_data['appointment_time'],
            location=validated_data.get('location', ''),
            needs_transport=validated_data.get('needs_transport', False),
            notes=validated_data.get('notes', ''),
            confirmation_code=confirmation_code,
            total_duration=total_duration,
            total_price=total_price,
            status='pending'
        )
        
        # Create appointment clients
        for idx, client_data in enumerate(clients_data, start=1):
            service = Service.objects.get(id=client_data['service_id'])
            
            appointment_client = AppointmentClient.objects.create(
                appointment=appointment,
                client_number=idx,
                service=service
            )
            
            # Add add-ons if any
            add_on_ids = client_data.get('add_on_ids', [])
            if add_on_ids:
                addons = AddOn.objects.filter(id__in=add_on_ids)
                appointment_client.add_ons.set(addons)
        
        return appointment


class BusinessHoursSerializer(serializers.ModelSerializer):
    """Serializer for BusinessHours model"""
    
    weekday_display = serializers.CharField(source='get_weekday_display', read_only=True)
    
    class Meta:
        model = BusinessHours
        fields = ['id', 'weekday', 'weekday_display', 'is_open', 'open_time', 'close_time']


class BlockedDateSerializer(serializers.ModelSerializer):
    """Serializer for BlockedDate model"""
    
    class Meta:
        model = BlockedDate
        fields = ['id', 'date', 'reason', 'created_at']
        read_only_fields = ['created_at']

