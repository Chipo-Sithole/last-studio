#!/bin/bash

# Droplet Setup Script for Lash Suite Luxe
# Run this script on a fresh Ubuntu 22.04 Droplet

set -e

echo "================================================"
echo "Lash Suite Luxe - Droplet Setup"
echo "================================================"

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install system dependencies
echo "📦 Installing system dependencies..."
sudo apt install -y \
    python3.11 \
    python3.11-venv \
    python3-pip \
    nginx \
    postgresql \
    postgresql-contrib \
    certbot \
    python3-certbot-nginx \
    git \
    curl \
    software-properties-common

# Install Node.js 20
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo "✅ Python version: $(python3.11 --version)"

# Create application user
echo "👤 Creating application user..."
sudo useradd -m -s /bin/bash lashapp || echo "User already exists"
sudo usermod -aG sudo lashapp

# Setup PostgreSQL database
echo "🗄️  Setting up PostgreSQL..."
sudo -u postgres psql <<EOF
CREATE DATABASE lash_suite_luxe;
CREATE USER lashapp WITH PASSWORD 'CHANGE_THIS_PASSWORD';
ALTER ROLE lashapp SET client_encoding TO 'utf8';
ALTER ROLE lashapp SET default_transaction_isolation TO 'read committed';
ALTER ROLE lashapp SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE lash_suite_luxe TO lashapp;
\q
EOF

# Clone repository
echo "📥 Cloning repository..."
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/Chipo-Sithole/last-studio.git lash-suite-luxe
sudo chown -R lashapp:lashapp /var/www/lash-suite-luxe

# Setup backend
echo "🐍 Setting up Django backend..."
cd /var/www/lash-suite-luxe/lash-backend
sudo -u lashapp python3.11 -m venv venv
sudo -u lashapp venv/bin/pip install --upgrade pip
sudo -u lashapp venv/bin/pip install -r requirements.txt

# Create .env file for backend
echo "⚙️  Creating backend environment file..."
sudo -u lashapp tee /var/www/lash-suite-luxe/lash-backend/.env > /dev/null <<EOF
DEBUG=False
SECRET_KEY=$(python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,your-droplet-ip
DATABASE_URL=postgresql://lashapp:CHANGE_THIS_PASSWORD@localhost:5432/lash_suite_luxe
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com
EOF

# Run migrations
echo "🗄️  Running database migrations..."
cd /var/www/lash-suite-luxe/lash-backend
sudo -u lashapp venv/bin/python manage.py migrate
sudo -u lashapp venv/bin/python manage.py collectstatic --noinput

# Seed database
echo "🌱 Seeding database..."
sudo -u lashapp venv/bin/python manage.py seed_data

# Setup frontend
echo "⚛️  Setting up React frontend..."
cd /var/www/lash-suite-luxe

# Create frontend .env
sudo -u lashapp tee /var/www/lash-suite-luxe/.env > /dev/null <<EOF
VITE_API_URL=https://your-domain.com/api
EOF

# Build frontend
sudo -u lashapp npm install
sudo -u lashapp npm run build

# Copy systemd service files
echo "⚙️  Setting up systemd services..."
sudo cp /var/www/lash-suite-luxe/deploy/lash-backend.service /etc/systemd/system/
sudo cp /var/www/lash-suite-luxe/deploy/lash-backend.socket /etc/systemd/system/

# Copy Nginx configuration
echo "🌐 Setting up Nginx..."
sudo cp /var/www/lash-suite-luxe/deploy/nginx.conf /etc/nginx/sites-available/lash-suite-luxe
sudo ln -sf /etc/nginx/sites-available/lash-suite-luxe /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Enable and start services
echo "🚀 Starting services..."
sudo systemctl daemon-reload
sudo systemctl enable lash-backend.socket
sudo systemctl start lash-backend.socket
sudo systemctl enable lash-backend.service
sudo systemctl start lash-backend.service
sudo systemctl restart nginx

echo ""
echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "📝 IMPORTANT: Update these files:"
echo "  1. /var/www/lash-suite-luxe/lash-backend/.env"
echo "     - Set your domain/IP in ALLOWED_HOSTS"
echo "     - Set your database password"
echo "     - Configure email settings"
echo ""
echo "  2. /var/www/lash-suite-luxe/.env"
echo "     - Set VITE_API_URL to your domain"
echo ""
echo "  3. /etc/nginx/sites-available/lash-suite-luxe"
echo "     - Replace 'your-domain.com' with your actual domain"
echo ""
echo "🔐 Setup SSL with Let's Encrypt:"
echo "  sudo certbot --nginx -d your-domain.com -d www.your-domain.com"
echo ""
echo "🎯 Create Django superuser:"
echo "  cd /var/www/lash-suite-luxe/lash-backend"
echo "  sudo -u lashapp venv/bin/python manage.py createsuperuser"
echo ""
echo "📊 Check service status:"
echo "  sudo systemctl status lash-backend"
echo "  sudo systemctl status nginx"
echo ""
echo "📋 View logs:"
echo "  sudo journalctl -u lash-backend -f"
echo ""
