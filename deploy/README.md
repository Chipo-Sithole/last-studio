# Deployment Files

This directory contains all the configuration files needed to deploy Lash Suite Luxe on a Digital Ocean Droplet.

## Files Overview

### `setup.sh`
Automated setup script that:
- Installs all system dependencies (Python, Node.js, PostgreSQL, Nginx)
- Creates database and application user
- Clones repository and sets up environments
- Configures systemd services
- Builds frontend and backend

**Usage:**
```bash
curl -o setup.sh https://raw.githubusercontent.com/Chipo-Sithole/last-studio/main/deploy/setup.sh
chmod +x setup.sh
./setup.sh
```

### `nginx.conf`
Nginx reverse proxy configuration that:
- Serves React frontend from `/dist`
- Proxies API requests to Django backend
- Handles SSL certificates
- Configures caching and compression
- Sets security headers

**Location:** `/etc/nginx/sites-available/lash-suite-luxe`

### `lash-backend.service`
Systemd service file for running Django with Gunicorn:
- 3 worker processes
- Unix socket communication
- Auto-restart on failure
- Logging configuration

**Location:** `/etc/systemd/system/lash-backend.service`

### `lash-backend.socket`
Systemd socket for Gunicorn:
- Creates Unix socket at `/run/lash-backend.sock`
- Manages socket permissions
- Enables socket activation

**Location:** `/etc/systemd/system/lash-backend.socket`

### `deploy.sh`
Quick update script for redeploying after code changes:
- Pulls latest code from GitHub
- Updates dependencies
- Runs migrations
- Rebuilds frontend
- Restarts services

**Usage:**
```bash
cd /var/www/lash-suite-luxe
bash deploy/deploy.sh
```

## Quick Reference

### Service Commands

```bash
# Start/stop/restart backend
sudo systemctl start lash-backend
sudo systemctl stop lash-backend
sudo systemctl restart lash-backend

# Check status
sudo systemctl status lash-backend

# View logs
sudo journalctl -u lash-backend -f

# Restart Nginx
sudo systemctl restart nginx
sudo nginx -t  # Test config first
```

### Manual Deployment Steps

```bash
# Pull code
cd /var/www/lash-suite-luxe
sudo -u lashapp git pull origin main

# Update backend
cd lash-backend
sudo -u lashapp venv/bin/pip install -r requirements.txt
sudo -u lashapp venv/bin/python manage.py migrate
sudo -u lashapp venv/bin/python manage.py collectstatic --noinput

# Update frontend
cd /var/www/lash-suite-luxe
sudo -u lashapp npm install
sudo -u lashapp npm run build

# Restart services
sudo systemctl restart lash-backend
sudo systemctl reload nginx
```

### Log Locations

- **Backend App Logs:** `/var/log/lash-backend/`
- **Nginx Access:** `/var/log/nginx/lash-suite-luxe-access.log`
- **Nginx Error:** `/var/log/nginx/lash-suite-luxe-error.log`
- **System (journald):** `sudo journalctl -u lash-backend`

## Architecture

```
Internet
   ↓
Nginx (Port 80/443)
   ↓
Frontend (React SPA) ← Static files from /dist
   ↓ (API calls to /api/*)
Unix Socket (/run/lash-backend.sock)
   ↓
Gunicorn (3 workers)
   ↓
Django Application
   ↓
PostgreSQL Database
```

## Customization

### Change Number of Workers

Edit `/etc/systemd/system/lash-backend.service`:
```
--workers 4  # Increase for better performance
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl restart lash-backend
```

### Add Custom Domain

1. Update DNS A records to point to droplet IP
2. Edit `/etc/nginx/sites-available/lash-suite-luxe`:
   - Replace `your-domain.com` with your domain
3. Update environment files:
   - `/var/www/lash-suite-luxe/lash-backend/.env` - ALLOWED_HOSTS
   - `/var/www/lash-suite-luxe/.env` - VITE_API_URL
4. Setup SSL:
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

### Enable Debug Logs

Edit `/var/www/lash-suite-luxe/lash-backend/.env`:
```
DEBUG=True
```

**⚠️ Never enable DEBUG=True in production!**

## Security Notes

- Backend runs as `lashapp` user (not root)
- Socket has restricted permissions (0660)
- Security headers configured in Nginx
- SSL/TLS enforced via Let's Encrypt
- Database credentials in environment files

## Troubleshooting

See [DROPLET-DEPLOYMENT.md](../DROPLET-DEPLOYMENT.md) for detailed troubleshooting guide.
