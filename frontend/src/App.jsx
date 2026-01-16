import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Search, MessageCircle, User, Heart, Send, ArrowLeft, MoreVertical, Edit3, LogOut, Mic, Square, X, Check, Flame, Globe } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import * as api from './api';

// Utility to decode JWT for Google Auth
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
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
          <div className="mb-8 flex flex-col items-center justify-center relative w-full">
            <h1 className="text-5xl font-black tracking-tight font-outfit text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_25px_rgba(0,210,255,0.6)] mb-2">
              VibeTalk
            </h1>

            {/* Animated Sound Wave */}
            <div className="flex items-center justify-center gap-1.5 h-8">
              <div className="w-1.5 bg-cyan-400 rounded-full animate-wave h-4"></div>
              <div className="w-1.5 bg-blue-500 rounded-full animate-wave h-8" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1.5 bg-purple-500 rounded-full animate-wave h-6" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 bg-pink-500 rounded-full animate-wave h-8" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-1.5 bg-cyan-400 rounded-full animate-wave h-4" style={{ animationDelay: '0.4s' }}></div>
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

            {/* Google Button - Custom Design with Invisible Overlay */}
            <div className="relative w-full">
              {/* The Visible 'Mock' Button (Matches Design) */}
              <button type="button" className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="22px" height="22px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                Continue with Google
              </button>
              {/* The Invisible Real Google Button - Overlays the entire area */}
              <div ref={googleBtnRef} className="absolute inset-0 opacity-0 z-10 overflow-hidden w-full h-full transform scale-x-125"></div>
            </div>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center">
            <button onClick={toggleMode} className="text-sm font-medium text-white/50 hover:text-white transition-colors">
              {isSignup ? "Already have an account? " : "Don't have an account? "}
              <span className="text-cyan-400 font-bold hover:underline">{isSignup ? "Sign In" : "Sign Up"}</span>
            </button>
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
    interests: userData.interests || '',
  });

  const [profilePicPreview, setProfilePicPreview] = useState(userData.profile_pic || userData.google_pic_url);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState(userData.images ? userData.images.map(i => i.image) : []);
  const [loading, setLoading] = useState(false);

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
      await axios.post(`${import.meta.env.VITE_API_URL}/api/profile/${userData.id}/upload_gallery/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
      });
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
      toast.success("Vibe Updated! 🔥");
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
          <h2 className="text-xl font-black italic bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">EDIT VIBE</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative w-full h-full rounded-full p-1 bg-black">
                <img src={profilePicPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name}`} className="w-full h-full rounded-full object-cover" />
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
              <label className="text-xs font-black text-white/70 uppercase tracking-wider flex items-center gap-2"><Image size={14} className="text-purple-500" /> My Vibe Gallery</label>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded badge-gradient">Add 5+ Photos</span>
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
              {[...Array(Math.max(0, 4 - galleryPreviews.length))].map((_, i) => (
                <div key={`empty-${i}`} className="w-24 h-32 flex-shrink-0 snap-start bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                  <Plus size={16} className="text-white/10" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="group">
              <label className="text-xs font-bold text-white/40 ml-1 mb-1 block">DISPLAY NAME</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field w-full bg-white/5 border-white/10 focus:border-cyan-500 transition-colors rounded-xl p-3" placeholder="Your Vibe Name" />
            </div>
            <div className="group">
              <label className="text-xs font-bold text-white/40 ml-1 mb-1 block">BIO / STATUS</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field w-full h-24 resize-none bg-white/5 border-white/10 focus:border-purple-500 transition-colors rounded-xl p-3" placeholder="Tell the world your vibe... ✨" />
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
                <label className="text-xs font-bold text-white/40 ml-1 mb-1 block">AGE</label>
                <input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} className="input-field w-full bg-white/5 border-white/10 rounded-xl p-3" />
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

const Feed = ({ onMessage }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We treat 'Profiles' as 'Posts' for this MVP
    api.getProfiles().then(res => {
      setPosts(res.data);
      setLoading(false);
    }).catch(err => {
      console.error("Feed error:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="screen center-content"><div className="loader"></div></div>;

  return (
    <div className="screen pb-20 overflow-y-auto">
      <div className="flex justify-between items-center p-4 sticky top-0 bg-black/90 backdrop-blur z-20">
        <h1 className="font-outfit text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">VibeTalk</h1>
        <Heart size={24} />
      </div>

      {/* Stories */}
      <div className="story-bar">
        {['Your Story', ...posts.slice(0, 5).map(p => p.name ? p.name.split(' ')[0] : 'Vibe')].map((name, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
            <div className="story-ring w-16 h-16">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} className="story-img" />
            </div>
            <span className="text-xs opacity-80">{name}</span>
          </div>
        ))}
      </div>

      {/* Real Posts from Users */}
      {posts.map((p, i) => (
        <div key={p.id || i} className="mb-6 border-b border-white/10 pb-4 animate-up" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="flex items-center gap-3 p-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden">
              <img src={p.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-bold text-sm block">{p.username}</span>
              <span className="text-xs opacity-50">{p.location || 'Vibe City'}</span>
            </div>
            <MoreVertical size={16} className="ml-auto opacity-50" />
          </div>

          <div className="w-full aspect-square bg-gray-900 overflow-hidden relative">
            <img src={`https://source.unsplash.com/random/800x800?party,neon,${p.username}`} className="w-full h-full object-cover"
              onError={(e) => e.target.src = 'https://media.istockphoto.com/id/1129638608/photo/technological-abstract-background.jpg?s=612x612&w=0&k=20&c=nO8E7i8Y7h6w6f5s7D6g8Hz7J9k0L1M2N3O4P5Q6R7S'} />
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-2 py-1 rounded text-xs font-bold">
              {p.age} years old
            </div>
          </div>

          <div className="p-3">
            <div className="flex gap-4 mb-2">
              <Heart size={28} className="hover:text-red-500 transition cursor-pointer" />
              <div onClick={() => onMessage(p.user)} className="cursor-pointer hover:scale-110 transition">
                <MessageCircle size={28} />
              </div>
              <Send size={28} className="hover:text-blue-500 transition cursor-pointer" />
            </div>
            <p className="text-sm">
              <span className="font-bold mr-2">{p.username}</span>
              {p.bio || "Just vibing on VibeTalk! ✨ #chill #newapp"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

const Reels = ({ onMessage }) => {
  return (
    <div className="reels-container">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="reel-item">
          <div className="absolute inset-0 bg-gray-800 animate-pulse">
            {/* Placeholder for actual video */}
            <img src={`https://source.unsplash.com/random/400x800?dance,music,${i}`} className="reel-video opacity-60" />
          </div>

          <div className="reel-actions">
            <div className="flex flex-col items-center gap-1"><Heart size={28} strokeWidth={2} /> <span className="text-xs">24k</span></div>
            <div className="flex flex-col items-center gap-1"><MessageCircle size={28} strokeWidth={2} /> <span className="text-xs">1.2k</span></div>
            <Send size={28} strokeWidth={2} />
            <MoreVertical size={28} strokeWidth={2} />
            <div className="w-8 h-8 border-2 border-white rounded-md overflow-hidden"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Music${i}`} /></div>
          </div>

          <div className="reel-overlay">
            <div className="flex items-center gap-2 mb-2">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=ReelUser${i}`} className="w-8 h-8 rounded-full border border-white" />
              <span className="font-bold">ReelStar_{i}</span>
              <button className="text-xs border border-white px-2 py-0.5 rounded">Follow</button>
            </div>
            <p className="text-sm">Vibing with the new update! 🔥 #vibetalk</p>
            <div className="flex items-center gap-2 mt-2 opacity-80 text-xs"><Mic size={12} /> Original Audio</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const MessagesList = ({ navigate, activeUser }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real matches/chats
    api.getMatches().then(res => {
      setChats(res.data);
      setLoading(false);
    }).catch(e => setLoading(false));
  }, []);

  return (
    <div className="screen pb-20 pt-14">
      <div className="fixed top-0 w-full p-4 glass z-10 flex justify-between items-center">
        <h1 className="font-bold text-xl flex items-center gap-1">{activeUser?.username} <span className="text-xs opacity-50">▼</span></h1>
        <Edit3 size={24} />
      </div>

      <div className="px-4 py-2">
        <div className="bg-white/10 p-2 rounded-lg flex items-center gap-2 text-white/50 text-sm">
          <Search size={16} /> Search
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto pb-20">
        {loading ? <div className="p-4 text-center opacity-50">Loading chats...</div> :
          chats.length === 0 ? (
            <div className="p-8 text-center opacity-50 flex flex-col items-center">
              <MessageCircle size={48} className="mb-2" />
              <p>No messages yet.</p>
              <p className="text-xs">Start a chat from the Home Feed!</p>
            </div>
          ) :
            chats.map(p => (
              <div key={p.id} className="chat-item" onClick={() => navigate(`/chats/${p.user}`)}>
                {/* Navigating to /chats/:id where :id is the USER ID, handled by MainApp/Router logic */}
                <div className="story-ring w-14 h-14 p-0.5 border-none bg-gradient-to-tr from-transparent to-transparent">
                  <img src={p.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`} className="w-full h-full rounded-full bg-gray-800 object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm block">{p.name || p.username}</h4>
                  <p className="text-xs opacity-60">Tap to chat • Now</p>
                </div>
                <camera size={20} className="opacity-50" />
              </div>
            ))}
      </div>
    </div>
  );
};

// --- Re-using existing Swipe Logic for 'Search' tab ---
const Discover = ({ user, userData }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchFound, setMatchFound] = useState(null);

  useEffect(() => {
    api.getProfiles().then(res => setProfiles(res.data.filter(p => p.username !== user.username))).catch(console.error);
  }, []);

  const handleSwipe = async (userId, action) => {
    // Existing swipe logic simplified for brevity in this view
    if (action === 'like') {
      const res = await api.swipe(userId, 'like');
      if (res.data.match) {
        toast.success("It's a Match! 🔥");
      }
    }
    setCurrentIndex(prev => prev + 1);
  };

  if (currentIndex >= profiles.length) return <div className="screen center-content"><h2>No more vibes.</h2></div>;
  const p = profiles[currentIndex];
  // Fallback if images missing (handled by backend now, but safe check)
  const imgUrl = p.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.username}`;

  return (
    <div className="screen pb-20 pt-4 relative overflow-hidden bg-black">
      <div className="swipe-card mx-auto mt-4 w-[90%] h-[70vh] rounded-3xl overflow-hidden relative shadow-2xl border border-white/10 bg-gray-900">
        <img src={imgUrl} className="w-full h-full object-cover" />
        <div className="absolutebottom-0 left-0 w-full bg-gradient-to-t from-black via-black/50 to-transparent p-6 pt-20 flex flex-col justify-end h-full">
          <h2 className="text-3xl font-bold flex items-center gap-2">{p.name}, {p.age} <span className="bg-blue-500 text-[10px] p-1 rounded-full"><Check size={8} /></span></h2>
          <p className="opacity-80 mb-4">{p.bio || "Just vibing."}</p>
          <div className="flex gap-4 mt-2">
            <button onClick={() => handleSwipe(p.user, 'pass')} className="w-14 h-14 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition"><X size={30} /></button>
            <button onClick={() => handleSwipe(p.user, 'like')} className="w-14 h-14 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition"><Heart size={30} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileView = ({ user, onLogout }) => (
  <div className="screen pb-20 pt-10 px-4">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-bold">{user.username} <span className="text-red-500 text-xs px-2 py-0.5 bg-red-500/10 rounded">LIVE</span></h1>
      <div className="flex gap-4">
        <div className="bg-white/10 p-2 rounded-full"><Plus size={20} /></div>
        <div onClick={onLogout} className="bg-red-500/20 p-2 rounded-full text-red-500"><LogOut size={20} /></div>
      </div>
    </div>

    <div className="flex items-center gap-6 mb-6">
      <div className="story-ring w-24 h-24 p-1">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full rounded-full bg-gray-800" />
      </div>
      <div className="flex gap-6 text-center">
        <div><span className="font-bold text-lg block">154</span><span className="text-xs opacity-60">Posts</span></div>
        <div><span className="font-bold text-lg block">2.4M</span><span className="text-xs opacity-60">Followers</span></div>
        <div><span className="font-bold text-lg block">12</span><span className="text-xs opacity-60">Following</span></div>
      </div>
    </div>

    <div className="mb-6">
      <p className="font-bold">Vibe Creator</p>
      <p className="opacity-80 text-sm">Building the future of social. 🚀<br />Artist | Dreamer | Vibe</p>
    </div>

    <div className="flex gap-2 mb-8">
      <button className="flex-1 bg-white/10 py-2 rounded-lg font-bold text-sm">Edit Profile</button>
      <button className="flex-1 bg-white/10 py-2 rounded-lg font-bold text-sm">Share Profile</button>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-3 gap-1">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
        <div key={i} className="aspect-square bg-gray-800 relative group overflow-hidden">
          <img src={`https://source.unsplash.com/random/300x300?art,${i}`} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
        </div>
      ))}
    </div>
  </div>
);

// --- Main App Shell ---
// --- Main App Shell ---
const MainApp = ({ user, userData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('feed');
  const navigate = useNavigate();

  const handleMessage = async (targetUserId) => {
    try {
      // Direct messaging: Create/Get chat room then navigate
      await api.post('/chatrooms/start_chat/', { target_user_id: targetUserId });
      navigate(`/chats/${targetUserId}`);
    } catch (e) {
      console.log("Chat start fallback", e);
      // Even if API fails (maybe offline?), try navigating
      navigate(`/chats/${targetUserId}`);
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'feed': return <Feed onMessage={handleMessage} />;
      case 'search': return <Discover user={user} userData={userData} />;
      case 'reels': return <Reels onMessage={handleMessage} />;
      case 'messages': return <MessagesList navigate={navigate} activeUser={user} />;
      case 'profile': return <ProfileView user={user} onLogout={onLogout} />;
      default: return <Feed onMessage={handleMessage} />;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {renderTab()}
      <InstaNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getMatches().then(res => setMatches(res.data)).finally(() => setLoading(false));
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

const ChatRoom = ({ user, isPublic = false }) => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null);

  const roomData = location.state?.room;
  const otherUserName = isPublic ? (roomData?.name || 'Public Room') : (location.state?.otherUser || 'Chat');
  // For public room, id is room.id. For private, id is room.id.

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const res = await api.getMessages(id, isPublic);
      setMessages(res.data);
    } catch (err) { }
  };

  const handleSendText = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await api.sendMessage(id, text, isPublic);
      setText('');
      loadMessages();
    } catch (err) { }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const file = new File([audioBlob], "voice_note.mp3", { type: "audio/mp3" });
        const formData = new FormData();
        formData.append('voice_file', file);
        if (isPublic) formData.append('public_room', id);
        else formData.append('room', id);

        try {
          await api.sendMessage(id, formData, isPublic);
          loadMessages();
        } catch (err) { alert("Failed Voice Note"); }
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) { alert("Mic Error"); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="screen flex flex-col h-screen p-0">
      <div className="glass nav-bar sticky top-0 rounded-none p-3 flex justify-between z-50 items-center">
        <div className="flex items-center gap-3">
          <ArrowLeft className="cursor-pointer" onClick={() => navigate(isPublic ? '/rooms' : '/chats')} />
          <div>
            <h3 className="m-0 text-base">{otherUserName}</h3>
            {isPublic && <span className="text-xs text-green-400">● Live Audio (Simulated)</span>}
          </div>
        </div>
        {!isPublic && <MoreVertical className="cursor-pointer" onClick={() => setShowMenu(!showMenu)} />}

        {showMenu && !isPublic && (
          <div className="glass absolute top-12 right-2 bg-gray-900 p-2 flex flex-col gap-2 rounded">
            {/* Block/Report logic here invoked via api */}
            <button className="btn btn-secondary text-xs p-2 text-red-500 border-red-500">Block / Report</button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.length === 0 && !isPublic && (
          <div className="flex flex-col items-center justify-center h-full opacity-70">
            <p className="mb-4 text-sm">No vibes yet. Break the ice!</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button className="chip" onClick={() => setText("What's your vibe? ✨")}>What's your vibe? ✨</button>
              <button className="chip" onClick={() => setText("Send me a voice limit! 🎤")}>Voice challenge? 🎤</button>
              <button className="chip" onClick={() => setText("Top 3 songs rn? 🎵")}>Top tracks? 🎵</button>
            </div>
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_name === user.username;
          return (
            <div key={msg.id} className={`max-w-[80%] ${isMe ? 'self-end' : 'self-start'} mb-2`}>
              <div className={`flex items-baseline gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && <span className="text-xs opacity-50 block">{msg.sender_name}</span>}
                <span className="text-[10px] opacity-30">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
              </div>
              <div
                className={`p-3 rounded-2xl ${isMe ? 'rounded-br-sm bg-primary bg-opacity-30' : 'rounded-bl-sm glass'}`}
              >
                {msg.text && <p className="m-0 text-sm">{msg.text}</p>}
                {msg.voice_file && <audio controls src={msg.voice_file} className="h-8 w-48 mt-2" />}
                {msg.audio_url && <div className="mt-2"><audio controls src={msg.audio_url} className="h-8 w-48" /><span className="text-[10px] opacity-50 block mt-1">Voice Record 🎤</span></div>}
              </div>
            </div>
          );
        })}
        {/* Fake Typing Indicator Logic: If last msg is mine and recent, simulate typing */}
        {messages.length > 0 && messages[messages.length - 1].sender_name === user.username && !isPublic && (
          <div className="self-start glass p-3 rounded-2xl rounded-bl-sm mb-2 animate-pulse flex items-center gap-1">
            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-150"></div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="glass p-3 rounded-none">
        <div className="flex items-center gap-2">
          <button
            className={`btn w-12 h-12 rounded-full p-0 flex items-center justify-center ${isRecording ? 'bg-red-500 animate-pulse' : ''}`}
            onMouseDown={startRecording} onMouseUp={stopRecording}
            onTouchStart={startRecording} onTouchEnd={stopRecording}
          >
            {isRecording ? <Square size={18} fill="white" /> : <Mic size={20} />}
          </button>

          <form onSubmit={handleSendText} className="flex-1 flex gap-2">
            <input
              className="input-field m-0 rounded-full px-4"
              placeholder={isRecording ? "Recording..." : "Message..."}
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={isRecording}
            />
            <button className="btn w-12 h-12 rounded-full p-0 flex items-center justify-center">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

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
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    api.getRooms().then(res => setRooms(res.data));
  }, []);
  const getOther = (r) => r.user1_name === user.username ? r.user2_name : r.user1_name;

  return (
    <div className="screen pb-20">
      <h1 className="text-center mt-4 mb-6">Chats</h1>
      {rooms.map(r => (
        <div key={r.id} className="glass card p-4 mb-3 flex items-center gap-4 cursor-pointer" onClick={() => navigate(`/chats/${r.id}`, { state: { room: r, otherUser: getOther(r) } })}>
          <div className="avatar w-12 h-12 text-lg">{getOther(r)[0]}</div>
          <div>
            <h3 className="font-bold">{getOther(r)}</h3>
            <p className="text-xs opacity-50">Private Chat</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ... (Previous components like ChatList, Matches etc. remain above) 

const AppLayout = ({ user, userData, setUserData, onLogout }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Force onboarding if no name or profile pic set properly (basic heuristic)
    // userData might simple initially, but let's check profile_pic
    if (userData && (!userData.profile_pic)) {
      // Delay slightly to not jar the user
      const timer = setTimeout(() => {
        setShowOnboarding(true);
        toast('Upload a photo to start vibing!', { icon: '📸' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [userData]);

  const location = useLocation();
  const hideHeader = ['/'];

  return (
    <>
      {/* Insta-Style Top Header */}
      {!hideHeader.includes(location.pathname) && user && (
        <div className="fixed top-0 w-full z-40 px-4 py-3 flex justify-between items-center bg-black/80 backdrop-blur-md border-b border-white/5">
          <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">VibeTalk.</h1>
          <div className="flex gap-5">
            <Link to="/activity"><div className="relative"><Flame size={24} strokeWidth={2} /> <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span></div></Link>
            <Link to="/chats"><MessageCircle size={24} strokeWidth={2} /></Link>
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        {/* Global Background Effects if needed */}
      </div>
      <Routes>
        <Route path="/discover" element={<Discover user={user} userData={userData} />} />
        <Route path="/rooms" element={<PublicRooms />} />
        <Route path="/public-chat/:id" element={<ChatRoom user={user} isPublic={true} />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/chats" element={<ChatsList user={user} />} />
        <Route path="/chats/:id" element={<ChatRoom user={user} isPublic={false} />} />
        <Route path="/profile" element={<ProfilePage user={user} userData={userData} onLogout={onLogout} onUpdate={setUserData} />} />
        <Route path="*" element={<Discover user={user} />} />
      </Routes>
      <Navbar />
      {showOnboarding && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4">
          {/* Reuse EditProfileModal but maybe with valid close logic or force it? 
                         For now reusing EditProfileModal is fine, but we need to pass onClose. 
                      */}
          <EditProfileModal user={user} userData={userData} onClose={() => setShowOnboarding(false)} onUpdate={setUserData} />
        </div>
      )}
    </>
  );
};

function App() {
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
        <MainApp user={user} userData={userData} onLogout={() => { setUser(null); setUserData(null); }} />
      </Router>
    );
  }

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a2e', color: '#fff', border: '1px solid #333' } }} />
      <Router>
        <Routes>
          <Route path="*" element={<Login onSuccess={checkAuth} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
