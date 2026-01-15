from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Profile
import random

class Command(BaseCommand):
    help = 'Injects 15 Vibe AI Personalities into the database'

    def handle(self, *args, **kwargs):
        self.stdout.write("Injecting Vibe AI Personalities...")
        
        # Data Set
        from api.models import ProfileImage, VoiceRoom

        # Data Set with Lifestyle Keywords for Images
        girls = [
            {"name": "Aanya", "age": 21, "bio": "Coffee, Code, and Chaos ☕✨. Swipe if you can match my vibe.", "loc": "Mumbai 🇮🇳", "tags": "coffee,girl,travel"},
            {"name": "Priya", "age": 23, "bio": "Not your average girl. I like deep talks and late night drives 🚗.", "loc": "Delhi 🇮🇳", "tags": "fashion,drive,night"},
            {"name": "Zara", "age": 20, "bio": "Fashion student 👗. Looking for my photographer.", "loc": "Bangalore 🇮🇳", "tags": "fashion,shopping,style"},
            {"name": "Ishita", "age": 22, "bio": "Foodie at heart 🍕. If you don't like Pizza, we can't be friends.", "loc": "Pune 🇮🇳", "tags": "pizza,food,cafe"},
            {"name": "Riya", "age": 24, "bio": "Just vibes. No drama. ✌️", "loc": "Mumbai 🇮🇳", "tags": "beach,party,dance"},
            {"name": "Sanya", "age": 21, "bio": "Music is my therapy 🎧. Send me your playlist.", "loc": "Goa 🇮🇳", "tags": "music,festival,guitar"},
            {"name": "Neha", "age": 25, "bio": "Working hard, partying harder 🥂.", "loc": "Gurgaon 🇮🇳", "tags": "office,drink,club"},
            {"name": "Kavya", "age": 22, "bio": "Bookworm 📚 looking for a gym rat.", "loc": "Hyderabad 🇮🇳", "tags": "book,gym,cat"}
        ]
        
        boys = [
            {"name": "Aryan", "age": 23, "bio": "Gym, Tech, and Travel ✈️. Let's explore.", "loc": "Delhi 🇮🇳", "tags": "gym,fitness,travel"},
            {"name": "Rohan", "age": 24, "bio": "Founder @ Stealth Startup 🚀. Hustle mode on.", "loc": "Bangalore 🇮🇳", "tags": "tech,laptop,startup"},
            {"name": "Kabir", "age": 22, "bio": "Guitarist 🎸. I might write a song about you.", "loc": "Mumbai 🇮🇳", "tags": "guitar,concert,music"},
            {"name": "Vihaan", "age": 25, "bio": "Adventure seeker 🏔️. Hiking usually.", "loc": "Himachal 🇮🇳", "tags": "mountain,hike,nature"},
            {"name": "Aditya", "age": 21, "bio": "Gamer for life 🎮. Valo?", "loc": "Pune 🇮🇳", "tags": "gaming,pc,neon"},
            {"name": "Arjun", "age": 26, "bio": "Chef in the making 👨‍🍳. I cook better than you.", "loc": "Chennai 🇮🇳", "tags": "cooking,food,kitchen"},
            {"name": "Rahul", "age": 23, "bio": "Photographer 📸. Let's capture moments.", "loc": "Jaipur 🇮🇳", "tags": "camera,photo,art"}
        ]
        
        # Helper to get lifestyle images
        def get_images(keywords):
            kw = keywords.split(',')
            return [f"https://source.unsplash.com/random/400x600/?{k}" for k in kw]
            # Since unsplash source is deprecated sometimes, fallback to picsum if needed, 
            # but let's try robust LoremPixel or similar if Unsplash fails.
            # actually better: https://loremflickr.com/400/600/{keyword}
        
        # Create Girls
        for i, g in enumerate(girls):
            username = f"vibe_girl_{i}"
            if not User.objects.filter(username=username).exists():
                u = User.objects.create_user(username=username, email=f"{username}@vibetalk.ai", password="password")
                p = Profile.objects.create(
                    user=u, name=g["name"], age=g["age"], gender="Female", bio=g["bio"], location=g["loc"], is_bot=True,
                    google_pic_url=f"https://randomuser.me/api/portraits/women/{i + 10}.jpg"
                )
                # Add Gallery Images
                kw_list = g['tags'].split(',')
                for k in kw_list:
                    ProfileImage.objects.create(profile=p, image=f"https://loremflickr.com/400/600/{k}")
                
                self.stdout.write(f"Created AI Girl: {g['name']} with {len(kw_list)} photos")

        # Create Boys
        for i, b in enumerate(boys):
            username = f"vibe_boy_{i}"
            if not User.objects.filter(username=username).exists():
                u = User.objects.create_user(username=username, email=f"{username}@vibetalk.ai", password="password")
                p = Profile.objects.create(
                    user=u, name=b["name"], age=b["age"], gender="Male", bio=b["bio"], location=b["loc"], is_bot=True,
                    google_pic_url=f"https://randomuser.me/api/portraits/men/{i + 10}.jpg"
                )
                # Add Gallery Images
                kw_list = b['tags'].split(',')
                for k in kw_list:
                    ProfileImage.objects.create(profile=p, image=f"https://loremflickr.com/400/600/{k}")
                
                self.stdout.write(f"Created AI Boy: {b['name']} with {len(kw_list)} photos")

        # Inject Voice Rooms
        rooms = [
           {"name": "Late Night Vibes 🌙", "topic": "Chill music & talks", "cat": "Chill"},
           {"name": "Desi Dating 🇮🇳", "topic": "Finding love in India", "cat": "Dating"},
           {"name": "Tech & Startup 🚀", "topic": "Coding, AI & Funding", "cat": "Tech"},
           {"name": "Singing Battle 🎤", "topic": "Karaoke Night", "cat": "Music"},
           {"name": "Ghost Stories 👻", "topic": "Real horror experiences", "cat": "Horror"}
        ]
        
        for r in rooms:
            if not VoiceRoom.objects.filter(name=r['name']).exists():
                vr = VoiceRoom.objects.create(name=r['name'], topic=r['topic'], category=r['cat'])
                # Add random members counts (fake participation)
                # In real app we count relations, but for initial look we might just rely on UI
                self.stdout.write(f"Created Room: {r['name']}")
                
        self.stdout.write(self.style.SUCCESS('Content Injection Complete! App is Full.'))
