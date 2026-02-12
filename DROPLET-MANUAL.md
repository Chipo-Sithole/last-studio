# Manual Step-by-Step Droplet Deployment

Deploy Lash Suite Luxe to Digital Ocean Droplet - Learning every step!

## 📋 What You'll Learn

- Creating and securing a Linux server
- Installing and configuring PostgreSQL database
- Setting up Python and Node.js environments
- Configuring Nginx as a reverse proxy
- Managing Linux services with systemd
- Setting up SSL certificates
- Deploying full-stack applications

## 🎯 Recommended Droplet

**Specs**: Basic - $18/month
- 2GB RAM
- 2 vCPUs  
- 50GB SSD Storage
- Ubuntu 22.04 LTS

## 🚀 Part 1: Create and Secure Droplet (15 mins)

### Step 1: Create Droplet

1. Log in to https://cloud.digitalocean.com/
2. Click **Create** → **Droplets**
3. Choose:
   - **Image**: Ubuntu 22.04 (LTS) x64
   - **Droplet Type**: Basic
   - **CPU options**: Regular - $18/month (2GB / 2 vCPUs)
   - **Datacenter**: Choose closest to Zimbabwe (e.g., London, Frankfurt)
   - **Authentication**: 
     - Choose **Password** (easier for learning)
     - Set a strong password
   - **Hostname**: `lash-suite-luxe`
4. Click **Create Droplet**
5. **Wait 1-2 minutes** - Note your droplet IP address

### Step 2: Connect via SSH

**On Windows (PowerShell):**
```powershell
ssh root@YOUR_DROPLET_IP
```

Enter your password when prompted.

**First login tip:** Type `yes` when asked about authenticity.

### Step 3: Update System

```bash
# Update package lists
apt update

# Upgrade all packages
apt upgrade -y

# This may take 3-5 minutes
```

**What you're learning:** Ubuntu package management with `apt`

### Step 4: Create Non-Root User

```bash
# Create user
adduser lashapp

# Follow prompts - set password and info (can skip most)

# Add to sudo group (can run admin commands)
usermod -aG sudo lashapp

# Switch to new user
su - lashapp
```

**What you're learning:** Linux users and permissions - never run apps as root!

### Step 5: Setup Firewall

```bash
# Allow SSH (so you don't lock yourself out!)
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

**What you're learning:** Basic server security with UFW (Uncomplicated Firewall)

---

## 🗄️ Part 2: Install PostgreSQL (10 mins)

### Step 1: Install PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Check it's running
sudo systemctl status postgresql
```

Press `q` to exit status view.

**What you're learning:** Installing and managing system services

### Step 2: Create Database and User

```bash
# Switch to postgres user
sudo -i -u postgres

# Open PostgreSQL prompt
psql
```

You'll see: `postgres=#`

Now run these SQL commands:

```sql
-- Create database
CREATE DATABASE lash_suite_luxe;

-- Create user with password
CREATE USER lashapp WITH PASSWORD 'YourSecurePassword123!';

-- Configure user
ALTER ROLE lashapp SET client_encoding TO 'utf8';
ALTER ROLE lashapp SET default_transaction_isolation TO 'read committed';
ALTER ROLE lashapp SET timezone TO 'UTC';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE lash_suite_luxe TO lashapp;

-- PostgreSQL 15+ specific: grant schema permissions
\c lash_suite_luxe
GRANT ALL ON SCHEMA public TO lashapp;

-- Exit
\q
```

Exit postgres user:
```bash
exit
```

**What you're learning:** PostgreSQL database administration

### Step 3: Test Database Connection

```bash
# Try connecting with your new user
psql -U lashapp -d lash_suite_luxe -h localhost -W
```

Enter password when prompted. If you see `lash_suite_luxe=>`, it worked! Type `\q` to exit.

**Troubleshooting:** If connection fails, edit `/etc/postgresql/14/main/pg_hba.conf` and ensure there's a line like:
```
local   all   all   md5
```

---

## 🐍 Part 3: Install Python & Setup Backend (15 mins)

### Step 1: Install Python

```bash
# Install Python and tools
sudo apt install python3.11 python3.11-venv python3-pip -y

# Verify
python3.11 --version
```

**What you're learning:** Installing specific Python versions

### Step 2: Clone Repository

```bash
# Create web directory
sudo mkdir -p /var/www
cd /var/www

# Clone your repo
sudo git clone https://github.com/Chipo-Sithole/last-studio.git lash-suite-luxe

# Change ownership to lashapp user
sudo chown -R lashapp:lashapp /var/www/lash-suite-luxe

# Navigate to project
cd /var/www/lash-suite-luxe
```

**What you're learning:** Linux file permissions and ownership

### Step 3: Setup Python Virtual Environment

```bash
# Navigate to backend
cd /var/www/lash-suite-luxe/lash-backend

# Create virtual environment
python3.11 -m venv venv

# Activate it
source venv/bin/activate

# You'll see (venv) in your prompt

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt

# This takes 2-3 minutes
```

**What you're learning:** Python virtual environments for dependency isolation

### Step 4: Create Backend Environment File

```bash
# Create .env file
nano .env
```

Paste this (update the values):

```env
DEBUG=False
SECRET_KEY=PASTE_SECRET_KEY_HERE
ALLOWED_HOSTS=YOUR_DROPLET_IP,your-domain.com
DATABASE_URL=postgresql://lashapp:YourSecurePassword123!@localhost:5432/lash_suite_luxe
CORS_ALLOWED_ORIGINS=http://YOUR_DROPLET_IP,https://your-domain.com
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=heavenlylashstudiozw@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
DEFAULT_FROM_EMAIL=heavenlylashstudiozw@gmail.com
```

**Generate SECRET_KEY:**
In another terminal, run:
```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the output and paste it as SECRET_KEY.

**Nano tips:**
- Paste: Right-click or Ctrl+Shift+V
- Save: Ctrl+O, then Enter
- Exit: Ctrl+X

**What you're learning:** Environment-based configuration

### Step 5: Run Migrations and Setup

```bash
# Make sure you're in /var/www/lash-suite-luxe/lash-backend
# And virtual environment is activated

# Run migrations
python manage.py migrate

# Create static files directory
python manage.py collectstatic --noinput

# Seed database with services
python manage.py seed_data

# Create admin user
python manage.py createsuperuser
```

Follow prompts to create your admin account.

**What you're learning:** Django management commands

### Step 6: Test Backend

```bash
# Test that backend runs
python manage.py runserver 0.0.0.0:8000
```

Visit `http://YOUR_DROPLET_IP:8000/api/services/` in your browser.

You should see JSON with your services!

Press `Ctrl+C` to stop the server.

**What you're learning:** Testing before deploying to production

---

## ⚛️ Part 4: Install Node.js & Build Frontend (10 mins)

### Step 1: Install Node.js

```bash
# Add Node.js 20 repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install nodejs -y

# Verify
node --version
npm --version
```

**What you're learning:** Installing Node.js on Linux

### Step 2: Create Frontend Environment

```bash
cd /var/www/lash-suite-luxe

# Create .env for frontend
nano .env
```

Paste:
```env
VITE_API_URL=http://YOUR_DROPLET_IP/api
```

**Later we'll change this to https://your-domain.com/api**

Save and exit.

### Step 3: Build Frontend

```bash
# Install dependencies
npm install

# This takes 3-5 minutes

# Build for production
npm run build

# You'll see a 'dist' folder created
ls -la dist
```

**What you're learning:** Building React apps for production

---

## 🌐 Part 5: Install & Configure Nginx (15 mins)

### Step 1: Install Nginx

```bash
# Install
sudo apt install nginx -y

# Start Nginx
sudo systemctl start nginx

# Enable on boot
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

Visit `http://YOUR_DROPLET_IP` - you should see "Welcome to nginx"!

**What you're learning:** Web server management

### Step 2: Create Nginx Configuration

```bash
# Create config file
sudo nano /etc/nginx/sites-available/lash-suite-luxe
```

Paste this (replace `YOUR_DROPLET_IP` with your actual IP):

```nginx
upstream backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name YOUR_DROPLET_IP;

    client_max_body_size 10M;

    # Logging
    access_log /var/log/nginx/lash-access.log;
    error_log /var/log/nginx/lash-error.log;

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django admin
    location /admin/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django static files
    location /static/ {
        alias /var/www/lash-suite-luxe/lash-backend/staticfiles/;
    }

    # Frontend
    location / {
        root /var/www/lash-suite-luxe/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

Save and exit.

**What you're learning:** Nginx reverse proxy configuration

### Step 3: Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/lash-suite-luxe /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Should say "syntax is ok" and "test is successful"

# Restart Nginx
sudo systemctl restart nginx
```

**What you're learning:** Nginx site management

---

## 🔧 Part 6: Setup Gunicorn as a Service (15 mins)

### Step 1: Create Log Directory

```bash
sudo mkdir -p /var/log/lash-backend
sudo chown lashapp:lashapp /var/log/lash-backend
```

### Step 2: Create Gunicorn Service File

```bash
sudo nano /etc/systemd/system/lash-backend.service
```

Paste:

```ini
[Unit]
Description=Lash Suite Luxe Backend
After=network.target postgresql.service

[Service]
Type=notify
User=lashapp
Group=www-data
WorkingDirectory=/var/www/lash-suite-luxe/lash-backend
Environment="PATH=/var/www/lash-suite-luxe/lash-backend/venv/bin"

ExecStart=/var/www/lash-suite-luxe/lash-backend/venv/bin/gunicorn \
          --workers 3 \
          --bind 127.0.0.1:8000 \
          --timeout 60 \
          --access-logfile /var/log/lash-backend/access.log \
          --error-logfile /var/log/lash-backend/error.log \
          --log-level info \
          config.wsgi:application

Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Save and exit.

**What you're learning:** Systemd service management - keeping your app running!

### Step 3: Start the Service

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable service (start on boot)
sudo systemctl enable lash-backend

# Start service
sudo systemctl start lash-backend

# Check status
sudo systemctl status lash-backend
```

Should show "active (running)" in green!

**What you're learning:** Managing application as a Linux service

### Step 4: Test Everything

Visit in your browser:
- **Frontend**: `http://YOUR_DROPLET_IP`
- **API**: `http://YOUR_DROPLET_IP/api/services/`
- **Admin**: `http://YOUR_DROPLET_IP/admin/`

Everything should work! 🎉

---

## 🔐 Part 7: Setup Domain & SSL (Optional - 20 mins)

### Prerequisites
- You need a domain name (e.g., from Namecheap)

### Step 1: Point Domain to Droplet

In your domain registrar's DNS settings, add:

```
Type: A
Name: @
Value: YOUR_DROPLET_IP
TTL: 300

Type: A
Name: www
Value: YOUR_DROPLET_IP
TTL: 300
```

**Wait 5-60 minutes for DNS to propagate**

### Step 2: Update Nginx Config

```bash
sudo nano /etc/nginx/sites-available/lash-suite-luxe
```

Change `server_name YOUR_DROPLET_IP;` to:
```nginx
server_name your-domain.com www.your-domain.com;
```

### Step 3: Update Environment Files

```bash
# Backend
nano /var/www/lash-suite-luxe/lash-backend/.env
```
Update:
```env
ALLOWED_HOSTS=your-domain.com,www.your-domain.com,YOUR_DROPLET_IP
CORS_ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

```bash
# Frontend
nano /var/www/lash-suite-luxe/.env
```
Update:
```env
VITE_API_URL=https://your-domain.com/api
```

### Step 4: Rebuild Frontend

```bash
cd /var/www/lash-suite-luxe
npm run build
```

### Step 5: Install SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Follow prompts:
- Enter email
- Agree to terms
- Choose to redirect HTTP to HTTPS (recommended)

**Certbot automatically:**
- Gets SSL certificate
- Updates Nginx config
- Sets up auto-renewal

### Step 6: Restart Services

```bash
sudo systemctl restart lash-backend
sudo systemctl reload nginx
```

Visit `https://your-domain.com` - You have SSL! 🔒

**What you're learning:** SSL/TLS certificates and web security

---

## 🎓 Post-Deployment Tasks

### Monitor Your App

```bash
# Check backend logs
sudo journalctl -u lash-backend -f

# Check Nginx errors
sudo tail -f /var/log/nginx/lash-error.log

# Check system resources
htop  # Install with: sudo apt install htop
```

### Restart Services

```bash
# Restart backend
sudo systemctl restart lash-backend

# Reload Nginx (no downtime)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx
```

### Update Your App

When you push changes to GitHub:

```bash
# SSH into droplet
ssh lashapp@YOUR_DROPLET_IP

# Navigate to project
cd /var/www/lash-suite-luxe

# Pull changes
git pull origin main

# Update backend
cd lash-backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
deactivate

# Update frontend
cd /var/www/lash-suite-luxe
npm install
npm run build

# Restart services
sudo systemctl restart lash-backend
sudo systemctl reload nginx
```

---

## 🆘 Troubleshooting

### Can't access website
```bash
# Check services
sudo systemctl status lash-backend
sudo systemctl status nginx

# Check if ports are open
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :8000
```

### Backend won't start
```bash
# Check logs
sudo journalctl -u lash-backend -n 50 --no-pager

# Test manually
cd /var/www/lash-suite-luxe/lash-backend
source venv/bin/activate
python manage.py check
python manage.py runserver 0.0.0.0:8000
```

### Database connection errors
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
psql -U lashapp -d lash_suite_luxe -h localhost -W

# Check .env DATABASE_URL is correct
```

### Frontend shows 404
```bash
# Rebuild
cd /var/www/lash-suite-luxe
npm run build

# Check dist folder exists
ls -la dist/

# Restart Nginx
sudo systemctl reload nginx
```

---

## 📚 What You Learned

✅ Linux server administration
✅ PostgreSQL database setup
✅ Python virtual environments
✅ Django deployment
✅ Node.js and npm
✅ Nginx reverse proxy
✅ Systemd services
✅ SSL/TLS with Let's Encrypt
✅ DNS configuration
✅ Full-stack deployment

## 🎯 Next Steps

1. [ ] Setup automatic backups
2. [ ] Configure monitoring
3. [ ] Setup staging environment
4. [ ] Implement CI/CD
5. [ ] Optimize performance

---

**Congratulations! You've deployed a full-stack application! 🎉**

Keep these commands handy:
```bash
# View services status
sudo systemctl status lash-backend nginx postgresql

# View logs
sudo journalctl -u lash-backend -f

# Restart everything
sudo systemctl restart lash-backend && sudo systemctl reload nginx
```
