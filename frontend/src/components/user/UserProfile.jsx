
import React, { useState, useRef } from 'react';
import { Play, Pause, MapPin, Briefcase, GraduationCap, Instagram, Mic, Edit3, Image as ImageIcon, Camera, ChevronLeft, Settings, Shield, Star, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../api';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';


// Premium Profile Component
const UserProfile = ({ user, isOwnProfile = false, onEdit, onLogout }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Mock data if specific fields missing (Product Level vision)
    const userData = {
        ...user,
        job: user.job || "Travel Blogger",
        company: user.company || "Freelance",
        school: user.school || "Delhi University",
        height: user.height || "5'10\"",
        zodiac: user.zodiac || "Leo ♌",
        habits: user.habits || ["Social Drinker", "Non-smoker"],
        prompts: user.prompts || [
            { q: "My simple pleasure is...", a: "Chai at 2 AM with good music. ☕" },
            { q: "I'll brag about you to my friends if...", a: "You can beat me in Ludo. 🎲" },
        ],
        tags: user.interests ? user.interests.split(',') : ["Photography", "Travel", "Music", "Foodie", "Art"],
    };

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) audioRef.current.pause();
            else audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('content_type', type);

        const toastId = toast.loading(`Uploading ${type}...`);

        try {
            await api.uploadContent(formData);
            toast.success(`${type === 'story' ? 'Story' : type === 'reel' ? 'Reel' : 'Post'} Uploaded! 🎉`, { id: toastId });
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        } catch (err) {
            console.error(err);
            toast.error("Upload failed.", { id: toastId });
        }
    };


    return (
        <div className="bg-black min-h-screen text-white pb-24 relative overflow-x-hidden md:max-w-md md:mx-auto md:border-r md:border-l md:border-white/10">

            {/* 🌟 Header Image / Cover Parallax */}
            <div className="relative h-[65vh] w-full group">
                <img
                    src={userData.profile_pic || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80"}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    alt="Profile"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

                {/* Navigation / Actions */}
                <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 pt-10">
                    {!isOwnProfile && <div className="bg-black/20 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/40"><ChevronLeft size={24} onClick={() => window.history.back()} /></div>}
                    {isOwnProfile && <div className="bg-black/20 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/40"><Settings size={24} /></div>}
                    <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 flex items-center gap-1">
                        <Shield size={10} className="text-green-400" /> Verified
                    </div>
                    {isOwnProfile && <div className="bg-black/20 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/40" onClick={onEdit}><Edit3 size={24} /></div>}
                </div>

                {/* Name & Basic Info Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-6">
                    <h1 className="text-4xl font-black font-outfit leading-none mb-2 shadow-black drop-shadow-md">
                        {userData.name || userData.username} <span className="text-2xl font-light opacity-80">{userData.age}</span>
                    </h1>
                    <div className="flex items-center gap-2 text-sm font-medium opacity-90 mb-4">
                        <MapPin size={14} className="text-pink-500" />
                        <span>{userData.location || "Mumbai, India"}</span>
                        <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                        <span>{userData.gender}</span>
                    </div>
                </div>
            </div>

            {/* 🚀 Content Body */}
            <div className="px-5 -mt-6 relative z-10 space-y-6">

                {/* 🆕 Create / Upload Actions (Premium Functional) */}
                {isOwnProfile && (
                    <div className="bg-[#1a1a1a] rounded-2xl p-4 border border-white/10 shadow-lg mb-4">
                        {/* Hidden Inputs */}
                        <input type="file" ref={props.storyInputRef || useRef(null)} className="hidden" accept="image/*,video/*" onChange={(e) => handleUpload(e, 'story')} />
                        <input type="file" ref={props.reelInputRef || useRef(null)} className="hidden" accept="video/*" onChange={(e) => handleUpload(e, 'reel')} />
                        <input type="file" ref={props.galleryInputRef || useRef(null)} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'post')} />

                        <div className="flex justify-between items-center gap-2">
                            <button onClick={() => document.querySelectorAll('input[type=file]')[0].click()} className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gradient-to-br from-[#262626] to-black border border-white/5 hover:border-pink-500/50 transition group">
                                <div className="p-2.5 rounded-full bg-gradient-to-tr from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/20 group-hover:scale-110 transition">
                                    <Camera size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-white/80">Add Story</span>
                            </button>

                            <button onClick={() => document.querySelectorAll('input[type=file]')[1].click()} className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gradient-to-br from-[#262626] to-black border border-white/5 hover:border-blue-500/50 transition group">
                                <div className="p-2.5 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition">
                                    <Play size={20} fill="currentColor" />
                                </div>
                                <span className="text-[10px] font-bold text-white/80">Post Reel</span>
                            </button>

                            <button onClick={() => document.querySelectorAll('input[type=file]')[2].click()} className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gradient-to-br from-[#262626] to-black border border-white/5 hover:border-green-500/50 transition group">
                                <div className="p-2.5 rounded-full bg-gradient-to-tr from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20 group-hover:scale-110 transition">
                                    <ImageIcon size={20} />
                                </div>
                                <span className="text-[10px] font-bold text-white/80">Upload</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Voice Bio (Premium Feature) */}
                {userData.voice_bio && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-[#1a1a1a] rounded-2xl p-4 flex items-center gap-4 border border-white/10 shadow-lg shadow-pink-500/10"
                    >
                        <div onClick={toggleAudio} className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-pink-500/40 cursor-pointer hover:scale-105 transition">
                            {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-1" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-pink-400 font-bold uppercase tracking-wider mb-1">My Anthem / Intro</p>
                            <div className="flex items-center gap-1 h-6 opacity-60">
                                {[...Array(20)].map((_, i) => (
                                    <div key={i} className={`w-1 rounded-full bg-white transition-all duration-300 ${isPlaying ? 'animate-music-bar' : ''}`} style={{ height: Math.random() * 100 + '%', animationDelay: `${i * 0.05}s` }}></div>
                                ))}
                            </div>
                        </div>
                        <audio ref={audioRef} src={userData.voice_bio} onEnded={() => setIsPlaying(false)} className="hidden" />
                    </motion.div>
                )}

                {/* About Me */}
                <div className="space-y-2">
                    <h3 className="section-title">About Me</h3>
                    <p className="text-lg leading-relaxed text-white/90 font-light">
                        {userData.bio || "Just a vibe looking for another vibe. Love impromptu plans, spicy food, and good conversations. If you can make me laugh, you're already halfway there. 😉"}
                    </p>
                </div>

                {/* Vitals & Essentials */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="info-chip"><Briefcase size={16} /> {userData.job}</div>
                    <div className="info-chip"><GraduationCap size={16} /> {userData.school}</div>
                    <div className="info-chip">📏 {userData.height}</div>
                    <div className="info-chip">{userData.zodiac}</div>
                    {userData.habits.map((h, i) => <div key={i} className="info-chip opacity-80">{h}</div>)}
                </div>

                {/* Interests */}
                <div>
                    <h3 className="section-title mb-3">Vibes</h3>
                    <div className="flex flex-wrap gap-2">
                        {userData.tags.map((tag, i) => (
                            <span key={i} className="px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm font-medium hover:bg-white/10 hover:border-pink-500/50 transition cursor-pointer">
                                {tag.trim()}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 📸 Gallery Grid (Masonry Style Mock) */}
                <div>
                    <h3 className="section-title mb-3">Moments</h3>
                    <div className="grid grid-cols-2 gap-2 h-64">
                        <div className="rounded-xl overflow-hidden relative group">
                            <img src={userData.images?.[0]?.image || `https://source.unsplash.com/random/400x600?portrait,1`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                        </div>
                        <div className="grid grid-rows-2 gap-2">
                            <div className="rounded-xl overflow-hidden relative group">
                                <img src={userData.images?.[1]?.image || `https://source.unsplash.com/random/400x300?party`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                            </div>
                            <div className="rounded-xl overflow-hidden relative group">
                                <img src={userData.images?.[2]?.image || `https://source.unsplash.com/random/400x300?travel`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                {isOwnProfile && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                        <Camera size={24} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {isOwnProfile && <button className="w-full py-3 mt-2 rounded-xl bg-white/5 border border-dashed border-white/20 text-white/50 text-sm hover:text-white hover:border-white/50 transition flex items-center justify-center gap-2">
                        <ImageIcon size={16} /> Add More Photos
                    </button>}
                </div>

                {/* Hinge Style Prompts */}
                <div className="space-y-4">
                    {userData.prompts.map((p, i) => (
                        <div key={i} className="bg-[#1a1a1a] p-5 rounded-2xl border-l-4 border-pink-500 shadow-md">
                            <p className="text-xs text-pink-400 uppercase font-bold tracking-wider mb-2">{p.q}</p>
                            <p className="text-xl font-medium font-serif leading-snug">"{p.a}"</p>
                        </div>
                    ))}
                </div>

                {/* Socials */}
                <div className="flex justify-center gap-6 py-4 border-t border-white/10 mt-6">
                    <div className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition cursor-pointer">
                        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center"><Instagram size={24} /></div>
                        <span className="text-[10px]">Instagram</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 transition cursor-pointer">
                        <div className="w-12 h-12 rounded-full border border-green-500/20 flex items-center justify-center text-green-500"><Mic size={24} /></div>
                        <span className="text-[10px]">Spotify</span>
                    </div>
                </div>

                {/* Action Buttons (Sticky for Own Profile) */}
                {isOwnProfile && (
                    <div className="sticky bottom-20 left-0 w-full px-4 pt-4 pb-0 bg-gradient-to-t from-black via-black to-transparent">
                        <button className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-4 rounded-full shadow-lg shadow-red-500/30 active:scale-95 transition" onClick={onEdit}>
                            Edit Profile
                        </button>
                        <button className="w-full mt-3 py-3 text-white/40 text-sm font-medium hover:text-red-500 transition" onClick={onLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        .section-title { font-size: 1.15rem; font-weight: 800; opacity: 0.9; margin-bottom: 0.5rem; color:white; }
        .info-chip { display: flex; align-items: center; gap: 6px; padding: 8px 12px; background: rgba(255,255,255,0.08); border-radius: 99px; font-size: 0.85rem; font-weight: 500; border: 1px solid rgba(255,255,255,0.05); }
      `}</style>
        </div>
    );
};

export default UserProfile;
