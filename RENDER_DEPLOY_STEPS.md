# 🚀 Deploy to Render.com - Quick Guide

## ✅ Step 1: Code is on GitHub!

Your repository: **https://github.com/FahimShahryer/video_processor**

All files are pushed and ready to deploy! 🎉

---

## 📋 Step 2: Deploy to Render.com

### 1. Go to Render.com
Visit: **https://render.com**

### 2. Sign Up / Log In
- Click **"Get Started for Free"**
- Sign up with **GitHub** (easiest method)
- Authorize Render to access your repositories

### 3. Create New Web Service
- Click **"New +"** button (top right)
- Select **"Web Service"**

### 4. Connect Repository
- Click **"Connect a repository"**
- Find: **FahimShahryer/video_processor**
- Click **"Connect"**

### 5. Configure Service

Fill in these settings:

**Basic Info:**
```
Name: video-processor
Region: Oregon (US West)
Branch: main
```

**Build & Start:**
```
Build Command: bash render-build.sh
Start Command: python main.py
```

**Instance Type:**
```
Plan: Free
```

**Environment Variables:**
```
PYTHON_VERSION: 3.11.0
```

### 6. Click "Create Web Service"

Wait 5-10 minutes for deployment...

### 7. Your App is Live! 🎉

Render will give you a URL like:
```
https://video-processor-xxxx.onrender.com
```

---

## 📝 What Happens During Deployment:

1. ✅ Render clones your GitHub repo
2. ✅ Runs `render-build.sh`:
   - Installs Python dependencies
   - Installs FFmpeg
3. ✅ Starts your app with `python main.py`
4. ✅ Your app is live!

---

## ⚙️ Files We Created for Render:

| File | Purpose |
|------|---------|
| `render.yaml` | Render configuration |
| `render-build.sh` | Build script (installs FFmpeg) |
| `runtime.txt` | Python version |
| `requirements.txt` | Python dependencies |
| `.gitignore` | Excludes FFmpeg executables (too big for GitHub) |

---

## 🎯 After Deployment:

### Test Your App:
1. Open the Render URL
2. Upload a video
3. Add segments (e.g., 10s-20s)
4. Click "Process Video"
5. Download the result!

### Monitor Logs:
In Render dashboard:
- Click on your service
- Go to "Logs" tab
- Watch for any errors

---

## ⚠️ Important Notes:

### Free Tier Limitations:
- **Sleeps after 15 min** of inactivity
- **First request** after sleep takes 15-30 seconds
- **Temporary storage** - uploads deleted on restart
- **512 MB RAM** - enough for small-medium videos

### Good For:
- ✅ Personal use
- ✅ Testing
- ✅ Portfolio projects
- ✅ Low traffic

### Need More?
Upgrade to **Starter plan** ($7/month):
- No sleeping
- Always on
- Better performance

---

## 🔧 Troubleshooting:

### Build Fails at FFmpeg Installation:
Check build logs in Render dashboard. If FFmpeg fails:
1. Go to your service settings
2. Change build command to:
   ```
   pip install -r requirements.txt
   ```
3. Add environment variable:
   ```
   SKIP_FFMPEG=true
   ```

### App Won't Start:
Check logs for:
- Missing dependencies
- Python errors
- Port issues (we configured this already)

### Video Processing Fails:
- Make sure FFmpeg installed (check logs: `ffmpeg -version`)
- Try smaller videos (<100MB)
- Check server has enough memory

---

## 📊 Deployment Checklist:

- [x] Code pushed to GitHub
- [x] `.gitignore` excludes large files
- [x] `render.yaml` configured
- [x] `render-build.sh` created
- [x] `requirements.txt` has all dependencies
- [x] Port configured from environment
- [ ] Render account created
- [ ] Repository connected
- [ ] Service deployed
- [ ] App tested and working

---

## 🎉 You're Almost There!

**Next Steps:**
1. Go to **https://render.com**
2. Sign up with GitHub
3. Connect your repo
4. Click deploy
5. **Your app goes live!**

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Community**: https://community.render.com
- **Your Repo**: https://github.com/FahimShahryer/video_processor

---

**Good luck with your deployment! 🚀**
