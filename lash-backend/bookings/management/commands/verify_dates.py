from django.core.management.base import BaseCommand
from datetime import datetime
from bookings.models import BusinessHours


class Command(BaseCommand):
    help = 'Verify date to weekday mapping'

    def handle(self, *args, **kwargs):
        # Check what day of week Feb 15, 2026 is
        d = datetime(2026, 2, 15).date()
        self.stdout.write(f"\nFeb 15, 2026:")
        self.stdout.write(f"  Weekday number: {d.weekday()} (0=Monday, 6=Sunday)")
        self.stdout.write(f"  Day name: {d.strftime('%A')}")

        # Get business hours for that weekday
        hours = BusinessHours.objects.filter(weekday=d.weekday()).first()
        if hours:
            self.stdout.write(f"\nBusiness hours in database for weekday {d.weekday()}:")
            self.stdout.write(f"  Day: {hours.get_weekday_display()}")
            self.stdout.write(f"  Open: {hours.is_open}")
            self.stdout.write(f"  Hours: {hours.open_time} - {hours.close_time}")
        else:
            self.stdout.write(f"\nNo business hours found for weekday {d.weekday()}")

        # Also check Feb 14
        d2 = datetime(2026, 2, 14).date()
        self.stdout.write(f"\nFeb 14, 2026:")
        self.stdout.write(f"  Weekday number: {d2.weekday()} (0=Monday, 6=Sunday)")
        self.stdout.write(f"  Day name: {d2.strftime('%A')}")

        hours2 = BusinessHours.objects.filter(weekday=d2.weekday()).first()
        if hours2:
            self.stdout.write(f"  Business hours: {hours2.open_time} - {hours2.close_time}")
