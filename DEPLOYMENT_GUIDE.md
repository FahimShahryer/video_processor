# Free Deployment Guide - Render.com

## 🚀 Deploy Video Trimmer Pro for FREE

### Prerequisites:
- GitHub account
- Git installed on your computer
- This project code

---

## Step-by-Step Deployment

### 1️⃣ **Create GitHub Repository**

1. Go to [GitHub.com](https://github.com)
2. Sign up / Log in
3. Click **"New"** (green button)
4. Repository name: `video-trimmer-pro`
5. Make it **Public** (required for free tier)
6. **Don't** add README, .gitignore, or license (we already have them)
7. Click **"Create repository"**

### 2️⃣ **Push Code to GitHub**

Open terminal in `video_trimmer_ui` folder:

```bash
# Navigate to project
cd d:\Projects\video_trimmer\video_trimmer_ui

# Initialize git (if not already)
git init

# Add remote (REPLACE with YOUR username)
git remote add origin https://github.com/YOUR_USERNAME/video-trimmer-pro.git

# Add all files
git add .

# Commit
git commit -m "Initial commit - Video Trimmer Pro"

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ Your code is now on GitHub!**

### 3️⃣ **Sign Up on Render.com**

1. Go to [Render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (easiest way)
4. Authorize Render to access your GitHub

### 4️⃣ **Create Web Service**

1. On Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select: `video-trimmer-pro`
5. Click **"Connect"**

### 5️⃣ **Configure Service**

Fill in the form:

**Basic Settings:**
- **Name**: `video-trimmer-pro` (or any name you like)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: Leave empty (or type `.`)
- **Runtime**: **Python 3**

**Build Settings:**
- **Build Command**:
  ```bash
  pip install -r requirements.txt && apt-get update && apt-get install -y ffmpeg
  ```

- **Start Command**:
  ```bash
  python main.py
  ```

**Instance Type:**
- Select: **Free** ⭐

**Advanced (Optional):**
- **Auto-Deploy**: Yes (recommended)

### 6️⃣ **Deploy!**

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Watch the build logs

**You'll see:**
```
==> Downloading buildpack
==> Installing Python 3.11
==> Installing dependencies
==> Installing FFmpeg
==> Starting your service
==> Deploy live at: https://video-trimmer-pro.onrender.com
```

### 7️⃣ **Access Your App** 🎉

Once deployed:
- Your URL: `https://video-trimmer-pro.onrender.com`
- Click the URL to open your app
- Start using it!

---

## ⚙️ **How It Works**

### Free Tier Features:
- ✅ **512 MB RAM**
- ✅ **Shared CPU**
- ✅ **Automatic HTTPS**
- ✅ **Auto-deploy on git push**
- ✅ **750 hours/month free**

### Limitations:
- ⚠️ **Sleeps after 15 min inactivity**
- ⚠️ **Wakes up on request** (15-30 sec delay)
- ⚠️ **Limited storage** (temporary)
- ⚠️ **No persistent storage** (uploads deleted on restart)

### Good For:
- ✅ Personal use
- ✅ Testing
- ✅ Portfolio projects
- ✅ Low-traffic apps

---

## 🔧 **Troubleshooting**

### Build Failed: FFmpeg Installation
If FFmpeg install fails, try alternative method:

Update `render.yaml`:
```yaml
services:
  - type: web
    name: video-trimmer-pro
    env: python
    buildCommand: |
      pip install -r requirements.txt
      apt-get update
      apt-get install -y ffmpeg
    startCommand: python main.py
```

### App Won't Start
Check logs in Render dashboard:
1. Click on your service
2. Go to "Logs" tab
3. Look for errors

Common issues:
- Missing `jinja2` in requirements.txt
- Port not set correctly (we fixed this)
- FFmpeg not installed

### Video Upload Fails
Free tier has limited storage. Try:
- Smaller videos (<100MB)
- Delete old uploads regularly
- Use `/api/videos` endpoint to check uploads

### App Sleeps (Slow First Load)
This is normal for free tier:
- First request after 15 min = slow (wakes up)
- Subsequent requests = fast
- Use paid tier ($7/month) to prevent sleeping

---

## 🔄 **Updating Your App**

After making changes locally:

```bash
# Make your changes
# ...

# Add and commit
git add .
git commit -m "Your change description"

# Push to GitHub
git push

# Render auto-deploys! ✨
```

Render will automatically rebuild and redeploy.

---

## 💰 **Free vs Paid**

### Free Tier ($0/month):
- 512 MB RAM
- Sleeps after 15 min
- 750 hours/month
- Perfect for: Testing, personal use

### Starter ($7/month):
- 512 MB RAM
- **No sleeping!**
- Always on
- Perfect for: Real usage

### Pro ($25/month):
- 2 GB RAM
- More CPU
- Better performance
- Perfect for: Production

---

## 🌐 **Alternative Free Platforms**

If Render doesn't work, try these:

### 1. **Railway.app**
- $5 free credits/month
- Easy deployment
- Similar to Render

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### 2. **Fly.io**
- Free tier with 3 VMs
- Good performance
- More complex setup

```bash
# Install Fly CLI
# Follow: https://fly.io/docs/hands-on/install-flyctl/

# Login
fly auth login

# Deploy
fly launch
```

### 3. **Hugging Face Spaces** 🤗
- Completely free
- Built for ML apps
- Public by default

Create `app.py` → Upload to HF Spaces

---

## 📝 **Important Notes**

### Storage Warning:
Free hosting has **temporary storage**:
- Uploaded videos are deleted on restart
- Output videos are deleted on restart
- Don't use for permanent storage

### Solution:
Implement cloud storage:
- AWS S3 (free tier)
- Cloudinary (free tier)
- Google Cloud Storage (free tier)

### Performance:
Free tier is slower than paid:
- Video processing takes longer
- Limited CPU/RAM
- For heavy use, consider paid tier

---

## ✅ **Checklist Before Deploying**

- [ ] Code pushed to GitHub
- [ ] `render.yaml` created
- [ ] `runtime.txt` created
- [ ] `requirements.txt` includes all dependencies
- [ ] `.gitignore` properly set up
- [ ] FFmpeg in build command
- [ ] Port configured from environment variable
- [ ] Render account created
- [ ] Repository connected
- [ ] Service configured
- [ ] Deploy clicked!

---

## 🎉 **Success!**

Once deployed, you'll have:
- ✅ Live URL (e.g., `https://video-trimmer-pro.onrender.com`)
- ✅ Automatic HTTPS
- ✅ Auto-deploy on git push
- ✅ Free hosting forever (with limitations)

**Share your app with friends!** 🚀

---

## 📞 **Need Help?**

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Video.js Docs**: https://videojs.com

---

**Happy Deploying! 🎬✨**
