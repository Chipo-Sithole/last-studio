# Quick Start: Droplet Creation Checklist

## 📋 Before You Start

### ✅ Step 1: Setup SSH Key (5 minutes)
**Read:** [SSH-KEYS-GUIDE.md](./SSH-KEYS-GUIDE.md)

```powershell
# In PowerShell:
ssh-keygen -t rsa -b 4096 -C "your-email@gmail.com"
cat ~\.ssh\id_rsa.pub
# Copy the output

# In Digital Ocean:
Settings → Security → SSH Keys → Add SSH Key
# Paste and save
```

## 🌊 Digital Ocean Droplet Settings

### Image
- ✅ **Ubuntu 22.04 (LTS) x64**

### Plan
- ✅ **Droplet Type**: Basic
- ✅ **Size**: Regular - $18/month
  - 2GB RAM
  - 2 vCPUs
  - 50GB SSD

### Datacenter Region
- ✅ **London** or **Frankfurt** (closest to Zimbabwe)

### ❌ Additional Options - Add a Database
**UNCHECK THIS!** ❌

**Why?**
- "Add a database" = Managed Database = $15/month EXTRA
- We'll install PostgreSQL FREE on the droplet
- Total cost stays $18/month (not $33/month)

### ✅ Authentication
**Choose ONE:**

**Option 1: SSH Key (Recommended)** ✅
- More secure
- No password needed
- Check box next to your key name

**Option 2: Password**
- Less secure
- Type password every time
- Set a strong password

### Hostname
- ✅ `lash-suite-luxe`

## 💰 Cost Breakdown

### What You're Paying For:
```
Droplet ($18/month):
  ✅ Ubuntu Server
  ✅ 2GB RAM
  ✅ 2 CPUs
  ✅ 50GB Storage
  ✅ Network/Bandwidth
  
We'll Install on Droplet (FREE):
  ✅ PostgreSQL Database
  ✅ Nginx Web Server
  ✅ Python/Django Backend
  ✅ Node.js/React Frontend
  ✅ SSL Certificate

Total: $18/month
```

### What NOT to Add:
```
❌ Managed Database ($15/month) = $33 total
❌ Backups ($3.60/month)
❌ Monitoring ($2/month)

We'll do these ourselves!
```

## 🎯 After Droplet is Created

1. **Note your Droplet IP** (shows on droplet page)
2. **SSH into droplet:**
   ```powershell
   ssh root@YOUR_DROPLET_IP
   ```
3. **Follow [DROPLET-MANUAL.md](./DROPLET-MANUAL.md)** step by step

## 🔍 Visual Guide

### ✅ Correct Droplet Creation
```
Choose an image: Ubuntu 22.04 LTS ✅
Choose a plan: $18/month (2GB) ✅
Choose a datacenter: London ✅

Additional options:
[ ] IPv6                          ← Skip
[ ] User data                     ← Skip
[ ] Monitoring                    ← Skip (free tier is fine)

Add a database:
[ ] PostgreSQL                    ← ❌ UNCHECK THIS!
[ ] MySQL
[ ] Redis

Authentication:
[x] SSH Key: My Windows PC        ← ✅ CHECK THIS!
[ ] Password

Finalize:
Hostname: lash-suite-luxe         ← ✅ Name it

[Create Droplet] ← Click
```

### ❌ Common Mistakes

**Mistake 1: Adding Managed Database**
```
Add a database:
[x] PostgreSQL                    ← ❌ DON'T CHECK!

Result: $18 + $15 = $33/month
```

**Mistake 2: Wrong Size**
```
CPU options:
[ ] Basic - $6/month (1GB)        ← ❌ Too small!
[x] Basic - $18/month (2GB)       ← ✅ Correct!
```

**Mistake 3: Using Password Instead of SSH Key**
```
Authentication:
[ ] SSH Key                       ← ❌ Less secure
[x] Password                      

Better:
[x] SSH Key                       ← ✅ More secure!
[ ] Password
```

## 🆘 Quick Troubleshooting

### "Can't connect via SSH"
```powershell
# Check SSH key
ls ~\.ssh\

# Try with password (if you set one)
ssh root@YOUR_DROPLET_IP

# Check firewall in Digital Ocean dashboard
```

### "How do I find my droplet IP?"
```
Digital Ocean Dashboard → Droplets → 
Your droplet → IP address is shown prominently
```

### "I accidentally added managed database"
```
Solution:
1. Destroy the droplet (no charge yet)
2. Create new one WITHOUT database
3. Takes 2 minutes to recreate
```

## ✅ Verification Checklist

Before proceeding to [DROPLET-MANUAL.md](./DROPLET-MANUAL.md):

- [ ] SSH key generated and added to Digital Ocean
- [ ] Droplet created with Ubuntu 22.04
- [ ] Droplet size: $18/month (2GB RAM)
- [ ] **DID NOT** add managed database
- [ ] Can SSH into droplet: `ssh root@YOUR_DROPLET_IP`
- [ ] Noted droplet IP address

🎉 **Ready to deploy!** Continue with [DROPLET-MANUAL.md](./DROPLET-MANUAL.md)

---

## 📊 Summary

| Item | Your Choice | Cost |
|------|-------------|------|
| Ubuntu Droplet | 2GB RAM, 2 CPU | $18/month |
| PostgreSQL | Install on droplet | $0 (included) |
| Nginx | Install on droplet | $0 (included) |
| SSL Certificate | Let's Encrypt | $0 (free) |
| **Total** | | **$18/month** |

vs.

| Item | Other Option | Cost |
|------|--------------|------|
| App Platform | Frontend + Backend | $17/month |
| Managed Database | PostgreSQL | $15/month |
| **Total** | | **$32/month** |

**You save: $168/year with Droplet!** 💰
