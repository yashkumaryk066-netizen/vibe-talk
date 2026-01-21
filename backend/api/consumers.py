"""
🎯 VibeTalk WebSocket Consumers
Real-time messaging, voice rooms, and online status
Developer: Yash Ankush Mishra (Rangra Developer)
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import ChatRoom, Message, VoiceRoom, Profile
from .serializers import MessageSerializer


class ChatConsumer(AsyncWebsocketConsumer):
    """Real-time 1-to-1 Chat Consumer"""
    
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope['user']
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to VibeTalk Chat 🚀'
        }))
    
    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """Handle incoming messages"""
        data = json.loads(text_data)
        message_type = data.get('type', 'chat_message')
        
        if message_type == 'chat_message':
            message_text = data.get('message', '')
            
            # Save message to database
            message_obj = await self.save_message(message_text)
            
            # Broadcast to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_text,
                    'sender': self.user.username,
                    'sender_id': self.user.id,
                    'message_id': message_obj['id'],
                    'created_at': message_obj['created_at'],
                }
            )
        
        elif message_type == 'typing':
            # Broadcast typing indicator
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'typing_indicator',
                    'user': self.user.username,
                    'is_typing': data.get('is_typing', True)
                }
            )

        elif message_type == 'permission_request':
            # Broadcast permission request
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'permission_request',
                    'permission': data.get('permission'),
                    'sender': self.user.username,
                    'sender_id': self.user.id
                }
            )

        elif message_type == 'permission_update':
            # Broadcast permission status update (Granted/Denied)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'permission_update',
                    'permission': data.get('permission'),
                    'status': data.get('status'),
                    'sender': self.user.username
                }
            )
    
    async def chat_message(self, event):
        """Send message to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message'],
            'sender': event['sender'],
            'sender_id': event['sender_id'],
            'message_id': event['message_id'],
            'created_at': event['created_at'],
        }))
    
    async def typing_indicator(self, event):
        """Send typing indicator to WebSocket"""
        # Don't send to self
        if event['user'] != self.user.username:
            await self.send(text_data=json.dumps({
                'type': 'typing',
                'user': event['user'],
                'is_typing': event['is_typing']
            }))

    async def permission_request(self, event):
        """Send permission request to recipient"""
        if event['sender_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'permission_request',
                'permission': event['permission'],
                'sender': event['sender']
            }))

    async def permission_update(self, event):
        """Send permission update to all permissions"""
        await self.send(text_data=json.dumps({
            'type': 'permission_update',
            'permission': event['permission'],
            'status': event['status'],
            'sender': event['sender']
        }))
    
    @database_sync_to_async
    def save_message(self, text):
        """Save message to database"""
        try:
            room = ChatRoom.objects.get(id=self.room_id)
            message = Message.objects.create(
                room=room,
                sender=self.user,
                text=text
            )
            return {
                'id': message.id,
                'created_at': message.created_at.isoformat()
            }
        except ChatRoom.DoesNotExist:
            return {'id': None, 'created_at': None}


class VoiceRoomConsumer(AsyncWebsocketConsumer):
    """Voice Room Consumer for Group Voice Chat"""
    
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'voice_room_{self.room_id}'
        self.user = self.scope['user']
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Notify others that user joined
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_joined',
                'user': self.user.username,
                'user_id': self.user.id
            }
        )
    
    async def disconnect(self, close_code):
        # Notify others that user left
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_left',
                'user': self.user.username,
                'user_id': self.user.id
            }
        )
        
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """Handle WebRTC signaling"""
        data = json.loads(text_data)
        
        # Forward WebRTC signals (offer, answer, ice-candidate)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'webrtc_signal',
                'data': data,
                'sender': self.user.username,
                'sender_id': self.user.id
            }
        )
    
    async def user_joined(self, event):
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'user_joined',
                'user': event['user'],
                'user_id': event['user_id']
            }))
    
    async def user_left(self, event):
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'user_left',
                'user': event['user'],
                'user_id': event['user_id']
            }))
    
    async def webrtc_signal(self, event):
        # Don't send signal back to sender
        if event['sender_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'webrtc_signal',
                'data': event['data'],
                'sender': event['sender'],
                'sender_id': event['sender_id']
            }))


class OnlineStatusConsumer(AsyncWebsocketConsumer):
    """Track online users in real-time"""
    
    async def connect(self):
        self.user = self.scope['user']
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.room_group_name = 'online_users'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Set user online
        await self.set_user_online(True)
        
        # Broadcast user is online
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_status',
                'user_id': self.user.id,
                'username': self.user.username,
                'status': 'online'
            }
        )
    
    async def disconnect(self, close_code):
        # Set user offline
        await self.set_user_online(False)
        
        # Broadcast user is offline
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_status',
                'user_id': self.user.id,
                'username': self.user.username,
                'status': 'offline'
            }
        )
        
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def user_status(self, event):
        """Send status update to WebSocket"""
        if event['user_id'] != self.user.id:
            await self.send(text_data=json.dumps({
                'type': 'status_update',
                'user_id': event['user_id'],
                'username': event['username'],
                'status': event['status']
            }))
    
    @database_sync_to_async
    def set_user_online(self, is_online):
        """Update user online status in database"""
        try:
            profile = Profile.objects.get(user=self.user)
            profile.is_online = is_online
            if is_online:
                from django.utils import timezone
                profile.last_seen = timezone.now()
            profile.save()
        except Profile.DoesNotExist:
            pass
