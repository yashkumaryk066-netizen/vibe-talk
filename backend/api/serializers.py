from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile, UserInteraction, ProfileImage, ChatRoom, Message, Block, Report, VoiceRoom

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileImage
        fields = ['id', 'image', 'created_at']

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    images = ProfileImageSerializer(many=True, read_only=True)
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['id', 'user', 'username', 'name', 'bio', 'gender', 'interested_in', 'age', 'min_age_pref', 'max_age_pref', 'interests', 'profile_pic', 'voice_bio', 'images']

    def get_profile_pic(self, obj):
        if obj.profile_pic:
            try:
                return obj.profile_pic.url
            except:
                pass
        if obj.google_pic_url:
            return obj.google_pic_url
        # Fallback to Premium 3D Avatars
        return f"https://api.dicebear.com/7.x/avataaars/svg?seed={obj.user.username}"

class UserInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInteraction
        fields = ['id', 'from_user', 'to_user', 'action', 'created_at']
        read_only_fields = ['from_user']

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    class Meta:
        model = Message
        fields = ['id', 'room', 'public_room', 'sender', 'sender_name', 'text', 'voice_file', 'audio_url', 'is_correction', 'correction_ref', 'created_at']
        read_only_fields = ['sender']

class ChatRoomSerializer(serializers.ModelSerializer):
    user1_name = serializers.CharField(source='user1.username', read_only=True)
    user2_name = serializers.CharField(source='user2.username', read_only=True)
    class Meta:
        model = ChatRoom
        fields = ['id', 'user1', 'user2', 'user1_name', 'user2_name', 'created_at']

class VoiceRoomSerializer(serializers.ModelSerializer):
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = VoiceRoom
        fields = ['id', 'name', 'category', 'topic', 'members_count', 'created_at']

    def get_members_count(self, obj):
        # Simulate Live Activity: Base members + Random fluctuation
        import random
        base = obj.members.count()
        # Add random fictional listeners for "Vibe"
        return base + random.randint(5, 40)

class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = ['id', 'blocker', 'blocked', 'created_at']
        read_only_fields = ['blocker']

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'reporter', 'reported', 'reason', 'created_at']
        read_only_fields = ['reporter']
