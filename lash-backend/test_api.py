"""
Test script to verify API endpoints are working correctly
"""
import requests
import json
from datetime import datetime, timedelta

BASE_URL = 'http://127.0.0.1:8000/api'

def test_services():
    """Test GET /api/services/"""
    print('\n📋 Testing Services Endpoint...')
    response = requests.get(f'{BASE_URL}/services/')
    if response.status_code == 200:
        services = response.json()
        print(f'✅ GET /api/services/ - Success ({len(services)} services)')
        for service in services[:2]:
            print(f'   • {service["name"]} - ${service["price"]} ({service["duration"]} min)')
        return True
    else:
        print(f'❌ GET /api/services/ - Failed ({response.status_code})')
        return False

def test_addons():
    """Test GET /api/addons/"""
    print('\n📋 Testing Add-Ons Endpoint...')
    response = requests.get(f'{BASE_URL}/addons/')
    if response.status_code == 200:
        addons = response.json()
        print(f'✅ GET /api/addons/ - Success ({len(addons)} add-ons)')
        for addon in addons[:2]:
            print(f'   • {addon["name"]} - ${addon["price"]}')
        return True
    else:
        print(f'❌ GET /api/addons/ - Failed ({response.status_code})')
        return False

def test_business_hours():
    """Test GET /api/business-hours/"""
    print('\n📋 Testing Business Hours Endpoint...')
    response = requests.get(f'{BASE_URL}/business-hours/')
    if response.status_code == 200:
        hours = response.json()
        print(f'✅ GET /api/business-hours/ - Success ({len(hours)} days configured)')
        for day in hours[:3]:
            if day['is_open']:
                print(f'   • {day["weekday_display"]}: {day["open_time"]} - {day["close_time"]}')
            else:
                print(f'   • {day["weekday_display"]}: Closed')
        return True
    else:
        print(f'❌ GET /api/business-hours/ - Failed ({response.status_code})')
        return False

def test_check_availability():
    """Test POST /api/appointments/check_availability/"""
    print('\n📋 Testing Check Availability Endpoint...')
    
    # Get a future date (tomorrow)
    tomorrow = (datetime.now() + timedelta(days=1)).date()
    
    payload = {
        'appointment_date': str(tomorrow),
        'appointment_time': '10:00',
        'total_duration': 120
    }
    
    response = requests.post(
        f'{BASE_URL}/appointments/check_availability/',
        json=payload,
        headers={'Content-Type': 'application/json'}
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f'✅ POST /api/appointments/check_availability/ - Success')
        print(f'   • Available: {result.get("available", False)}')
        if result.get('message'):
            print(f'   • Message: {result["message"]}')
        return True
    else:
        print(f'❌ POST /api/appointments/check_availability/ - Failed ({response.status_code})')
        print(f'   • Response: {response.text}')
        return False

def test_available_slots():
    """Test GET /api/appointments/available_slots/"""
    print('\n📋 Testing Available Slots Endpoint...')
    
    # Get a future date (tomorrow)
    tomorrow = (datetime.now() + timedelta(days=1)).date()
    
    response = requests.get(
        f'{BASE_URL}/appointments/available_slots/',
        params={'date': str(tomorrow)}
    )
    
    if response.status_code == 200:
        result = response.json()
        slots = result.get('slots', [])
        print(f'✅ GET /api/appointments/available_slots/ - Success')
        print(f'   • Found {len(slots)} available slots')
        if slots:
            available_times = [s['time'] for s in slots[:3] if isinstance(s, dict)]
            if available_times:
                print(f'   • First 3 slots: {", ".join(available_times)}')
        return True
    else:
        print(f'❌ GET /api/appointments/available_slots/ - Failed ({response.status_code})')
        print(f'   • Response: {response.text}')
        return False

def test_create_appointment():
    """Test POST /api/appointments/ - Create a full appointment"""
    print('\n📋 Testing Create Appointment Endpoint...')
    
    # Get a future date (3 days from now)
    future_date = (datetime.now() + timedelta(days=3)).date()
    
    payload = {
        'first_name': 'Jane',
        'last_name': 'Doe',
        'email': 'jane.doe@example.com',
        'phone': '+1234567890',
        'is_returning': False,
        'appointment_date': str(future_date),
        'appointment_time': '14:00',
        'clients': [
            {
                'client_number': 1,
                'service_id': 'classic-natural',
                'add_on_ids': ['lash-bath']
            }
        ],
        'notes': 'Test appointment from API test script'
    }
    
    response = requests.post(
        f'{BASE_URL}/appointments/',
        json=payload,
        headers={'Content-Type': 'application/json'}
    )
    
    if response.status_code == 201:
        result = response.json()
        print(f'✅ POST /api/appointments/ - Success')
        print(f'   • Confirmation Code: {result.get("confirmation_code")}')
        print(f'   • Customer: {result.get("customer_name")}')
        print(f'   • Date: {result.get("appointment_date")} at {result.get("appointment_time")}')
        print(f'   • Total Price: ${result.get("total_price")}')
        print(f'   • Total Duration: {result.get("total_duration")} min')
        return result.get('confirmation_code')
    else:
        print(f'❌ POST /api/appointments/ - Failed ({response.status_code})')
        print(f'   • Response: {response.text}')
        return None

def test_get_by_confirmation(confirmation_code):
    """Test GET /api/appointments/by_confirmation/?code=XXX"""
    if not confirmation_code:
        print('\n⚠️  Skipping confirmation code test (no code available)')
        return False
        
    print('\n📋 Testing Get by Confirmation Code...')
    response = requests.get(f'{BASE_URL}/appointments/by_confirmation/?code={confirmation_code}')
    
    if response.status_code == 200:
        result = response.json()
        print(f'✅ GET /api/appointments/by_confirmation/ - Success')
        print(f'   • Found appointment for {result.get("customer_name")}')
        print(f'   • Status: {result.get("status")}')
        return True
    else:
        print(f'❌ GET /api/appointments/by_confirmation/ - Failed ({response.status_code})')
        return False

def test_list_appointments():
    """Test GET /api/appointments/"""
    print('\n📋 Testing List Appointments Endpoint...')
    response = requests.get(f'{BASE_URL}/appointments/')
    
    if response.status_code == 200:
        appointments = response.json()
        print(f'✅ GET /api/appointments/ - Success ({len(appointments)} appointments)')
        if appointments:
            apt = appointments[0]
            print(f'   • Latest: {apt.get("customer_name")} on {apt.get("appointment_date")}')
        return True
    else:
        print(f'❌ GET /api/appointments/ - Failed ({response.status_code})')
        return False

def main():
    print('='*60)
    print('🚀 TESTING LASH STUDIO BACKEND API')
    print('='*60)
    
    results = []
    
    # Test read-only endpoints
    results.append(('Services', test_services()))
    results.append(('Add-Ons', test_addons()))
    results.append(('Business Hours', test_business_hours()))
    
    # Test availability checking
    results.append(('Check Availability', test_check_availability()))
    results.append(('Available Slots', test_available_slots()))
    
    # Test appointment creation
    confirmation_code = test_create_appointment()
    results.append(('Create Appointment', confirmation_code is not None))
    
    # Test retrieval by confirmation
    results.append(('Get by Confirmation', test_get_by_confirmation(confirmation_code)))
    
    # Test listing
    results.append(('List Appointments', test_list_appointments()))
    
    # Summary
    print('\n' + '='*60)
    print('📊 TEST SUMMARY')
    print('='*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = '✅ PASSED' if result else '❌ FAILED'
        print(f'{status} - {test_name}')
    
    print(f'\n🎯 Results: {passed}/{total} tests passed ({int(passed/total*100)}%)')
    
    if passed == total:
        print('🎉 All tests passed! API is fully functional.')
    else:
        print('⚠️  Some tests failed. Check the output above for details.')

if __name__ == '__main__':
    try:
        main()
    except requests.exceptions.ConnectionError:
        print('❌ ERROR: Could not connect to the API server.')
        print('   Make sure the Django server is running at http://127.0.0.1:8000')
    except Exception as e:
        print(f'❌ ERROR: {str(e)}')
