# Quick Start: Deploy to Digital Ocean

Follow these steps to deploy your Lash Suite Luxe app to Digital Ocean in under 30 minutes.

## ✅ Pre-Deployment Checklist

- [ ] Code is working locally
- [ ] GitHub account created
- [ ] Digital Ocean account created (use this link for $200 credit: https://m.do.co/c/yourreferralcode)

## 📦 Step 1: Push to GitHub (5 minutes)

```powershell
# Navigate to your project
cd "C:\Users\sitho\Documents\Build Portfolio\heavely lash studio frontend\lash-suite-luxe"

# Initialize git (if not done)
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/lash-suite-luxe.git
git branch -M main
git push -u origin main
```

## 🚀 Step 2: Create App on Digital Ocean (10 minutes)

1. **Go to**: https://cloud.digitalocean.com/apps/new
2. **Connect GitHub**: Click "GitHub" → Authorize → Select `lash-suite-luxe`
3. **Auto-detect**: DO will find your app automatically

### Configure Services:

**Backend Service:**
- Name: `lash-backend`
- Type: Web Service
- Source Directory: `/lash-backend`
- Run Command: `gunicorn config.wsgi --log-file -`
- HTTP Port: 8000
- Route: `/api`

**Frontend Service:**
- Name: `frontend`  
- Type: Static Site
- Build Command: `npm install && npm run build`
- Output Directory: `dist`
- Route: `/`

**Database:**
- Add PostgreSQL database
- Name: `lash-db`
- Plan: Basic ($15/month)

## 🔐 Step 3: Set Environment Variables (5 minutes)

### Generate SECRET_KEY:
```powershell
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Backend Environment Variables:
```env
DEBUG=False
SECRET_KEY=<your-generated-secret-key>
ALLOWED_HOSTS=${APP_DOMAIN}
DATABASE_URL=${lash-db.DATABASE_URL}
CORS_ALLOWED_ORIGINS=${frontend.PUBLIC_URL}
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

### Frontend Environment Variables:
```env
VITE_API_URL=${lash-backend.PUBLIC_URL}/api
```

## 🎯 Step 4: Deploy (5 minutes)

1. Click **"Create Resources"**
2. Wait for build (5-10 minutes)
3. You'll get URLs like:
   - Frontend: `https://lash-suite-luxe-xxxxx.ondigitalocean.app`
   - Backend: `https://lash-backend-xxxxx.ondigitalocean.app`

## 🗄️ Step 5: Setup Database (5 minutes)

1. Go to **lash-backend** → **Console**
2. Run:
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_data
```

## ✨ You're Live!

Visit your frontend URL and test booking a service!

### Quick Links:
- **Your App**: Check Digital Ocean dashboard
- **Admin Panel**: `your-backend-url/api/admin/`
- **Logs**: Backend service → Runtime Logs

## 💰 Cost Estimate:
- Frontend: $5/month
- Backend: $12/month
- Database: $15/month
- **Total: ~$32/month**

## 🆘 Troubleshooting:

**Build failed?**
- Check logs in Digital Ocean dashboard
- Verify package.json and requirements.txt

**Can't access site?**
- Wait 5-10 minutes after first deploy
- Check service health in dashboard

**CORS errors?**
- Verify CORS_ALLOWED_ORIGINS includes frontend URL
- Check in backend environment variables

## 📚 Full Documentation:
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🔄 Future Updates:

Just push to GitHub:
```bash
git add .
git commit -m "Your changes"
git push
```

Digital Ocean will auto-deploy! 🎉
