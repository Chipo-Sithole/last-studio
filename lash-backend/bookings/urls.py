"""
URL configuration for bookings app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from bookings.views import (
    ServiceViewSet, AddOnViewSet, AppointmentViewSet,
    CustomerViewSet, BusinessHoursViewSet, BlockedDateViewSet
)

app_name = 'bookings'

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'addons', AddOnViewSet, basename='addon')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'business-hours', BusinessHoursViewSet, basename='business-hours')
router.register(r'blocked-dates', BlockedDateViewSet, basename='blocked-dates')

urlpatterns = [
    path('', include(router.urls)),
]
