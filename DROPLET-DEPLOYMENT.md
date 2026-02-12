# Deploy to Digital Ocean Droplet

This guide walks you through deploying Lash Suite Luxe on a Digital Ocean Droplet for maximum control and cost efficiency.

## 💰 Cost: $12-18/month

- **Basic Droplet** (2GB RAM): $12/month ✅ Recommended
- **Optional Managed Database**: +$15/month (or use Droplet's PostgreSQL)
- **Total**: $12-27/month vs $32+ for App Platform

## ✨ What You Get

- Full SSH access
- Complete server control
- Host frontend + backend on one server
- Custom configurations
- Learn server management

## 📋 Prerequisites

1. **Digital Ocean Account** - Sign up at https://www.digitalocean.com/
2. **Domain Name** (Optional but recommended) - e.g., from Namecheap, GoDaddy
3. **SSH Client** - Built into Windows 10+, macOS, Linux

## 🚀 Part 1: Create Droplet (5 minutes)

### Step 1: Create Droplet

1. Log in to https://cloud.digitalocean.com/
2. Click **"Create"** → **"Droplets"**
3. Choose configuration:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic
   - **CPU**: Regular - $12/month (2GB RAM, 1 CPU) ✅
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH Key (recommended) or Password
   - **Hostname**: lash-suite-luxe

4. Click **"Create Droplet"**
5. Wait 1-2 minutes for droplet to start

### Step 2: Point Domain to Droplet (if using custom domain)

In your domain registrar (Namecheap, GoDaddy, etc.):

```
Type: A Record
Name: @
Value: YOUR_DROPLET_IP
TTL: 300

Type: A Record
Name: www
Value: YOUR_DROPLET_IP
TTL: 300
```

*DNS can take 5-60 minutes to propagate*

## 🔧 Part 2: Initial Server Setup (10 minutes)

### Step 1: Connect to Droplet

```bash
ssh root@YOUR_DROPLET_IP
```

### Step 2: Download and Run Setup Script

```bash
# Download setup script
curl -o setup.sh https://raw.githubusercontent.com/Chipo-Sithole/last-studio/main/deploy/setup.sh

# Make it executable
chmod +x setup.sh

# Run setup (takes 5-10 minutes)
./setup.sh
```

The script will:
- Install Python, Node.js, PostgreSQL, Nginx
- Create database and user
- Clone your repository
- Install dependencies
- Setup services

### Step 3: Configure Environment Variables

```bash
# Edit backend .env
nano /var/www/lash-suite-luxe/lash-backend/.env
```

Update these values:
```env
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,YOUR_DROPLET_IP
DATABASE_URL=postgresql://lashapp:YOUR_SECURE_PASSWORD@localhost:5432/lash_suite_luxe
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
```

**Generate secure database password:**
```bash
openssl rand -base64 32
```

```bash
# Edit frontend .env
nano /var/www/lash-suite-luxe/.env
```

Update:
```env
VITE_API_URL=https://your-domain.com/api
```

### Step 4: Update PostgreSQL Password

```bash
sudo -u postgres psql
```

```sql
ALTER USER lashapp WITH PASSWORD 'YOUR_SECURE_PASSWORD';
\q
```

### Step 5: Rebuild Frontend with Correct API URL

```bash
cd /var/www/lash-suite-luxe
sudo -u lashapp npm run build
```

### Step 6: Update Nginx Configuration

```bash
nano /etc/nginx/sites-available/lash-suite-luxe
```

Replace `your-domain.com` with your actual domain or droplet IP

### Step 7: Restart Services

```bash
sudo systemctl restart lash-backend
sudo systemctl reload nginx
```

## 🔐 Part 3: Setup SSL Certificate (5 minutes)

### Free SSL with Let's Encrypt

```bash
# Install certbot (if not already installed)
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow prompts:
- Enter email address
- Agree to terms
- Choose to redirect HTTP to HTTPS (recommended)

**Certificate auto-renews every 90 days**

## 👤 Part 4: Create Admin User (2 minutes)

```bash
cd /var/www/lash-suite-luxe/lash-backend
sudo -u lashapp venv/bin/python manage.py createsuperuser
```

Follow prompts to create admin account.

## ✅ Part 5: Test Your Deployment

### Test URLs:

1. **Frontend**: https://your-domain.com
2. **API**: https://your-domain.com/api/services/
3. **Admin**: https://your-domain.com/admin/

### Check Services:

```bash
# Backend status
sudo systemctl status lash-backend

# Nginx status
sudo systemctl status nginx

# View backend logs
sudo journalctl -u lash-backend -f

# View Nginx logs
sudo tail -f /var/log/nginx/lash-suite-luxe-error.log
```

## 🔄 Updating Your App

After pushing changes to GitHub:

```bash
# SSH into droplet
ssh root@YOUR_DROPLET_IP

# Run deploy script
cd /var/www/lash-suite-luxe
bash deploy/deploy.sh
```

Or manually:

```bash
cd /var/www/lash-suite-luxe

# Pull changes
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

# Restart
sudo systemctl restart lash-backend
sudo systemctl reload nginx
```

## 📊 Monitoring & Maintenance

### View Logs

```bash
# Backend logs
sudo journalctl -u lash-backend -f

# Nginx access logs
sudo tail -f /var/log/nginx/lash-suite-luxe-access.log

# Nginx error logs
sudo tail -f /var/log/nginx/lash-suite-luxe-error.log
```

### Database Backup

```bash
# Create backup
sudo -u postgres pg_dump lash_suite_luxe > backup_$(date +%Y%m%d).sql

# Restore backup
sudo -u postgres psql lash_suite_luxe < backup_20260212.sql
```

### System Updates

```bash
# Update packages weekly
sudo apt update && sudo apt upgrade -y

# Reboot if needed
sudo reboot
```

## 🔒 Security Best Practices

### 1. Setup Firewall

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Disable Root Login

```bash
# Create sudo user for yourself
adduser yourname
usermod -aG sudo yourname

# Edit SSH config
nano /etc/ssh/sshd_config

# Set:
PermitRootLogin no
PasswordAuthentication no  # If using SSH keys

# Restart SSH
sudo systemctl restart sshd
```

### 3. Setup Fail2Ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. Regular Backups

Setup automatic daily database backups:

```bash
# Create backup script
sudo nano /usr/local/bin/backup-lash-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/lash-suite-luxe"
mkdir -p $BACKUP_DIR
sudo -u postgres pg_dump lash_suite_luxe | gzip > $BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

```bash
chmod +x /usr/local/bin/backup-lash-db.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-lash-db.sh") | crontab -
```

## 🆘 Troubleshooting

### "Bad Gateway" Error

```bash
# Check backend is running
sudo systemctl status lash-backend

# Restart backend
sudo systemctl restart lash-backend

# Check logs
sudo journalctl -u lash-backend -n 50
```

### Frontend Shows Blank Page

```bash
# Rebuild frontend
cd /var/www/lash-suite-luxe
sudo -u lashapp npm run build
sudo systemctl reload nginx
```

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test database connection
sudo -u postgres psql lash_suite_luxe -c "SELECT 1;"

# Check .env DATABASE_URL matches PostgreSQL credentials
```

### Can't Access Website

```bash
# Check Nginx is running
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Check firewall
sudo ufw status
```

## 📈 Performance Optimization

### Enable Nginx Caching

Add to `/etc/nginx/sites-available/lash-suite-luxe`:

```nginx
# Cache configuration
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;

location /api/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_bypass $http_cache_control;
    add_header X-Proxy-Cache $upstream_cache_status;
    # ... rest of config
}
```

### Increase Gunicorn Workers

Edit `/etc/systemd/system/lash-backend.service`:

```
--workers 4  # Change from 3 to 4 for 2GB droplet
```

## 🎓 Learning Resources

- **Nginx**: https://nginx.org/en/docs/
- **Gunicorn**: https://docs.gunicorn.org/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Systemd**: https://www.freedesktop.org/software/systemd/man/
- **Let's Encrypt**: https://letsencrypt.org/docs/

## 💡 Tips

1. **Monitor disk space**: Run `df -h` regularly
2. **Monitor memory**: Run `free -m` to check RAM usage
3. **Setup monitoring**: Consider using Digital Ocean Monitoring or UptimeRobot
4. **Enable automatic updates**: `sudo apt install unattended-upgrades`
5. **Setup email notifications**: For service failures

## 🎯 Next Steps

- [ ] Setup automated backups
- [ ] Configure email alerts for errors
- [ ] Setup monitoring (UptimeRobot, etc.)
- [ ] Configure CDN for static assets (optional)
- [ ] Setup staging environment (optional)

---

**Need Help?**
- Digital Ocean Community: https://www.digitalocean.com/community/
- Documentation: https://docs.digitalocean.com/
- Server status: `sudo systemctl status lash-backend nginx postgresql`
