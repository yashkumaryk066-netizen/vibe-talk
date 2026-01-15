import os
import django

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from api.models import Profile

def seed():
    print("🌱 Seeding database...")
    
    users = [
        {
            "username": "sarah_w", 
            "email": "sarah@test.com", 
            "password": "password123",
            "name": "Sarah Williams", 
            "speak": "English", 
            "learn": "Hindi, Spanish",
            "bio": "Love traveling and meeting new people. Here to learn Hindi!",
            "interests": "Travel, Movies, Reading"
        },
        {
            "username": "rahul_v", 
            "email": "rahul@test.com", 
            "password": "password123",
            "name": "Rahul Verma", 
            "speak": "Hindi", 
            "learn": "English",
            "bio": "Software engineer from Delhi. Want to improve my English.",
            "interests": "Coding, Cricket, Tech"
        },
        {
            "username": "akiko_jp", 
            "email": "akiko@test.com", 
            "password": "password123",
            "name": "Akiko Tanaka", 
            "speak": "Japanese", 
            "learn": "English",
            "bio": "Student from Tokyo. I love anime and music.",
            "interests": "Anime, Music, Art"
        },
        {
            "username": "mateo_es", 
            "email": "mateo@test.com", 
            "password": "password123",
            "name": "Mateo Rodriguez", 
            "speak": "Spanish", 
            "learn": "English, Japanese",
            "bio": "Chef from Madrid. Food lover!",
            "interests": "Cooking, Football, History"
        },
        {
            "username": "priya_art", 
            "email": "priya@test.com", 
            "password": "password123",
            "name": "Priya Singh", 
            "speak": "Hindi, English", 
            "learn": "French",
            "bio": "Artist and dreamer. Let's exchange languages!",
            "interests": "Art, Design, Yoga"
        }
    ]

    count = 0
    for u in users:
        if not User.objects.filter(username=u['username']).exists():
            user = User.objects.create_user(username=u['username'], email=u['email'], password=u['password'])
            Profile.objects.create(
                user=user,
                name=u['name'],
                speak_language=u['speak'],
                learn_language=u['learn'],
                bio=u['bio'],
                interests=u['interests']
            )
            print(f"✅ Created user: {u['name']} ({u['username']})")
            count += 1
        else:
            print(f"⚠️  Skipping {u['username']}, already exists.")
    
    if count > 0:
        print(f"\n✨ Successfully added {count} new vibes to the database!")
    else:
        print("\n✨ Database is already populated!")

if __name__ == "__main__":
    seed()
