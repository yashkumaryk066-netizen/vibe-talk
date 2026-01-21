import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Users, Globe, Zap, Shield, Star, Code } from 'lucide-react';

const AboutUs = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] text-white pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/10 rounded-full transition"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">About VibeTalk</h1>
                        <p className="text-xs text-white/60">Get to know us better</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Hero Section */}
                <div className="glass p-8 rounded-2xl mb-8 border border-white/10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-4 flex items-center justify-center transform rotate-12">
                        <Heart className="text-white" size={40} fill="white" />
                    </div>
                    <h2 className="text-3xl font-black mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        VibeTalk
                    </h2>
                    <p className="text-xl text-white/80 mb-2">Voice-First Social Connection Platform</p>
                    <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Connecting people through authentic conversations, voice-first interactions,
                        and meaningful connections - without revealing phone numbers.
                    </p>
                </div>

                {/* Our Mission */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="text-yellow-400" size={28} />
                        Our Mission
                    </h2>
                    <div className="glass p-6 rounded-xl text-white/80 leading-relaxed">
                        <p className="mb-4">
                            VibeTalk was created with a simple yet powerful mission: to make social connections
                            more authentic, safe, and fun for everyone.
                        </p>
                        <p>
                            We believe that the best conversations happen when people feel comfortable being themselves.
                            That's why we built a platform where you can:
                        </p>
                        <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                            <li>Connect without revealing your phone number</li>
                            <li>Communicate through voice notes and text messages</li>
                            <li>Discover people with similar interests nearby or globally</li>
                            <li>Stay safe with built-in blocking, reporting, and moderation</li>
                        </ul>
                    </div>
                </section>

                {/* What Makes Us Different */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Star className="text-blue-400" size={28} />
                        What Makes Us Different
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="glass p-6 rounded-xl border border-blue-500/20">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
                                <Shield className="text-blue-400" size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-blue-400">Privacy First</h3>
                            <p className="text-white/70 text-sm">
                                No phone numbers required. Your privacy is protected with anonymous usernames
                                and optional profile visibility settings.
                            </p>
                        </div>

                        <div className="glass p-6 rounded-xl border border-purple-500/20">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-3">
                                <Users className="text-purple-400" size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-purple-400">Voice-First</h3>
                            <p className="text-white/70 text-sm">
                                Express yourself with voice notes, text, and images.
                                We prioritize authentic voice communication over endless swiping.
                            </p>
                        </div>

                        <div className="glass p-6 rounded-xl border border-green-500/20">
                            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3">
                                <Globe className="text-green-400" size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-green-400">Global Community</h3>
                            <p className="text-white/70 text-sm">
                                Connect with people from around the world or find matches in your city.
                                Language practice, friendships, and meaningful connections.
                            </p>
                        </div>

                        <div className="glass p-6 rounded-xl border border-red-500/20">
                            <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center mb-3">
                                <Heart className="text-red-400" size={24} />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-red-400">Gen Z Vibes</h3>
                            <p className="text-white/70 text-sm">
                                Modern, fast, and fun. Swipe, match, chat, and vibe with people who get you.
                                No boring profiles, just real connections.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Features */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Core Features</h2>

                    <div className="glass p-6 rounded-xl space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Discover People</h3>
                                <p className="text-white/70 text-sm">
                                    Swipe-based discovery with advanced filters (age, location, interests).
                                    Find people you actually want to talk to.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Voice Rooms & Chat</h3>
                                <p className="text-white/70 text-sm">
                                    Join public voice rooms or have private one-on-one chats.
                                    Send text, voice notes, and images seamlessly.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Matches & Connections</h3>
                                <p className="text-white/70 text-sm">
                                    Like someone? If they like you back, it's a match!
                                    Start chatting instantly with mutual matches.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Safety & Moderation</h3>
                                <p className="text-white/70 text-sm">
                                    Block and report users instantly. Our team actively moderates content
                                    to keep the community safe and friendly.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Premium Experience</h3>
                                <p className="text-white/70 text-sm">
                                    Beautiful glassmorphic UI, smooth animations, Instagram-style stories,
                                    and reels integration. A truly modern social experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Team */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Code className="text-purple-400" size={28} />
                        The Team
                    </h2>

                    <div className="glass p-6 rounded-xl">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
                                YM
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-white mb-1">Yash Ankush Mishra</h3>
                                <p className="text-blue-400 text-sm mb-2">Founder & Developer</p>
                                <p className="text-white/70 text-sm leading-relaxed">
                                    Full-stack developer specializing in AI-powered applications and social platforms.
                                    Based in Rangra, Bhagalpur, Bihar, India. Passionate about creating technology that brings people together.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                                        Full Stack Developer
                                    </span>
                                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                                        AI Architect
                                    </span>
                                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                        UI/UX Designer
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Technology Stack */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Technology We Use</h2>

                    <div className="glass p-6 rounded-xl">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-blue-400 mb-3">Frontend</h3>
                                <ul className="space-y-2 text-white/70 text-sm">
                                    <li>• React 18 + Vite</li>
                                    <li>• Tailwind CSS (Glassmorphism)</li>
                                    <li>• Lucide React Icons</li>
                                    <li>• React Router</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-purple-400 mb-3">Backend</h3>
                                <ul className="space-y-2 text-white/70 text-sm">
                                    <li>• Django 5.0 + DRF</li>
                                    <li>• PostgreSQL Database</li>
                                    <li>• Redis Cache</li>
                                    <li>• WebSocket (Channels)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-green-400 mb-3">Hosting</h3>
                                <ul className="space-y-2 text-white/70 text-sm">
                                    <li>• Netlify (Frontend CDN)</li>
                                    <li>• Render.com (Backend)</li>
                                    <li>• HTTPS/TLS Encryption</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-yellow-400 mb-3">Features</h3>
                                <ul className="space-y-2 text-white/70 text-sm">
                                    <li>• Google OAuth</li>
                                    <li>• AI-Powered Chatbots</li>
                                    <li>• Real-time Messaging</li>
                                    <li>• Voice Notes</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Values */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Our Values</h2>

                    <div className="space-y-3">
                        <div className="glass p-4 rounded-xl flex items-start gap-3">
                            <div className="text-2xl">🛡️</div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Safety First</h3>
                                <p className="text-white/70 text-sm">Zero tolerance for harassment and inappropriate behavior</p>
                            </div>
                        </div>

                        <div className="glass p-4 rounded-xl flex items-start gap-3">
                            <div className="text-2xl">🤝</div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Respect & Inclusivity</h3>
                                <p className="text-white/70 text-sm">Everyone is welcome regardless of gender, location, or background</p>
                            </div>
                        </div>

                        <div className="glass p-4 rounded-xl flex items-start gap-3">
                            <div className="text-2xl">🔒</div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Privacy Protection</h3>
                                <p className="text-white/70 text-sm">Your personal data is never sold or shared without consent</p>
                            </div>
                        </div>

                        <div className="glass p-4 rounded-xl flex items-start gap-3">
                            <div className="text-2xl">✨</div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Authentic Connections</h3>
                                <p className="text-white/70 text-sm">We encourage real conversations over superficial interactions</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <div className="glass p-8 rounded-2xl text-center border border-blue-500/20">
                    <h2 className="text-2xl font-bold mb-3">Join the VibeTalk Community</h2>
                    <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                        Thousands of people are already connecting, chatting, and making friends on VibeTalk.
                        Start your journey today!
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold hover:scale-105 transition"
                    >
                        Get Started
                    </button>
                </div>

                {/* Footer Links */}
                <div className="mt-12 pt-6 border-t border-white/10">
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
                        <button onClick={() => navigate('/terms')} className="text-blue-400 hover:underline">
                            Terms & Conditions
                        </button>
                        <span className="text-white/30">•</span>
                        <button onClick={() => navigate('/privacy-policy')} className="text-blue-400 hover:underline">
                            Privacy Policy
                        </button>
                        <span className="text-white/30">•</span>
                        <button onClick={() => navigate('/safety')} className="text-blue-400 hover:underline">
                            Safety Guidelines
                        </button>
                        <span className="text-white/30">•</span>
                        <button onClick={() => navigate('/contact')} className="text-blue-400 hover:underline">
                            Contact Support
                        </button>
                    </div>
                    <p className="text-center text-white/50 text-xs mt-4">
                        © 2026 VibeTalk. Made with ❤️ in India
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
