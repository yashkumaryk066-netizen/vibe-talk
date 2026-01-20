# 🔔 VibeTalk - Push Notifications System
# Developer: Yash Ankush Mishra (Rangra Developer)

"""
Complete Push Notification System
- Web Push (PWA)
- FCM (Firebase Cloud Messaging)
- Email Notifications
"""

#========================================
# BACKEND - Django Push Notifications
#========================================

# backend/api/notifications.py

from django.conf import settings
from firebase_admin import messaging, initialize_app, credentials
import logging

logger = logging.getLogger(__name__)

# Initialize Firebase (run once at startup)
try:
    cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
    initialize_app(cred)
except Exception as e:
    logger.error(f"Firebase initialization failed: {e}")


class PushNotificationService:
    """Send push notifications via FCM"""
    
    @staticmethod
    def send_match_notification(user, matched_user):
        """Notify user of a new match"""
        try:
            if not user.fcm_token:
                return False
            
            message = messaging.Message(
                notification=messaging.Notification(
                    title="🎉 It's a Match!",
                    body=f"You matched with {matched_user.name}! Say hi now!",
                    image=matched_user.profile_pic_url,
                ),
                data={
                    'type': 'match',
                    'user_id': str(matched_user.id),
                    'click_action': f'/chat/{matched_user.id}',
                },
                token=user.fcm_token,
                android=messaging.AndroidConfig(
                    priority='high',
                    notification=messaging.AndroidNotification(
                        sound='match_sound.mp3',
                        color='#00d2ff',
                    ),
                ),
                apns=messaging.APNSConfig(
                    payload=messaging.APNSPayload(
                        aps=messaging.Aps(
                            sound='match_sound.caf',
                            badge=1,
                        ),
                    ),
                ),
            )
            
            response = messaging.send(message)
            logger.info(f"Sent match notification: {response}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send notification: {e}")
            return False
    
    @staticmethod
    def send_message_notification(user, sender, message_text):
        """Notify user of a new message"""
        try:
            if not user.fcm_token:
                return False
            
            # Truncate long messages
            preview = message_text[:50] + '...' if len(message_text) > 50 else message_text
            
            message = messaging.Message(
                notification=messaging.Notification(
                    title=f"💬 {sender.name}",
                    body=preview,
                    image=sender.profile_pic_url,
                ),
                data={
                    'type': 'message',
                    'sender_id': str(sender.id),
                    'click_action': f'/chat/{sender.id}',
                },
                token=user.fcm_token,
            )
            
            response = messaging.send(message)
            return True
            
        except Exception as e:
            logger.error(f"Message notification failed: {e}")
            return False
    
    @staticmethod
    def send_like_notification(user, liker):
        """Notify user someone liked them (Premium feature)"""
        if not user.is_premium:
            return  # Only notify premium users
        
        try:
            message = messaging.Message(
                notification=messaging.Notification(
                    title="❤️ Someone Likes You!",
                    body=f"{liker.name} swiped right on you!",
                ),
                data={'type': 'like', 'user_id': str(liker.id)},
                token=user.fcm_token,
            )
            messaging.send(message)
        except Exception as e:
            logger.error(f"Like notification failed: {e}")


# Model changes needed:
# Add to Profile model:
# fcm_token = models.CharField(max_length=255, blank=True, null=True)
# notification_enabled = models.BooleanField(default=True)

#========================================
# FRONTEND - FCM Integration
#========================================

# frontend/public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  projectId: "YOUR_PROJECT_ID",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
    badge: '/badge.png',
    image: payload.notification.image,
    data: payload.data,
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: 'Open' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    const clickAction = event.notification.data.click_action;
    clients.openWindow(clickAction || '/');
  }
});

# frontend/src/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      
      console.log('FCM Token:', token);
      
      // Send token to backend
      await api.updateFCMToken(token);
      
      return token;
    }
  } catch (error) {
    console.error('Notification permission error:', error);
  }
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Foreground message:', payload);
      resolve(payload);
    });
  });
};

# Usage in App.jsx:
/*
import { requestNotificationPermission, onMessageListener } from './firebase';

useEffect(() => {
  requestNotificationPermission();
  
  onMessageListener().then((payload) => {
    toast.success(payload.notification.title);
  });
}, []);
*/

#========================================
# EMAIL NOTIFICATIONS
#========================================

# backend/api/email_notifications.py

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class EmailService:
    """Send transactional emails"""
    
    @staticmethod
    def send_welcome_email(user):
        """Welcome email after signup"""
        try:
            subject = "Welcome to VibeTalk! 🎉"
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = user.email
            
            # HTML template
            html_content = f"""
            <html>
            <body style="font-family: Arial; background: #f5f5f5; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px;">
                    <h1 style="color: #00d2ff;">Welcome to VibeTalk! 🎉</h1>
                    <p>Hi {user.name},</p>
                    <p>We're excited to have you! Start connecting with amazing people near you.</p>
                    
                    <a href="{settings.FRONTEND_URL}/profile/edit" 
                       style="display: inline-block; background: linear-gradient(135deg, #00d2ff, #3a7bd5); 
                              color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; 
                              margin: 20px 0;">
                        Complete Your Profile
                    </a>
                    
                    <h3>Quick Tips:</h3>
                    <ul>
                        <li>Add multiple photos for better matches</li>
                        <li>Write an interesting bio</li>
                        <li>Be authentic and respectful</li>
                    </ul>
                    
                    <p>Happy matching!<br>The VibeTalk Team</p>
                </div>
            </body>
            </html>
            """
            
            msg = EmailMultiAlternatives(subject, '', from_email, [to_email])
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            
            logger.info(f"Welcome email sent to {user.email}")
            
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
    
    @staticmethod
    def send_match_email(user, matched_user):
        """Email notification for new match"""
        if not user.email_notifications_enabled:
            return
        
        try:
            subject = f"🎉 You matched with {matched_user.name}!"
            html_content = f"""
            <html>
            <body style="font-family: Arial; padding: 20px;">
                <h2>It's a Match!</h2>
                <p>You and {matched_user.name} liked each other!</p>
                <img src="{matched_user.profile_pic_url}" style="width: 100px; border-radius: 50%;">
                <p><a href="{settings.FRONTEND_URL}/chat/{matched_user.id}">Start chatting now!</a></p>
            </body>
            </html>
            """
            
            msg = EmailMultiAlternatives(subject, '', settings.DEFAULT_FROM_EMAIL, [user.email])
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            
        except Exception as e:
            logger.error(f"Match email failed: {e}")

# Settings additions:
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.sendgrid.net'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# EMAIL_HOST_USER = 'apikey'
# EMAIL_HOST_PASSWORD = os.environ.get('SENDGRID_API_KEY')
# DEFAULT_FROM_EMAIL = 'VibeTalk <noreply@vibetalk.com>'

#========================================
# INSTALLATION
#========================================

# Backend:
# pip install firebase-admin

# Frontend:
# npm install firebase

# Firebase Console Setup:
# 1. Go to console.firebase.google.com
# 2. Create project
# 3. Enable Cloud Messaging
# 4. Download service account JSON (backend)
# 5. Get web config (frontend)
# 6. Generate VAPID key

# SendGrid Setup:
# 1. signup at sendgrid.com
# 2. Create API key
# 3. Verify sender email
# 4. Add to .env: SENDGRID_API_KEY=xxx
