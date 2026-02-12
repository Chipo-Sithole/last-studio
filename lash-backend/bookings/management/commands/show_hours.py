from django.core.management.base import BaseCommand
from bookings.models import BusinessHours


class Command(BaseCommand):
    help = 'Display current business hours'

    def handle(self, *args, **kwargs):
        self.stdout.write('Current Business Hours:')
        self.stdout.write('-' * 50)
        
        hours = BusinessHours.objects.all().order_by('weekday')
        
        for h in hours:
            day_name = h.get_weekday_display()
            if h.is_open:
                self.stdout.write(f'{day_name}: {h.open_time} - {h.close_time}')
            else:
                self.stdout.write(f'{day_name}: Closed')
