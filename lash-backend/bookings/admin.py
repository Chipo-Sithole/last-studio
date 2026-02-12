from django.contrib import admin
from bookings.models import (
    Service, AddOn, Customer, Appointment, 
    AppointmentClient, BusinessHours, BlockedDate
)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'duration', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'description']
    ordering = ['category', 'price']


@admin.register(AddOn)
class AddOnAdmin(admin.ModelAdmin):
    list_display = ['name', 'price', 'duration', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    ordering = ['price']


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'email', 'phone', 'is_returning', 'created_at']
    list_filter = ['is_returning', 'created_at']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']


class AppointmentClientInline(admin.TabularInline):
    model = AppointmentClient
    extra = 1
    fields = ['client_number', 'service', 'add_ons']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = [
        'confirmation_code', 'customer', 'appointment_date', 
        'appointment_time', 'status', 'total_price'
    ]
    list_filter = ['status', 'appointment_date', 'created_at']
    search_fields = [
        'confirmation_code', 'customer__first_name', 
        'customer__last_name', 'customer__email'
    ]
    ordering = ['-appointment_date', '-appointment_time']
    readonly_fields = ['confirmation_code', 'created_at', 'updated_at']
    inlines = [AppointmentClientInline]
    
    fieldsets = (
        ('Customer Information', {
            'fields': ('customer',)
        }),
        ('Appointment Details', {
            'fields': (
                'appointment_date', 'appointment_time', 'status', 
                'confirmation_code', 'total_duration', 'total_price'
            )
        }),
        ('Additional Info', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(BusinessHours)
class BusinessHoursAdmin(admin.ModelAdmin):
    list_display = ['get_weekday_display', 'is_open', 'open_time', 'close_time']
    list_filter = ['is_open']
    ordering = ['weekday']


@admin.register(BlockedDate)
class BlockedDateAdmin(admin.ModelAdmin):
    list_display = ['date', 'reason', 'created_at']
    ordering = ['-date']
    search_fields = ['reason']

