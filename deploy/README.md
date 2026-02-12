# Deployment Files

Configuration files for deploying Lash Suite Luxe on Digital Ocean Droplet.

## 📁 Files in This Directory

### `nginx.conf`
Nginx configuration for your droplet.
- **Location on server**: `/etc/nginx/sites-available/lash-suite-luxe`
- **What it does**: Routes traffic, serves frontend, proxies backend

### `lash-backend.service`
Systemd service file for Django/Gunicorn.
- **Location on server**: `/etc/systemd/system/lash-backend.service`
- **What it does**: Keeps your backend running as a service

### `lash-backend.socket`
Systemd socket for Gunicorn.
- **Location on server**: `/etc/systemd/system/lash-backend.socket`
- **What it does**: Creates Unix socket for backend communication

### `deploy.sh`
Quick update/redeploy script.
- **When to use**: After pushing changes to GitHub
- **What it does**: Pulls code, rebuilds, restarts services

## 🚀 Usage

These files are used during deployment following [DROPLET-MANUAL.md](../DROPLET-MANUAL.md).

You'll copy them to the server during setup (the manual walks you through it).

## 📋 Quick Reference

```bash
# Restart services
sudo systemctl restart lash-backend
sudo systemctl reload nginx

# View logs
sudo journalctl -u lash-backend -f

# Test Nginx config
sudo nginx -t

# Run deploy script (after setup)
bash /var/www/lash-suite-luxe/deploy/deploy.sh
```
