from datetime import datetime
from bookings.models import BusinessHours

# Check what day of week Feb 15, 2026 is
d = datetime(2026, 2, 15).date()
print(f"Feb 15, 2026:")
print(f"  Weekday number: {d.weekday()} (0=Monday, 6=Sunday)")
print(f"  Day name: {d.strftime('%A')}")

# Get business hours for that weekday
hours = BusinessHours.objects.filter(weekday=d.weekday()).first()
if hours:
    print(f"\nBusiness hours in database for weekday {d.weekday()}:")
    print(f"  Day: {hours.get_weekday_display()}")
    print(f"  Open: {hours.is_open}")
    print(f"  Hours: {hours.open_time} - {hours.close_time}")
else:
    print(f"\nNo business hours found for weekday {d.weekday()}")

# Also check Feb 14
d2 = datetime(2026, 2, 14).date()
print(f"\nFeb 14, 2026:")
print(f"  Weekday number: {d2.weekday()} (0=Monday, 6=Sunday)")
print(f"  Day name: {d2.strftime('%A')}")

hours2 = BusinessHours.objects.filter(weekday=d2.weekday()).first()
if hours2:
    print(f"  Business hours: {hours2.open_time} - {hours2.close_time}")
