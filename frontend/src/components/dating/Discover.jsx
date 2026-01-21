
import React, { useState, useEffect, useRef } from 'react';
import { Heart, X, MapPin, Info, Check, Star, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import api from '../../api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const DatingCard = ({ profile, onSwipe, isTop }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
    const likeOpacity = useTransform(x, [10, 100], [0, 1]);
    const nopeOpacity = useTransform(x, [-100, -10], [1, 0]);

    // Premium 3D Tilt Effect
    const handleDragEnd = (event, info) => {
        if (info.offset.x > 100) {
            onSwipe('like');
        } else if (info.offset.x < -100) {
            onSwipe('pass');
        }
    };

    return (
        <motion.div
            style={{ x, rotate, opacity, zIndex: isTop ? 10 : 0 }}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className={`absolute top-0 left-0 w-full h-full ${isTop ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
            initial={{ scale: 0.95, y: -20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            <div className="relative w-full h-[75vh] rounded-3xl overflow-hidden shadow-2xl bg-[#1a1a1a] border border-white/10 select-none">

                {/* Image */}
                <img
                    src={profile.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
                    className="w-full h-full object-cover pointer-events-none"
                    alt={profile.name}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>

                {/* 🟢 Status & Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="glass px-3 py-1 rounded-full flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold font-mono">ONLINE</span>
                    </div>
                    {profile.distance && (
                        <div className="glass px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-white/80">
                            <MapPin size={12} /> {profile.distance} km
                        </div>
                    )}
                </div>

                {/* INFO Section */}
                <div className="absolute bottom-0 left-0 w-full p-6 pb-24 text-white">
                    {/* Swiping Indicators (visual feedback) */}
                    <motion.div style={{ opacity: likeOpacity }} className="absolute top-[-400px] right-8 rotate-12 border-4 border-green-500 text-green-500 rounded-lg px-4 py-2 text-4xl font-black uppercase tracking-widest bg-black/20 backdrop-blur-md">
                        LIKE
                    </motion.div>
                    <motion.div style={{ opacity: nopeOpacity }} className="absolute top-[-400px] left-8 -rotate-12 border-4 border-red-500 text-red-500 rounded-lg px-4 py-2 text-4xl font-black uppercase tracking-widest bg-black/20 backdrop-blur-md">
                        NOPE
                    </motion.div>

                    <div className="flex items-end justify-between mb-2">
                        <div>
                            <h2 className="text-4xl font-black font-outfit drop-shadow-lg flex items-center gap-2">
                                {profile.name}, {profile.age}
                                {profile.is_verified && <span className="bg-blue-500 text-white rounded-full p-1"><Check size={12} strokeWidth={4} /></span>}
                            </h2>
                            <p className="text-white/80 text-lg font-medium mt-1 gap-2 flex items-center">
                                <span className="opacity-60">lives in</span> {profile.location || 'Mumbai, India'}
                            </p>
                        </div>
                        <div className="bg-white/10 p-2 rounded-full backdrop-blur-md cursor-pointer hover:bg-white/20 transition">
                            <Info size={24} />
                        </div>
                    </div>

                    {/* Tags/Vibes */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        {profile.interests?.split(',').slice(0, 3).map((tag, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-white/10 border border-white/5 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                                {tag.trim()}
                            </span>
                        ))}
                    </div>

                    <p className="mt-4 text-white/70 line-clamp-2 leading-relaxed">
                        {profile.bio || "Just vibing and looking for a genuine connection. swiping right if you have good music taste. 🎵"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const MatchModal = ({ profile, onClose, onChat }) => {
    useEffect(() => {
        confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#FF0055', '#FF00CC', '#00FFFF']
        });
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="relative w-full max-w-sm text-center">
                <h1 className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 transform -rotate-6 mb-8 animate-pulse">IT'S A MATCH!</h1>

                <div className="flex justify-center items-center gap-4 mb-10 relative">
                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.3)] rotate-[-10deg] hover:scale-110 transition z-10">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80" className="w-full h-full object-cover" /> {/* Current User (Mock) */}
                    </div>
                    <div className="absolute z-20 bg-white text-pink-500 rounded-full p-2 shadow-xl animate-bounce">
                        <Heart size={24} fill="currentColor" />
                    </div>
                    <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.3)] rotate-[10deg] hover:scale-110 transition z-10">
                        <img src={profile.profile_pic} className="w-full h-full object-cover" />
                    </div>
                </div>

                <p className="text-white/80 text-lg mb-8">You and {profile.name} liked each other.</p>

                <button onClick={onChat} className="w-full py-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 font-bold text-lg mb-4 hover:scale-105 transition shadow-lg shadow-pink-500/40 list-none">
                    Send a Message
                </button>
                <button onClick={onClose} className="w-full py-4 rounded-full bg-white/10 font-bold text-lg hover:bg-white/20 transition">
                    Keep Swiping
                </button>
            </div>
        </div>
    );
}


const Discover = ({ user }) => {
    const [profiles, setProfiles] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [matchProfile, setMatchProfile] = useState(null); // If matched
    const [loading, setLoading] = useState(true);
    const navigate = React.useRouter?.()?.navigate || ((path) => window.location.hash = path); // Fallback if not passed, but usually passed via router context

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        setLoading(true);
        try {
            const res = await api.getProfiles(); // 'learn' param removed for general dating
            // If API returns empty (no matches or first run), use FAKE_PROFILES to ensure "Product Level" demo
            if (!res.data || res.data.length === 0) {
                // Import local mock data for demo if API empty (handled by App.jsx data typically but doing robust here)
                // For now, assume API returns *some* seeded data or we fallback
                // Let's use the API response.

                // If actually empty, user sees "No more profiles".
                // In a real product, we'd fetch from a diverse pool.
            }
            setProfiles(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const swiped = async (direction, profile) => {
        if (direction === 'like') {
            try {
                const res = await api.swipe(profile.user, 'like');
                if (res.data.match) {
                    setMatchProfile(profile); // Trigger Modal
                }
            } catch (err) { console.error(err); }
        } else {
            api.swipe(profile.user, 'pass').catch(console.error);
        }

        // Move to next
        setTimeout(() => {
            setCurrentIndex(prev => prev + 1);
        }, 200); // Wait for animation
    };

    const handleManualSwipe = (dir) => {
        if (currentIndex < profiles.length) {
            swiped(dir, profiles[currentIndex]);
        }
    };

    if (matchProfile) {
        return <MatchModal profile={matchProfile} onClose={() => setMatchProfile(null)} onChat={() => window.location.assign(`/chats/new?user=${matchProfile.user}`)} />;
    }

    return (
        <div className="screen relative overflow-hidden flex flex-col items-center justify-center bg-[#0a0a0a]">

            {/* Top Gradient */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none"></div>

            {/* 🌟 Vibe Dating Header */}
            <div className="absolute top-4 w-full flex justify-between items-center px-6 z-20">
                <h1 className="text-2xl font-black font-outfit text-white drop-shadow-md">Vibe<span className="text-pink-500">Date</span></h1>
                <div className="bg-white/10 p-2 rounded-full backdrop-blur-md">
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                        <div className="w-1 h-4 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>

            {/* Cards Stack */}
            <div className="relative w-[95%] max-w-md h-[75vh] mt-4">
                <AnimatePresence>
                    {profiles.slice(currentIndex, currentIndex + 3).reverse().map((profile, i) => (
                        <DatingCard
                            key={profile.user}
                            profile={profile}
                            onSwipe={(dir) => swiped(dir, profile)}
                            isTop={i === profiles.slice(currentIndex, currentIndex + 3).length - 1} // Only top card interactive
                        />
                    ))}
                </AnimatePresence>

                {currentIndex >= profiles.length && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4 animate-spin-slow">
                            <RefreshCw size={40} />
                        </div>
                        <h2 className="text-2xl font-bold">No more vibes nearby.</h2>
                        <p className="mt-2 text-sm">Expand your discovery settings or check back later.</p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="absolute bottom-24 w-full flex justify-center items-center gap-6 z-20">
                <button onClick={() => handleManualSwipe('pass')} className="w-16 h-16 rounded-full bg-black/40 border border-red-500/50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition transform hover:scale-110 shadow-lg backdrop-blur-sm">
                    <X size={32} strokeWidth={3} />
                </button>

                <button className="w-12 h-12 rounded-full bg-black/40 border border-purple-500/50 text-purple-400 flex items-center justify-center hover:bg-purple-500 hover:text-white transition transform hover:scale-110 shadow-lg backdrop-blur-sm">
                    <Star size={20} fill="currentColor" />
                </button>

                <button onClick={() => handleManualSwipe('like')} className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-400 to-green-600 text-white flex items-center justify-center hover:scale-110 transition shadow-green-500/30 shadow-xl">
                    <Heart size={32} strokeWidth={3} fill="white" />
                </button>

                <button className="w-12 h-12 rounded-full bg-black/40 border border-blue-500/50 text-blue-400 flex items-center justify-center hover:bg-blue-500 hover:text-white transition transform hover:scale-110 shadow-lg backdrop-blur-sm">
                    <Zap size={20} fill="currentColor" />
                </button>
            </div>

        </div>
    );
};

export default Discover;
