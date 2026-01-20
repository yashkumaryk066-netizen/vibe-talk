# VibeTalk - Sentry Error Monitoring Setup
# Developer: Yash Ankush Mishra (Rangra Developer)

"""
Backend Sentry Integration (Django)
Install: pip install sentry-sdk
"""

# backend/config/settings.py additions:

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.redis import RedisIntegration
import os

if not DEBUG:  # Only in production
    sentry_sdk.init(
        dsn=os.environ.get('SENTRY_DSN'),  # Get from sentry.io
        integrations=[
            DjangoIntegration(),
            RedisIntegration(),
        ],
        traces_sample_rate=0.1,  # 10% of transactions for performance
        send_default_pii=False,  # Don't send personal data
        environment='production',
        release=f"vibetalk@{os.environ.get('APP_VERSION', '2.0.0')}",
        
        # Custom error filtering
        before_send=lambda event, hint: filter_sentry_event(event, hint),
    )

def filter_sentry_event(event, hint):
    """Filter out noise from Sentry"""
    # Ignore specific errors
    if 'exc_info' in hint:
        exc_type, exc_value, tb = hint['exc_info']
        if isinstance(exc_value, KeyboardInterrupt):
            return None  # Don't send
    
    return event

# -------------------------------------------
# FRONTEND SENTRY (React)
# -------------------------------------------

# frontend/src/sentry.js
import * as Sentry from "@sentry/react";

export const initSentry = () => {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: "production",
      release: "vibetalk@2.0.0",
      
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      beforeSend(event, hint) {
        // Filter out development errors
        if (event.exception) {
          const error = hint.originalException;
          if (error && error.message && error.message.includes('ResizeObserver')) {
            return null; // Ignore known browser bug
          }
        }
        return event;
      },
    });
  }
};

// Set user context
export const setSentryUser = (user) => {
  Sentry.setUser({
    id: user.id,
    username: user.username,
    email: user.email,
  });
};

// Manual error capture
export const captureError = (error, context = {}) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

// Usage in App.jsx:
// import { initSentry, setSentryUser } from './sentry';
// useEffect(() => { initSentry(); }, []);
// setSentryUser(currentUser); // After login

# -------------------------------------------
# INSTALLATION
# -------------------------------------------

# Backend:
# pip install sentry-sdk

# Frontend:
# npm install @sentry/react

# Get DSN from: https://sentry.io (free tier)
# Add to .env:
# SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
# VITE_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
