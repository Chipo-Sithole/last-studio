from django.core.management.base import BaseCommand
from bookings.models import Service, AddOn, BusinessHours


class Command(BaseCommand):
    help = 'Seeds the database with initial services, add-ons, and business hours'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding database...')
        
        # Clear existing data
        self.stdout.write('Clearing existing data...')
        Service.objects.all().delete()
        AddOn.objects.all().delete()
        BusinessHours.objects.all().delete()
        
        # Create Services
        self.stdout.write('Creating services...')
        services_data = [
            {
                'id': 'classic-natural',
                'name': 'Classic Natural',
                'description': 'Perfect for everyday elegance. One extension per natural lash for a subtle, refined look.',
                'duration': 90,
                'price': 120.00,
                'category': 'classic',
                'is_active': True,
            },
            {
                'id': 'classic-glamour',
                'name': 'Classic Glamour',
                'description': 'Fuller coverage with dramatic length. Ideal for special occasions.',
                'duration': 105,
                'price': 145.00,
                'category': 'classic',
                'is_active': True,
            },
            {
                'id': 'volume-light',
                'name': 'Light Volume',
                'description': 'Handcrafted fans of 2-3 ultra-fine extensions for soft, fluffy fullness.',
                'duration': 120,
                'price': 175.00,
                'category': 'volume',
                'is_active': True,
            },
            {
                'id': 'volume-full',
                'name': 'Full Volume',
                'description': 'Luxurious density with 4-6 lash fans. Bold, dramatic, unforgettable.',
                'duration': 150,
                'price': 220.00,
                'category': 'volume',
                'is_active': True,
            },
            {
                'id': 'hybrid',
                'name': 'Hybrid Set',
                'description': 'The best of both worlds. Classic and volume techniques blended seamlessly.',
                'duration': 120,
                'price': 185.00,
                'category': 'hybrid',
                'is_active': True,
            },
        ]
        
        for service_data in services_data:
            service = Service.objects.create(**service_data)
            self.stdout.write(f'  ✓ Created service: {service.name}')
        
        # Create Add-Ons
        self.stdout.write('Creating add-ons...')
        addons_data = [
            {
                'id': 'lash-bath',
                'name': 'Lash Bath & Clean',
                'description': 'Deep cleanse to maintain lash health',
                'duration': 10,
                'price': 15.00,
                'is_active': True,
            },
            {
                'id': 'colored-tips',
                'name': 'Colored Tips',
                'description': 'Add a pop of color to your look',
                'duration': 15,
                'price': 25.00,
                'is_active': True,
            },
            {
                'id': 'bottom-lashes',
                'name': 'Bottom Lash Extensions',
                'description': 'Complete your look with lower lash enhancements',
                'duration': 20,
                'price': 35.00,
                'is_active': True,
            },
            {
                'id': 'lash-serum',
                'name': 'Growth Serum Treatment',
                'description': 'Nourishing serum for healthier natural lashes',
                'duration': 5,
                'price': 20.00,
                'is_active': True,
            },
        ]
        
        for addon_data in addons_data:
            addon = AddOn.objects.create(**addon_data)
            self.stdout.write(f'  ✓ Created add-on: {addon.name}')
        
        # Create Business Hours
        # Weekdays (Mon-Fri): 6pm-10pm
        # Saturday: 9:30am-6pm
        # Sunday: 2pm-6pm
        self.stdout.write('Creating business hours...')
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
                self.stdout.write(f'  ✓ Created hours: {day_name} {hours.open_time}-{hours.close_time}')
            else:
                self.stdout.write(f'  ✓ Created hours: {day_name} (Closed)')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Database seeded successfully!'))
        self.stdout.write(f'Created {len(services_data)} services')
        self.stdout.write(f'Created {len(addons_data)} add-ons')
        self.stdout.write(f'Created {len(business_hours)} business hour entries')
