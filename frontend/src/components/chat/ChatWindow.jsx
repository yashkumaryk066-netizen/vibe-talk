
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Video, Camera, Mic, Image, Play, MoreVertical, Shield, Info, StopCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api';
import { generateSmartReply, FAKE_REPLIES } from '../../utils/chatUtils';
import { useCall } from '../../context/CallContext';

const ChatWindow = ({ user, isPublic = false }) => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { startCall } = useCall();

    // Fallback: Extract ID from URL if Route params fail
    const id = params.id || location.pathname.split('/chats/')[1]?.split('/')[0] || location.pathname.split('/public-chat/')[1]?.split('/')[0];

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const chatEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    // Determine Room Name/Info
    const roomData = location.state?.room;
    const otherUser = location.state?.otherUser || (id === 'bot' ? { username: 'Vibe Assistant', isFake: true, profile_pic: null } : { username: 'Vibe User', profile_pic: null, isFake: false });
    const isFakeUser = otherUser.isFake || otherUser.username === 'Vibe Assistant' || id === 'bot';
    const chatTitle = isPublic ? (roomData?.name || 'Public Room') : (otherUser.username || "Vibe Match");
    const chatAvatar = isPublic ? null : (otherUser.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser.username || 'user'}`);

    const [isLocked, setIsLocked] = useState(false);

    // Load Messages
    const loadMessages = async () => {
        if (!id || id === 'undefined' || id === 'null' || id === 'new') return;

        if (id === 'bot') {
            const botMsgs = [
                { id: 1, text: "Welcome to VibeTalk! 🛡️ I'm here to guide you.", sender_name: 'Vibe Assistant', created_at: new Date(Date.now() - 10000).toISOString() },
                { id: 2, text: "You can try secure Audio/Video calls with real users! 📞", sender_name: 'Vibe Assistant', created_at: new Date(Date.now() - 5000).toISOString() }
            ];
            if (messages.length === 0 && !isTyping) setMessages(botMsgs);
            return;
        }

        if (String(id).startsWith('fake_')) {
            const saved = localStorage.getItem('vibe_fake_chat');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (`fake_${parsed.username}` === id) {
                    setMessages(parsed.msgs || []);
                }
            }
            return;
        }

        try {
            const res = await api.getMessages(id, isPublic);
            const newMsgs = res.data;
            if (newMsgs.length > messages.length) setIsTyping(false);
            setMessages(newMsgs);
        } catch (err) { console.error("Error fetching messages:", err); }
    };

    useEffect(() => {
        if (id === 'new') {
            const searchParams = new URLSearchParams(location.search);
            const targetUserId = searchParams.get('user');
            if (targetUserId) {
                api.startChat(targetUserId).then(res => {
                    navigate(`/chats/${res.data.id}`, { replace: true, state: location.state });
                }).catch(err => {
                    console.error(err);
                    toast.error("Connecting failed.");
                    navigate('/discover');
                });
            }
            return;
        }

        loadMessages();
        const interval = setInterval(loadMessages, 2000);
        return () => clearInterval(interval);
    }, [id, isFakeUser]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = async (e, content = null) => {
        if (e) e.preventDefault();
        const finalContent = content || text;
        if ((!finalContent && !(finalContent instanceof FormData)) || !id || id === 'undefined') return;

        try {
            // Handle Real Send
            if (id !== 'bot' && !String(id).startsWith('fake_')) {
                await api.sendMessage(id, finalContent, isPublic);
                // Refresh purely to confirm sent (or optimistically update)
                if (finalContent instanceof FormData) {
                    toast.success("Media Sent!");
                    loadMessages(); // Refresh immediately
                }
            }

            // Optimistic UI for text
            if (typeof finalContent === 'string') {
                const myMsg = { id: Date.now(), text: finalContent, sender_name: user?.username || 'You', created_at: new Date().toISOString() };
                setMessages(prev => [...prev, myMsg]);
                setText('');
            }

            // 🤖 FAKE USER Logic (Same as before)
            if (id === 'bot' || String(id).startsWith('fake_')) {
                setIsTyping(true);
                setTimeout(() => {
                    let replyText;
                    if (id === 'bot') {
                        replyText = "I'm a bot! Connect with real people for calls.";
                    } else {
                        const conversationCount = messages.filter(m => m.sender_name === user.username).length;
                        const recent = messages.slice(-5).map(m => m.text || '');
                        const replies = generateSmartReply(finalContent instanceof FormData ? "Sent a file" : finalContent, conversationCount, otherUser.username, otherUser.bio, recent);
                        replyText = replies[0];

                        const saved = localStorage.getItem('vibe_fake_chat');
                        if (saved) {
                            const parsed = JSON.parse(saved);
                            const myTextMsg = { id: Date.now(), text: finalContent instanceof FormData ? "📷 Image" : finalContent, sender_name: user?.username, created_at: new Date().toISOString() };
                            const botMsg = { id: Date.now() + 1, text: replyText, sender_name: otherUser.username, created_at: new Date().toISOString() };
                            parsed.msgs.push(myTextMsg, botMsg);
                            localStorage.setItem('vibe_fake_chat', JSON.stringify(parsed));
                        }
                    }

                    setMessages(prev => [...prev, {
                        id: Date.now() + 100,
                        text: replyText,
                        sender_name: id === 'bot' ? 'Vibe Assistant' : otherUser.username,
                        created_at: new Date().toISOString()
                    }]);
                    setIsTyping(false);
                }, 2000);
            }
        } catch (e) { toast.error("Failed to send"); }
    };

    // --- 📸 Media Handlers ---
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('image', file); // Should match backend 'image' field
        handleSend(null, formData);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioFile = new File([audioBlob], "voice_note.wav", { type: 'audio/wav' });
                const formData = new FormData();
                formData.append('voice_file', audioFile);
                handleSend(null, formData);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Mic access denied", err);
            toast.error("Accessing Microphone failed");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };


    const handleCall = (type) => {
        if (isFakeUser || id === 'bot') {
            toast.error("Cannot call virtual assistants.");
            return;
        }
        startCall(id, type, otherUser);
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white font-sans relative overflow-hidden">

            {/* 🌟 Background Glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[100px] pointer-events-none"></div>

            {/* 🟢 Header */}
            <div className="h-16 flex items-center px-4 border-b border-white/5 bg-black/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
                <ArrowLeft size={24} className="mr-3 cursor-pointer hover:scale-110 active:scale-95 transition text-white/90" onClick={() => navigate(-1)} />

                {!isPublic && (
                    <div className={`w-10 h-10 rounded-full overflow-hidden mr-3 border p-0.5 ${otherUser.username === 'Vibe Assistant' ? 'border-blue-500' : 'border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`}>
                        <img src={chatAvatar} className="w-full h-full object-cover rounded-full bg-gray-800" />
                        {otherUser.username === 'Vibe Assistant' && <div className="absolute bottom-3 left-12 w-4 h-4 bg-blue-500 border-2 border-black rounded-full flex items-center justify-center text-[8px] font-bold">✓</div>}
                    </div>
                )}

                <div className="flex-1 cursor-pointer">
                    <h3 className="font-bold text-base leading-tight flex items-center gap-1 text-white">{chatTitle} {isPublic && <span className="bg-red-500 text-[8px] px-1 rounded text-white font-bold ml-1 animate-pulse">LIVE</span>}</h3>
                    {!isPublic ? (
                        <span className={`text-xs font-medium flex items-center gap-1 ${otherUser.username === 'Vibe Assistant' ? 'text-blue-400' : 'text-green-400'}`}>
                            {otherUser.username === 'Vibe Assistant' ? 'Official Bot' : 'Online now'}
                            {otherUser.username !== 'Vibe Assistant' && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                        </span>
                    ) : (
                        <span className="text-xs text-white/50">{Math.floor(Math.random() * 200) + 10} vibing</span>
                    )}
                </div>

                <div className="flex gap-5 opacity-90 items-center">
                    {!isPublic && id !== 'bot' && !String(id).startsWith('fake_') && (
                        <>
                            <button onClick={() => handleCall('audio')} className="p-2 rounded-full hover:bg-white/10 transition active:scale-90 ring-1 ring-white/5">
                                <Phone size={20} className="text-white hover:text-green-400 transition" />
                            </button>
                            <button onClick={() => handleCall('video')} className="p-2 rounded-full hover:bg-white/10 transition active:scale-90 ring-1 ring-white/5">
                                <Video size={20} className="text-white hover:text-blue-400 transition" />
                            </button>
                        </>
                    )}
                    <MoreVertical size={24} className="hover:text-white transition cursor-pointer" />
                </div>
            </div>

            {/* 🟢 Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-transparent relative z-10 scrollbar-hide">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center opacity-40 mt-32 animate-in fade-in zoom-in duration-500">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 text-5xl shadow-[0_0_30px_rgba(0,0,0,0.4)] ${otherUser.username === 'Vibe Assistant' ? 'bg-blue-600 shadow-blue-500/40' : 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/40'}`}>
                            <img src={chatAvatar} className="w-24 h-24 rounded-full opacity-90 object-cover" />
                        </div>
                        <p className="font-bold text-lg text-white">{otherUser.username === 'Vibe Assistant' ? 'Vibe Assistant' : "Start Vibing! 🔥"}</p>
                    </div>
                )}

                {messages.map((msg, i) => {
                    const isMe = msg.sender_name === user?.username || msg.sender_name === 'You';
                    const showAvatar = !isMe && (i === 0 || messages[i - 1]?.sender_name !== msg.sender_name);

                    return (
                        <div key={i} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                            {!isMe && (
                                <div className={`w-8 h-8 rounded-full bg-gray-800 overflow-hidden flex-shrink-0 self-end mb-1 border border-white/10 ${!showAvatar && 'opacity-0'}`}>
                                    <img src={otherUser.username === 'Vibe Assistant' ? chatAvatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender_name}`} className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className={`max-w-[75%] shadow-sm backdrop-blur-sm ${isMe
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl rounded-br-sm shadow-blue-500/10'
                                : 'bg-[#262626]/90 text-white rounded-2xl rounded-bl-sm border border-white/10'
                                } px-4 py-2.5`}>

                                {msg.text && <p className="leading-snug text-[15px]">{msg.text}</p>}

                                {msg.image && (
                                    <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                                        <img src={msg.image} className="max-w-full h-auto" />
                                    </div>
                                )}

                                {(msg.audio_url || msg.voice_file) && (
                                    <div className="flex items-center gap-3 mt-1 min-w-[120px]">
                                        <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition">
                                            <Play size={14} fill="white" />{/* TODO: Implement Play Logic */}
                                        </div>
                                        <div className="h-8 flex items-center gap-0.5">
                                            {[...Array(10)].map((_, j) => <div key={j} className="w-1 bg-white/40 rounded-full" style={{ height: Math.random() * 15 + 5 + 'px' }}></div>)}
                                        </div>
                                    </div>
                                )}

                                <span className={`text-[10px] block text-right mt-1 font-medium ${isMe ? 'text-blue-100/50' : 'text-gray-400/50'}`}>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    );
                })}

                {isTyping && (
                    <div className="text-xs text-white/30 ml-12 animate-pulse">Typing...</div>
                )}
                <div ref={chatEndRef}></div>
            </div>

            {/* 🟢 Input Area */}
            <div className="p-3 bg-black/90 backdrop-blur-md border-t border-white/10 flex items-center gap-3 pb-6 sticky bottom-0 z-50">

                {/* Hidden File Input */}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

                <div onClick={() => fileInputRef.current?.click()} className="bg-[#262626] p-2.5 rounded-full cursor-pointer hover:bg-white/20 transition active:scale-90 group">
                    <Camera size={22} className="text-blue-500 group-hover:scale-110 transition" />
                </div>

                <form onSubmit={handleSend} className="flex-1 bg-[#121212] rounded-full flex items-center px-4 py-2.5 border border-white/10 focus-within:border-blue-500/50 transition shadow-inner">
                    <input
                        className="bg-transparent border-none outline-none text-base text-white flex-1 placeholder-zinc-500"
                        placeholder={isRecording ? "Recording..." : (isLocked ? "Chat locked" : "Message...")}
                        value={text}
                        onChange={e => setText(e.target.value)}
                        disabled={isLocked || isRecording}
                    />
                    {text.trim() ? (
                        <button type="submit" className="text-blue-500 font-bold text-sm ml-2 hover:text-blue-400 transition animate-in zoom-in">Send</button>
                    ) : (
                        <div className="flex gap-3 opacity-60 pr-1">
                            {isRecording ? (
                                <StopCircle size={22} className="text-red-500 animate-pulse cursor-pointer hover:scale-110" onClick={stopRecording} />
                            ) : (
                                <Mic size={22} className="hover:text-white transition cursor-pointer hover:scale-110" onClick={startRecording} />
                            )}
                            <Image size={22} className="hover:text-white transition cursor-pointer hover:scale-110" onClick={() => fileInputRef.current?.click()} />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
