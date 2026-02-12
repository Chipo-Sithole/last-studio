from django.core.management.base import BaseCommand
from bookings.services import AvailabilityService
from datetime import datetime
import json


class Command(BaseCommand):
    help = 'Test API response for specific dates'

    def handle(self, *args, **kwargs):
        # Test Saturday Feb 14
        saturday = datetime(2026, 2, 14).date()
        self.stdout.write(f'\n=== SATURDAY {saturday} ===')
        sat_slots = AvailabilityService.get_available_slots(saturday)
        self.stdout.write(f'Total slots: {len(sat_slots)}')
        if sat_slots:
            self.stdout.write(f'First slot: {sat_slots[0]["time"]}')
            self.stdout.write(f'Last slot: {sat_slots[-1]["time"]}')
        
        # Test Sunday Feb 15
        sunday = datetime(2026, 2, 15).date()
        self.stdout.write(f'\n=== SUNDAY {sunday} ===')
        sun_slots = AvailabilityService.get_available_slots(sunday)
        self.stdout.write(f'Total slots: {len(sun_slots)}')
        if sun_slots:
            self.stdout.write(f'First slot: {sun_slots[0]["time"]}')
            self.stdout.write(f'Last slot: {sun_slots[-1]["time"]}')
            self.stdout.write(f'\nAll Sunday slots:')
            for slot in sun_slots:
                self.stdout.write(f'  - {slot["time"]}')
