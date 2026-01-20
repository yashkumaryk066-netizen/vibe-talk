// 🎯 VibeTalk - Advanced Interaction Components
// Developer: Yash Ankush Mishra (Rangra Developer)
// Premium 3D, Particles, Sound, Haptics

import React, { useEffect, useRef, useState } from 'react';

// ========================================
// 🎆 PARTICLE CELEBRATION EFFECT
// ========================================

export const ParticleCelebration = ({ trigger, color = '#00d2ff' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!trigger || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 100;

        class Particle {
            constructor() {
                this.x = canvas.width / 2;
                this.y = canvas.height / 2;
                this.vx = (Math.random() - 0.5) * 10;
                this.vy = (Math.random() - 0.5) * 10;
                this.life = 1;
                this.size = Math.random() * 4 + 2;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += 0.1; // Gravity
                this.life -= 0.01;
            }

            draw() {
                ctx.globalAlpha = this.life;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();

                if (particle.life <= 0) {
                    particles.splice(index, 1);
                }
            });

            if (particles.length > 0) {
                requestAnimationFrame(animate);
            }
        }

        animate();
    }, [trigger, color]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-50"
            style={{ display: trigger ? 'block' : 'none' }}
        />
    );
};

// ========================================
// 🎴 3D TILT CARD (Mouse Follow)
// ========================================

export const Card3D = ({ children, className = '' }) => {
    const cardRef = useRef(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        const handleMouseMove = (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * 10; // Max 10 deg
            const rotateY = ((centerX - x) / centerX) * 10;

            card.style.setProperty('--tilt-x', `${rotateY}deg`);
            card.style.setProperty('--tilt-y', `${rotateX}deg`);
        };

        const handleMouseLeave = () => {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
        };

        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={`card-3d-tilt ${className}`}
            style={{
                transition: 'transform 0.1s ease-out',
            }}
        >
            {children}
        </div>
    );
};

// ========================================
// 🔊 SOUND EFFECT PLAYER
// ========================================

const soundCache = {};

export const playSound = (soundName, volume = 0.5) => {
    const sounds = {
        click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSV+zO/aizkHGGS57OihUhELTKXh8LJnHgU2jdXwzHwrBSh+yu/dkj0IElyx6OmpWRQLSKDf87dpJAU0i9Tvzn8q',
        swipe: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSV+zO/aizkHGGS57OihUhELTKXh8LJnHgU2jdXwzHwrBSh+yu/dkj0IElyx6OmpWRQLSKDf87dpJAU0i9Tvzn8q',
        match: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSV+zO/aizkHGGS57OihUhELTKXh8LJnHgU2jdXwzHwrBSh+yu/dkj0IElyx6OmpWRQLSKDf87dpJAU0i9Tvzn8q',
    };

    if (!sounds[soundName]) return;

    if (!soundCache[soundName]) {
        soundCache[soundName] = new Audio(sounds[soundName]);
    }

    const audio = soundCache[soundName].cloneNode();
    audio.volume = volume;
    audio.play().catch(() => { });
};

// ========================================
// 📳 HAPTIC FEEDBACK
// ========================================

export const haptic = (type = 'light') => {
    if (!navigator.vibrate) return;

    const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 50, 10],
        error: [50, 100, 50],
        double: [10, 50, 10],
    };

    navigator.vibrate(patterns[type] || patterns.light);
};

// ========================================
// 🎯 INTERACTIVE BUTTON WITH FEEDBACK
// ========================================

export const InteractiveButton = ({
    children,
    onClick,
    sound = 'click',
    hapticType = 'light',
    className = '',
    ...props
}) => {
    const handleClick = (e) => {
        playSound(sound);
        haptic(hapticType);
        if (onClick) onClick(e);
    };

    return (
        <button
            onClick={handleClick}
            className={`btn-press btn-ripple ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// ========================================
// 🌊 BLOB CURSOR FOLLOWER
// ========================================

export const BlobCursor = () => {
    const blobRef = useRef(null);

    useEffect(() => {
        const blob = blobRef.current;
        if (!blob) return;

        let mouseX = 0;
        let mouseY = 0;
        let blobX = 0;
        let blobY = 0;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const animate = () => {
            blobX += (mouseX - blobX) * 0.1;
            blobY += (mouseY - blobY) * 0.1;

            blob.style.transform = `translate(${blobX - 25}px, ${blobY - 25}px)`;
            requestAnimationFrame(animate);
        };

        document.addEventListener('mousemove', handleMouseMove);
        animate();

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div
            ref={blobRef}
            className="fixed w-12 h-12 rounded-full pointer-events-none z-50 morphing-blob blob-gradient opacity-30 blur-xl"
            style={{ transition: 'none' }}
        />
    );
};

// ========================================
// ✨ SHIMMER LOADING CARD
// ========================================

export const ShimmerCard = () => (
    <div className="glass-ultra rounded-2xl p-6 shimmer">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/10 rounded-full" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
        </div>
        <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded" />
            <div className="h-3 bg-white/10 rounded w-5/6" />
        </div>
    </div>
);

// ========================================
// 🎊 SUCCESS CELEBRATION
// ========================================

export const SuccessCelebration = ({ show, onComplete }) => {
    useEffect(() => {
        if (show) {
            haptic('success');
            playSound('match');

            // Confetti
            if (window.confetti) {
                window.confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                });
            }

            setTimeout(() => {
                if (onComplete) onComplete();
            }, 2000);
        }
    }, [show, onComplete]);

    if (!show) return null;

    return (
        <>
            <ParticleCelebration trigger={show} />
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                <div className="glass-ultra p-8 rounded-3xl text-center animate-in zoom-in-95 scale-up">
                    <div className="text-8xl mb-4 float-gentle">🎉</div>
                    <h2 className="text-3xl font-black neon-text-cyan mb-2">
                        It's a Match!
                    </h2>
                    <p className="text-white/70">Start chatting now!</p>
                </div>
            </div>
        </>
    );
};

// ========================================
// 🎨 GRADIENT AVATAR
// ========================================

export const GradientAvatar = ({ src, name, size = 'md', online = false }) => {
    const sizes = {
        sm: 'w-10 h-10',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32',
    };

    return (
        <div className={`relative ${sizes[size]}`}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500 via-purple-500 to-pink-500 blur opacity-75 animate-pulse" />
            <div className="relative w-full h-full rounded-full p-0.5 bg-gradient-to-br from-cyan-500 to-purple-500">
                <div className="w-full h-full rounded-full bg-black overflow-hidden">
                    {src ? (
                        <img src={src} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                            {name?.[0]?.toUpperCase() || '?'}
                        </div>
                    )}
                </div>
            </div>
            {online && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-black shadow-lg animate-pulse" />
            )}
        </div>
    );
};

// ========================================
// 🎯 SWIPE GESTURE DETECTOR
// ========================================

export const useSwipeGesture = (onSwipeLeft, onSwipeRight) => {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(0);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            haptic('medium');
            playSound('swipe');
            onSwipeLeft?.();
        }
        if (isRightSwipe) {
            haptic('medium');
            playSound('swipe');
            onSwipeRight?.();
        }
    };

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };
};

export default {
    ParticleCelebration,
    Card3D,
    playSound,
    haptic,
    InteractiveButton,
    BlobCursor,
    ShimmerCard,
    SuccessCelebration,
    GradientAvatar,
    useSwipeGesture,
};
