#!/bin/bash
# 🚀 VibeTalk - Quick Start Script  
# Developer: Yash Ankush Mishra (Rangra Developer)

echo "🎯 VibeTalk Production Setup - Quick Start"
echo "==========================================="
echo ""

# Check if in correct directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this from the vibe_talk root directory"
    exit 1
fi

echo "📋 Step 1: Backend Setup"
echo "------------------------"
cd backend

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing/Updating dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo ""
echo "📋 Step 2: Environment Configuration"
echo "------------------------------------"

if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "✅ .env created! Please edit it with your actual values:"
    echo "   - SECRET_KEY (generate a random string)"
    echo "   - DATABASE_URL (if using PostgreSQL)"
    echo "   - GOOGLE_CLIENT_ID"
    echo ""
    read -p "Press Enter after editing .env file..."
fi

echo ""
echo "📋 Step 3: Database Setup"
echo "------------------------"
python manage.py makemigrations
python manage.py migrate

echo ""
echo "📋 Step 4: Create Superuser (Optional)"
echo "--------------------------------------"
read -p "Create admin user? (y/n): " create_admin
if [ "$create_admin" = "y" ]; then
    python manage.py createsuperuser
fi

echo ""
echo "📋 Step 5: Frontend Setup"
echo "------------------------"
cd ../frontend

if [ ! -f ".env" ]; then
    echo "📝 Creating frontend .env from template..."
    cp .env.example .env
    echo "✅ .env created! Update VITE_API_URL if needed"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo ""
echo "✅ Setup Complete!"
echo "=================="
echo ""
echo "🚀 To start the application:"
echo ""
echo "Backend (Terminal 1):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Frontend (Terminal 2):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "📱 Access the app at: http://localhost:5173"
echo "🔧 Admin panel at: http://localhost:8000/admin"
echo ""
echo "📚 For production deployment, see: DEPLOYMENT_GUIDE.md"
echo ""
