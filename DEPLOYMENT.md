# Deploying Lash Suite Luxe to Digital Ocean

This guide will walk you through deploying your lash booking application to Digital Ocean App Platform.

## Prerequisites

1. **Digital Ocean Account** - Sign up at https://www.digitalocean.com/
2. **GitHub Account** - Your code needs to be in a GitHub repository
3. **Domain Name** (Optional) - You can use a DigitalOcean-provided domain or your own

## Step 1: Prepare Your Repository

### 1.1 Initialize Git (if not already done)

```bash
cd "C:\Users\sitho\Documents\Build Portfolio\heavely lash studio frontend\lash-suite-luxe"
git init
git add .
git commit -m "Initial commit - ready for deployment"
```

### 1.2 Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named `lash-suite-luxe`
3. **Don't** initialize with README (since you already have code)
4. Copy the repository URL

### 1.3 Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/lash-suite-luxe.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Digital Ocean App Platform

### 2.1 Create New App

1. Log in to https://cloud.digitalocean.com/
2. Click **"Create"** → **"Apps"**
3. Choose **"GitHub"** as your source
4. Authorize Digital Ocean to access your GitHub account
5. Select your `lash-suite-luxe` repository
6. Choose the `main` branch
7. Check **"Autodeploy"** (deploys automatically on push)

### 2.2 Configure Backend Service

1. Digital Ocean will auto-detect your app - click **Editbackend service**
2. Configure the following:
   - **Name**: `lash-backend`
   - **Source Directory**: `/lash-backend`
   - **Build Command**: (leave as auto-detected)
   - **Run Command**: `gunicorn config.wsgi --log-file -`
   - **HTTP Port**: `8000`
   - **Routes**: `/api`
   - **Health Check**: `/api/services/`

### 2.3 Configure Frontend Service

1. Click **"Add Component"** → **"Static Site"**
2. Configure:
   - **Name**: `frontend`
   - **Source Directory**: `/`
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `dist`
   - **Routes**: `/`
   - **Catchall Document**: `index.html`

### 2.4 Add Database

1. Click **"Add Resource"** → **"Database"**
2. Choose **PostgreSQL**
3. Choose a plan:
   - **Basic** ($15/month) - Good for starting
   - **Professional** ($60/month) - For production
4. Name it `lash-db`
5. Digital Ocean will automatically set the `DATABASE_URL` environment variable

## Step 3: Configure Environment Variables

### 3.1 Backend Environment Variables

In the **lash-backend** service settings, add these environment variables:

```plaintext
# Django Settings
DEBUG=False
SECRET_KEY=<generate-a-secure-random-key>
ALLOWED_HOSTS=${APP_DOMAIN}
DATABASE_URL=${lash-db.DATABASE_URL}

# CORS Configuration
CORS_ALLOWED_ORIGINS=${frontend.PUBLIC_URL}

# Email Configuration (for booking confirmations)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=<your-app-password>
DEFAULT_FROM_EMAIL=your-email@gmail.com
```

**To generate a SECRET_KEY:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 3.2 Frontend Environment Variables

In the **frontend** service settings, add:

```plaintext
VITE_API_URL=${lash-backend.PUBLIC_URL}/api
```

## Step 4: Deploy

1. Review your configuration
2. Choose your plan (Start with **Basic** $5/month per service)
3. Click **"Create Resources"**
4. Wait for deployment (usually 5-10 minutes)

## Step 5: Run Database Migrations

After the first deployment:

1. Go to your app in Digital Ocean dashboard
2. Click on the **lash-backend** service
3. Click **"Console"** tab
4. Run these commands:

```bash
python manage.py migrate
python manage.py createsuperuser
# Follow prompts to create admin user

# Optional: Seed with initial data
python manage.py seed_data
```

## Step 6: Configure Custom Domain (Optional)

### 6.1 In Digital Ocean:
1. Go to your app → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain name

### 6.2 In Your Domain Registrar:
Add these DNS records:

```
Type: CNAME
Name: @
Value: <provided-by-digitalocean>

Type: CNAME  
Name: www
Value: <provided-by-digitalocean>
```

## Step 7: Post-Deployment Tasks

### 7.1 Test Your Application
- Visit your frontend URL
- Try booking a service
- Check if emails are sent

### 7.2 Access Admin Panel
- Go to `https://your-app.ondigitalocean.app/api/admin/`
- Log in with your superuser credentials
- Verify services are loaded

### 7.3 Monitor Logs
- In Digital Ocean dashboard, click on each service
- Check **"Runtime Logs"** for any errors

## Costs Breakdown

### Minimum Setup (~$35/month):
- Frontend Static Site: $5/month
- Backend Service: $12/month
- PostgreSQL Database: $15/month
- Bandwidth: Included (1TB)

### Recommended Setup (~$65/month):
- Frontend Static Site: $5/month
- Backend Service: $12/month (or $24 for better performance)
- PostgreSQL Database: $15/month (Basic) or $60 (Professional)
- Custom Domain: Free (if using DO-provided) or ~$12/year for custom

## Troubleshooting

### Build Failures

**Frontend fails to build:**
```bash
# Check package.json scripts
# Ensure all dependencies are in package.json
npm install
npm run build
```

**Backend fails to start:**
```bash
# Check requirements.txt
# Verify Python version in runtime.txt matches
pip install -r requirements.txt
python manage.py check
```

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check database is running in DO dashboard
- Run migrations from console

### CORS Errors
- Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL
- Check that frontend URL is correct in environment variables

### Static Files Not Loading
- Verify `collectstatic` runs during build
- Check whitenoise is in requirements.txt
- Verify `STATIC_ROOT` is set correctly

## Updating Your App

After making changes:

```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Digital Ocean will automatically:
1. Detect the push
2. Build your app
3. Run tests (if configured)
4. Deploy the new version
5. Keep the old version running until new one is ready

## Alternative: Deploy with Droplet

If you prefer more control, you can use a Droplet (VPS):

### Estimated Cost: $12-24/month

1. Create Ubuntu Droplet
2. Install Nginx, PostgreSQL, Python
3. Set up systemd services
4. Configure SSL with Let's Encrypt

This requires more technical knowledge but gives you full control.

## Need Help?

- Digital Ocean Docs: https://docs.digitalocean.com/products/app-platform/
- Community Forum: https://www.digitalocean.com/community/
- Status Page: https://status.digitalocean.com/

## Next Steps

1. [ ] Push code to GitHub
2. [ ] Create Digital Ocean account
3. [ ] Create App Platform app
4. [ ] Configure environment variables
5. [ ] Deploy and test
6. [ ] Set up custom domain
7. [ ] Configure email service
8. [ ] Set up monitoring and alerts
