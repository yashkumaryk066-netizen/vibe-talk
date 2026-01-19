from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from api.models import Profile
import random

class Command(BaseCommand):
    help = 'Seeds the database with Premium VibeMatch Users (AI Bots)'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding Premium Vibe Users...")

        # --- DATASET ---
        # Highly curate female heavy list
        USERS = [
            {"name": "Riya_Sharma", "gender": "Female", "bio": "Looking for a serious vibe. 🎵"},
            {"name": "Ananya_Queen", "gender": "Female", "bio": "Princess treatment only. 👑"},
            {"name": "Zara_Official", "gender": "Female", "bio": "Fashion & Travel. ✈️"},
            {"name": "Priya_Angel", "gender": "Female", "bio": "Sweet but spicy. 🌶️"},
            {"name": "Sneha_Loves", "gender": "Female", "bio": "Hopeless romantic. 💖"},
            {"name": "Aisha_Vibes", "gender": "Female", "bio": "Gym & Coffee date? ☕"},
            {"name": "Kavya_Cool", "gender": "Female", "bio": "Let's explore the city. 🌃"},
            {"name": "Neha_Style", "gender": "Female", "bio": "Designer by day, dreamer by night. ✨"},
            {"name": "Ishita_Dream", "gender": "Female", "bio": "Here for good conversations only."},
            {"name": "Simran_K", "gender": "Female", "bio": "Music is my love language. 🎶"},
            {"name": "Sanya_Dance", "gender": "Female", "bio": "Dance with me? 💃"},
            {"name": "Nisha_Foodie", "gender": "Female", "bio": "Will date for pizza. 🍕"},
            {"name": "Meera_Yoga", "gender": "Female", "bio": "Peace & Love. 🧘‍♀️"},
            {"name": "Kiara_Cutie", "gender": "Female", "bio": "Cute vibes only. ✨"},
            {"name": "Avni_Artist", "gender": "Female", "bio": "Painting my life. 🎨"},
            
            # Fewer Males
            {"name": "Aryan_Vibe", "gender": "Male", "bio": "Gym rat. 💪"},
            {"name": "Kabir_Sing", "gender": "Male", "bio": "Guitarist. 🎸"},
            {"name": "Rohan_Tech", "gender": "Male", "bio": "Techie & Trekker. 🏔️"},
            {"name": "Vikram_Fit", "gender": "Male", "bio": "Fitness first."},
            {"name": "Aditya_Gamer", "gender": "Male", "bio": "Valorant? 🎮"}
        ]

        # Avatars used in Frontend (Unsplash Source)
        # Note: In backend we store just the URL string
        
        count = 0
        for i, u_data in enumerate(USERS):
            username = u_data["name"]
            email = f"{username.lower()}@vibetalk.ai"
            
            if not User.objects.filter(username=username).exists():
                user = User.objects.create_user(username=username, email=email, password="password123")
                
                # Determine avatar based on gender for correctness
                search_term = "woman,girl,indian" if u_data["gender"] == "Female" else "man,boy,indian"
                pic_url = f"https://source.unsplash.com/random/150x150?{search_term}&sig={i}"
                
                Profile.objects.create(
                    user=user,
                    name=username.replace("_", " "),
                    bio=u_data["bio"],
                    gender=u_data["gender"],
                    age=random.randint(19, 26),
                    location="Mumbai, India",
                    interested_in="Male" if u_data["gender"] == "Female" else "Female",
                    interests="Music, Travel, Dating",
                    is_bot=True, # ACTIVATES AI PERSONA
                    google_pic_url=pic_url
                )
                count += 1
                self.stdout.write(f"Created {username}")
            else:
                self.stdout.write(f"Skipped {username} (Exists)")

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {count} new Premium Users."))
