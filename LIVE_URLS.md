# 🚀 VibeTalk 2.0 - Live Deployment URLs

## Production URLs

### Frontend (Netlify)
**Live Site:** https://vibe-talk-premium-live.netlify.app

- **Status:** ✅ Live
- **Auto-Deploy:** Enabled (from GitHub)
- **CDN:** Global edge network
- **SSL:** Automatic HTTPS

### Backend (Render.com)
**API Base:** https://vibe-talk-backend-yash.onrender.com/api

**Key Endpoints:**
- Health Check: https://vibe-talk-backend-yash.onrender.com/api/health/
- Admin Panel: https://vibe-talk-backend-yash.onrender.com/admin/
- API Documentation: https://vibe-talk-backend-yash.onrender.com/api/

- **Status:** ✅ Live
- **Auto-Deploy:** Enabled (from GitHub)
- **Database:** PostgreSQL on Render
- **Cache:** Redis on Render

---

## GitHub Repository
**Repo:** https://github.com/yashkumaryk066-netizen/vibe-talk

**Auto-Deployment:**
- Push to `main` branch triggers automatic deployments on both Netlify and Render
- Build time: ~20-30 seconds
- Zero downtime deployments

---

## Environment Configuration

### Frontend Environment Variables (Netlify)
```bash
VITE_API_URL=https://vibe-talk-backend-yash.onrender.com/api
VITE_WS_URL=wss://vibe-talk-backend-yash.onrender.com
VITE_GOOGLE_CLIENT_ID=336631033589-nq28gonut9lsv33ocs68tq4h1dejbbb8.apps.googleusercontent.com
VITE_ENVIRONMENT=production
```

### Backend Environment Variables (Render)
```bash
DEBUG=False
DATABASE_URL=<postgres-connection-string>
REDIS_URL=<redis-connection-string>
SECRET_KEY=<secure-50-char-string>
FRONTEND_URL=https://vibe-talk-premium-live.netlify.app
GOOGLE_CLIENT_ID=336631033589-nq28gonut9lsv33ocs68tq4h1dejbbb8.apps.googleusercontent.com
ALLOWED_HOSTS=vibe-talk-backend-yash.onrender.com
```

---

## Quick Testing

### Test the Frontend
1. Visit: https://vibe-talk-premium-live.netlify.app
2. You should see the VibeTalk landing page with Login/Sign Up options
3. Try Google OAuth login

### Test the Backend
```bash
# Health check
curl https://vibe-talk-backend-yash.onrender.com/api/health/

# Expected response:
# {"status": "healthy", "database": "connected", "redis": "connected"}
```

---

## Deployment Status

| Service | Status | URL |
|---------|--------|-----|
| Frontend | ✅ Live | https://vibe-talk-premium-live.netlify.app |
| Backend API | ✅ Live | https://vibe-talk-backend-yash.onrender.com/api |
| Database | ✅ Connected | PostgreSQL on Render |
| Redis Cache | ✅ Connected | Redis on Render |
| GitHub Auto-Deploy | ✅ Active | Push to main = auto deploy |

---

## Monitoring & Dashboards

### Netlify Dashboard
https://app.netlify.com/projects/vibe-talk-premium-live

- View deployment history
- Monitor build logs
- Manage environment variables
- Check analytics

### Render Dashboard
https://dashboard.render.com/

- Monitor service health
- View deployment logs
- Manage databases
- Check performance metrics

---

## Next Steps

### For Development
1. Make code changes locally
2. Commit and push to GitHub `main` branch
3. Wait ~20-30 seconds for automatic deployment
4. Verify changes on live site

### For Testing
1. Test user registration and login
2. Verify profile creation flow
3. Test swipe/discovery feature
4. Check real-time chat functionality
5. Test voice note uploads
6. Verify Google OAuth integration

---

## Important Notes

> [!WARNING]
> The free tier on Render may experience cold starts. The first request after inactivity might take 30-60 seconds to wake up the service.

> [!TIP]
> To keep the backend warm, you can use UptimeRobot or similar services to ping the health endpoint every 5-10 minutes.

> [!IMPORTANT]
> All environment variables are securely stored in Netlify and Render dashboards. Never commit `.env` files to Git.

---

## Support & Documentation

- **Main README:** [README.md](file:///home/tele/vibe_talk/README.md)
- **Deployment Guide:** [DEPLOYMENT_GUIDE.md](file:///home/tele/vibe_talk/DEPLOYMENT_GUIDE.md)
- **Walkthrough:** [walkthrough.md](file:///home/tele/.gemini/antigravity/brain/f36dbbdb-6fad-4e19-9887-820a79aec1ff/walkthrough.md)

---

**Last Updated:** January 21, 2026  
**Status:** ✅ Production Ready  
**Version:** 2.0.0
