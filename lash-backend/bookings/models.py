from django.db import models
from django.core.validators import MinValueValidator, EmailValidator
from django.utils import timezone
from bookings.constants import AppointmentStatus, ServiceCategory, Weekday


class Service(models.Model):
    """Lash extension service types"""
    
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.IntegerField(validators=[MinValueValidator(0)], help_text="Duration in minutes")
    price = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.CharField(max_length=20, choices=ServiceCategory.CHOICES)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['category', 'price']
        verbose_name = 'Service'
        verbose_name_plural = 'Services'
    
    def __str__(self):
        return f"{self.name} - ${self.price}"


class AddOn(models.Model):
    """Additional services that can be added to appointments"""
    
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    duration = models.IntegerField(validators=[MinValueValidator(0)], help_text="Duration in minutes")
    price = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['price']
        verbose_name = 'Add-On'
        verbose_name_plural = 'Add-Ons'
    
    def __str__(self):
        return f"{self.name} - ${self.price}"


class Customer(models.Model):
    """Customer information"""
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(validators=[EmailValidator()])
    phone = models.CharField(max_length=20)
    is_returning = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Appointment(models.Model):
    """Main appointment/booking"""
    
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    location = models.CharField(max_length=255, default='Harare', help_text="Customer's location for mobile service")
    needs_transport = models.BooleanField(default=False, help_text="Whether transport fee is included")
    status = models.CharField(max_length=20, choices=AppointmentStatus.CHOICES, default=AppointmentStatus.PENDING)
    confirmation_code = models.CharField(max_length=20, unique=True, db_index=True)
    total_duration = models.IntegerField(validators=[MinValueValidator(0)], help_text="Total duration in minutes")
    total_price = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(0)])
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-appointment_date', '-appointment_time']
        verbose_name = 'Appointment'
        verbose_name_plural = 'Appointments'
        indexes = [
            models.Index(fields=['appointment_date', 'appointment_time']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.customer.full_name} - {self.appointment_date} {self.appointment_time}"
    
    @property
    def is_upcoming(self):
        now = timezone.now()
        appointment_datetime = timezone.make_aware(
            timezone.datetime.combine(self.appointment_date, self.appointment_time)
        )
        return appointment_datetime > now


class AppointmentClient(models.Model):
    """Individual clients within an appointment (supports multiple clients per booking)"""
    
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='clients')
    client_number = models.IntegerField(validators=[MinValueValidator(1)])
    service = models.ForeignKey(Service, on_delete=models.PROTECT, related_name='appointment_clients')
    add_ons = models.ManyToManyField(AddOn, blank=True, related_name='appointment_clients')
    
    class Meta:
        ordering = ['appointment', 'client_number']
        verbose_name = 'Appointment Client'
        verbose_name_plural = 'Appointment Clients'
        unique_together = ['appointment', 'client_number']
    
    def __str__(self):
        return f"{self.appointment.customer.full_name} - Client {self.client_number}"
    
    @property
    def total_duration(self):
        """Calculate total duration including service and add-ons"""
        duration = self.service.duration
        duration += sum(addon.duration for addon in self.add_ons.all())
        return duration
    
    @property
    def total_price(self):
        """Calculate total price including service and add-ons"""
        price = self.service.price
        price += sum(addon.price for addon in self.add_ons.all())
        return price


class BusinessHours(models.Model):
    """Business hours configuration"""
    
    weekday = models.IntegerField(choices=Weekday.CHOICES, unique=True)
    is_open = models.BooleanField(default=True)
    open_time = models.TimeField(null=True, blank=True)
    close_time = models.TimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['weekday']
        verbose_name = 'Business Hours'
        verbose_name_plural = 'Business Hours'
    
    def __str__(self):
        day_name = dict(Weekday.CHOICES)[self.weekday]
        if not self.is_open:
            return f"{day_name}: Closed"
        return f"{day_name}: {self.open_time} - {self.close_time}"


class BlockedDate(models.Model):
    """Dates when the business is closed"""
    
    date = models.DateField(unique=True)
    reason = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['date']
        verbose_name = 'Blocked Date'
        verbose_name_plural = 'Blocked Dates'
    
    def __str__(self):
        return f"{self.date} - {self.reason or 'Closed'}"

