"""
Email service for sending appointment confirmations.
"""
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings
from bookings.models import Appointment
from datetime import datetime


def send_appointment_confirmation(appointment: Appointment) -> bool:
    """
    Send booking confirmation email to customer.
    
    Args:
        appointment: The Appointment instance
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        customer = appointment.customer
        
        # Format date and time for email
        appointment_datetime = datetime.combine(
            appointment.appointment_date,
            appointment.appointment_time
        )
        formatted_date = appointment_datetime.strftime('%A, %B %d, %Y')
        formatted_time = appointment_datetime.strftime('%I:%M %p')
        
        # Prepare context for email template
        context = {
            'customer_name': customer.first_name,
            'confirmation_code': appointment.confirmation_code,
            'appointment_date': formatted_date,
            'appointment_time': formatted_time,
            'location': appointment.location,
            'needs_transport': appointment.needs_transport,
            'total_price': f'${appointment.total_price}',
            'total_duration': appointment.total_duration,
            'clients': appointment.clients.all(),
            'studio_email': 'heavenlylashstudiozw@gmail.com',
        }
        
        # Plain text email content
        plain_message = f"""
Hi {customer.first_name},

Your mobile lash appointment at Heavenly Lash Studio has been confirmed!

Booking Details:
------------------
Confirmation Code: {appointment.confirmation_code}
Date: {formatted_date}
Time: {formatted_time}
Your Location: {appointment.location}
Total Duration: {appointment.total_duration} minutes
Total Price: ${appointment.total_price}{'(includes $2 transport fee)' if appointment.needs_transport else ''}

Services Booked:
"""
        
        for client in appointment.clients.all():
            plain_message += f"\n• {client.service.name} - ${client.service.price}"
            if client.add_ons.exists():
                for addon in client.add_ons.all():
                    plain_message += f"\n  + {addon.name} - ${addon.price}"
        
        plain_message += f"""

We'll come to your location at the scheduled time.

Need to reschedule or have questions?
Contact us at: heavenlylashstudiozw@gmail.com

We look forward to seeing you!

Best regards,
Heavenly Lash Studio Team
"""
        
        # Send email
        subject = f'Booking Confirmed - {appointment.confirmation_code}'
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[customer.email],
            fail_silently=False,
        )
        
        return True
        
    except Exception as e:
        print(f'Error sending confirmation email: {str(e)}')
        return False


def send_admin_notification(appointment: Appointment) -> bool:
    """
    Send new booking notification to admin.
    
    Args:
        appointment: The Appointment instance
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        customer = appointment.customer
        
        # Format date and time for email
        appointment_datetime = datetime.combine(
            appointment.appointment_date,
            appointment.appointment_time
        )
        formatted_date = appointment_datetime.strftime('%A, %B %d, %Y')
        formatted_time = appointment_datetime.strftime('%I:%M %p')
        
        # Admin notification email
        admin_message = f"""
🎉 NEW BOOKING RECEIVED!

Confirmation Code: {appointment.confirmation_code}
------------------

CUSTOMER DETAILS:
Name: {customer.first_name} {customer.last_name}
Email: {customer.email}
Phone: {customer.phone}
{"✓ Returning Client" if customer.is_returning else "○ New Client"}

APPOINTMENT DETAILS:
Date: {formatted_date}
Time: {formatted_time}
Location: {appointment.location}
{"Transport Required: YES ($2 fee included)" if appointment.needs_transport else "Transport Required: NO"}

SERVICES BOOKED:
"""
        
        for client in appointment.clients.all():
            admin_message += f"\n• {client.service.name} - ${client.service.price} ({client.service.duration} min)"
            if client.add_ons.exists():
                for addon in client.add_ons.all():
                    admin_message += f"\n  + {addon.name} - ${addon.price} ({addon.duration} min)"
        
        admin_message += f"""

TOTAL:
Duration: {appointment.total_duration} minutes
Price: ${appointment.total_price}

{"NOTES: " + appointment.notes if appointment.notes else ""}

------------------
View in admin panel: http://127.0.0.1:8000/admin/bookings/appointment/{appointment.id}/change/
"""
        
        # Send email to admin
        subject = f'🆕 New Booking - {customer.first_name} {customer.last_name} - {formatted_date}'
        
        send_mail(
            subject=subject,
            message=admin_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['heavenlylashstudiozw@gmail.com'],
            fail_silently=False,
        )
        
        return True
        
    except Exception as e:
        print(f'Error sending admin notification: {str(e)}')
        return False
