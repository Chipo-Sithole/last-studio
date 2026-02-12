# Setting Up Termius for Your Droplet

Termius is a modern SSH client with a beautiful interface. Perfect for managing your droplet!

## 📥 Part 1: Install Termius (2 mins)

### Download & Install

1. Go to https://termius.com/
2. Click **"Download"**
3. Choose **Windows** version
4. Install the downloaded file
5. Open Termius

**Free version is perfect for our needs!**

## 🔑 Part 2: Add Your SSH Key to Termius (3 mins)

### Step 1: Open Keychain

1. Open Termius
2. Click **"Keychain"** in the left sidebar
3. Click **"Keys"** tab at the top
4. Click **"+ New Key"** button

### Step 2: Import Your SSH Key

**Option A: Let Termius Find It (Easiest)**
1. Click **"Import"**
2. Termius should auto-detect your key at `C:\Users\sitho\.ssh\id_rsa`
3. Select it and click **"Import"**
4. Give it a label: `My SSH Key`
5. Click **"Save"**

**Option B: Manual Import**
1. Click **"Use Private Key"**
2. Click **"Browse"**
3. Navigate to: `C:\Users\sitho\.ssh\`
4. Select `id_rsa` file
5. Label: `My SSH Key`
6. Click **"Save"**

✅ Your SSH key is now in Termius!

## 🌊 Part 3: Add Your Droplet (3 mins)

### Step 1: Create New Host

1. Click **"Hosts"** in left sidebar
2. Click **"+ New Host"** button

### Step 2: Configure Connection

Fill in these details:

**Address:** `104.248.160.206`

**Username:** `root`

**Label:** `Lash Suite Luxe Droplet`

**Key:** Select `My SSH Key` (the one you just added)

**Port:** `22` (default)

**Optional - Add Tags:**
- Click **"Tags"**
- Create tag: `Production` or `Digital Ocean`

### Step 3: Save

Click **"Save"** (top right)

## 🚀 Part 4: Connect to Your Droplet (1 min)

### Connect

1. In **Hosts** view, you'll see your droplet
2. **Double-click** on `Lash Suite Luxe Droplet`
3. Or click on it and press **"Connect"**

**First time connecting:**
- You'll see: "The authenticity of host can't be established"
- Click **"Add and Continue"**

**You're connected!** 🎉

You'll see the Ubuntu terminal prompt:
```
root@lash-suite-luxe:~#
```

## 💡 Termius Tips & Tricks

### Quick Connect
- Press `Ctrl+K` to quickly search and connect to hosts

### Multiple Tabs
- Right-click on host → **"Connect in new tab"**
- Or middle-click on host

### Split Screen
- Right-click on tab → **"Split horizontally"** or **"Split vertically"**
- Great for monitoring logs while deploying!

### SFTP Mode
- Click **"SFTP"** button at bottom of terminal
- Browse and transfer files with GUI
- Drag & drop files between your PC and server!

### Snippets (Saved Commands)
1. Click **"Snippets"** in left sidebar
2. Click **"+ New Snippet"**
3. Save commonly used commands:

```bash
# Restart backend
sudo systemctl restart lash-backend && sudo systemctl reload nginx

# View backend logs
sudo journalctl -u lash-backend -f

# Update app
cd /var/www/lash-suite-luxe && git pull && npm run build
```

### Port Forwarding
- Right-click on host → **"Port forwarding"**
- Forward server ports to your local machine
- Access services running on droplet as if they were local!

### Terminal Settings
1. Click gear icon (⚙️) → **"Settings"**
2. **"Terminal"** tab:
   - Choose color scheme
   - Adjust font size
   - Enable/disable sounds

### Dark Mode
- Settings → **"Appearance"** → Choose theme

## 🎨 Customize Your Setup

### Add Connection Groups

Organize multiple servers:
1. **"Hosts"** → **"+ New Group"**
2. Create groups like:
   - `Production Servers`
   - `Development`
   - `Databases`
3. Drag hosts into groups

### Color Code Connections

Make it easy to identify servers:
1. Edit host
2. Click color circle next to label
3. Choose color (e.g., Red for production, Blue for dev)

## 📋 Your Droplet Details

**Save these for reference:**

```
Label: Lash Suite Luxe Droplet
Address: 104.248.160.206
Username: root
Key: My SSH Key
Tags: Production, Digital Ocean
```

**After creating lashapp user, add second connection:**
```
Label: Lash Suite Luxe (App User)
Address: 104.248.160.206
Username: lashapp
Key: My SSH Key
```

## 🆘 Troubleshooting

### Can't Connect - "Connection refused"

**Check:**
1. Droplet is running (Digital Ocean dashboard)
2. IP address is correct: `104.248.160.206`
3. Firewall allows SSH (should be default)

### "Permission denied (publickey)"

**Solutions:**
1. Check SSH key is selected in host settings
2. Verify key was imported correctly
3. Try connecting via PowerShell to test: `ssh root@104.248.160.206`

### Key Not Found

**Re-import key:**
1. Keychain → Keys
2. Delete old key
3. Import again from `C:\Users\sitho\.ssh\id_rsa`

### Termius Asks for Passphrase

If you set a passphrase when creating your SSH key:
- Enter it when prompted
- Check **"Remember passphrase"** to save it

## 🎯 Now You're Ready!

Your Termius is set up! You can now:

✅ Connect to your droplet with one click
✅ Use beautiful terminal interface
✅ Save commonly used commands
✅ Transfer files with SFTP
✅ Manage multiple connections easily

## 🚀 Next Steps

1. **Connect to your droplet** in Termius
2. Follow **[DROPLET-MANUAL.md](./DROPLET-MANUAL.md)** starting from **Part 1, Step 3**
3. Use Termius terminal for all commands!

---

## 🎓 Termius vs PowerShell

| Feature | Termius | PowerShell |
|---------|---------|------------|
| Interface | Beautiful GUI ✨ | Plain text |
| Saved connections | ✅ Yes | ❌ Manual |
| Multiple tabs | ✅ Yes | New windows |
| SFTP/File transfer | ✅ Built-in | ❌ Need WinSCP |
| Snippets | ✅ Yes | ❌ Manual |
| Port forwarding | ✅ Easy GUI | ❌ Complex commands |
| Themes/colors | ✅ Many options | Limited |
| **Best for** | **Daily use** 🎯 | Quick one-offs |

**Use Termius for deployment!** 🚀

---

**Ready to deploy? Connect to your droplet and let's start!**
