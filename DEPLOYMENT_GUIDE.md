# 🚀 VibeTalk - Complete Deployment Guide
**Developer:** Yash Ankush Mishra (Rangra Developer)

---

## 📋 Prerequisites

1. **GitHub Account** - For code hosting
2. **Render.com Account** - For backend (Free tier)
3. **Netlify Account** - For frontend (Already set up)
4. **Google OAuth Credentials** - Already have
5. **Domain (Optional)** - For custom branding

---

## STEP 1: Backend Deployment (Render.com) 🌐

### 1.1 Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name:** `vibe-talk-db`
   - **Database:** `vibetalk`
   - **User:** `vibetalk`
   - **Region:** Oregon (Free)
   - **Plan:** Free
4. Click **"Create Database"**
5. **Copy the Internal Database URL** (starts with `postgresql://`)

### 1.2 Create Redis Instance

1. Click **"New +"** → **"Redis"**
2. Configure:
   - **Name:** `vibe-talk-redis`
   - **Region:** Oregon
   - **Plan:** Free
3. Click **"Create Redis"**
4. **Copy the Internal Redis URL**

### 1.3 Deploy Backend Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   ```
   Name: vibe-talk-backend
   Region: Oregon (Free)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: ./build.sh
   Start Command: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
   ```

4. **Add Environment Variables:**
   ```bash
   SECRET_KEY=<generate-random-50-char-string>
   DEBUG=False
   DATABASE_URL=<paste-postgresql-url>
   REDIS_URL=<paste-redis-url>
   FRONTEND_URL=https://vibe-talk-premium-live.netlify.app
   GOOGLE_CLIENT_ID=336631033589-nq28gonut9lsv33ocs68tq4h1dejbbb8.apps.googleusercontent.com
   ALLOWED_HOSTS=.onrender.com,.netlify.app
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (~5 minutes)
7. **Copy the backend URL** (e.g., `https://vibe-talk-backend.onrender.com`)

---

## STEP 2: Frontend Deployment (Netlify) 🎨

### 2.1 Update Environment Variables

1. Go to Netlify Dashboard → Your Site → **Site Settings** → **Environment Variables**
2. Add/Update:
   ```bash
   VITE_API_URL=https://vibe-talk-backend.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=336631033589-nq28gonut9lsv33ocs68tq4h1dejbbb8.apps.googleusercontent.com
   VITE_WS_URL=vibe-talk-backend.onrender.com
   VITE_ENVIRONMENT=production
   ```

### 2.2 Trigger Rebuild

1. Go to **Deploys** tab
2. Click **"Trigger Deploy"** → **"Clear cache and deploy site"**
3. Wait for build (~2 minutes)

---

## STEP 3: Database Migration 📊

### Option A: Using Render Shell (Recommended)

1. Go to Render Dashboard → Your Backend Service
2. Click **"Shell"** tab
3. Run:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   # Username: admin
   # Email: admin@vibetalk.com
   # Password: VibeTalk@2026
   ```

### Option B: Using Local Migration

1. Export DATABASE_URL:
   ```bash
   export DATABASE_URL="<your-postgres-url>"
   cd backend
   python manage.py migrate
   ```

---

## STEP 4: Google OAuth Configuration 🔐

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to **APIs & Services** → **Credentials**
3. Edit your OAuth 2.0 Client ID
4. Add Authorized JavaScript Origins:
   ```
   https://vibe-talk-premium-live.netlify.app
   https://vibe-talk-backend.onrender.com
   ```
5. Add Authorized Redirect URIs:
   ```
   https://vibe-talk-premium-live.netlify.app
   https://vibe-talk-backend.onrender.com/api/auth/google_auth/
   ```
6. Click **Save**

---

## STEP 5: Testing & Verification ✅

### 5.1 Backend Health Check
```bash
curl https://vibe-talk-backend.onrender.com/api/health/
```
Expected Response:
```json
{
  "status": "healthy",
  "database": "connected",
  "redis": "connected"
}
```

### 5.2 Frontend Test

1. Open: `https://vibe-talk-premium-live.netlify.app`
2. Test:
   - ✅ Login with Google
   - ✅ Create profile
   - ✅ Swipe profiles
   - ✅ Send messages
   - ✅ Check real-time chat

---

## STEP 6: Performance Optimization 🚀

### 6.1 Enable Render Auto-Sleep Prevention

Add to `render.yaml`:
```yaml
services:
  - type: web
    healthCheckPath: /api/health/
```

### 6.2 Add UptimeRobot Monitoring

1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Add Monitor:
   - Type: HTTP(s)
   - URL: `https://vibe-talk-backend.onrender.com/api/health/`
   - Interval: 5 minutes
3. This prevents Render free tier from sleeping!

### 6.3 Enable Netlify Analytics (Optional)

```bash
# In Netlify Dashboard:
Site Settings → Analytics → Enable
```

---

## STEP 7: Custom Domain (Optional) 🌍

### Backend Domain
1. Render Dashboard → Service → **Settings** → **Custom Domain**
2. Add: `api.yourdomain.com`
3. Update DNS:
   ```
   Type: CNAME
   Name: api
   Value: vibe-talk-backend.onrender.com
   ```

### Frontend Domain
1. Netlify → **Domain Settings**
2. Add custom domain
3. Configure DNS as instructed

---

## 🔧 Troubleshooting

### Issue 1: Google Login Fails
**Solution:**
- Check CORS settings in `backend/config/settings.py`
- Verify Google OAuth redirect URIs
- Check browser console for errors

### Issue 2: 500 Server Error
**Solution:**
```bash
# Check Render logs:
Render Dashboard → Service → Logs

# Common fixes:
- Run migrations
- Check DATABASE_URL
- Verify SECRET_KEY is set
```

### Issue 3: WebSocket Not Connecting
**Solution:**
- Check REDIS_URL is set
- Ensure Channels is installed
- Verify WS protocol (wss:// for production)

### Issue 4: Static Files Missing
**Solution:**
```bash
# In Render Shell:
python manage.py collectstatic --no-input
```

---

## 📊 Post-Deployment Checklist

- [ ] Backend health check returns 200
- [ ] Frontend loads without errors
- [ ] Google Login works
- [ ] Database migrations complete
- [ ] Redis connection established
- [ ] WebSocket chat working
- [ ] Profile images upload
- [ ] Fake chat AI responding
- [ ] Environment variables set
- [ ] UptimeRobot monitoring active
- [ ] Error tracking configured (Sentry - optional)

---

## 🎯 Next Steps

1. **Add Sentry** for error tracking
2. **Set up CI/CD** with GitHub Actions
3. **Add Cloudinary** for media storage
4. **Implement Agora.io** for voice/video calls
5. **Add Razorpay** for premium features

---

## 🆘 Need Help?

**Backend URL:** `https://vibe-talk-backend.onrender.com`  
**Frontend URL:** `https://vibe-talk-premium-live.netlify.app`  
**Admin Panel:** `https://vibe-talk-backend.onrender.com/admin`

**Developer:** Yash Ankush Mishra - Rangra Developer ⚡  
**Version:** 2.0.0 - Production Ready 🚀
