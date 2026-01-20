#!/usr/bin/env bash
# 🚀 VibeTalk Production Build Script
# Developer: Yash Ankush Mishra (Rangra Developer)

set -o errexit  # Exit on error

echo "🔧 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "📦 Collecting static files..."
python manage.py collectstatic --no-input --clear

echo "🗄️ Running database migrations..."
python manage.py migrate --no-input

echo "👥 Creating superuser (if not exists)..."
python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@vibetalk.com', 'VibeTalk@2026')
    print('✅ Superuser created: admin')
else:
    print('ℹ️  Superuser already exists')
EOF

echo "🎭 Seeding fake profiles (optional)..."
python manage.py seed_bots || echo "⚠️  Seed script not found or failed"

echo "✅ Build completed successfully!"
