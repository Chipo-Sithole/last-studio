# Heavenly Lash Studio - Backend API

Django REST Framework backend for the Heavenly Lash Studio booking platform.

## Setup

1. **Activate Virtual Environment:**
   ```bash
   .\.venv\Scripts\Activate.ps1  # Windows PowerShell
   ```

2. **Install Dependencies:**
   ```bash
   uv pip install -e .
   ```

3. **Configure Environment:**
   - Copy `.env.example` to `.env`
   - Update environment variables as needed

4. **Run Migrations:**
   ```bash
   python manage.py migrate
   ```

5. **Create Superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Development Server:**
   ```bash
   python manage.py runserver 8001
   ```

## Project Structure

```
lash-backend/
├── config/              # Django project settings
│   ├── settings.py      # Main configuration
│   ├── urls.py          # URL routing
│   └── wsgi.py         # WSGI config
├── bookings/           # Main booking app
│   ├── models.py       # Database models
│   ├── views.py        # API views
│   ├── serializers/    # DRF serializers
│   ├── urls.py         # App URL patterns
│   └── admin.py        # Django admin config
└── manage.py           # Django management script
```

## API Endpoints

Coming soon...

## Technologies

- Django 5.1+
- Django REST Framework
- SQLite (development)
- CORS Headers for frontend integration
