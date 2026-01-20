// 🎯 VibeTalk - Custom React Hooks
// Developer: Yash Ankush Mishra (Rangra Developer)

import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';

// ========================================
// 🔄 API CALL HOOK (with loading & error states)
// ========================================

export const useAPI = (apiFunction) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (...args) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiFunction(...args);
            setData(response.data);
            return response.data;
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'Something went wrong';
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunction]);

    const reset = useCallback(() => {
        setData(null);
        setError(null);
        setLoading(false);
    }, []);

    return { data, loading, error, execute, reset };
};

// ========================================
// ⌨️ DEBOUNCE HOOK (for search, etc.)
// ========================================

export const useDebounce = (value, delay = 500) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
};

// ========================================
// 💾 LOCAL STORAGE HOOK (with sync)
// ========================================

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return initialValue;
        }
    });

    const setValue = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    }, [key, storedValue]);

    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setStoredValue(initialValue);
        } catch (error) {
            console.error(`Error removing ${key} from localStorage:`, error);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
};

// ========================================
// 👁️ INTERSECTION OBSERVER (lazy loading, infinite scroll)
// ========================================

export const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [entry, setEntry] = useState(null);
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            setEntry(entry);
        }, options);

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [options]);

    return { ref, isIntersecting, entry };
};

// ========================================
// 📱 WINDOW SIZE HOOK (responsive)
// ========================================

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowSize.width < 768;
    const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
    const isDesktop = windowSize.width >= 1024;

    return { ...windowSize, isMobile, isTablet, isDesktop };
};

// ========================================
// ⏱️ COUNTDOWN TIMER HOOK
// ========================================

export const useCountdown = (initialSeconds) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval = null;

        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(s => s - 1);
            }, 1000);
        } else if (seconds === 0) {
            setIsActive(false);
        }

        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const start = () => setIsActive(true);
    const pause = () => setIsActive(false);
    const reset = () => {
        setSeconds(initialSeconds);
        setIsActive(false);
    };

    return { seconds, isActive, start, pause, reset };
};

// ========================================
// 📋 CLIPBOARD HOOK
// ========================================

export const useClipboard = () => {
    const [copied, setCopied] = useState(false);

    const copy = useCallback(async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success('Copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy');
            console.error('Clipboard error:', err);
        }
    }, []);

    return { copied, copy };
};

// ========================================
// 🎤 VOICE RECORDING HOOK
// ========================================

export const useVoiceRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [duration, setDuration] = useState(0);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setDuration(0);

            // Start duration timer
            timerRef.current = setInterval(() => {
                setDuration(d => d + 1);
            }, 1000);

        } catch (err) {
            toast.error('Microphone access denied');
            console.error('Recording error:', err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setDuration(0);
        chunksRef.current = [];
    };

    return {
        isRecording,
        audioBlob,
        duration,
        startRecording,
        stopRecording,
        resetRecording
    };
};

// ========================================
// 🖼️ IMAGE COMPRESSION HOOK
// ========================================

export const useImageCompression = () => {
    const compress = useCallback(async (file, maxSizeMB = 1, maxWidthOrHeight = 1920) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidthOrHeight) {
                            height *= maxWidthOrHeight / width;
                            width = maxWidthOrHeight;
                        }
                    } else {
                        if (height > maxWidthOrHeight) {
                            width *= maxWidthOrHeight / height;
                            height = maxWidthOrHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    }, 'image/jpeg', 0.8); // 80% quality
                };

                img.onerror = reject;
                img.src = e.target.result;
            };

            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }, []);

    return { compress };
};

// ========================================
// 🔔 NOTIFICATION PERMISSION HOOK
// ========================================

export const useNotificationPermission = () => {
    const [permission, setPermission] = useState(Notification.permission);

    const requestPermission = async () => {
        if ('Notification' in window) {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result;
        }
        return 'denied';
    };

    const showNotification = (title, options = {}) => {
        if (permission === 'granted') {
            new Notification(title, {
                icon: '/logo.png',
                badge: '/logo.png',
                ...options
            });
        }
    };

    return { permission, requestPermission, showNotification };
};

// ========================================
// 🎮 KEYBOARD SHORTCUTS HOOK
// ========================================

export const useKeyPress = (targetKey, callback) => {
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === targetKey) {
                callback(e);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [targetKey, callback]);
};

// ========================================
// 🌐 ONLINE STATUS HOOK
// ========================================

export const useOnlineStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            toast.success('Back online!');
        };

        const handleOffline = () => {
            setIsOnline(false);
            toast.error('No internet connection');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
};

// ========================================
// 📜 INFINITE SCROLL HOOK
// ========================================

export const useInfiniteScroll = (fetchMore, hasMore = true) => {
    const [isFetching, setIsFetching] = useState(false);
    const observerTarget = useRef(null);

    useEffect(() => {
        if (!observerTarget.current || !hasMore) return;

        const observer = new IntersectionObserver(
            async (entries) => {
                if (entries[0].isIntersecting && !isFetching) {
                    setIsFetching(true);
                    await fetchMore();
                    setIsFetching(false);
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [fetchMore, hasMore, isFetching]);

    return { observerTarget, isFetching };
};

// ========================================
// ⏰ IDLE DETECTION HOOK
// ========================================

export const useIdleDetection = (timeoutMs = 300000) => { // 5 minutes default
    const [isIdle, setIsIdle] = useState(false);

    useEffect(() => {
        let timeout;

        const resetTimer = () => {
            clearTimeout(timeout);
            setIsIdle(false);
            timeout = setTimeout(() => setIsIdle(true), timeoutMs);
        };

        // Listen to user activity
        const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, resetTimer);
        });

        resetTimer(); // Initial call

        return () => {
            clearTimeout(timeout);
            events.forEach(event => {
                document.removeEventListener(event, resetTimer);
            });
        };
    }, [timeoutMs]);

    return isIdle;
};

export default {
    useAPI,
    useDebounce,
    useLocalStorage,
    useIntersectionObserver,
    useWindowSize,
    useCountdown,
    useClipboard,
    useVoiceRecorder,
    useImageCompression,
    useNotificationPermission,
    useKeyPress,
    useOnlineStatus,
    useInfiniteScroll,
    useIdleDetection
};
