// 🛠️ VibeTalk - Utility Functions
// Developer: Yash Ankush Mishra (Rangra Developer)

// ========================================
// 📅 DATE & TIME UTILITIES
// ========================================

export const formatTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Just now, 5m ago, 2h ago, Yesterday, Monday, 12 Jan
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return days[d.getDay()];
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]}`;
};

export const formatMessageTime = (date) => {
    const d = new Date(date);
    const hours = d.getHours();
    const mins = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${ampm}`;
};

export const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getRelativeTime = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffSecs < 60) return 'active now';
    if (diffMins < 60) return `active ${diffMins}m ago`;
    if (diffHours < 24) return `active ${diffHours}h ago`;
    if (diffDays < 7) return `active ${diffDays}d ago`;
    return 'active long ago';
};

// ========================================
// 🔒 INPUT SANITIZATION (XSS Protection)
// ========================================

export const sanitizeHTML = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

export const escapeHTML = (text) => {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

export const validateInput = (input, maxLength = 500) => {
    if (!input || typeof input !== 'string') return false;
    if (input.trim().length === 0) return false;
    if (input.length > maxLength) return false;
    return true;
};

// ========================================
// 📁 FILE VALIDATION
// ========================================

export const validateImage = (file, maxSizeMB = 5) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Use JPG, PNG, GIF, or WebP' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: `File too large. Max size is ${maxSizeMB}MB` };
    }

    return { valid: true, error: null };
};

export const validateVoiceNote = (file, maxSizeMB = 10) => {
    const allowedTypes = ['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav'];
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Invalid audio format' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: `Audio file too large. Max ${maxSizeMB}MB` };
    }

    return { valid: true, error: null };
};

export const getFileSizeDisplay = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ========================================
// 🔗 URL UTILITIES
// ========================================

export const extractURLs = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex) || [];
};

export const linkify = (text) => {
    return text.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-cyan-400 underline">$1</a>'
    );
};

export const isValidURL = (string) => {
    try {
        new URL(string);
        return true;
    } catch {
        return false;
    }
};

// ========================================
// 🎨 COLOR UTILITIES
// ========================================

export const getAvatarColor = (name) => {
    const colors = [
        'from-pink-500 to-rose-500',
        'from-purple-500 to-indigo-500',
        'from-blue-500 to-cyan-500',
        'from-green-500 to-emerald-500',
        'from-yellow-500 to-orange-500',
        'from-red-500 to-pink-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
};

export const getInitials = (name) => {
    if (!name) return '?';
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// ========================================
// 📊 PROFILE COMPLETION CALCULATOR
// ========================================

export const calculateProfileCompletion = (profile) => {
    const fields = [
        profile.name,
        profile.bio,
        profile.age,
        profile.location,
        profile.gender,
        profile.interested_in,
        profile.interests,
        profile.profile_pic || profile.google_pic_url,
        profile.images && profile.images.length > 0,
    ];

    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
};

// ========================================
// 🔍 SEARCH UTILITIES
// ========================================

export const fuzzySearch = (query, text) => {
    if (!query || !text) return false;

    query = query.toLowerCase();
    text = text.toLowerCase();

    let queryIndex = 0;
    for (let i = 0; i < text.length && queryIndex < query.length; i++) {
        if (text[i] === query[queryIndex]) {
            queryIndex++;
        }
    }

    return queryIndex === query.length;
};

export const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-cyan-400/30 text-white">$1</mark>');
};

// ========================================
// 📱 DEVICE DETECTION
// ========================================

export const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isIOS = () => {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const isAndroid = () => {
    return /Android/i.test(navigator.userAgent);
};

export const getDeviceInfo = () => {
    return {
        isMobile: isMobileDevice(),
        isIOS: isIOS(),
        isAndroid: isAndroid(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
    };
};

// ========================================
// 🎲 RANDOM UTILITIES
// ========================================

export const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

export const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ========================================
// 🔢 NUMBER UTILITIES
// ========================================

export const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

export const clamp = (value, min, max) => {
    return Math.min(Math.max(value, min), max);
};

// ========================================
// 🎯 DISTANCE CALCULATION (Geolocation)
// ========================================

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

export const formatDistance = (km) => {
    if (km < 1) return `${Math.round(km * 1000)}m away`;
    if (km < 10) return `${km.toFixed(1)}km away`;
    return `${Math.round(km)}km away`;
};

// ========================================
// 💾 STORAGE UTILITIES
// ========================================

export const safeJSONParse = (str, fallback = null) => {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
};

export const clearOldCache = (prefix = 'vibe_', maxAgeDays = 7) => {
    const maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
    const now = Date.now();

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix)) {
            const item = safeJSONParse(localStorage.getItem(key));
            if (item?.timestamp && (now - item.timestamp > maxAge)) {
                localStorage.removeItem(key);
            }
        }
    }
};

// ========================================
// 🔐 ENCRYPTION (Basic - for non-sensitive data)
// ========================================

export const simpleEncrypt = (text) => {
    return btoa(encodeURIComponent(text));
};

export const simpleDecrypt = (encrypted) => {
    try {
        return decodeURIComponent(atob(encrypted));
    } catch {
        return null;
    }
};

// ========================================
// 📋 FORM VALIDATION
// ========================================

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const validatePassword = (password) => {
    return {
        isValid: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecialChar: /[!@#$%^&*]/.test(password),
    };
};

export const validateUsername = (username) => {
    if (username.length < 3 || username.length > 20) {
        return { valid: false, error: 'Username must be 3-20 characters' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, error: 'Only letters, numbers, and underscores allowed' };
    }
    return { valid: true, error: null };
};

// ========================================
// 🎵 AUDIO UTILITIES
// ========================================

export const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play().catch(err => console.error('Sound play failed:', err));
};

export const vibrate = (pattern = [200]) => {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
};

// ========================================
// 📊 ANALYTICS HELPERS
// ========================================

export const trackEvent = (eventName, properties = {}) => {
    // Placeholder for analytics (Google Analytics, Mixpanel, etc.)
    console.log('📊 Event:', eventName, properties);

    // Example: Google Analytics
    if (window.gtag) {
        window.gtag('event', eventName, properties);
    }
};

// ========================================
// 🔄 ASYNC RETRY UTILITY
// ========================================

export const retryAsync = async (fn, maxRetries = 3, delay = 1000) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i === maxRetries - 1) throw err;
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
};

// ========================================
// 🎯 MATCHING SCORE CALCULATOR
// ========================================

export const calculateMatchScore = (user, targetUser) => {
    let score = 0;

    // Interest overlap
    const userInterests = user.interests?.split(',').map(i => i.trim().toLowerCase()) || [];
    const targetInterests = targetUser.interests?.split(',').map(i => i.trim().toLowerCase()) || [];
    const commonInterests = userInterests.filter(i => targetInterests.includes(i));
    score += commonInterests.length * 15;

    // Age compatibility
    const ageDiff = Math.abs(user.age - targetUser.age);
    if (ageDiff <= 2) score += 20;
    else if (ageDiff <= 5) score += 10;
    else if (ageDiff <= 10) score += 5;

    // Profile completion
    const userCompletion = calculateProfileCompletion(user);
    const targetCompletion = calculateProfileCompletion(targetUser);
    score += Math.min(userCompletion, targetCompletion) / 5;

    // Location (if available)
    if (user.location === targetUser.location) score += 15;

    return Math.min(score, 100); // Cap at 100
};

export default {
    formatTime,
    formatMessageTime,
    formatDuration,
    getRelativeTime,
    sanitizeHTML,
    escapeHTML,
    validateInput,
    validateImage,
    validateVoiceNote,
    getFileSizeDisplay,
    extractURLs,
    linkify,
    isValidURL,
    getAvatarColor,
    getInitials,
    calculateProfileCompletion,
    fuzzySearch,
    highlightText,
    isMobileDevice,
    isIOS,
    isAndroid,
    getDeviceInfo,
    getRandomElement,
    shuffleArray,
    generateId,
    formatNumber,
    clamp,
    calculateDistance,
    formatDistance,
    safeJSONParse,
    clearOldCache,
    simpleEncrypt,
    simpleDecrypt,
    validateEmail,
    validatePassword,
    validateUsername,
    playSound,
    vibrate,
    trackEvent,
    retryAsync,
    calculateMatchScore
};
