"""
🔌 VibeTalk WebSocket Routing
Developer: Yash Ankush Mishra (Rangra Developer)
"""

from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/chat/<int:room_id>/', consumers.ChatConsumer.as_asgi()),
    path('ws/voice/<int:room_id>/', consumers.VoiceRoomConsumer.as_asgi()),
    path('ws/online/', consumers.OnlineStatusConsumer.as_asgi()),
]
