from django.core.management.base import BaseCommand
from bookings.models import BusinessHours


class Command(BaseCommand):
    help = 'Updates business hours only'

    def handle(self, *args, **kwargs):
        self.stdout.write('Updating business hours...')
        
        # Clear existing business hours
        BusinessHours.objects.all().delete()
        
        # Create new business hours
        # Weekdays (Mon-Fri): 6pm-10pm
        # Saturday: 9:30am-6pm
        # Sunday: 2pm-6pm
        business_hours = [
            {'weekday': 0, 'is_open': True, 'open_time': '18:00', 'close_time': '22:00'},   # Monday
            {'weekday': 1, 'is_open': True, 'open_time': '18:00', 'close_time': '22:00'},   # Tuesday
            {'weekday': 2, 'is_open': True, 'open_time': '18:00', 'close_time': '22:00'},   # Wednesday
            {'weekday': 3, 'is_open': True, 'open_time': '18:00', 'close_time': '22:00'},   # Thursday
            {'weekday': 4, 'is_open': True, 'open_time': '18:00', 'close_time': '22:00'},   # Friday
            {'weekday': 5, 'is_open': True, 'open_time': '09:30', 'close_time': '18:00'},   # Saturday
            {'weekday': 6, 'is_open': True, 'open_time': '14:00', 'close_time': '18:00'},   # Sunday
        ]
        
        for hours_data in business_hours:
            hours = BusinessHours.objects.create(**hours_data)
            day_name = hours.get_weekday_display()
            if hours.is_open:
                self.stdout.write(f'  ✓ Updated hours: {day_name} {hours.open_time}-{hours.close_time}')
            else:
                self.stdout.write(f'  ✓ Updated hours: {day_name} (Closed)')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Business hours updated successfully!'))
