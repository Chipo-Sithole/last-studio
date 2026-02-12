from django.core.management.base import BaseCommand
from bookings.models import Service


class Command(BaseCommand):
    help = 'Update all service durations to 45 minutes'

    def handle(self, *args, **kwargs):
        self.stdout.write('Updating all service durations to 45 minutes...')
        
        services = Service.objects.all()
        
        for service in services:
            old_duration = service.duration
            service.duration = 45
            service.save()
            self.stdout.write(f'  ✓ Updated {service.name}: {old_duration} min → 45 min')
        
        self.stdout.write(self.style.SUCCESS(f'\n✅ Updated {services.count()} services successfully!'))
