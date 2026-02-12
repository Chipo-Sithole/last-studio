from django.core.management.base import BaseCommand
from bookings.services import AvailabilityService
from datetime import datetime, timedelta


class Command(BaseCommand):
    help = 'Test available time slots for upcoming Saturday and Sunday'

    def handle(self, *args, **kwargs):
        # Find next Saturday (weekday 5)
        today = datetime.now().date()
        days_ahead = 5 - today.weekday()  # Saturday is 5
        if days_ahead <= 0:  # Target day already happened this week
            days_ahead += 7
        next_saturday = today + timedelta(days=days_ahead)
        
        # Find next Sunday (weekday 6)
        days_ahead = 6 - today.weekday()  # Sunday is 6
        if days_ahead <= 0:
            days_ahead += 7
        next_sunday = today + timedelta(days=days_ahead)
        
        self.stdout.write(f'\nTesting time slots for:')
        self.stdout.write(f'Saturday: {next_saturday}')
        self.stdout.write(f'Sunday: {next_sunday}')
        self.stdout.write('-' * 50)
        
        # Get slots for Saturday
        self.stdout.write(f'\nSATURDAY ({next_saturday}) TIME SLOTS:')
        saturday_slots = AvailabilityService.get_available_slots(next_saturday)
        if saturday_slots:
            for slot in saturday_slots:
                status = "✓ Available" if slot['available'] else "✗ Booked"
                self.stdout.write(f"  {slot['time']} - {status}")
        else:
            self.stdout.write('  No slots available or business is closed')
        
        # Get slots for Sunday
        self.stdout.write(f'\nSUNDAY ({next_sunday}) TIME SLOTS:')
        sunday_slots = AvailabilityService.get_available_slots(next_sunday)
        if sunday_slots:
            for slot in sunday_slots:
                status = "✓ Available" if slot['available'] else "✗ Booked"
                self.stdout.write(f"  {slot['time']} - {status}")
        else:
            self.stdout.write('  No slots available or business is closed')
        
        self.stdout.write(f'\nTotal Saturday slots: {len(saturday_slots)}')
        self.stdout.write(f'Total Sunday slots: {len(sunday_slots)}')
