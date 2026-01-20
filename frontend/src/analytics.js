# 🚀 VibeTalk - Critical Production Features Implementation
# Developer: Yash Ankush Mishra(Rangra Developer)

# ========================================
# 1. GOOGLE ANALYTICS INTEGRATION
# ========================================

# frontend / src / analytics.js
export const initAnalytics = () => {
    // Google Analytics 4
    const GA_ID = import.meta.env.VITE_GA_ID || 'G-XXXXXXXXXX';

    // Load GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA_ID, {
        send_page_view: true,
        cookie_flags: 'SameSite=None;Secure'
    });

    window.gtag = gtag;
};

// Track events
export const trackEvent = (eventName, properties = {}) => {
    if (window.gtag) {
        window.gtag('event', eventName, properties);
    }
    console.log('📊 Analytics:', eventName, properties);
};

// Predefined events
export const Analytics = {
    // Auth
    signup: (method) => trackEvent('sign_up', { method }),
    login: (method) => trackEvent('login', { method }),

    // Profile
    profileComplete: (completion) => trackEvent('profile_completed', { completion_rate: completion }),
    photoUpload: () => trackEvent('photo_uploaded'),

    // Discovery
    profileView: (userId) => trackEvent('profile_view', { profile_id: userId }),
    swipeLeft: () => trackEvent('swipe_left'),
    swipeRight: () => trackEvent('swipe_right'),
    superLike: () => trackEvent('super_like'),

    // Matching
    match: () => trackEvent('match_created'),

    // Messaging
    messageSent: (type) => trackEvent('message_sent', { message_type: type }),
    voiceNoteSent: () => trackEvent('voice_note_sent'),

    // Premium
    premiumView: () => trackEvent('premium_viewed'),
    subscribe: (plan) => trackEvent('subscribe', { plan }),

    // Engagement
    dailyLogin: (streak) => trackEvent('daily_login', { streak }),
    sessionDuration: (seconds) => trackEvent('session_duration', { value: seconds }),
};

// Usage in App.jsx:
// import { initAnalytics, Analytics } from './analytics';
// useEffect(() => { initAnalytics(); }, []);
// Analytics.signup('google'); // On signup
