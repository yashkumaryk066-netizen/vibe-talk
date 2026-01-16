from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q, Case, When, Value, IntegerField
from .models import Profile, UserInteraction, ChatRoom, Message, Block, Report, VoiceRoom, ProfileImage
from .serializers import (UserSerializer, ProfileSerializer, UserInteractionSerializer, 
                          ChatRoomSerializer, MessageSerializer, BlockSerializer, ReportSerializer, VoiceRoomSerializer)

class AuthViewSet(viewsets.ViewSet):
    # ... (Keep existing methods: signup, login, me)
    @action(detail=False, methods=['post'])
    def signup(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username taken'}, status=400)
        user = User.objects.create_user(username=username, password=password, email=email)
        Profile.objects.create(user=user, name=username)
        return Response({'status': 'created'}, status=201)

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return Response({'status': 'logged in', 'user_id': user.id})
        return Response({'error': 'Invalid credentials'}, status=400)
    
    @action(detail=False, methods=['post'])
    def google_auth(self, request):
        """
        Handle Google Login/Signup securely by verifying ID Token.
        Payload: { token: "JWT_ID_TOKEN_FROM_GOOGLE" }
        """
        token = request.data.get('token')
        
        if not token:
             return Response({'error': 'No token provided'}, status=400)

        try:
             # --- 1. Verify Token with Google ---
             # This ensures the request isn't fake/spoofed
             from google.oauth2 import id_token
             from google.auth.transport import requests
             
             # CLIENT_ID should ideally be in settings/env, assuming matching frontend ID for now
             # You can pass None to verify_oauth2_token if you just want to decode, but checking audience is safer
             id_info = id_token.verify_oauth2_token(token, requests.Request())
             
             # Get verified info
             google_id = id_info['sub']
             email = id_info['email']
             name = id_info.get('name', 'VibeUser')
             photo = id_info.get('picture', None)

        except ValueError:
             return Response({'error': 'Invalid Google Token'}, status=400)

        # --- 2. Check if Profile exists with this Google ID ---
        try:
            profile = Profile.objects.get(google_id=google_id)
            user = profile.user
            login(request, user)
            return Response({'status': 'logged in', 'user_id': user.id})
        
        except Profile.DoesNotExist:
            # --- 3. Check if user with this email already exists (Link Account) ---
            try:
                user = User.objects.get(email=email)
                profile, created = Profile.objects.get_or_create(user=user)
                profile.google_id = google_id
                if not profile.profile_pic and photo:
                     profile.google_pic_url = photo
                profile.save()
                
            except User.DoesNotExist:
                # --- 4. Create Fresh User & Profile ---
                import uuid
                # Generate unique username: vibe_yash_1234
                base_name = email.split('@')[0][:10]
                username = f"{base_name}_{str(uuid.uuid4())[:4]}"
                
                user = User.objects.create_user(username=username, email=email, password=None)
                profile = Profile.objects.create(
                    user=user, 
                    name=name, 
                    google_id=google_id, 
                    google_pic_url=photo,
                    is_premium=False
                )
            
            login(request, user)
            return Response({'status': 'created', 'user_id': user.id}, status=201)

    @action(detail=False, methods=['get'])
    def me(self, request):
        if request.user.is_authenticated:
            try:
                profile = Profile.objects.get(user=request.user)
                return Response(ProfileSerializer(profile).data)
            except Profile.DoesNotExist:
                 return Response({'error': 'Profile not found'}, status=404)
        return Response({'error': 'Not logged in'}, status=403)

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = self.queryset
        
        if user.is_authenticated:
            try:
                my_profile = Profile.objects.get(user=user)
            except Profile.DoesNotExist:
                return queryset.none()

            # 1. Block Logic
            blocked_ids = Block.objects.filter(blocker=user).values_list('blocked', flat=True)
            blocked_by_ids = Block.objects.filter(blocked=user).values_list('blocker', flat=True)
            
            # 2. Already Swiped Logic
            swiped_ids = UserInteraction.objects.filter(from_user=user).values_list('to_user', flat=True)
            
            queryset = queryset.exclude(user__in=blocked_ids)\
                               .exclude(user__in=blocked_by_ids)\
                               .exclude(user__in=swiped_ids)\
                               .exclude(user=user)

            # 3. Gender Preference
            if my_profile.interested_in != 'Everyone':
                queryset = queryset.filter(gender=my_profile.interested_in)
            
            # 4. Age Preference
            queryset = queryset.filter(age__gte=my_profile.min_age_pref, age__lte=my_profile.max_age_pref)
            
            # --- Randomize ---
            queryset = queryset.order_by('?') 

        return queryset
    
    @action(detail=True, methods=['post'])
    def upload_gallery(self, request, pk=None):
        profile = self.get_object()
        if profile.user != request.user:
             return Response({'error': 'Not allowd'}, status=403)
        
        image_file = request.FILES.get('image')
        if image_file:
            ProfileImage.objects.create(profile=profile, image=image_file)
            return Response({'status': 'uploaded'})
        return Response({'error': 'No image'}, status=400)
    
    @action(detail=False, methods=['post'])
    def update_me(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Not logged in'}, status=403)
        profile = Profile.objects.get(user=request.user)
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class UserInteractionViewSet(viewsets.ModelViewSet):
    queryset = UserInteraction.objects.all()
    serializer_class = UserInteractionSerializer
    
    def create(self, request, *args, **kwargs):
        # Custom logic for "Swipe"
        from_user = request.user
        to_user_id = request.data.get('to_user')
        action_type = request.data.get('action') # 'like' or 'pass'
        
        if not to_user_id or action_type not in ['like', 'pass']:
            return Response({'error': 'Invalid data'}, status=400)
            
        to_user = User.objects.get(id=to_user_id)
        
        # Record the interaction
        interaction, created = UserInteraction.objects.get_or_create(
            from_user=from_user, to_user=to_user,
            defaults={'action': action_type}
        )
        
        match_found = False
        if action_type == 'like':
             # Check if they liked me back
             if UserInteraction.objects.filter(from_user=to_user, to_user=from_user, action='like').exists():
                 # It's a MATCH!
                 match_found = True
                 # Create ChatRoom
                 u1, u2 = (from_user, to_user) if from_user.id < to_user.id else (to_user, from_user)
                 ChatRoom.objects.get_or_create(user1=u1, user2=u2)
        
        return Response({'status': 'ok', 'match': match_found})
    
    @action(detail=False, methods=['get'])
    def matches(self, request):
        # Return list of profiles I matched with
        # Match = I liked them AND They liked me
        user = request.user
        if not user.is_authenticated: return Response([])
        
        my_likes = UserInteraction.objects.filter(from_user=user, action='like').values_list('to_user', flat=True)
        liked_me = UserInteraction.objects.filter(to_user=user, action='like', from_user__in=my_likes).values_list('from_user', flat=True)
        
        matches = Profile.objects.filter(user__in=liked_me)
        return Response(ProfileSerializer(matches, many=True).data)

class ChatRoomViewSet(viewsets.ModelViewSet):
    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return self.queryset.filter(Q(user1=user) | Q(user2=user))
        return self.queryset.none()

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        room = self.get_object()
        text = request.data.get('text')
        voice_file = request.FILES.get('voice_file')
        
        # Save User Message
        msg = Message.objects.create(room=room, sender=request.user, text=text, voice_file=voice_file)
        
        # --- AI BOT BRAIN START ---
        # Check if the OTHER user in the room is a bot
        other_user = room.user2 if room.user1 == request.user else room.user1
        try:
            other_profile = Profile.objects.get(user=other_user)
            if other_profile.is_bot and text:
                self.handle_bot_reply(room, other_user, text)
        except Profile.DoesNotExist:
            pass
        # --- AI BOT BRAIN END ---

        return Response(MessageSerializer(msg).data)

    def handle_bot_reply(self, room, bot_user, user_text):
        """
        VibeGPT Lite: Multilingual Smart Response System.
        Supports: English, Hindi, Hinglish.
        """
        from random import choice
        import time 
        
        raw_text = user_text
        user_text = user_text.lower()
        
        reply_text = None
        reply_audio = None
        is_female = False
        
        try:
            p = Profile.objects.get(user=bot_user)
            is_female = (p.gender == 'Female')
        except: pass

        # --- 1. Safety & Block Protocol ---
        bad_words = ['bitch', 'sexy', 'nude', 'hate', 'stupid', 'fuck', 'sex', 'send nudes', 'randi', 'chutiya']
        if any(word in user_text for word in bad_words):
            reply_text = "Eww, not my vibe. Blocked. 🚫" if is_female else "Bro, relax. Not cool. 🚫"
            Message.objects.create(room=room, sender=bot_user, text=reply_text)
            return

        # --- 2. Voice/Audio Requests ---
        if any(w in user_text for w in ['voice', 'speak', 'bol', 'audio', 'aawaz', 'sunao']):
             if is_female:
                 reply_audio = "https://actions.google.com/sounds/v1/human_voices/woman_laugh.ogg"
                 reply_text = choice(["Lo suno meri aawaz! 🎤", "Here you go! ✨", "Voice note for you!"])
             else:
                 reply_audio = "https://actions.google.com/sounds/v1/human_voices/man_laugh.ogg" 
                 reply_text = "Ye le bhai voice. 🎤"

        # --- 3. Multilingual Brain (Hinglish/Hindi/English) ---
        elif not reply_text:
            # Hindi/Hinglish Triggers
            if any(w in user_text for w in ['kya', 'kaise', 'kahan', 'kab', 'kyu', 'nahi', 'ha', 'tum', 'main', 'aur']):
                if 'kaise ho' in user_text or 'kya haal' in user_text:
                    reply_text = choice(["Main badhiya hoon! Tum batao? ✨", "Bas mast vibes hain. Tum kaise ho?", "Sab chill hai!"])
                elif 'kya kar' in user_text or 'kr rh' in user_text:
                    reply_text = choice(["Kuch khaas nahi, bas music sun rahi hoon. 🎧", "VibeTalk pe scroll kar rahi hoon! 😉", "Tumhara wait kar rahi thi lol."])
                elif 'kahan se' in user_text or 'rehte ho' in user_text:
                    reply_text = f"Main {p.location} se hoon! 🇮🇳 Tum kahan se ho?"
                elif 'naam' in user_text:
                    reply_text = f"Mera naam {p.name} hai. Nice to meet ya! ✨"
                elif 'khana' in user_text or 'eat' in user_text:
                    reply_text = "Abhi Pizza soch rahi hoon 🍕. Tumne kya khaya?"
                elif 'gf' in user_text or 'bf' in user_text or 'single' in user_text:
                    reply_text = "Filhal toh single aur mingling hoon 😉."
                elif 'pasand' in user_text or 'like' in user_text:
                    reply_text = "Mujhe late night drives aur music pasand hai. Tumhe?"
                else:
                    reply_text = choice(["Sahi hai yaar!", "Aur batao?", "Fir kya scene hai?", "Hahaha sahi baat hai."])
            
            # English Triggers
            else:
                if 'hi' in user_text or 'hello' in user_text or 'hey' in user_text:
                    reply_text = choice(["Heyy! ✨", "Hi there! 👋", "Yo! What's the vibe?", "Hey! Nice to meet ya."])
                elif 'how are' in user_text or 'wbu' in user_text:
                    reply_text = choice(["Just vibing cool, wbu? ☕", "Living my best life! You?", "Pretty good, just scrolling."])
                elif 'meet' in user_text or 'date' in user_text:
                    reply_text = "Whoa, slow down! Let's pass the vibe check first. 😉"
                elif 'beautiful' in user_text or 'pretty' in user_text or 'cute' in user_text:
                    reply_text = choice(["Aww, stops it! 🙈", "Thanks! You're sweet. 🥰", "Trying my best haha."])
                elif 'music' in user_text or 'song' in user_text:
                     reply_text = "I'm obsessed with The Weeknd & AP Dhillon rn. You? 🎵"
                elif 'love' in user_text:
                    reply_text = "Love is a strong word! Let's start with 'Like' maybe? 😉"
                else:
                    reply_text = choice(["Haha true!", "That's interesting...", "Tell me more!", "Vibes. ✨", "So true logic."])

        # Create Bot Message with slight delay simulation (async thought)
        Message.objects.create(room=room, sender=bot_user, text=reply_text, audio_url=reply_audio)

class VoiceRoomViewSet(viewsets.ModelViewSet):
    queryset = VoiceRoom.objects.all()
    serializer_class = VoiceRoomSerializer
    
    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        room = self.get_object()
        room.members.add(request.user)
        return Response({'status': 'joined'})
    
    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        room = self.get_object()
        room.members.remove(request.user)
        return Response({'status': 'left'})

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    
    def get_queryset(self):
        room_id = self.request.query_params.get('room')
        public_room_id = self.request.query_params.get('public_room') # New support
        
        if room_id:
             return self.queryset.filter(room__id=room_id).order_by('created_at')
        if public_room_id:
             return self.queryset.filter(public_room__id=public_room_id).order_by('created_at')
             
        return self.queryset.none()

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class BlockViewSet(viewsets.ModelViewSet):
    queryset = Block.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BlockSerializer

    def perform_create(self, serializer):
        serializer.save(blocker=self.request.user)

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ReportSerializer

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)
