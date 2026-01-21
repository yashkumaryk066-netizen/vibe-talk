from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, ProfileViewSet, UserInteractionViewSet, ChatRoomViewSet, MessageViewSet, BlockViewSet, ReportViewSet, VoiceRoomViewSet, UserContentViewSet

router = DefaultRouter()
router.register(r'auth', AuthViewSet, basename='auth')
router.register(r'profiles', ProfileViewSet)
router.register(r'interactions', UserInteractionViewSet)
router.register(r'rooms', ChatRoomViewSet) # Private chats
router.register(r'public-rooms', VoiceRoomViewSet) # Public/Voice rooms
router.register(r'messages', MessageViewSet)
router.register(r'blocks', BlockViewSet)
router.register(r'reports', ReportViewSet)
router.register(r'content', UserContentViewSet)


urlpatterns = router.urls
