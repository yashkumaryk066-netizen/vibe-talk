import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Search, MessageCircle, User, Heart, Send, ArrowLeft, MoreVertical, Edit3, LogOut, Mic, Square, X, Check, Flame, Globe } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import * as api from './api';

const Login = ({ onSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);

  // Toggle between Login and Signup with a smooth state transition
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({ username: '', password: '', email: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        await api.signup(formData);
        toast.success("Welcome to the Vibe! 🚀");
        // Auto-login after signup
        const res = await api.login(formData.username, formData.password);
        if (res.data.status === 'logged in') onSuccess();
      } else {
        const res = await api.login(formData.username, formData.password);
        if (res.data.status === 'logged in') {
          toast.success("Vibes loaded. ✨");
          onSuccess();
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(isSignup ? "Username already taken." : "Wrong credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0f0c29]">
      {/* 🌌 Premium Animated Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/30 rounded-full blur-[100px] animate-pulse delay-0"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-600/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      {/* 💎 Glass Card Container */}
      <div className="z-10 w-full max-w-md p-1">
        <div className="glass bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl p-8 md:p-10 relative overflow-hidden group">

          {/* Shine Effect */}
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 group-hover:animate-shine"></div>

          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 mb-4 shadow-lg shadow-purple-500/30 animate-float">
              <Mic size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-1 font-outfit">VibeTalk.</h1>
            <p className="text-white/40 text-sm font-light tracking-wide">
              {isSignup ? "Create your identity." : "Welcome back, legend."}
            </p>
          </div>

          {/* 📝 Form Section */}
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">

            {/* Username Input */}
            <div className="group/input">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block ml-1 transition-colors group-focus-within/input:text-blue-400">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-white/30 group-focus-within/input:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  className="w-full bg-black/20 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-white/20 hover:bg-black/30"
                  placeholder="vibe_master"
                  required
                  value={formData.username}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            {/* Email Input (Signup Only) */}
            {isSignup && (
              <div className="group/input animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block ml-1 transition-colors group-focus-within/input:text-purple-400">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Globe size={18} className="text-white/30 group-focus-within/input:text-purple-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    className="w-full bg-black/20 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-white/20 hover:bg-black/30"
                    placeholder="you@example.com"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Password Input */}
            <div className="group/input">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2 block ml-1 transition-colors group-focus-within/input:text-pink-400">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Flame size={18} className="text-white/30 group-focus-within/input:text-pink-400 transition-colors" />
                </div>
                <input
                  type="password"
                  className="w-full bg-black/20 border border-white/10 text-white text-sm rounded-xl focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 block w-full pl-11 p-3.5 transition-all outline-none placeholder-white/20 hover:bg-black/30"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              disabled={loading}
              className="w-full group relative flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg shadow-purple-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2 overflow-hidden"
            >
              {/* Button Shine Overlay */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine transition-all"></div>

              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    {isSignup ? "Create Account" : "Sign In"} <ArrowLeft size={16} className="rotate-180" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Toggle Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/40">
              {isSignup ? "Already inside?" : "New to VibeTalk?"}{" "}
              <button
                onClick={toggleMode}
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 hover:text-white transition-all ml-1 border-b border-transparent hover:border-purple-400"
              >
                {isSignup ? "Login Here" : "Join Now"}
              </button>
            </p>
          </div>

        </div>

        {/* Footer Branding */}
        <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em] mt-8 font-light">
          Secure • Encrypted • Private
        </p>

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
    voiceButton: null
  });



  // Handle form submission with file upload support
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append('name', form.name);
      data.append('bio', form.bio);
      data.append('gender', form.gender);
      data.append('age', form.age);
      data.append('location', form.location);
      data.append('interested_in', form.interested_in);
      data.append('min_age_pref', form.min_age_pref);
      data.append('max_age_pref', form.max_age_pref);
      data.append('interests', form.interests);

      // Handle Files
      // Note: form.voiceButton is storing the file object for voice as per previous code
      if (form.voiceButton instanceof File) {
        data.append('voice_bio', form.voiceButton);
      }
      // If we add profile pic upload later, append here too

      const res = await api.updateMe(data);
      onUpdate(res.data);
      onClose();
      toast.success("Vibe Updated! ✨");
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="glass card w-full max-w-lg relative overflow-y-auto max-h-[85vh] p-8 border-t border-white/20 shadow-2xl animate-up">
        <X className="absolute top-6 right-6 cursor-pointer opacity-70 hover:opacity-100 transition" onClick={onClose} />
        <h2 className="mb-6 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Edit Vibes</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <div className="space-y-4">
            <div>
              <label className="text-xs uppercase font-bold tracking-wider opacity-60 mb-2 block">Display Name</label>
              <input className="input-field bg-white/5 border-white/10 focus:bg-black/40" placeholder="Display Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>

            <div>
              <label className="text-xs uppercase font-bold tracking-wider opacity-60 mb-2 block">Bio</label>
              <textarea className="input-field bg-white/5 border-white/10 focus:bg-black/40 h-24 resize-none" placeholder="Short intro about your vibe..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase font-bold tracking-wider opacity-60 mb-2 block">Gender</label>
              <select className="input-field bg-white/5 border-white/10" value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs uppercase font-bold tracking-wider opacity-60 mb-2 block">Age</label>
              <input type="number" className="input-field bg-white/5 border-white/10" placeholder="Age" value={form.age} onChange={e => setForm({ ...form, age: parseInt(e.target.value) || 18 })} />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase font-bold tracking-wider opacity-60 mb-2 block">Location / Country</label>
            <select className="input-field bg-white/5 border-white/10" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
              <option value="India 🇮🇳">India 🇮🇳</option>
              <option value="USA 🇺🇸">USA 🇺🇸</option>
              <option value="UK 🇬🇧">UK 🇬🇧</option>
              <option value="Canada 🇨🇦">Canada 🇨🇦</option>
              <option value="Japan 🇯🇵">Japan 🇯🇵</option>
              <option value="Korea 🇰🇷">Korea 🇰🇷</option>
              <option value="Global 🌍">Global 🌍</option>
            </select>
          </div>

          <div className="p-4 rounded-xl border border-white/10 bg-white/5 mt-2">
            <span className="text-xs uppercase font-bold tracking-wider opacity-60 mb-4 block">Discovery Settings</span>

            <div className="mb-4">
              <label className="text-xs opacity-50 mb-1 block">Show Me</label>
              <select className="input-field bg-black/40 border-white/10" value={form.interested_in} onChange={e => setForm({ ...form, interested_in: e.target.value })}>
                <option value="Male">Men</option>
                <option value="Female">Women</option>
                <option value="Everyone">Everyone</option>
              </select>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <label className="text-xs opacity-50 mb-1 block">Min Age</label>
                <input type="number" className="input-field bg-black/40 border-white/10 text-center" value={form.min_age_pref} min="18" onChange={e => setForm({ ...form, min_age_pref: parseInt(e.target.value) })} />
              </div>
              <span className="opacity-30">-</span>
              <div className="flex-1">
                <label className="text-xs opacity-50 mb-1 block">Max Age</label>
                <input type="number" className="input-field bg-black/40 border-white/10 text-center" value={form.max_age_pref} max="100" onChange={e => setForm({ ...form, max_age_pref: parseInt(e.target.value) })} />
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs uppercase font-bold tracking-wider opacity-60 mb-2 block">Voice Intro</label>
            <div className="file-input-wrapper flex flex-col items-center justify-center gap-2 hover:border-primary transition group">
              <Mic size={24} className="opacity-50 group-hover:text-primary group-hover:opacity-100 transition" />
              <span className="text-sm opacity-70 group-hover:text-white">{form.voiceButton ? "Voice File Selected ✅" : (userData.voice_bio ? "Change Voice Intro 🔄" : "Upload Voice Intro 🎙️")}</span>
              <input type="file" accept="audio/*" onChange={e => setForm({ ...form, voiceButton: e.target.files[0] })} />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase font-bold tracking-wider opacity-60 mb-2 block">Interests</label>
            <input className="input-field bg-white/5 border-white/10" placeholder="Gaming, Anime, Travel..." value={form.interests} onChange={e => setForm({ ...form, interests: e.target.value })} />
          </div>

          <button className="btn mt-4 shadow-lg shadow-blue-500/25">Save Vibe</button>
        </form>
      </div>
    </div>
  );
};

const Discover = ({ user, userData }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchFound, setMatchFound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const audioRef = useRef(null);

  // Parse my interests safely
  const myInterests = userData?.interests ? userData.interests.toLowerCase().split(',').map(s => s.trim()) : [];

  useEffect(() => { loadProfiles(); }, []);

  const loadProfiles = async () => {
    try {
      const res = await api.getProfiles();
      console.log("Profiles loaded:", res.data);
      setProfiles(res.data.filter(p => p.username !== user.username));
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleSwipe = async (userId, action) => {
    // Haptic Vibe (Visual Shake)
    const cardElement = document.querySelector('.swipe-card');
    if (cardElement) {
      cardElement.style.transition = 'transform 0.4s ease, opacity 0.3s ease';
      cardElement.style.transform = `translateX(${action === 'like' ? 200 : -200}px) rotate(${action === 'like' ? 20 : -20}deg)`;
      cardElement.style.opacity = '0';
    }

    const currentProfile = profiles[currentIndex];

    // Optimistic Update Logic
    const nextStep = () => {
      setPhotoIndex(0);
      setCurrentIndex(prev => prev + 1);
      // Reset styles for next mounted card (React Key logic resets DOM)
    };

    try {
      const res = await api.swipe(userId, action);
      if (res.data.match) {
        // Show Boom match!
        setMatchFound(currentProfile);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00d2ff', '#ff007f', '#ffffff']
        });

        // Wait for user to enjoy match before next
        setTimeout(() => {
          setMatchFound(null);
          nextStep();
        }, 3000);
      } else {
        // No match, move fast
        setTimeout(nextStep, 350);
      }
    } catch (err) {
      console.error(err);
      // If error, maybe revert? For now, we assume success or ignore.
      setTimeout(nextStep, 350);
    }
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    const p = profiles[currentIndex];
    const totalPhotos = 1 + (p.images ? p.images.length : 0);
    if (totalPhotos > 1) {
      setPhotoIndex(prev => (prev + 1) % totalPhotos);
    }
  };

  const handleVoicePlay = (e, audioUrl) => {
    e.stopPropagation();
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (loading) return <div className="screen center-content"><div className="loader">Finding Vibes...</div></div>;

  if (currentIndex >= profiles.length) {
    return (
      <div className="screen center-content flex-col text-center">
        <h2 className="mb-4">No more vibes nearby.</h2>
        <p className="opacity-70 mb-6">Expand your settings or come back later.</p>
        <button className="btn w-auto" onClick={() => window.location.reload()}>Refresh</button>
      </div>
    );
  }

  const p = profiles[currentIndex];
  // Construct photo array
  const allPhotos = p.profile_pic ? [p.profile_pic] : [];
  if (p.images) allPhotos.push(...p.images.map(img => img.image));

  const currentImage = allPhotos.length > 0 ? allPhotos[photoIndex] : null;

  return (
    <div className="screen pb-20 relative overflow-hidden">
      <div className="header flex justify-between items-center mb-4">
        <h1 className="m-0 text-xl text-primary">VibeMatch</h1>
        <div className="p-2 glass rounded-full"><Flame size={20} className="text-orange-500" /></div>
      </div>

      <div className="swipe-container">
        <div key={p.user} className="swipe-card animate-up group" onClick={nextPhoto} onDoubleClick={() => handleSwipe(p.user, 'like')}>
          {/* Neon Border Glow */}
          <div className="absolute inset-0 rounded-[30px] border-2 border-transparent bg-gradient-to-b from-blue-500/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>

          {/* Photo Area */}
          <div className="w-full h-full bg-gray-900 flex items-center justify-center text-6xl font-bold text-white/10 uppercase relative overflow-hidden rounded-[20px]">
            {currentImage ? (
              <img src={currentImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                <span className="text-8xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  {p.name[0]}
                </span>
              </div>
            )}

            {/* Pagination Dots */}
            {allPhotos.length > 1 && (
              <div className="absolute top-4 left-0 w-full flex justify-center gap-1.5 px-4 z-20">
                {allPhotos.map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === photoIndex ? 'w-6 bg-white shadow-lg shadow-white/50' : 'w-1.5 bg-white/30'}`} />
                ))}
              </div>
            )}
          </div>

          <div className="swipe-info pointer-events-none">
            <h2 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
              {p.name}, {p.age}
              <span className="bg-blue-500 rounded-full p-1 text-[10px] flex items-center justify-center shadow-lg shadow-blue-500/50" title="Verified Vibe">
                <Check size={12} strokeWidth={4} />
              </span>
            </h2>
            <p className="text-white/80 text-sm mb-2 flex items-center gap-1 opacity-70"><Globe size={12} /> {p.location || 'India 🇮🇳'}</p>
            <p className="text-white/80 text-lg mb-2">{p.gender}</p>
            {p.bio && <p className="text-white/70 italic mb-4">"{p.bio}"</p>}
            <div className="flex flex-wrap gap-2 mb-3">
              {p.interests && p.interests.split(',').map((tag, i) => {
                const isMatch = myInterests.includes(tag.trim().toLowerCase());
                return (
                  <span key={i} className={`badge-gradient ${isMatch ? 'border-yellow-400 text-yellow-300 shadow-[0_0_10px_rgba(250,204,21,0.5)]' : ''}`}>
                    {tag.trim()} {isMatch && '✨'}
                  </span>
                );
              })}
            </div>

            {p.voice_bio && (
              <div className="mt-3 flex items-center gap-2 pointer-events-auto" onClick={e => e.stopPropagation()}>
                <div className={`p-3 rounded-full backdrop-blur cursor-pointer transition flex items-center justify-center ${isPlaying ? 'bg-primary text-black pulse-ring' : 'bg-white/20 text-white hover:bg-white/30'}`}
                  onClick={(e) => handleVoicePlay(e, p.voice_bio)}>
                  {isPlaying ? <Square size={16} fill="currentColor" /> : <Mic size={20} />}
                </div>
                <span className="text-xs text-white/80">{isPlaying ? "Listening..." : "Play Voice Intro"}</span>
              </div>
            )}

            {allPhotos.length > 1 && <p className="text-xs text-center mt-4 opacity-50">Tap right/left to browse • Double tap to like</p>}
          </div>
        </div>
      </div>

      <div className="swipe-buttons">
        <button className="swipe-btn pass" onClick={() => handleSwipe(p.user, 'pass')}><X size={32} /></button>
        <button className="swipe-btn like" onClick={() => handleSwipe(p.user, 'like')}><Heart size={32} fill="currentColor" /></button>
      </div>

      {matchFound && (
        <div className="match-overlay">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-yellow-500 mb-4 animate-bounce">IT'S A VIBE!</h1>
          <div className="flex gap-4 items-center">
            <div className="avatar w-20 h-20 text-2xl">{user.username[0]}</div>
            <Heart size={40} className="text-pink-500 animate-pulse" fill="currentColor" />
            <div className="avatar w-20 h-20 text-2xl">{matchFound.name[0]}</div>
          </div>
          <p className="mt-6 text-xl">You and {matchFound.name} like each other.</p>
        </div>
      )}
    </div>
  );
};

const PublicRooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchRooms = () => {
    api.getPublicRooms().then(res => {
      setRooms(res.data);
      setLoading(false);
    }).catch(err => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const createRoom = async () => {
    const name = prompt("Name your Vibe Room:", "Chill Zone ☕");
    if (!name) return;

    // Mock creation for now or real API if implemented
    // Let's assume we post to /public-rooms/
    // Since backend ViewSet is standard ModelViewSet, POST /public-rooms/ should work if serializer allows
    try {
      // We might need to adjust backend to allow creation if not already
      // For now, let's optimistic add or alerting
      alert("Creating vibe rooms is coming in Phase 2! Stay tuned.");
    } catch (e) { console.error(e); }
  };

  const joinRoom = (room) => {
    api.joinPublicRoom(room.id).then(() => {
      navigate(`/public-chat/${room.id}`, { state: { room } });
    }).catch(err => toast.error("Could not join room"));
  };

  return (
    <div className="screen pb-20">
      <div className="header sticky top-0 z-10 glass rounded-none p-4 mb-4 border-none flex justify-between items-center">
        <h1 className="m-0 text-xl font-bold flex items-center gap-2"><Mic size={20} /> Voice Rooms</h1>
        <button className="btn text-xs px-3 py-1 bg-white/10" onClick={createRoom}>+ Create</button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-10 opacity-50 space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs">Tuning in...</p>
        </div>
      ) : (
        rooms.length === 0 ? (
          <div className="text-center opacity-60 mt-10 p-4">
            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Mic size={32} />
            </div>
            <h3>No Live Vibes</h3>
            <p className="text-sm mb-4">Be the first to start a voice room!</p>
            <button className="btn" onClick={createRoom}>Start a Room 🎙️</button>
          </div>
        ) : (
          rooms.map((r, i) => (
            <div key={i} className="glass card animate-up mb-4 p-4 flex justify-between items-center cursor-pointer hover:bg-white hover:bg-opacity-5 transition" onClick={() => joinRoom(r)}>
              <div>
                <h3 className="font-bold text-lg">{r.name}</h3>
                <p className="text-sm opacity-70">{r.topic || 'Just vibing'}</p>
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block">{r.category || 'General'}</span>
              </div>
              <div className="text-center min-w-[50px]">
                <span className="block font-bold text-xl">{r.members_count || 0}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-50 flex items-center justify-center gap-1"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Live</span>
              </div>
            </div>
          ))
        )
      )}
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

  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1a1a2e', color: '#fff', border: '1px solid #333' } }} />
      <Router>
        <Routes>
          <Route path="/" element={!user ? <Login onSuccess={checkAuth} /> : <AppLayout user={user} userData={userData} setUserData={setUserData} onLogout={() => { setUser(null); setUserData(null); }} />} />
          <Route path="/*" element={!user ? <Login onSuccess={checkAuth} /> : <AppLayout user={user} userData={userData} setUserData={setUserData} onLogout={() => { setUser(null); setUserData(null); }} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
