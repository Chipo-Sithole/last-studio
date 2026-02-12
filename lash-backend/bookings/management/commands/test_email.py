from django.core.management.base import BaseCommand
from django.core.mail import send_mail
from django.conf import settings


class Command(BaseCommand):
    help = 'Test email configuration by sending a test email'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str, help='Email address to send test to')

    def handle(self, *args, **options):
        recipient_email = options['email']
        
        self.stdout.write('Testing email configuration...')
        self.stdout.write(f'Sending test email to: {recipient_email}')
        self.stdout.write(f'From: {settings.EMAIL_HOST_USER}')
        self.stdout.write(f'Backend: {settings.EMAIL_BACKEND}')
        
        try:
            send_mail(
                subject='Test Email from Heavenly Lash Studio',
                message='This is a test email to verify your email configuration is working correctly.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[recipient_email],
                fail_silently=False,
            )
            
            self.stdout.write(self.style.SUCCESS('✅ Test email sent successfully!'))
            self.stdout.write('Check your inbox (and spam folder)')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Failed to send email: {str(e)}'))
            self.stdout.write('\nTroubleshooting:')
            self.stdout.write('1. Check your .env file has correct EMAIL_HOST_PASSWORD')
            self.stdout.write('2. Make sure 2-Step Verification is enabled on Gmail')
            self.stdout.write('3. Use an App Password, not your regular Gmail password')
            self.stdout.write('4. Check if "Less secure app access" needs to be enabled')
