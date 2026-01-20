// 🎨 VibeTalk - Premium UI Components Library
// Developer: Yash Ankush Mishra (Rangra Developer)

import React from 'react';
import { Loader2 } from 'lucide-react';

// ========================================
// 🎯 LOADING STATES
// ========================================

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    };

    return (
        <Loader2
            className={`animate-spin text-cyan-400 ${sizes[size]} ${className}`}
        />
    );
};

export const SkeletonCard = () => (
    <div className="glass p-6 rounded-xl animate-pulse">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/10 rounded-full" />
            <div className="flex-1">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
        </div>
        <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded" />
            <div className="h-3 bg-white/10 rounded w-5/6" />
        </div>
    </div>
);

export const SkeletonMessage = () => (
    <div className="flex items-end gap-2 mb-4">
        <div className="w-8 h-8 bg-white/10 rounded-full flex-shrink-0" />
        <div className="bg-white/10 rounded-2xl p-3 max-w-[70%]">
            <div className="h-3 bg-white/20 rounded w-48 mb-2" />
            <div className="h-3 bg-white/20 rounded w-32" />
        </div>
    </div>
);

export const LoadingScreen = ({ message = 'Loading...' }) => (
    <div className="screen flex flex-col items-center justify-center min-h-screen">
        <div className="radar-loader mb-4" />
        <p className="text-white/60 text-sm animate-pulse">{message}</p>
    </div>
);

// ========================================
// ❌ ERROR STATES
// ========================================

export const ErrorMessage = ({ title = 'Error', message, onRetry }) => (
    <div className="glass p-6 rounded-xl border-l-4 border-red-500">
        <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-500 text-xl">⚠️</span>
            </div>
            <div className="flex-1">
                <h3 className="text-red-400 font-bold mb-1">{title}</h3>
                <p className="text-white/70 text-sm mb-3">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="text-cyan-400 text-sm font-semibold hover:underline"
                    >
                        Try Again →
                    </button>
                )}
            </div>
        </div>
    </div>
);

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        // TODO: Send to Sentry
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="screen flex items-center justify-center min-h-screen">
                    <div className="glass p-8 rounded-2xl max-w-md text-center">
                        <div className="text-6xl mb-4">😵</div>
                        <h2 className="text-2xl font-bold mb-2">Oops! Something broke</h2>
                        <p className="text-white/60 mb-6">
                            Don't worry, it's not your fault. We're on it!
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn"
                        >
                            Refresh App
                        </button>
                        {process.env.NODE_ENV === 'development' && (
                            <details className="mt-4 text-left text-xs text-red-400">
                                <summary>Error Details</summary>
                                <pre className="mt-2 p-2 bg-black/50 rounded overflow-auto">
                                    {this.state.error?.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// ========================================
// 📭 EMPTY STATES
// ========================================

export const EmptyState = ({ icon, title, message, action }) => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="text-6xl mb-4 opacity-50">{icon}</div>
        <h3 className="text-xl font-bold mb-2 text-white/90">{title}</h3>
        <p className="text-white/50 mb-6 max-w-sm">{message}</p>
        {action && (
            <button onClick={action.onClick} className="btn-secondary">
                {action.text}
            </button>
        )}
    </div>
);

// ========================================
// ✅ SUCCESS FEEDBACK
// ========================================

export const SuccessBanner = ({ message, onClose }) => (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top">
        <div className="glass px-6 py-3 rounded-full border border-green-500/30 bg-green-500/10 flex items-center gap-3">
            <span className="text-green-400 text-xl">✓</span>
            <span className="text-white font-medium">{message}</span>
            {onClose && (
                <button onClick={onClose} className="text-white/50 hover:text-white ml-2">
                    ×
                </button>
            )}
        </div>
    </div>
);

// ========================================
// 🔔 CONFIRMATION DIALOG
// ========================================

export const ConfirmDialog = ({ title, message, onConfirm, onCancel, danger = false }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
        <div className="glass p-6 rounded-2xl max-w-sm w-full animate-in zoom-in-95">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-white/70 mb-6">{message}</p>
            <div className="flex gap-3">
                <button onClick={onCancel} className="btn-secondary flex-1">
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className={`btn flex-1 ${danger ? 'bg-red-500 hover:bg-red-600' : ''}`}
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
);

// ========================================
// 🖼️ IMAGE PREVIEW
// ========================================

export const ImagePreview = ({ file, onRemove, onConfirm }) => {
    const [preview, setPreview] = React.useState(null);

    React.useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, [file]);

    if (!preview) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
            <div className="flex-1 flex items-center justify-center p-4">
                <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
            </div>
            <div className="p-4 bg-gradient-to-t from-black to-transparent flex gap-3">
                <button onClick={onRemove} className="btn-secondary flex-1">
                    Remove
                </button>
                <button onClick={onConfirm} className="btn flex-1">
                    Send Image
                </button>
            </div>
        </div>
    );
};

// ========================================
// 🎵 VOICE MESSAGE PLAYER (WAVEFORM)
// ========================================

export const VoicePlayer = ({ audioUrl, senderName }) => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);
    const audioRef = React.useRef(new Audio(audioUrl));

    React.useEffect(() => {
        const audio = audioRef.current;

        audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration);
        });

        audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
            setIsPlaying(false);
            setCurrentTime(0);
        });

        return () => {
            audio.pause();
            audio.removeEventListener('loadedmetadata', () => { });
            audio.removeEventListener('timeupdate', () => { });
            audio.removeEventListener('ended', () => { });
        };
    }, [audioUrl]);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (time) => {
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 min-w-[200px]">
            <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center flex-shrink-0 hover:scale-110 transition"
            >
                {isPlaying ? (
                    <svg className="w-4 h-4" fill="white" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4 ml-0.5" fill="white" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>

            <div className="flex-1">
                <div className="h-8 flex items-center gap-0.5">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className={`flex-1 rounded-full transition-all ${(i / 20) * 100 <= progress ? 'bg-cyan-400' : 'bg-white/20'
                                }`}
                            style={{ height: `${Math.random() * 20 + 10}px` }}
                        />
                    ))}
                </div>
                <div className="text-xs text-white/50 mt-1">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
            </div>
        </div>
    );
};

// ========================================
// 🔔 NOTIFICATION BADGE
// ========================================

export const Badge = ({ count, className = '' }) => {
    if (!count || count === 0) return null;

    return (
        <div className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${className}`}>
            {count > 99 ? '99+' : count}
        </div>
    );
};

// ========================================
// 💬 TYPING INDICATOR
// ========================================

export const TypingIndicator = ({ userName = 'Someone' }) => (
    <div className="flex items-center gap-2 text-white/50 text-sm mb-2">
        <div className="flex gap-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="text-xs">{userName} is typing...</span>
    </div>
);

// ========================================
// 🟢 ONLINE STATUS INDICATOR
// ========================================

export const OnlineIndicator = ({ isOnline, lastSeen, size = 'sm' }) => {
    const sizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    if (isOnline) {
        return (
            <div className={`${sizes[size]} bg-green-500 rounded-full border-2 border-black shadow-lg`} title="Online" />
        );
    }

    if (lastSeen) {
        const diff = Date.now() - new Date(lastSeen).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        let text = 'Active ';
        if (days > 0) text += `${days}d ago`;
        else if (hours > 0) text += `${hours}h ago`;
        else if (minutes > 0) text += `${minutes}m ago`;
        else text += 'just now';

        return (
            <div className={`${sizes[size]} bg-white/30 rounded-full border-2 border-black`} title={text} />
        );
    }

    return null;
};

// ========================================
// 📊 PROFILE COMPLETION INDICATOR
// ========================================

export const ProfileCompletionBar = ({ percentage }) => (
    <div className="w-full">
        <div className="flex justify-between text-xs mb-2">
            <span className="text-white/70">Profile Strength</span>
            <span className="text-cyan-400 font-bold">{percentage}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-500"
                style={{ width: `${percentage}%` }}
            />
        </div>
        {percentage < 100 && (
            <p className="text-xs text-white/50 mt-2">
                Complete your profile to get 3x more matches! 🔥
            </p>
        )}
    </div>
);

// ========================================
// 🎯 BUTTON VARIANTS
// ========================================

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    onClick,
    className = ''
}) => {
    const variants = {
        primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg',
        secondary: 'bg-white/10 border border-white/20 text-white hover:bg-white/20',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        success: 'bg-green-500 text-white hover:bg-green-600'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
        >
            {loading ? (
                <LoadingSpinner size="sm" className="mx-auto" />
            ) : (
                children
            )}
        </button>
    );
};

export default {
    LoadingSpinner,
    SkeletonCard,
    SkeletonMessage,
    LoadingScreen,
    ErrorMessage,
    ErrorBoundary,
    EmptyState,
    SuccessBanner,
    ConfirmDialog,
    ImagePreview,
    VoicePlayer,
    Badge,
    TypingIndicator,
    OnlineIndicator,
    ProfileCompletionBar,
    Button
};
