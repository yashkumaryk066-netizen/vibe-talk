#!/bin/bash
# 🚀 VibeTalk - LIVE DEPLOYMENT SCRIPT
# Developer: Yash Ankush Mishra (Rangra Developer)
# Deploy everything to production!

set -e  # Exit on error

echo "🚀 VibeTalk - Live Deployment Starting..."
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is configured
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Not a git repository!${NC}"
    exit 1
fi

echo "📋 Step 1: Checking Git Status"
echo "-------------------------------"
git status

echo ""
echo "➕ Step 2: Adding All Files"
echo "----------------------------"
git add .

echo ""
echo "📝 Step 3: Creating Commit"
echo "--------------------------"
COMMIT_MSG="🚀 Production Update: Premium UI, Compliance, Analytics, Monitoring ($(date '+%Y-%m-%d %H:%M'))"
git commit -m "$COMMIT_MSG" || echo "⚠️  No changes to commit or already committed"

echo ""
echo "🌿 Step 4: Checking Remote"
echo "--------------------------"
if git remote -v | grep -q 'origin'; then
    echo "✅ Remote 'origin' exists"
    git remote -v
else
    echo -e "${YELLOW}⚠️  No remote 'origin' found${NC}"
    echo "Please add your GitHub repository:"
    echo "git remote add origin <your-repo-url>"
    exit 1
fi

echo ""
echo "⬆️  Step 5: Pushing to GitHub"
echo "-----------------------------"
BRANCH=$(git branch --show-current)
echo "Current branch: $BRANCH"

git push origin $BRANCH || {
    echo -e "${YELLOW}⚠️  Push failed. Trying force push...${NC}"
    read -p "Force push? This will overwrite remote. (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin $BRANCH --force
    else
        echo -e "${RED}❌ Deployment cancelled${NC}"
        exit 1
    fi
}

echo ""
echo -e "${GREEN}✅ Code pushed to GitHub!${NC}"
echo ""

echo "📱 Step 6: Frontend Deployment (Netlify)"
echo "----------------------------------------"
echo "Netlify will auto-deploy from GitHub push!"
echo "Check: https://app.netlify.com"
echo ""
echo "⏳ Waiting for Netlify build (usually 2-3 minutes)..."
echo "🌐 Your site: https://vibe-talk-premium-live.netlify.app"
echo ""

echo "🔧 Step 7: Backend Deployment (Render.com)"
echo "------------------------------------------"
echo ""
echo "👉 MANUAL STEPS REQUIRED:"
echo ""
echo "1. Go to: https://dashboard.render.com"
echo "2. If first deployment:"
echo "   - Click 'New +' → 'Web Service'"
echo "   - Connect GitHub repository"
echo "   - Settings:"
echo "     • Name: vibe-talk-backend"
echo "     • Region: Oregon (Free)"
echo "     • Branch: main"
echo "     • Root Directory: backend"
echo "     • Runtime: Python 3"
echo "     • Build Command: ./build.sh"
echo "     • Start Command: gunicorn config.wsgi:application --bind 0.0.0.0:\$PORT"
echo ""
echo "3. Add Environment Variables (IMPORTANT!):"
echo "   Copy from: backend/.env.example"
echo "   Required:"
echo "   • SECRET_KEY=<generate-random-string>"
echo "   • DEBUG=False"
echo "   • DATABASE_URL=<postgres-url-from-render>"
echo "   • REDIS_URL=<redis-url-from-render>"
echo "   • FRONTEND_URL=https://vibe-talk-premium-live.netlify.app"
echo "   • GOOGLE_CLIENT_ID=336631033589-nq28gonut9lsv33ocs68tq4h1dejbbb8.apps.googleusercontent.com"
echo "   • ALLOWED_HOSTS=.onrender.com,.netlify.app"
echo ""
echo "4. Click 'Create Web Service'"
echo "5. Wait for deployment (5-10 min)"
echo ""

echo "📊 Step 8: Post-Deployment Checklist"
echo "------------------------------------"
echo ""
echo "After backend deploys, update Netlify environment variables:"
echo ""
echo "1. Go to: https://app.netlify.com → Your Site → Site Settings → Environment Variables"
echo "2. Update:"
echo "   • VITE_API_URL=<your-render-backend-url>/api"
echo "   Example: https://vibe-talk-backend.onrender.com/api"
echo ""
echo "3. Trigger Netlify Rebuild:"
echo "   Deploys → Trigger Deploy → Clear cache and deploy site"
echo ""

echo "🔍 Step 9: Testing"
echo "------------------"
echo ""
echo "After both deployments complete:"
echo ""
echo "1. Backend Health Check:"
echo "   curl <backend-url>/api/health/"
echo "   Should return: {\"status\":\"healthy\"}"
echo ""
echo "2. Frontend Test:"
echo "   Open: https://vibe-talk-premium-live.netlify.app"
echo "   - Login with Google"
echo "   - Create/edit profile"
echo "   - Test swipe"
echo "   - Test chat"
echo ""

echo "📈 Step 10: Enable Analytics"
echo "----------------------------"
echo ""
echo "1. Google Analytics:"
echo "   - Go to: https://analytics.google.com"
echo "   - Create property 'VibeTalk'"
echo "   - Get GA4 Measurement ID (G-XXXXXXXXXX)"
echo "   - Add to Netlify env: VITE_GA_ID=G-XXXXXXXXXX"
echo ""
echo "2. Sentry (Error Monitoring):"
echo "   - Go to: https://sentry.io"
echo "   - Create project 'vibetalk-frontend' + 'vibetalk-backend'"
echo "   - Get DSN keys"
echo "   - Add to env variables"
echo ""

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ DEPLOYMENT SCRIPT COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📝 Summary:"
echo "  ✅ Code pushed to GitHub"
echo "  ⏳ Netlify auto-deploying"
echo "  ⏳ Render backend needs manual setup"
echo ""
echo "🔗 Live URL: https://vibe-talk-premium-live.netlify.app"
echo ""
echo "📚 Next Steps:"
echo "  1. Set up Render backend (manual)"
echo "  2. Update Netlify env vars"
echo "  3. Test everything"
echo "  4. Enable analytics"
echo ""
echo "🎉 Good luck with your launch!"
echo ""
