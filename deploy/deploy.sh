#!/bin/bash

# Update and Deploy Script for Lash Suite Luxe
# Run this after pushing changes to GitHub

set -e

echo "🚀 Deploying Lash Suite Luxe..."

# Navigate to project
cd /var/www/lash-suite-luxe

# Pull latest changes
echo "📥 Pulling latest changes from GitHub..."
sudo -u lashapp git pull origin main

# Update backend
echo "🐍 Updating backend..."
cd lash-backend
sudo -u lashapp venv/bin/pip install -r requirements.txt
sudo -u lashapp venv/bin/python manage.py migrate
sudo -u lashapp venv/bin/python manage.py collectstatic --noinput

# Update frontend
echo "⚛️  Updating frontend..."
cd /var/www/lash-suite-luxe
sudo -u lashapp npm install
sudo -u lashapp npm run build

# Restart services
echo "🔄 Restarting services..."
sudo systemctl restart lash-backend
sudo systemctl reload nginx

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Service status:"
sudo systemctl status lash-backend --no-pager | head -n 10
echo ""
echo "🌐 Nginx status:"
sudo systemctl status nginx --no-pager | head -n 3
