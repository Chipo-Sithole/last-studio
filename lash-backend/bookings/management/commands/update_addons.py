from django.core.management.base import BaseCommand
from bookings.models import AddOn


class Command(BaseCommand):
    help = 'Update add-ons to keep only 3 specific ones'

    def handle(self, *args, **kwargs):
        self.stdout.write('Updating add-ons...')
        
        # Delete all existing add-ons except colored-tips
        AddOn.objects.exclude(id='colored-tips').delete()
        self.stdout.write('  ✓ Removed old add-ons')
        
        # Create new add-ons
        addons_data = [
            {
                'id': 'colored-tips',
                'name': 'Colored Tips',
                'description': 'Add a pop of color to your look',
                'duration': 15,
                'price': 25.00,
                'is_active': True,
            },
            {
                'id': 'lash-removal',
                'name': 'Eyelash Extension Removal',
                'description': 'Safe and gentle removal of existing lash extensions',
                'duration': 30,
                'price': 30.00,
                'is_active': True,
            },
            {
                'id': 'lash-refill',
                'name': 'Eyelash Refill',
                'description': 'Refresh and fill in your existing lash extensions',
                'duration': 60,
                'price': 80.00,
                'is_active': True,
            },
        ]
        
        for addon_data in addons_data:
            addon, created = AddOn.objects.update_or_create(
                id=addon_data['id'],
                defaults=addon_data
            )
            action = 'Created' if created else 'Updated'
            self.stdout.write(f'  ✓ {action}: {addon.name} - ${addon.price} ({addon.duration} min)')
        
        self.stdout.write(self.style.SUCCESS('\n✅ Add-ons updated successfully!'))
