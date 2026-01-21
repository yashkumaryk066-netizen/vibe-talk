import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Heart, MessageCircle, User, Settings, Camera, Video, Phone, Send, MoreVertical, Search, Bell, X, Check, Image, Mic, Play, Pause, Volume2, ArrowLeft, Globe, Share2, Edit3, LogOut, Flame, Shield, Layers } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import api from './api';
import './App.css';
import './premium-effects.css';

// Feature Imports
import { CallProvider } from './context/CallContext';
import CallOverlay from './components/call/CallOverlay';
import ChatWindow from './components/chat/ChatWindow';
import Discover from './components/dating/Discover'; // New Premium Discover
import UserProfile from './components/user/UserProfile'; // New Premium Profile
import TermsAndConditions from './pages/TermsAndConditions';

import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import SafetyGuidelines from './pages/SafetyGuidelines';
import ContactUs from './pages/ContactUs';


// Utility to decode JWT for Google Auth
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

// --- 🌟 Premium Data Content (Indian & Global Dating Vibe) ---
const REAL_NAMES = [
  "Riya_Sharma", "Ananya_Queen", "Zara_Official", "Priya_Angel", "Sneha_Loves",
  "Aisha_Vibes", "Kavya_Cool", "Neha_Style", "Ishita_Dream", "Simran_K",
  "Rohan_Hunk", "Vikram_Fit", "Kabir_Sing", "Aryan_Vibe", "Rahul_Desi",
  "Sana_Glow", "Tanya_Xo", "Mira_Fashion", "Diya_Sparkle", "Esha_Live",
  "Arjun_Gym", "Aditya_Tech", "Vivaan_Cool", "Reyansh_Dude", "Dhruv_Art",
  "Shruti_Date", "Pooja_Party", "Kriti_Sanon_Fan", "Alia_Fan_Club", "Nora_Dance",
  "Sia_Travels", "Myra_Music", "Kiara_Cutie", "Avni_Artist", "Roohi_Rose",
  "Aarav_King", "Vihaan_Pro", "Krishna_Soul", "Ishaan_Music", "Shaurya_Rider"
];

const FEMALE_AVATARS = Array.from({ length: 45 }, (_, i) => `https://randomuser.me/api/portraits/women/${i}.jpg`);
const MALE_AVATARS = Array.from({ length: 45 }, (_, i) => `https://randomuser.me/api/portraits/men/${i}.jpg`);
const REAL_AVATARS = [...FEMALE_AVATARS, ...MALE_AVATARS];
const ALL_AVATARS = REAL_AVATARS;

const VIBE_IMAGES = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
  "https://images.unsplash.com/photo-1514525253440-b393452eeb25?w=800&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
  "https://images.unsplash.com/photo-1516726817505-f5ed8259b496?w=800&q=80"
];

// --- 🤖 PREMIUM FAKE PROFILES POOL (12 per gender) ---
const FAKE_PROFILES = {
  Male: [
    { name: 'Kabir', username: 'kabir_vibes', bio: 'Gym freak 💪 & Late night drives 🏎️', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Aryan', username: 'aryan_cool', bio: 'Tech geek 💻 Music lover 🎧', avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { name: 'Rohan', username: 'rohan_explorer', bio: 'Travel junkie ✈️ Foodie 🍕', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { name: 'Aditya', username: 'aditya_gamer', bio: 'Gaming pro 🎮 Netflix addict 📺', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
    { name: 'Vivaan', username: 'vivaan_artist', bio: 'Photographer 📸 Coffee enthusiast ☕', avatar: 'https://randomuser.me/api/portraits/men/41.jpg' },
    { name: 'Reyansh', username: 'rey_sports', bio: 'Cricket lover 🏏 Fitness freak 🏃', avatar: 'https://randomuser.me/api/portraits/men/52.jpg' },
    { name: 'Aarav', username: 'aarav_chill', bio: 'Chill vibes only 🌴 Musician 🎸', avatar: 'https://randomuser.me/api/portraits/men/18.jpg' },
    { name: 'Vihaan', username: 'vihaan_rider', bio: 'Bike lover 🏍️ Adventure seeker 🎯', avatar: 'https://randomuser.me/api/portraits/men/67.jpg' },
    { name: 'Ayush', username: 'ayush_dev', bio: 'Code & Coffee ☕💻 Anime fan 🍜', avatar: 'https://randomuser.me/api/portraits/men/28.jpg' },
    { name: 'Siddharth', username: 'sid_fitness', bio: 'Gym bro 💪 Protein shakes 🥤', avatar: 'https://randomuser.me/api/portraits/men/71.jpg' },
    { name: 'Dhruv', username: 'dhruv_night', bio: 'Night owl 🦉 EDM lover 🎵', avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
    { name: 'Karan', username: 'karan_vlogger', bio: 'Content creator 🎬 Traveler 🌍', avatar: 'https://randomuser.me/api/portraits/men/64.jpg' }
  ],
  Female: [
    { name: 'Ananya', username: 'ananya_cute', bio: 'Coffee & Sunsets ☕🌅 Book lover 📚', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Riya', username: 'riya_dancer', bio: 'Dancer 💃 Vibes only ✨', avatar: 'https://randomuser.me/api/portraits/women/63.jpg' },
    { name: 'Kiara', username: 'kiara_fashionista', bio: 'Fashion blogger 👗 Makeup artist 💄', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
    { name: 'Diya', username: 'diya_artist', bio: 'Painter 🎨 Nature lover 🌿', avatar: 'https://randomuser.me/api/portraits/women/21.jpg' },
    { name: 'Aadhya', username: 'aadhya_singer', bio: 'Singing is life 🎤 Music vibes 🎵', avatar: 'https://randomuser.me/api/portraits/women/55.jpg' },
    { name: 'Saanvi', username: 'saanvi_gymgirl', bio: 'Fitness queen 💪 Yoga enthusiast 🧘', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
    { name: 'Myra', username: 'myra_foodie', bio: 'Foodie 🍕 Travel junkie ✈️', avatar: 'https://randomuser.me/api/portraits/women/17.jpg' },
    { name: 'Pari', username: 'pari_gamer', bio: 'Girl gamer 🎮 Anime lover 🍜', avatar: 'https://randomuser.me/api/portraits/women/41.jpg' },
    { name: 'Aisha', username: 'aisha_photographer', bio: 'Photography 📷 Sunset chaser 🌇', avatar: 'https://randomuser.me/api/portraits/women/72.jpg' },
    { name: 'Kavya', username: 'kavya_bookworm', bio: 'Bookworm 📖 Tea > Coffee 🍵', avatar: 'https://randomuser.me/api/portraits/women/28.jpg' },
    { name: 'Ishita', username: 'ishita_traveler', bio: 'Wanderlust soul 🌍 Beach lover 🏖️', avatar: 'https://randomuser.me/api/portraits/women/50.jpg' },
    { name: 'Zara', username: 'zara_nightowl', bio: 'Night owl 🌙 Late night talks 💬', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' }
  ]

};


const getOrInitFakeChat = (userGender) => {
  const saved = localStorage.getItem('vibe_fake_chat');
  if (saved) return JSON.parse(saved);

  // If User is Male -> Female Bot, else Male Bot
  const targetGender = userGender === 'Male' ? 'Female' : 'Male';
  const pool = FAKE_PROFILES[targetGender];
  const bot = pool[Math.floor(Math.random() * pool.length)];

  const initData = {
    ...bot,
    lastMessage: "Hey! Just saw your profile. Vibe match? 👀",
    lastTime: new Date().toISOString(),
    createdAt: Date.now(), // Track when fake chat was created
    conversationCount: 0, // Track number of exchanges
    isFake: true,
    msgs: [{ id: 1, text: "Hey! Just saw your profile. Vibe match? 👀", sender_name: bot.name, created_at: new Date().toISOString() }]
  };
  localStorage.setItem('vibe_fake_chat', JSON.stringify(initData));
  return initData;
};

const Login = ({ onSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const googleBtnRef = useRef(null);

  // Toggle between Login and Signup
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({ username: '', password: '', email: '' });
  };

  // Google Auth Handler
  const handleGoogleResponse = async (response) => {
    setLoading(true);
    try {
      // Send the raw ID Token to backend for secure verification
      const res = await api.googleAuth({ token: response.credential });

      if (res.data.status === 'logged in' || res.data.status === 'created') {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        // Use user info from response if available, or just generic welcome
        toast.success(`Welcome to VibeTalk! 🚀`, { style: { background: '#333', color: '#fff' } });
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      toast.error("Google Login Failed.", { style: { background: '#333', color: '#fff' } });
    } finally {
      setLoading(false);
    }
  };

  // Initialize Google Button or Dev Fallback
  useEffect(() => {
    // Initialize Google Identity Services
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "336631033589-nq28gonut9lsv33ocs68tq4h1dejbbb8.apps.googleusercontent.com",
        callback: handleGoogleResponse
      });

      // Render the invisible Google button
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(
          googleBtnRef.current,
          { theme: "filled_black", size: "large", type: "standard", shape: "pill", width: "380", text: "continue_with" }
        );
      }
    }
  }, [isSignup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        await api.signup(formData);
        toast.success("Welcome to the Vibe! 🚀", { style: { background: '#333', color: '#fff' } });
        const res = await api.login(formData.username, formData.password);
        if (res.data.status === 'logged in') onSuccess();
      } else {
        const res = await api.login(formData.username, formData.password);
        if (res.data.status === 'logged in') {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          toast.success("Vibes loaded. ✨", { style: { background: '#333', color: '#fff' } });
          onSuccess();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(isSignup ? "Username already taken." : "Wrong credentials.", { style: { background: '#333', color: '#fff' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen h-screen w-full flex items-center justify-center relative overflow-hidden bg-cosmic">
      {/* 🌌 Exact Premium Background VFX */}
      <div className="stars"></div>

      {/* Dynamic Glow Orbs matching the reference */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-float-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/30 rounded-full blur-[120px] animate-float-slow" style={{ animationDelay: '2.5s' }}></div>

      {/* 💎 The 'Same-to-Same' Neon Glass Card */}
      <div className="z-10 w-full max-w-[380px] p-4 perspective-[1000px]">
        <div className="glass neon-border bg-black/40 backdrop-blur-3xl rounded-[35px] p-8 md:p-10 relative overflow-hidden flex flex-col items-center border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">

          {/* Logo Section - EXACT MATCH */}
          <div className="mb-6 flex flex-col items-center justify-center relative w-full">
            <h1 className="text-5xl font-black tracking-tight font-outfit text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_25px_rgba(0,210,255,0.6)] mb-2">
              VibeTalk
            </h1>

            {/* 🟢 Live Users Indicator */}
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md animate-pulse-slow">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
              <span className="text-[10px] font-bold text-white/80 tracking-wide">1,240+ Active Now</span>
            </div>

            {/* Animated Sound Wave */}
            <div className="flex items-center justify-center gap-1.5 h-8 mt-2 opacity-50">
              <div className="w-1 bg-cyan-400 rounded-full animate-wave h-3"></div>
              <div className="w-1 bg-blue-500 rounded-full animate-wave h-6" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 bg-purple-500 rounded-full animate-wave h-4" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 bg-pink-500 rounded-full animate-wave h-6" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-1 bg-cyan-400 rounded-full animate-wave h-3" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>

          {/* 📝 Form Section */}
          <form onSubmit={handleSubmit} className="w-full space-y-5 relative z-10">

            {/* Username */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-cyan-400" />
              </div>
              <input
                type="text"
                className="w-full bg-black/30 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 block pl-11 p-3.5 transition-all outline-none placeholder-white/30 hover:bg-black/40 hover:border-cyan-500/50"
                placeholder="Username"
                required
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
              />
            </div>

            {/* Email (Signup) */}
            {isSignup && (
              <div className="group relative animate-in fade-in slide-in-from-top-2">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe size={18} className="text-purple-400" />
                </div>
                <input
                  type="email"
                  className="w-full bg-black/30 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block pl-11 p-3.5 transition-all outline-none placeholder-white/30 hover:bg-black/40 hover:border-purple-500/50"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            )}

            {/* Password */}
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Flame size={18} className="text-pink-400" />
              </div>
              <input
                type="password"
                className="w-full bg-black/30 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 block pl-11 p-3.5 transition-all outline-none placeholder-white/30 hover:bg-black/40 hover:border-pink-500/50"
                placeholder="Password"
                required
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {/* 18+ Checkbox */}
            <div className="flex items-start gap-2 px-1">
              <input type="checkbox" id="age-confirm" required className="mt-1 w-3 h-3 accent-cyan-500" />
              <label htmlFor="age-confirm" className="text-[10px] text-white/50 leading-tight">
                I confirm I am <b>18+ years old</b>. I agree to the <Link to="/terms" className="text-white/70 underline hover:text-cyan-400">Terms</Link> & <Link to="/safety" className="text-white/70 underline hover:text-cyan-400">Safety Policy</Link>.
              </label>
            </div>

            {/* Main Gradient Button */}
            <button
              disabled={loading}
              className="w-full py-4 px-4 rounded-xl text-white font-bold text-base bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:shadow-[0_0_20px_rgba(0,210,255,0.6)] active:scale-[0.98] transition-all relative overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connecting...
                </div>
              ) : (
                isSignup ? "Start Your Vibe" : "Sign In"
              )}
            </button>
            <p className="text-[10px] text-center text-white/40 font-medium tracking-wide">
              18+ Only • Anonymous • Safety First • No Recording
            </p>

            {/* Google Button - Custom Design with Functional OAuth Iframe */}
            <div className="relative w-full">
              {/* The Visible 'Mock' Button (Matches Design) - Clicks pass through to Google iframe below */}
              <button type="button" className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-3 pointer-events-none" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22px" height="22px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                Continue with Google
              </button>
              {/* The Real Google Button - Invisible but clickable (Opacity 0.01) to show custom design underneath */}
              <div ref={googleBtnRef} className="absolute inset-0 z-10 overflow-hidden w-full h-full" style={{ opacity: 0.01 }}></div>
            </div>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center">
            <button onClick={toggleMode} className="text-sm font-medium text-white/50 hover:text-white transition-colors">
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <span className="text-cyan-400 font-bold hover:underline">{isSignup ? "Sign In" : "Sign Up"}</span>
            </button>
          </div>

          {/* Legal Pages Footer */}
          <div className="mt-6 text-center">
            <div className="flex flex-wrap justify-center gap-3 text-xs">
              <Link to="/terms" className="text-white/50 hover:text-white transition">
                Terms
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/privacy-policy" className="text-white/50 hover:text-white transition">
                Privacy
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/about" className="text-white/50 hover:text-white transition">
                About
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/safety" className="text-white/50 hover:text-white transition">
                Safety
              </Link>
              <span className="text-white/20">•</span>
              <Link to="/contact" className="text-white/50 hover:text-white transition">
                Contact
              </Link>
            </div>
          </div>

          {/* 🌟 SEO: Developer Footer for Image Ranking 🌟 */}
          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-2">
            <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition duration-500 cursor-pointer" onClick={() => window.open('https://vibe-talk-premium-live.netlify.app/#yash', '_blank')}>
              <img src="/yash_seo.jpg" alt="Yash Ankush Mishra - Rangra Developer" className="w-10 h-10 rounded-full border border-white/20 object-cover" />
              <div className="text-left">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Developed By</p>
                <p className="text-xs font-bold text-white leading-none mt-0.5">Yash Ankush Mishra</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const EditProfileModal = ({ user, userData, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    name: userData.name || '',
    bio: userData.bio || '',
    gender: userData.gender || 'Male',
    age: userData.age || 18,
    location: userData.location || 'India 🇮🇳',
    interested_in: userData.interested_in || 'Everyone',
    min_age_pref: userData.min_age_pref || 18,
    max_age_pref: userData.max_age_pref || 50,
    interests: userData.interests || '', // Comma separated
    looking_for: 'Relationship', // New field logic simulation
  });

  const [profilePicPreview, setProfilePicPreview] = useState(userData.profile_pic || userData.google_pic_url);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState(userData.images ? userData.images.map(i => i.image) : []);
  const [loading, setLoading] = useState(false);

  const VIBE_TAGS = ["🎵 Music", "🎮 Gaming", "💪 Gym", "🍕 Foodie", "✈️ Travel", "📸 Photography", "🎨 Art", "📚 Books", "💻 Tech", "🍿 Movies", "💃 Dancing", "🏎️ Cars", "🌿 Nature", "🐶 Pets"];
  const selectedTags = form.interests ? form.interests.split(',').filter(Boolean) : [];

  const toggleTag = (tag) => {
    let newTags;
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter(t => t !== tag);
    } else {
      if (selectedTags.length >= 5) return toast.error("Max 5 vibes allowed!");
      newTags = [...selectedTags, tag];
    }
    setForm({ ...form, interests: newTags.join(',') });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setGalleryPreviews(prev => [...prev, URL.createObjectURL(file)]);
    toast.loading("Uploading vibe...", { id: 'upload-gal' });

    try {
      const token = localStorage.getItem('token');
      const res = await api.uploadGalleryImage(userData.id, formData);
      toast.success("Added to gallery!", { id: 'upload-gal' });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed", { id: 'upload-gal' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(form).forEach(key => data.append(key, form[key]));
      if (profilePicFile) data.append('profile_pic', profilePicFile);

      const res = await api.updateMe(data);
      onUpdate(res.data);
      onClose();
      toast.success("Profile Updated! Ready to Match 🔥");
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-nav-in">
      <div className="bg-[#121212] w-full max-w-lg h-auto max-h-[90vh] rounded-3xl border border-white/10 shadow-2xl overflow-y-auto custom-scrollbar relative">
        <div className="sticky top-0 bg-[#121212]/90 backdrop-blur z-20 flex justify-between items-center p-5 border-b border-white/5">
          <h2 className="text-xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">EDIT PROFILE</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-full h-full rounded-full p-1 bg-black">
                <img src={profilePicPreview || (form.name ? REAL_AVATARS[form.name.length % REAL_AVATARS.length] : REAL_AVATARS[0])} className="w-full h-full rounded-full object-cover" />
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10">
                <Camera size={24} className="text-white drop-shadow-lg" />
                <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
              </label>
              <div className="absolute bottom-1 right-1 bg-cyan-500 p-1.5 rounded-full border-4 border-black z-20 shadow-lg">
                <Plus size={16} strokeWidth={4} color="black" />
              </div>
            </div>
            <p className="text-xs text-center text-white/40 uppercase tracking-widest font-bold">Tap Avatar to Change</p>
          </div>

          <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs font-black text-white/70 uppercase tracking-wider flex items-center gap-2"><Image size={14} className="text-purple-500" /> My Photos</label>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded badge-gradient">Best for Matches</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
              <label className="w-24 h-32 flex-shrink-0 snap-start bg-black/40 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-cyan-400/50 hover:bg-cyan-400/5 transition group">
                <div className="p-2 bg-white/5 rounded-full group-hover:scale-110 transition"><Upload size={20} className="text-cyan-400" /></div>
                <span className="text-[10px] font-bold text-white/40 group-hover:text-cyan-400">UPLOAD</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleGalleryUpload} />
              </label>
              {galleryPreviews.map((src, i) => (
                <div key={i} className="w-24 h-32 flex-shrink-0 snap-start bg-black rounded-xl overflow-hidden relative border border-white/10 group shadow-lg">
                  <img src={src} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition px-2 pb-2 flex items-end justify-center">
                    <button type="button" className="text-xs text-red-500 font-bold hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="text-xs font-bold text-white/40 ml-1 mb-1 block">DISPLAY NAME</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field w-full bg-white/5 border-white/10 focus:border-cyan-500 transition-colors rounded-xl p-3" placeholder="Name" />
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 ml-1 mb-1 block">AGE</label>
                <input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className="input-field w-full bg-white/5 border-white/10 rounded-xl p-3" />
              </div>
            </div>

            <div className="group">
              <label className="text-xs font-bold text-white/40 ml-1 mb-1 block">ABOUT ME</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field w-full h-24 resize-none bg-white/5 border-white/10 focus:border-purple-500 transition-colors rounded-xl p-3" placeholder="Tell the world your vibe... ✨" />
            </div>

            {/* VIBE TAGS */}
            <div>
              <label className="text-xs font-bold text-white/40 ml-1 mb-2 block uppercase tracking-wider">My Vibe (Select 5)</label>
              <div className="flex flex-wrap gap-2">
                {VIBE_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-white/60 hover:border-white/30'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-white/40 ml-1 mb-2 block uppercase tracking-wider">I'm Looking For</label>
              <div className="grid grid-cols-3 gap-2">
                {['Relationship 💘', 'Situationship 😵‍💫', 'Just Friends 🤝', 'Casual 😉', 'Not Sure 🤷‍♂️', 'Chat Only 💬'].map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm({ ...form, looking_for: opt })}
                    className={`p-2 rounded-xl text-xs font-bold border transition text-center ${form.looking_for === opt
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 border-white/10 text-white/60'
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-white/40 ml-1 mb-1 block">GENDER</label>
                <div className="relative">
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="input-field w-full bg-white/5 border-white/10 rounded-xl p-3 appearance-none">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none opacity-50"><ChevronDown size={14} /></div>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-white/40 ml-1 mb-1 block">INTERESTED IN</label>
                <div className="relative">
                  <select value={form.interested_in} onChange={e => setForm({ ...form, interested_in: e.target.value })} className="input-field w-full bg-white/5 border-white/10 rounded-xl p-3 appearance-none">
                    <option>Everyone</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none opacity-50"><ChevronDown size={14} /></div>
                </div>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-[#121212] pt-4 pb-2 border-t border-white/5">
            <button disabled={loading} className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(0,210,255,0.3)] hover:shadow-[0_0_30px_rgba(0,210,255,0.5)] active:scale-[0.98] transition-all relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Save size={20} />}
                {loading ? "Updating..." : "Save Profile"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 📸 Instagram-Style UX Components ---

const InstaNav = ({ activeTab, onTabChange }) => (
  <div className="bottom-nav">
    <div onClick={() => onTabChange('feed')} className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}>
      {activeTab === 'feed' ? <Heart size={28} fill="white" /> : <Heart size={28} />}
    </div>
    <div onClick={() => onTabChange('search')} className={`nav-item ${activeTab === 'search' ? 'active' : ''}`}>
      <Search size={28} strokeWidth={activeTab === 'search' ? 3 : 2} />
    </div>
    <div onClick={() => onTabChange('reels')} className={`nav-item ${activeTab === 'reels' ? 'active' : ''}`}>
      <div className="bg-white/10 p-1.5 rounded-lg border border-white/50">
        <div className="w-5 h-5 border-2 border-white rounded-sm flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
        </div>
      </div>
    </div>
    <div onClick={() => onTabChange('messages')} className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}>
      <MessageCircle size={28} strokeWidth={activeTab === 'messages' ? 3 : 2} />
    </div>
    <div onClick={() => onTabChange('profile')} className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}>
      <User size={28} strokeWidth={activeTab === 'profile' ? 3 : 2} />
    </div>
  </div>
);



// --- 🎥 Premium Video Content (Female Centric / Dating Vibe) ---
const VIBE_VIDEOS = [
  "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-running-above-camera-screen-40748-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-with-smartphone-40758-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-young-woman-skating-in-a-parking-lot-40738-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-walking-on-beach-at-sunset-1184-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-happy-in-a-room-40745-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-in-white-dress-confident-in-front-of-camera-40751-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-posing-for-camera-in-winter-clothes-40742-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-young-couple-walking-in-the-city-40733-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-couple-dating-in-a-restaurant-40735-large.mp4"
];

const VIBE_MUSIC = [
  { title: "Desi Vibe 🇮🇳", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { title: "Night Drive 🏎️", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { title: "Love Song ❤️", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { title: "Gym Bass 💪", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" }
];

const generateMockReels = (count = 50) => {
  return Array.from({ length: count }, (_, i) => {
    const isGirl = i % 3 !== 0; // 2/3rd Girls
    const music = VIBE_MUSIC[i % VIBE_MUSIC.length];
    return {
      id: `mock-reel-${i}`,
      url: VIBE_VIDEOS[i % VIBE_VIDEOS.length],
      thumb: VIBE_IMAGES[i % VIBE_IMAGES.length],
      avatar: isGirl ? FEMALE_AVATARS[i % FEMALE_AVATARS.length] : MALE_AVATARS[i % MALE_AVATARS.length],
      music: music.title,
      music_url: music.url,
      user: REAL_NAMES[i % REAL_NAMES.length],
      likes: Math.floor(Math.random() * 50000) + 1000,
      desc: [
        "Waiting for my date... 🙈 #dating #love",
        "Koi hai jo vibe match kre? ✨ #single",
        "Night drives & chill? 🚗 #vibes",
        "Outfit of the day! Rate it 1-10 💖",
        "Missing someone special... ❤️",
        "Kaun banega mera partner? 😉 #desivibes"
      ][Math.floor(Math.random() * 6)]
    };
  });
};

const Feed = ({ onMessage }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch real profiles (if any exist in backend)
    api.getProfiles().then(res => {
      // 2. Generate PREMIUM fake posts to supplement (Strictly Dating/Chill Vibes)
      const fakePosts = Array.from({ length: 50 }, (_, i) => ({
        id: `fake-${i}`,
        username: REAL_NAMES[i % REAL_NAMES.length],
        location: ['Vibe Club 🥂', 'Late Night Drive 🏎️', 'Gym 💪', 'Beach Sunset 🏖️', 'Coffee Date ☕'][i % 5],
        profile_pic: REAL_AVATARS[i % REAL_AVATARS.length], // REAL FACES
        image: VIBE_IMAGES[i % VIBE_IMAGES.length], // GUARANTEED PREMIUM IMAGE
        bio: ['Just chillin 🌊', 'Living my best life ✨', 'Music is life 🎵', 'Dream big 🚀', 'Good vibes only ✌️'][i % 5],
        age: 20 + (i % 10),
        likes: Math.floor(Math.random() * 5000) + 100
      }));

      // 3. SANITIZE backend data: Force overwrite broken/generic content
      const sanitizedBackendPosts = (res.data || []).map((p, i) => ({
        ...p,
        // Override Generic Names
        username: (p.username && (p.username.startsWith('user') || p.username.startsWith('vibe_'))) ? REAL_NAMES[(i + 10) % REAL_NAMES.length] : p.username,
        // FORCE PREMIUM IMAGES: Ignore user uploads for now to guarantee aesthetic (unless verified)
        image: VIBE_IMAGES[i % VIBE_IMAGES.length],
        // Override Generic Avatars
        profile_pic: p.profile_pic || REAL_AVATARS[(i + 3) % REAL_AVATARS.length]
      }));

      // Merge and Shuffle
      setPosts([...sanitizedBackendPosts, ...fakePosts].sort(() => 0.5 - Math.random()));
      setLoading(false);
    }).catch(err => {
      console.log("Using pure localized premium data");
      const fakePostsOnly = Array.from({ length: 50 }, (_, i) => ({
        id: `fake-${i}`,
        username: REAL_NAMES[i % REAL_NAMES.length],
        location: 'Vibe City',
        profile_pic: REAL_AVATARS[i % REAL_AVATARS.length],
        image: VIBE_IMAGES[i % VIBE_IMAGES.length],
        bio: 'Vibe check ✅',
        likes: 999
      }));
      setPosts(fakePostsOnly);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="screen center-content"><div className="loader"></div></div>;

  return (
    <div className="screen pb-20 overflow-y-auto bg-black">
      <div className="flex justify-between items-center p-4 sticky top-0 bg-black/90 backdrop-blur z-20 border-b border-white/5">
        <h1 className="font-outfit text-2xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">VibeTalk</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/matches')} className="p-1 hover:bg-white/10 rounded-full transition active:scale-95">
            <Heart size={24} />
          </button>
          <button onClick={() => navigate('/chats')} className="p-1 hover:bg-white/10 rounded-full transition active:scale-95 relative">
            <MessageCircle size={24} />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-black"></div>
          </button>
        </div>
      </div>

      {/* 🛡️ SAFETY QUICK BAR (User Confidence) */}
      <div className="bg-white/5 px-4 py-2 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2 text-[10px] opacity-60">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          1,240+ Online
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1 text-[10px] text-white/50"><div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-red-500"><X size={8} /></div> Block</div>
          <div className="flex items-center gap-1 text-[10px] text-white/50"><div className="w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500"><Flame size={8} /></div> Report</div>
          <div className="flex items-center gap-1 text-[10px] text-white/50"><div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500"><Globe size={8} /></div> Safe</div>
        </div>
      </div>

      {/* Stories - Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto px-4 py-4 scrollbar-hide border-b border-white/5 mb-2">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="story-ring w-16 h-16 border-2 border-white/30 border-dashed rounded-full flex items-center justify-center relative bg-white/5">
            <Plus size={24} className="text-blue-500" />
          </div>
          <span className="text-xs font-bold">Add Vibe</span>
        </div>
        {[...Array(15)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
            <div className="story-ring w-16 h-16 p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full group-hover:scale-105 transition">
              <img src={REAL_AVATARS[i % REAL_AVATARS.length]} className="w-full h-full rounded-full bg-black border-2 border-black object-cover" />
            </div>
            <span className="text-xs opacity-70 group-hover:opacity-100 truncate w-16 text-center">{REAL_NAMES[i % REAL_NAMES.length]}</span>
          </div>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="flex flex-col pb-4">
        {posts.map((p, i) => (
          <div key={p.id || i} className="bg-black mb-4 border-b border-white/10 pb-4 animate-up">
            {/* Header */}
            <div className="flex items-center gap-3 p-3">
              <div onClick={() => navigate('/profile', { state: { user: p } })} className="w-9 h-9 rounded-full bg-gray-800 p-[1px] bg-gradient-to-br from-blue-500 to-purple-500 cursor-pointer">
                <img src={p.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`} className="w-full h-full rounded-full border border-black object-cover" />
              </div>
              <div>
                <span onClick={() => navigate('/profile', { state: { user: p } })} className="font-bold text-sm block hover:text-blue-400 cursor-pointer text-white">{p.username}</span>
                <span className="text-[10px] opacity-50 block">{p.location || 'Unknown Location'}</span>
              </div>
              <MoreVertical size={16} className="ml-auto opacity-50 cursor-pointer" />
            </div>

            {/* Image */}
            <div className="w-full aspect-square bg-gray-900 overflow-hidden relative group">
              <img src={p.image || `https://source.unsplash.com/random/800x800?sig=${i}`} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
              {/* Tap Animation Overlay (Mock) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-active:opacity-100 transition-opacity duration-200 pointer-events-none">
                <Heart size={80} className="text-white fill-white drop-shadow-2xl animate-ping" />
              </div>
            </div>

            {/* Actions */}
            <div className="p-3">
              <div className="flex gap-5 mb-3">
                <Heart size={26} className="hover:text-red-500 hover:fill-red-500 transition cursor-pointer" />
                <div onClick={() => navigate('/chats/' + (p.id || `fake_${p.username}`), { state: { otherUser: { ...p, isFake: !p.id } } })} className="cursor-pointer hover:scale-110 transition hover:text-blue-400">
                  <MessageCircle size={26} className="-scale-x-100" />
                </div>
                <Send size={26} className="hover:text-green-400 transition cursor-pointer" />
                <div className="ml-auto"><Bookmark size={26} className="hover:text-yellow-400 transition" /></div>
              </div>

              <p className="text-sm">
                <span className="font-bold mr-2 text-white">{p.username}</span>
                <span className="opacity-90">{p.bio || "Just creating some vibes 🌊 #vibetalk #premium"}</span>
              </p>
              <p className="text-xs text-white/40 mt-1 uppercase font-bold tracking-wide">View all {p.likes || Math.floor(Math.random() * 500)} comments</p>
              <p className="text-[10px] text-white/30 mt-1 uppercase">2 HOURS AGO</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Reels = ({ onMessage }) => {
  const navigate = useNavigate();
  const [reels] = useState(() => generateMockReels(100));
  const videoRefs = useRef({});
  const audioRefs = useRef({});
  const containerRef = useRef(null);
  const [muted, setMuted] = useState(false); // Try unmute default
  const [activeReelId, setActiveReelId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Intersection Observer to Auto-Play/Pause
  useEffect(() => {
    const options = {
      root: containerRef.current,
      threshold: 0.6,
    };

    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        const reelId = entry.target.dataset.id;
        const video = videoRefs.current[reelId];
        const audio = audioRefs.current[reelId];

        if (!video) return;

        if (entry.isIntersecting) {
          setActiveReelId(reelId);
          video.currentTime = 0;
          if (audio) audio.currentTime = 0;

          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              setIsPlaying(true);
              if (audio && !muted) audio.play().catch(e => console.log("Audio play failed", e));
            }).catch(() => {
              setMuted(true);
              video.muted = true;
              video.play();
              setIsPlaying(true);
            });
          }
        } else {
          video.pause();
          if (audio) audio.pause();
          if (entry.target.dataset.id === activeReelId) setIsPlaying(false);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    setTimeout(() => {
      const elements = document.querySelectorAll('.reel-snap-item');
      elements.forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, [reels, muted]); // Add muted to dep to retry audio if unmuted?

  // Handle Double Tap Like
  const handleDoubleTap = (e) => {
    const heart = document.createElement('div');
    heart.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>';
    heart.className = 'absolute inset-0 m-auto w-24 h-24 flex items-center justify-center animate-ping z-50 pointer-events-none drop-shadow-2xl';
    e.currentTarget.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
  };

  const togglePlay = (id) => {
    const video = videoRefs.current[id];
    const audio = audioRefs.current[id];
    if (video) {
      if (video.paused) {
        video.play();
        if (audio && !muted) audio.play();
        setIsPlaying(true);
      } else {
        video.pause();
        if (audio) audio.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const newMuted = !muted;
    setMuted(newMuted);

    // Apply to current active video/audio immediately
    if (activeReelId) {
      const video = videoRefs.current[activeReelId];
      const audio = audioRefs.current[activeReelId];
      if (video) video.muted = newMuted; // Actually we use separate audio, video muted can stay true or sync? 
      // If we use separate audio, video should ALWAYS be muted to avoid duplicate audio if video has it.
      // But wait, our vibe videos might NOT have audio. 
      // Policy: Video always muted, Audio track handles sound.
      if (video) video.muted = true;

      if (audio) {
        if (newMuted) audio.pause();
        else if (!video.paused) audio.play();
      }
    }
  }

  return (
    <div ref={containerRef} className="reels-container snap-y snap-mandatory scrollbar-hide h-[calc(100vh-60px)] w-full overflow-y-scroll bg-black">
      {reels.map((r, i) => (
        <div
          key={i}
          data-id={r.id}
          className="reel-snap-item reel-item snap-start h-full w-full relative flex items-center justify-center bg-gray-900 border-b border-gray-800"
        >
          {/* Audio Track */}
          {r.music_url && <audio ref={el => audioRefs.current[r.id] = el} src={r.music_url} loop />}

          {/* Video Layer */}
          <div className="absolute inset-0 bg-black cursor-pointer" onDoubleClick={handleDoubleTap} onClick={() => togglePlay(r.id)}>
            <video
              ref={el => videoRefs.current[r.id] = el}
              src={r.url}
              poster={r.thumb}
              className="w-full h-full object-cover opacity-100"
              loop
              muted={true} // Always mute video track, use audio track
              playsInline
              preload="auto"
            />
            {/* Dark Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/95 pointer-events-none"></div>

            {/* Play Button Overlay if Paused */}
            {!isPlaying && activeReelId === r.id && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-black/20 backdrop-blur-[2px]">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md animate-in zoom-in duration-200">
                  <div className="ml-2 w-0 h-0 border-t-[15px] border-t-transparent border-l-[30px] border-l-white border-b-[15px] border-b-transparent"></div>
                </div>
              </div>
            )}

            {/* Play/Pause/Mute Indicator Overlay */}
            <button onClick={toggleMute} className="absolute top-16 right-4 z-40 p-2 bg-black/40 rounded-full backdrop-blur-md border border-white/10 hover:bg-black/60 transition">
              {muted ? <div className="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg></div>
                : <div className="text-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg></div>}
            </button>
          </div>

          {/* 🎵 Music Disc Animation (Bottom Right) */}
          <div className="absolute bottom-6 right-4 z-20 pointer-events-none">
            <div className={`w-12 h-12 rounded-full bg-gray-900 border-[3px] border-black flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.8)] ${activeReelId === r.id && isPlaying ? 'animate-spin-slow' : ''}`}>
              <img src={r.avatar} className="w-full h-full object-cover opacity-90 p-1 rounded-full" />
            </div>
            <div className={`absolute -bottom-3 -right-3 transform -rotate-12 bg-black/50 p-1 rounded-full border border-white/10 backdrop-blur transition-all duration-300 ${!muted ? 'scale-110 shadow-lg border-green-400/50' : 'grayscale'}`}>
              <Music size={12} className={`text-white drop-shadow-md ${!muted && 'animate-pulse'}`} />
            </div>
            {/* Flying Notes (Only if playing and unmuted) */}
            {!muted && isPlaying && activeReelId === r.id && (
              <div className="absolute bottom-8 right-2 flex flex-col gap-4">
                <Music size={14} className="text-white/60 animate-fly-notes delay-75" />
                <Music size={10} className="text-blue-400 animate-fly-notes delay-150 ml-4" />
              </div>
            )}
          </div>

          {/* 📝 User Info (Bottom Left) */}
          <div className="absolute bottom-4 left-4 right-16 text-white z-20 text-left pointer-events-none w-[75%]">
            <div className="flex items-center gap-3 mb-3 pointer-events-auto">
              <div onClick={() => navigate('/profile', { state: { user: { username: r.user, profile_pic: r.avatar } } })} className="w-9 h-9 rounded-full border border-white/80 p-[1px] shadow-lg cursor-pointer hover:scale-110 transition">
                <img src={r.avatar} className="w-full h-full rounded-full object-cover" />
              </div>
              <span onClick={() => navigate('/profile', { state: { user: { username: r.user, profile_pic: r.avatar } } })} className="font-bold text-white text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wide cursor-pointer hover:underline">{r.user}</span>
              <button className="text-[10px] border border-white/50 bg-white/10 px-3 py-1 rounded-lg backdrop-blur-md font-bold hover:bg-white/25 transition shadow-sm">Follow</button>
            </div>

            <p className="text-sm drop-shadow-md mb-4 line-clamp-2 font-medium opacity-95 leading-snug">{r.desc}</p>

            <div className="flex items-center gap-2 text-xs opacity-90 bg-transparent w-full overflow-hidden">
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/5">
                <Music size={12} className="text-white" />
                <div className="overflow-hidden w-[150px] relative">
                  <span className="inline-block whitespace-nowrap animate-marquee font-medium">{r.music || 'Original Audio'} • {r.user}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ❤️ Interaction Sidebar (Right) */}
          <div className="absolute bottom-24 right-2 flex flex-col items-center gap-5 text-white z-20 pointer-events-auto">
            <div className="flex flex-col items-center gap-0.5 group cursor-pointer" onClick={(e) => { e.stopPropagation(); handleDoubleTap(e); }}>
              <Heart size={30} strokeWidth={1.5} className="group-hover:scale-110 transition drop-shadow-lg filter shadow-black" />
              <span className="text-[11px] font-bold drop-shadow-md">{r.likes > 1000 ? (r.likes / 1000).toFixed(1) + 'k' : r.likes}</span>
            </div>

            <div className="flex flex-col items-center gap-0.5 group cursor-pointer" onClick={(e) => {
              e.stopPropagation();
              navigate('/chats/' + (r.user_id || `fake_${r.user}`), { state: { otherUser: { username: r.user, profile_pic: r.avatar, isFake: !r.user_id } } });
            }}>
              <MessageCircle size={30} strokeWidth={1.5} className="group-hover:scale-110 transition drop-shadow-lg -scale-x-100" />
              <span className="text-[11px] font-bold drop-shadow-md">1.2k</span>
            </div>

            <div className="flex flex-col items-center gap-0.5 group cursor-pointer">
              <Send size={30} strokeWidth={1.5} className="group-hover:scale-110 transition drop-shadow-lg transform -rotate-12" />
              <span className="text-[11px] font-bold drop-shadow-md">Share</span>
            </div>

            <div className="group cursor-pointer mt-2">
              <MoreVertical size={24} className="opacity-90 drop-shadow-lg" />
            </div>
          </div>
        </div>
      ))}
    </div >
  );
};

const MessagesList = ({ navigate, activeUser }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const userGender = localStorage.getItem('vibe_user_gender') || 'Male';

  // Vibe Assistant Item (define before useEffect)
  const vibeBot = {
    id: 'bot',
    user: 'bot',
    username: 'Vibe Assistant',
    name: 'Vibe Assistant',
    profile_pic: null,
    isFake: true,
    last_message: "Welcome to VibeTalk! 🛡️"
  };

  useEffect(() => {
    api.getMatches().then(res => {
      // Inject Fake Chat Logic
      const fakeChat = getOrInitFakeChat(userGender);
      const fakeEntry = {
        id: `fake_${fakeChat.username}`,
        user: fakeChat.username,
        username: fakeChat.username,
        name: fakeChat.name,
        profile_pic: fakeChat.avatar,
        // Using fakeData prop to pass full context to ChatRoom
        fakeData: fakeChat,
        // Override display props
        last_message: fakeChat.lastMessage,
        updated_at: fakeChat.lastTime,
        isFake: true
      };

      // Merge: Bot + Fake + Real
      const realChats = res.data || [];
      setChats([vibeBot, fakeEntry, ...realChats]);
      setLoading(false);
    }).catch(e => setLoading(false));
  }, []);



  return (
    <div className="screen pb-20 pt-14">
      <div className="fixed top-0 w-full p-4 glass z-10 flex justify-between items-center">
        <h1 className="font-bold text-xl flex items-center gap-1">Messages <span className="text-xs opacity-50">({chats.length + 1})</span></h1>
        <Edit3 size={24} />
      </div>

      <div className="px-4 py-2 mt-2">
        <div className="bg-white/10 p-2 rounded-lg flex items-center gap-2 text-white/50 text-sm">
          <Search size={16} /> Search chats...
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto pb-20 mt-1">
        {/* ALWAYS SHOW VIBE BOT */}
        <div className="chat-item bg-blue-500/5 mb-1 border-l-2 border-blue-500" onClick={() => navigate(`/chats/${vibeBot.user}`, { state: { otherUser: vibeBot, room: { name: 'Vibe Assistant' } } })}>
          <div className="story-ring w-14 h-14 p-0.5 border-none bg-blue-500/20 rounded-full flex items-center justify-center">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=VibeAssistant`} className="w-full h-full rounded-full bg-black object-cover" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm flex items-center gap-1">Vibe Assistant <span className="bg-blue-500 text-[8px] px-1 rounded text-white overflow-hidden">OFFICIAL</span></h4>
            <p className="text-xs text-blue-400 font-medium">Tap for help & safety tips</p>
          </div>
          <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
        </div>

        {loading ? <div className="p-4 text-center opacity-50">Loading matches...</div> :
          chats.length === 0 ? (
            <div className="p-8 text-center opacity-50 flex flex-col items-center">
              <MessageCircle size={48} className="mb-2" />
              <p>No other messages yet.</p>
            </div>
          ) :
            chats.map(p => (
              <div key={p.id} className="chat-item" onClick={() => navigate(`/chats/${p.id}`, { state: { otherUser: { ...p, username: p.name || p.username } } })}>
                {/* Navigating to /chats/:id where :id is the USER ID, handled by MainApp/Router logic */}
                <div className="story-ring w-14 h-14 p-0.5 border-none bg-gradient-to-tr from-transparent to-transparent">
                  <img src={p.profile_pic || REAL_AVATARS[p.id % REAL_AVATARS.length]} className="w-full h-full rounded-full bg-gray-800 object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm block">{p.name || REAL_NAMES[p.id % REAL_NAMES.length]}</h4>
                  <p className="text-xs opacity-60">{p.last_message || p.lastMessage || "Tap to chat • Now"}</p>
                </div>
                <Camera size={20} className="opacity-50" />
              </div>
            ))}
      </div>
    </div>
  );
};



const ProfileView = ({ user, onLogout, isOwnProfile = true }) => {
  const navigate = useNavigate();
  return (
    <div className="screen pb-20 pt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">{user.username} <span className="text-red-500 text-xs px-2 py-0.5 bg-red-500/10 rounded">LIVE</span></h1>
        <div className="flex gap-4">
          {isOwnProfile && <div className="bg-white/10 p-2 rounded-full"><Plus size={20} /></div>}
          {isOwnProfile && <div onClick={onLogout} className="bg-red-500/20 p-2 rounded-full text-red-500"><LogOut size={20} /></div>}
          {!isOwnProfile && <div className="bg-white/10 p-2 rounded-full"><MoreVertical size={20} /></div>}
        </div>
      </div>

      <div className="flex items-center gap-6 mb-6">
        <div className="story-ring w-24 h-24 p-1">
          <img src={user.profile_pic || user.google_pic_url || (user.username ? REAL_AVATARS[user.username.length % REAL_AVATARS.length] : REAL_AVATARS[0])} className="w-full h-full rounded-full bg-gray-800 object-cover" alt="User Profile" />
        </div>

        <div className="flex gap-6 text-center">
          <div><span className="block font-bold text-lg">12</span><span className="text-xs opacity-50">Posts</span></div>
          <div><span className="block font-bold text-lg">2.5k</span><span className="text-xs opacity-50">Followers</span></div>
          <div><span className="block font-bold text-lg">340</span><span className="text-xs opacity-50">Following</span></div>
        </div>
      </div>

      {/* Description / SEO Bio */}
      {/* Description / SEO Bio */}
      <div className="mb-6">
        <h2 className="font-bold">{user.name || "VibeTalk User"}</h2>
        <p className="opacity-70 text-sm mb-2">{user.bio || "Passionate about connecting with the world."}</p>

        {/* SEO Credit - Hidden from easy view but present for crawlers/users */}
        <div className="bg-white/5 p-3 rounded-lg border border-white/5 mt-4">
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-1">Developed By</p>
          <p className="text-xs text-blue-400 font-bold">Yash A Mishra (Rangra Developer)</p>
          <a href="https://vibe-talk-premium-live.netlify.app/" className="text-[10px] text-white/30 hover:text-white transition">yashamishra.com • ysmai.com</a>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        {isOwnProfile ? (
          <>
            <button className="flex-1 bg-white/10 py-2 rounded-lg font-bold text-sm">Edit Profile</button>
            <button className="flex-1 bg-white/10 py-2 rounded-lg font-bold text-sm">Share Profile</button>
          </>
        ) : (
          <>
            <button className="flex-1 bg-blue-600 py-2 rounded-lg font-bold text-sm text-white">Follow</button>
            <button onClick={() => navigate('/chats/new', { state: { otherUser: user } })} className="flex-1 bg-white/10 py-2 rounded-lg font-bold text-sm">Message</button>
          </>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
          <div key={i} className="aspect-square bg-gray-800 relative group overflow-hidden">
            <img src={`https://source.unsplash.com/random/300x300?art,${i}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
          </div>
        ))}
      </div>
    </div >
  );
};



const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getMatches().then(res => {
      // Augment matches with premium data if missing
      const augmentedMatches = (res.data || []).map((m, i) => ({
        ...m,
        profile_pic: m.profile_pic || REAL_AVATARS[i % REAL_AVATARS.length],
        name: m.name || REAL_NAMES[i % REAL_NAMES.length]
      }));
      setMatches(augmentedMatches);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="screen pb-20">
      <h1 className="text-center mt-4 mb-6">Your Matches</h1>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="radar-loader mb-4"></div>
          <p className="opacity-50 animate-pulse">Scanning for vibes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {matches.length === 0 ? (
            <div className="col-span-2 text-center mt-10 opacity-60 flex flex-col items-center">
              <div className="text-6xl mb-4 grayscale opacity-50">💔</div>
              <h3 className="text-xl mb-2">No Matches Yet</h3>
              <p className="max-w-xs mx-auto mb-6">Your vibe is unique. Don't worry, the right one is swiping right now.</p>
              <Link to="/discover" className="btn w-auto px-8 shadow-lg shadow-purple-500/30">Start Swiping</Link>
            </div>
          ) :
            matches.map(m => (
              <div key={m.user} className="glass card p-3 flex flex-col items-center text-center cursor-pointer hover:bg-white/5 transition"
                onClick={() => {
                  navigate('/chats'); // Or directly to chat room if logic allows
                }}
              >
                <div className="avatar w-16 h-16 text-2xl mb-2 overflow-hidden border-2 border-green-400 p-0.5">
                  {m.profile_pic ? <img src={m.profile_pic} className="w-full h-full object-cover rounded-full" /> : m.name[0]}
                </div>
                <h3 className="font-bold">{m.name}, {m.age}</h3>
                <p className="text-xs text-green-400 flex items-center gap-1 justify-center"><Check size={10} /> Matched</p>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

// --- 🌍 Premium Public Rooms (HelloTalk Style) ---
const PublicRooms = () => {
  // Mock Data for "Live" Rooms
  const rooms = [
    { id: 'english-1', name: 'English Practice 🇺🇸', topic: 'Daily Conversation', members: 42, active: true },
    { id: 'hindi-1', name: 'Desi Vibes 🇮🇳', topic: 'Late Night Talks', members: 128, active: true },
    { id: 'music-1', name: 'Music Lounge 🎵', topic: 'Share your playlist', members: 15, active: true },
    { id: 'gaming-1', name: 'Gaming Squad 🎮', topic: 'BGMI / Valo Rank Push', members: 8, active: true },
    { id: 'tech-1', name: 'Dev Talks 💻', topic: 'Coding & AI', members: 24, active: true },
    { id: 'dating-1', name: 'Love & Vibes ❤️', topic: 'Find your match', members: 256, active: true },
  ];

  const navigate = useNavigate();

  return (
    <div className="screen pb-20 pt-16 px-4">
      <div className="fixed top-0 left-0 w-full bg-black/90 backdrop-blur z-20 p-4 border-b border-white/5 flex justify-between items-center">
        <h1 className="text-2xl font-black italic tracking-tight text-white">Live Rooms <span className="text-red-500 animate-pulse">●</span></h1>
        <button className="bg-white/10 p-2 rounded-full"><Plus size={24} /></button>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-2">
        {rooms.map((room, i) => (
          <div key={room.id} onClick={() => navigate(`/public-chat/${room.id}`, { state: { room } })}
            className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition cursor-pointer active:scale-[0.98]">
            {/* Visual Gang / Avatar Pile */}
            <div className="absolute right-4 top-4 flex -space-x-3">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="w-8 h-8 rounded-full border-2 border-[#121212] overflow-hidden">
                  <img src={REAL_AVATARS[(i + j) % REAL_AVATARS.length]} className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-[#121212] bg-gray-800 flex items-center justify-center text-[10px] font-bold">
                +{room.members}
              </div>
            </div>

            {/* Glowing Backdrop */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-[50px] rounded-full group-hover:bg-blue-500/30 transition"></div>

            <div className="flex justify-between items-start relative z-10">
              <div>
                <h3 className="font-bold text-lg text-white mb-1">{room.name}</h3>
                <p className="text-sm text-white/60 mb-3">{room.topic}</p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(x => (
                      <img key={x} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${room.id}${x}`} className="w-6 h-6 rounded-full border border-black bg-gray-800" />
                    ))}
                  </div>
                  <span className="text-xs text-green-400 font-bold tracking-wide flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> {room.members} Online
                  </span>
                </div>
              </div>
              <div className="bg-white/10 p-2 rounded-full">
                <ArrowRight size={20} className="-rotate-45 group-hover:rotate-0 transition duration-300" />
              </div>
            </div>
          </div>
        ))}

        {/* Create Room Prompt */}
        <div className="border border-dashed border-white/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition cursor-pointer">
          <Plus size={40} className="mb-2" />
          <span className="font-bold">Create Your Room</span>
        </div>
      </div>
    </div>
  );
};

// ChatRoom moved to components/chat/ChatWindow.jsx
// FAKE_REPLIES moved to utils/chatUtils.js

// --- Main App & Navigation ---

const Navbar = () => {
  const location = useLocation();
  if (['/', '/login'].includes(location.pathname) || location.pathname.startsWith('/chats/') || location.pathname.startsWith('/public-chat/')) return null;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link to={to} className={`nav-item flex flex-col items-center text-xs ${location.pathname === to ? 'text-primary' : 'text-gray-400'}`}>
      <Icon size={24} />
      <span>{label}</span>
    </Link>
  );

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl p-4 z-50 flex justify-between items-center ring-1 ring-white/10">
      <NavItem to="/discover" icon={Search} label="Discover" />
      <NavItem to="/rooms" icon={Globe} label="Rooms" />
      <div className="w-[1px] h-8 bg-white/10"></div>
      <NavItem to="/chats" icon={MessageCircle} label="Chats" />
      <NavItem to="/matches" icon={Heart} label="Matches" />
      <NavItem to="/profile" icon={User} label="Profile" />
    </nav>
  );
}


// Redefine Profile Page to include Edit Button
const ProfilePage = ({ user, userData, onLogout, onUpdate }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [uploading, setUploading] = useState(false);

  // userData.images should have the list of gallery images
  // userData.profile_pic has main

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    // We need the profile ID. Assuming userData includes the ID or 'id' field is exposed in ProfileSerializer?
    // ProfileSerializer usually exposes 'id' of the user, but not the profile PK. 
    // Actually the `upload_gallery` action is on the Detail route of ProfileViewSet. 
    // We need to know the profile ID. Let's assume userData.id (User ID) is NOT the profile ID.
    // Wait, ProfileViewSet is ModelViewSet on Profile. So the ID is profile.id. 
    // Is profile.id exposed? Let's check serializer. No it's not explicitly adding 'id'.
    // Let's rely on api.getMe() returning ProfileSerializer which SHOULD have 'id' if ModelSerializer default.
    // Default ModelSerializer DOES include 'id'. Let's hope so. If not, we might fail.
    // For safety, let's assume api updateMe endpoint might be easier but we used specific action.
    // Let's try userData.id (which might be user id? No, getMe returns ProfileSerializer data). 
    // ProfileSerializer model = Profile. So id is Profile ID. Perfect.

    try {
      await api.uploadGalleryImage(userData.id || userData.user, formData); // Fallback to user ID if profile ID missing? No, user ID won't work for Pk look up if pk is AutoField.
      // Actually for simplicity, let's refresh profile.
      const res = await api.getMe();
      onUpdate(res.data);
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="screen pb-20">
      <div className="glass card text-center mt-10 p-6 relative">
        <button className="absolute top-4 right-4 p-2 opacity-70 hover:opacity-100" onClick={() => setShowEdit(true)}>
          <Edit3 size={20} />
        </button>
        <div className="avatar w-24 h-24 text-3xl mx-auto mb-4 border-4 border-primary overflow-hidden">
          {userData?.profile_pic ? <img src={userData.profile_pic} className="w-full h-full object-cover" /> : (userData?.name ? userData.name[0].toUpperCase() : '?')}
        </div>
        <h2 className="text-2xl font-bold">{userData?.name || user.username}</h2>
        <p className="opacity-60">@{user.username}</p>

        {/* Gallery Section */}
        <div className="mt-6 text-left">
          <h3 className="text-sm font-bold opacity-70 mb-2 uppercase">My Vibes (Gallery)</h3>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <label className="glass w-20 h-20 flex items-center justify-center cursor-pointer hover:bg-white/10 shrink-0">
              {uploading ? <div className="loader w-4 h-4" /> : <span className="text-2xl">+</span>}
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
            </label>
            {userData?.images?.map(img => (
              <div key={img.id} className="w-20 h-20 shrink-0 rounded overflow-hidden glass">
                <img src={img.image} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-left space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="glass p-3 rounded bg-white/5">
              <span className="text-xs uppercase opacity-50 block">Gender</span>
              <span className="font-semibold">{userData?.gender || 'Not set'}</span>
            </div>
            <div className="glass p-3 rounded bg-white/5">
              <span className="text-xs uppercase opacity-50 block text-primary">Age</span>
              <span className="font-semibold">{userData?.age || 'Not set'}</span>
            </div>
          </div>
          <div className="glass p-3 rounded bg-white/5">
            <span className="text-xs uppercase opacity-50 block">Interested In</span>
            <span className="font-semibold">{userData?.interested_in || 'Everyone'}</span>
          </div>
          <div className="glass p-3 rounded bg-white/5">
            <span className="text-xs uppercase opacity-50 block">Bio</span>
            <p className="text-sm italic opacity-80">{userData?.bio || 'No bio yet.'}</p>
          </div>
        </div>

        <button className="btn btn-secondary mt-8 text-red-400 border-red-400 flex items-center justify-center gap-2 mx-auto" onClick={onLogout}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {showEdit && <EditProfileModal user={user} userData={userData} onClose={() => setShowEdit(false)} onUpdate={onUpdate} />}
    </div>
  );
};

// Redefine Chats, Requests for Tailwind/Style consistency if needed, but keeping existing is fine.
// Just ensuring Routes exist.


const ChatsList = ({ user }) => {
  // Empty wrapper to keep existing definition but generally unused as MessagesList is the main one now
  return null;
}



// --- 🚀 Onboarding / Intro Modal (New User Flow) ---
const IntroModal = ({ onClose }) => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 animate-in fade-in">
      <div className="w-full max-w-sm bg-[#121212] rounded-3xl border border-white/10 p-8 text-center relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/10 flex">
          <div className={`h-full bg-purple-500 transition-all duration-500 ${step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'}`}></div>
        </div>

        <div className="mb-6 mt-4 flex justify-center">
          {step === 1 && <div className="w-24 h-24 bg-purple-500/20 rounded-full flex items-center justify-center animate-bounce"><User size={48} className="text-purple-500" /></div>}
          {step === 2 && <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse"><Flame size={48} className="text-red-500" /></div>}
          {step === 3 && <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center animate-bounce"><Check size={48} className="text-green-500" /></div>}
        </div>

        <h2 className="text-2xl font-black font-outfit mb-2">
          {step === 1 && "Stay Anonymous 🎭"}
          {step === 2 && "Safety First 🛡️"}
          {step === 3 && "You're Ready! 🚀"}
        </h2>
        <p className="text-white/60 mb-8 text-sm leading-relaxed">
          {step === 1 && "No phone numbers, no real names required. Chat freely but respectfully. Your privacy is our priority."}
          {step === 2 && "Zero tolerance for harassment. You can Block, Report, or Mute anyone instantly. Keep the vibe check passed!"}
          {step === 3 && "Start matching with people nearby or globally. Confirm you are 18+ and ready to vibe?"}
        </p>

        <button onClick={nextStep} className="w-full py-3.5 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-200 transition">
          {step === 3 ? "Let's Go!" : "Next"}
        </button>
      </div>
    </div>
  );
};

// ... (Previous components) 

const MainApp = ({ user, userData, onLogout, onUpdate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTabState] = useState('feed');
  const [showOnboarding, setShowOnboarding] = useState(!userData?.profile_pic);
  const [showIntro, setShowIntro] = useState(!localStorage.getItem('vibe_intro_seen'));
  const [showGenSelect, setShowGenSelect] = useState(!localStorage.getItem('vibe_user_gender')); // Premium Modal

  const handleGenderSelect = (gender) => {
    localStorage.setItem('vibe_user_gender', gender);
    setShowGenSelect(false);
    getOrInitFakeChat(gender); // Trigger creation
    toast.success(`Profile set! Matching you with vibes... ✨`);
  };

  // Sync URL -> Tab
  useEffect(() => {
    const path = location.pathname;
    if (path === '/discover') setActiveTabState('search');
    else if (path === '/rooms') setActiveTabState('rooms');
    else if (path === '/reels') setActiveTabState('reels');
    else if (path === '/chats') setActiveTabState('messages');
    else if (path === '/matches') setActiveTabState('matches');
    else if (path === '/profile') setActiveTabState('profile');
    else if (path.startsWith('/public-chat/')) setActiveTabState('rooms'); // Sub-route
    else if (path.startsWith('/chats/')) setActiveTabState('messages'); // Sub-route
    else setActiveTabState('feed');
  }, [location.pathname]);

  // Wrapper to Navigate instead of just setting state
  const setActiveTab = (tab) => {
    if (tab === 'feed') navigate('/');
    else if (tab === 'search') navigate('/discover');
    else if (tab === 'rooms') navigate('/rooms');
    else if (tab === 'reels') navigate('/reels');
    else if (tab === 'messages') navigate('/chats');
    else if (tab === 'matches') navigate('/matches');
    else if (tab === 'profile') navigate('/profile');
    else navigate('/');
  };

  const renderContent = () => {
    // If we are in a sub-route like /chats/:id, we should probably render the specific component or handle it in the Switch
    // But since the original design used a Switch, let's keep it simple.

    // Special handling for sub-routes if they are not full pages in Router but overlay
    if (location.pathname.startsWith('/chats/') && location.pathname !== '/chats') {
      return <ChatWindow user={user} />;
    }
    if (location.pathname.startsWith('/public-chat/')) {
      return <ChatWindow user={user} isPublic={true} />;
    }

    switch (activeTab) {
      case 'discover': return <Discover user={user} />;
      case 'search': return <AdvancedSearch user={user} />;
      case 'rooms': return <PublicRooms />;
      case 'reels': return <Reels onMessage={() => navigate('/chats')} />;
      case 'messages': return <MessagesList activeUser={user} navigate={navigate} />;
      case 'matches': return <Matches />;
      case 'profile':
        if (location.state?.user && location.state.user.username !== user.username) {
          return <UserProfile user={location.state.user} isOwnProfile={false} />;
        }
        return <UserProfile user={{ ...user, ...userData }} isOwnProfile={true} onLogout={onLogout} onEdit={() => setShowOnboarding(true)} />;
      default: return <Discover user={user} />;
    }
  };

  return (
    <CallProvider user={user}>
      <CallOverlay />
      <div className="bg-black text-white min-h-screen relative font-sans">
        {/* Main Content Area */}
        <div className="pb-16">
          {renderContent()}
        </div>


        {/* 🟢 Gender Selection Modal (Premium) */}
        {showGenSelect && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-6 animate-in fade-in">
            <div className="w-full max-w-sm bg-[#121212] rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden text-center">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <h2 className="text-3xl font-black font-outfit text-white mb-2">Vibe Check! ✨</h2>
              <p className="text-white/60 mb-8 text-sm">To give you the best matches, tell us who you are.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleGenderSelect('Male')} className="flex flex-col items-center p-6 rounded-2xl bg-[#262626] border border-white/5 hover:border-blue-500 hover:bg-blue-500/10 transition group">
                  <span className="text-4xl mb-2 group-hover:scale-110 transition">😎</span>
                  <span className="font-bold text-white group-hover:text-blue-400">Boy</span>
                </button>
                <button onClick={() => handleGenderSelect('Female')} className="flex flex-col items-center p-6 rounded-2xl bg-[#262626] border border-white/5 hover:border-pink-500 hover:bg-pink-500/10 transition group">
                  <span className="text-4xl mb-2 group-hover:scale-110 transition">💃</span>
                  <span className="font-bold text-white group-hover:text-pink-400">Girl</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 w-full bg-black border-t border-white/10 flex justify-around items-center py-3 pb-5 z-50 backdrop-blur-md">
          <div onClick={() => setActiveTab('discover')} className={`cursor-pointer transition ${activeTab === 'discover' ? 'scale-110 text-pink-500' : 'text-white/50'}`}>
            {activeTab === 'discover' ? <Flame size={28} className="fill-pink-500" /> : <Flame size={28} />}
          </div>

          <div onClick={() => setActiveTab('search')} className={`cursor-pointer transition ${activeTab === 'search' ? 'scale-110 text-white' : 'text-white/50'}`}>
            <Search size={28} strokeWidth={activeTab === 'search' ? 3 : 2} />
          </div>

          <div onClick={() => setActiveTab('rooms')} className={`cursor-pointer transition ${activeTab === 'rooms' ? 'scale-110 text-blue-400' : 'text-white/50'}`}>
            <Globe size={28} strokeWidth={activeTab === 'rooms' ? 3 : 2} />
          </div>

          <div onClick={() => setActiveTab('messages')} className={`cursor-pointer transition ${activeTab === 'messages' ? 'scale-110 text-white' : 'text-white/50'}`}>
            <div className="relative">
              <MessageCircle size={28} strokeWidth={activeTab === 'messages' ? 3 : 2} />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black animate-pulse"></div>
            </div>
          </div>

          <div onClick={() => setActiveTab('profile')} className={`cursor-pointer transition ${activeTab === 'profile' ? 'scale-110 border-white' : 'border-transparent text-white/50'}`}>
            <div className={`w-8 h-8 rounded-full overflow-hidden border-2 ${activeTab === 'profile' ? 'border-white' : 'border-white/50'}`}>
              <img src={userData?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Onboarding Modal */}
        {showOnboarding && !showIntro && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
            <EditProfileModal user={user} userData={userData} onClose={() => setShowOnboarding(false)} onUpdate={(data) => { onUpdate(data); setShowOnboarding(false); }} />
          </div>
        )}

        {/* Intro Modal (First Time User) */}
        {showIntro && <IntroModal onClose={() => {
          localStorage.setItem('vibe_intro_seen', 'true');
          setShowIntro(false);
          // If we haven't onboarded profile, show that next
          if (!userData?.profile_pic) setShowOnboarding(true);
        }} />}
      </div>
    </CallProvider>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    try {
      const res = await api.getMe();
      setUser({ username: res.data.username });
      setUserData(res.data);
    } catch (err) { setUser(null); } finally { setLoading(false); }
  };

  if (loading) return <div className="screen center-content"><div className="loader">Loading...</div></div>;

  if (user) {
    return (
      <Router>
        <MainApp
          user={user}
          userData={userData}
          onLogout={async () => {
            try { await api.logout(); } catch (e) { console.error("Logout failed", e); }
            setUser(null);
            setUserData(null);
            window.location.href = '/login'; // Force reload to clear any js state
          }}
          onUpdate={setUserData}
        />
      </Router>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a2e', color: '#fff', border: '1px solid #333' } }} />
      <Router>
        <Routes>
          {/* Legal Pages - Accessible without login */}
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/safety" element={<SafetyGuidelines />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Default login page */}
          <Route path="*" element={<Login onSuccess={checkAuth} />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
