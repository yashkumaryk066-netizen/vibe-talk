from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    bio = models.TextField(blank=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], default='Male')
    interested_in = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Everyone', 'Everyone')], default='Everyone')
    age = models.IntegerField(default=18)
    min_age_pref = models.IntegerField(default=18)
    max_age_pref = models.IntegerField(default=50)
    interests = models.TextField(help_text="Comma separated interests")
    location = models.CharField(max_length=50, default='India 🇮🇳')
    google_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    is_premium = models.BooleanField(default=False)
    is_bot = models.BooleanField(default=False) # AI Personality Flag
    profile_pic = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    google_pic_url = models.URLField(blank=True, null=True) # Fallback for Google Photo
    voice_bio = models.FileField(upload_to='voice_bios/', blank=True, null=True)

    def __str__(self):
        return self.user.username

class ProfileImage(models.Model):
    profile = models.ForeignKey(Profile, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile_gallery/')
    created_at = models.DateTimeField(auto_now_add=True)

class UserInteraction(models.Model):
    ACTION_CHOICES = [('like', 'Like'), ('pass', 'Pass')]
    
    from_user = models.ForeignKey(User, related_name='actions_sent', on_delete=models.CASCADE)
    to_user = models.ForeignKey(User, related_name='actions_received', on_delete=models.CASCADE)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('from_user', 'to_user')

class ChatRoom(models.Model):
    user1 = models.ForeignKey(User, related_name='chat_rooms_1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name='chat_rooms_2', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user1', 'user2')

class VoiceRoom(models.Model):
    """
    Public rooms for group vibes.
    """
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, default='Chill') # e.g. "Dating", "Chill", "Music"
    topic = models.CharField(max_length=200)   # e.g. "Late Night Talks", "Gaming"
    members = models.ManyToManyField(User, related_name='joined_rooms', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, related_name='messages', on_delete=models.CASCADE, null=True, blank=True)
    public_room = models.ForeignKey(VoiceRoom, related_name='public_messages', on_delete=models.CASCADE, null=True, blank=True)
    
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True)
    voice_file = models.FileField(upload_to='voice_notes/', blank=True, null=True)
    audio_url = models.URLField(blank=True, null=True) # For AI Voice Notes
    is_correction = models.BooleanField(default=False)
    correction_ref = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    
    created_at = models.DateTimeField(auto_now_add=True)

class Block(models.Model):
    blocker = models.ForeignKey(User, related_name='blocking', on_delete=models.CASCADE)
    blocked = models.ForeignKey(User, related_name='blocked_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Report(models.Model):
    reporter = models.ForeignKey(User, related_name='reports_sent', on_delete=models.CASCADE)
    reported = models.ForeignKey(User, related_name='reports_received', on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
