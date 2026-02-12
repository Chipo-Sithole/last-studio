# Lash Suite Luxe - Premium Lash Booking System

A modern, full-stack booking platform for a premium lash extension studio. Features an elegant frontend experience and robust Django REST API backend.

![Lash Suite Luxe](https://img.shields.io/badge/Lash-Suite%20Luxe-pink?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Django](https://img.shields.io/badge/Django-5.1-092E20?style=flat-square&logo=django)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)

## ✨ Features

- **🎯 Multi-Client Booking** - Book appointments for multiple clients simultaneously
- **📅 Real-Time Availability** - Live time slot availability checking
- **💅 5 Premium Services** - Classic Natural, Classic Glamour, Light Volume, Full Volume, Hybrid Set
- **✨ Add-Ons** - Lash bath, colored tips, bottom lashes, growth serum
- **📍 Location Selection** - Studio or mobile service options
- **🚗 Transport Coordination** - Optional transport service for mobile bookings
- **📧 Email Notifications** - Automated booking confirmations
- **📱 Responsive Design** - Seamless experience across all devices
- **🎨 Elegant UI** - Modern, animation-rich interface with Framer Motion

## 🏗 Architecture

```
lash-suite-luxe/
├── src/                      # React Frontend
│   ├── components/           # UI Components
│   │   ├── booking/         # Booking flow components
│   │   ├── landing/         # Landing page sections
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities & API client
│   ├── pages/               # Page components
│   └── types/               # TypeScript definitions
│
└── lash-backend/            # Django REST API
    ├── bookings/            # Bookings app
    │   ├── models.py        # Data models
    │   ├── views.py         # API endpoints
    │   ├── services.py      # Business logic
    │   └── serializers/     # DRF serializers
    └── config/              # Django settings
```

## 🚀 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Server state management
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **React Hook Form** - Form validation
- **date-fns** - Date utilities

### Backend
- **Django 5.1** - Web framework
- **Django REST Framework** - API framework
- **PostgreSQL** - Production database
- **SQLite** - Development database
- **python-dotenv** - Environment management

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.13+
- Git

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/Chipo-Sithole/last-studio.git
cd last-studio

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
# Navigate to backend directory
cd lash-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
python manage.py migrate

# Create superuser (for admin access)
python manage.py createsuperuser

# Seed initial data
python manage.py seed_data

# Start development server
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api`

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:8000/api
```

**Backend (lash-backend/.env)**
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

## 📊 API Endpoints

### Services
- `GET /api/services/` - List all active services
- `GET /api/services/{id}/` - Get service details

### Add-Ons
- `GET /api/add-ons/` - List all add-ons

### Time Slots
- `GET /api/time-slots/` - Get available time slots
  - Query params: `date` (YYYY-MM-DD), `service_ids`

### Appointments
- `POST /api/appointments/` - Create new appointment
- `GET /api/appointments/{id}/` - Get appointment details

## 🚢 Deployment

**Deployed on Digital Ocean Droplet**

### 📚 Deployment Guides
- **[DROPLET-MANUAL.md](./DROPLET-MANUAL.md)** - Complete step-by-step deployment guide
- **[DROPLET-CHECKLIST.md](./DROPLET-CHECKLIST.md)** - Quick checklist for droplet creation
- **[SSH-KEYS-GUIDE.md](./SSH-KEYS-GUIDE.md)** - SSH key setup guide
- **[TERMIUS-SETUP.md](./TERMIUS-SETUP.md)** - Termius SSH client setup

### 🔧 Configuration Files
All deployment configs are in the `/deploy` folder:
- `nginx.conf` - Web server configuration
- `lash-backend.service` - Backend systemd service
- `lash-backend.socket` - Backend socket configuration
- `deploy.sh` - Quick update script

### 💰 Cost
- **$18/month** - Single 2GB droplet (includes everything)
- Ubuntu 22.04 + PostgreSQL + Nginx + Django + React

## 📝 Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
```

### Backend
```bash
python manage.py runserver      # Start dev server
python manage.py migrate        # Run migrations
python manage.py seed_data      # Seed database
python manage.py test          # Run tests
```

## 🎨 Services Offered

1. **Classic Natural** - Subtle, refined everyday elegance ($120, 90 min)
2. **Classic Glamour** - Dramatic length for special occasions ($145, 105 min)
3. **Light Volume** - Soft, fluffy fullness with 2-3 extensions ($175, 120 min)
4. **Full Volume** - Bold, dramatic density with 4-6 lash fans ($220, 150 min)
5. **Hybrid Set** - Perfect blend of classic and volume ($185, 120 min)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👤 Author

**Chipo Sithole**
- GitHub: [@Chipo-Sithole](https://github.com/Chipo-Sithole)

## 🙏 Acknowledgments

- Built with modern best practices
- Designed for scalability and performance
- Optimized for user experience

---

**Repository**: [https://github.com/Chipo-Sithole/last-studio](https://github.com/Chipo-Sithole/last-studio)
