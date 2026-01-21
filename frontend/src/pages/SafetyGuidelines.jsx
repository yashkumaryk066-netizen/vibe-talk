import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, Ban, Flag, Lock, Eye, Heart, MessageCircle } from 'lucide-react';

const SafetyGuidelines = () => {
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
                        <h1 className="text-xl font-bold">Safety & Community Guidelines</h1>
                        <p className="text-xs text-white/60">Stay safe while connecting</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Introduction */}
                <div className="glass p-6 rounded-2xl mb-6 border border-green-500/20">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="bg-green-500/20 p-3 rounded-xl">
                            <Shield className="text-green-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Your Safety Is Our Priority</h2>
                            <p className="text-white/70 leading-relaxed">
                                VibeTalk is committed to creating a safe, respectful, and inclusive community.
                                Please read these guidelines to ensure a positive experience for everyone.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Community Rules */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Heart className="text-red-400" size={28} />
                        Community Rules
                    </h2>

                    <div className="glass p-6 rounded-xl space-y-4">
                        <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                            <h3 className="font-bold text-green-400 mb-2 flex items-center gap-2">
                                ✅ DO: Be Respectful & Kind
                            </h3>
                            <ul className="text-white/70 text-sm space-y-1 ml-6">
                                <li>• Treat others with respect and kindness</li>
                                <li>• Be patient with language learners</li>
                                <li>• Keep conversations friendly and positive</li>
                                <li>• Respect boundaries and privacy</li>
                            </ul>
                        </div>

                        <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                            <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                                ❌ DON'T: Harass or Bully
                            </h3>
                            <ul className="text-white/70 text-sm space-y-1 ml-6">
                                <li>• No harassment, threats, or intimidation</li>
                                <li>• No hate speech or discriminatory language</li>
                                <li>• No unsolicited sexual content or advances</li>
                                <li>• No spam or repetitive messaging</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Prohibited Content */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Ban className="text-red-400" size={28} />
                        Prohibited Content & Behavior
                    </h2>

                    <div className="glass p-6 rounded-xl border border-red-500/20">
                        <div className="bg-red-500/10 p-4 rounded-lg mb-4">
                            <p className="font-semibold text-red-400 flex items-center gap-2">
                                <AlertTriangle size={20} /> Zero Tolerance Policy
                            </p>
                            <p className="text-sm text-white/70 mt-2">
                                The following behaviors will result in immediate account suspension or ban:
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Sexual Content</h4>
                                        <p className="text-white/60 text-xs">
                                            Sexually explicit images, messages, or requests
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Hate Speech</h4>
                                        <p className="text-white/60 text-xs">
                                            Content promoting hatred based on race, religion, gender, etc.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Violence</h4>
                                        <p className="text-white/60 text-xs">
                                            Violent content, threats, or promotion of self-harm
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Minors</h4>
                                        <p className="text-white/60 text-xs">
                                            Content involving or targeting individuals under 18
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Scams & Fraud</h4>
                                        <p className="text-white/60 text-xs">
                                            Phishing, financial scams, or fraudulent activities
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Spam</h4>
                                        <p className="text-white/60 text-xs">
                                            Excessive messaging, advertising, or promotional content
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Impersonation</h4>
                                        <p className="text-white/60 text-xs">
                                            Pretending to be someone else or using fake identities
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 shrink-0"></div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">Illegal Activity</h4>
                                        <p className="text-white/60 text-xs">
                                            Promoting illegal drugs, weapons, or criminal activity
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Safety Tools */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="text-blue-400" size={28} />
                        Your Safety Tools
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="glass p-5 rounded-xl border border-blue-500/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <Ban className="text-blue-400" size={20} />
                                </div>
                                <h3 className="font-bold text-blue-400">Block Users</h3>
                            </div>
                            <p className="text-white/70 text-sm">
                                Instantly block anyone you don't want to interact with.
                                They won't be able to see your profile or message you.
                            </p>
                            <p className="text-blue-400 text-xs mt-2">
                                Profile → Block → Confirm
                            </p>
                        </div>

                        <div className="glass p-5 rounded-xl border border-red-500/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                    <Flag className="text-red-400" size={20} />
                                </div>
                                <h3 className="font-bold text-red-400">Report Abuse</h3>
                            </div>
                            <p className="text-white/70 text-sm">
                                Report users who violate our guidelines. Our team reviews all reports within 24 hours.
                            </p>
                            <p className="text-red-400 text-xs mt-2">
                                Profile → Report → Select Reason
                            </p>
                        </div>

                        <div className="glass p-5 rounded-xl border border-purple-500/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <Eye className="text-purple-400" size={20} />
                                </div>
                                <h3 className="font-bold text-purple-400">Privacy Controls</h3>
                            </div>
                            <p className="text-white/70 text-sm">
                                Control who can see your profile, message you, and view your online status.
                            </p>
                            <p className="text-purple-400 text-xs mt-2">
                                Settings → Privacy → Customize
                            </p>
                        </div>

                        <div className="glass p-5 rounded-xl border border-green-500/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                    <MessageCircle className="text-green-400" size={20} />
                                </div>
                                <h3 className="font-bold text-green-400">Support Team</h3>
                            </div>
                            <p className="text-white/70 text-sm">
                                Contact our support team anytime if you need help or feel unsafe.
                            </p>
                            <p className="text-green-400 text-xs mt-2">
                                Contact → support@vibetalk.app
                            </p>
                        </div>
                    </div>
                </section>

                {/* Safety Tips */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Lock className="text-yellow-400" size={28} />
                        Safety Tips
                    </h2>

                    <div className="glass p-6 rounded-xl space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="text-2xl shrink-0">🔒</div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Protect Your Privacy</h3>
                                <p className="text-white/70 text-sm">
                                    Never share personal information like your phone number, address, or financial details with strangers.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="text-2xl shrink-0">👤</div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Be Cautious with Strangers</h3>
                                <p className="text-white/70 text-sm">
                                    Not everyone is who they claim to be. Take your time getting to know someone before sharing personal details.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="text-2xl shrink-0">🚫</div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Don't Send Money</h3>
                                <p className="text-white/70 text-sm">
                                    Never send money to someone you met on VibeTalk. This is a major red flag for scams.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="text-2xl shrink-0">📸</div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Think Before You Share</h3>
                                <p className="text-white/70 text-sm">
                                    Once you send a photo or message, you can't control what happens to it. Only share what you're comfortable with.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="text-2xl shrink-0">🏠</div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Meet Safely (If Ever)</h3>
                                <p className="text-white/70 text-sm">
                                    If you decide to meet someone in person, meet in a public place, tell a friend, and stay sober.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="text-2xl shrink-0">⚠️</div>
                            <div>
                                <h3 className="font-bold text-white mb-1">Trust Your Instincts</h3>
                                <p className="text-white/70 text-sm">
                                    If something feels wrong, it probably is. Block and report anyone who makes you uncomfortable.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* For Parents */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">For Parents & Guardians</h2>

                    <div className="glass p-6 rounded-xl border border-yellow-500/20">
                        <p className="text-yellow-400 font-semibold mb-3">
                            VibeTalk is for users 18+ only.
                        </p>
                        <p className="text-white/70 text-sm mb-4">
                            If you discover that a minor is using VibeTalk, please report the account immediately.
                            We will investigate and take appropriate action, including account termination.
                        </p>
                        <p className="text-white/70 text-sm">
                            We encourage parents to monitor their children's online activities and educate them about online safety.
                        </p>
                    </div>
                </section>

                {/* Reporting Process */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">How to Report</h2>

                    <div className="glass p-6 rounded-xl">
                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                                    1
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Open the user's profile or chat</h3>
                                    <p className="text-white/60 text-sm">Navigate to the profile of the user you want to report</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                                    2
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Click the report button (flag icon)</h3>
                                    <p className="text-white/60 text-sm">Usually in the top-right corner or menu</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                                    3
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Select the reason for reporting</h3>
                                    <p className="text-white/60 text-sm">Choose the most relevant category (harassment, spam, etc.)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                                    4
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Provide additional details (optional)</h3>
                                    <p className="text-white/60 text-sm">Add context or screenshots to help our team investigate</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold shrink-0">
                                    ✓
                                </div>
                                <div>
                                    <h3 className="font-bold text-white mb-1">Submit report</h3>
                                    <p className="text-white/60 text-sm">Our team will review within 24 hours and take action</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                            <p className="text-green-400 font-semibold mb-2">What happens next?</p>
                            <ul className="text-white/70 text-sm space-y-1 ml-4">
                                <li>• Your report is confidential and anonymous</li>
                                <li>• The reported user will not be notified</li>
                                <li>• Our moderation team investigates all reports</li>
                                <li>• Action may include warning, suspension, or permanent ban</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Emergency */}
                <div className="glass p-6 rounded-xl mb-8 border border-red-500/20 bg-red-500/5">
                    <div className="flex items-start gap-4">
                        <AlertTriangle className="text-red-400 shrink-0" size={32} />
                        <div>
                            <h3 className="font-bold text-xl text-red-400 mb-2">In Case of Emergency</h3>
                            <p className="text-white/70 mb-3">
                                If you or someone you know is in immediate danger, contact local emergency services immediately.
                            </p>
                            <div className="grid md:grid-cols-2 gap-3 text-sm">
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <p className="font-bold text-white">India Emergency: 112</p>
                                    <p className="text-white/60 text-xs">Police, Fire, Ambulance</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <p className="font-bold text-white">Women Helpline: 1091</p>
                                    <p className="text-white/60 text-xs">24/7 Support</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <p className="font-bold text-white">Cyber Crime: 1930</p>
                                    <p className="text-white/60 text-xs">Report online fraud</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    <p className="font-bold text-white">Child Helpline: 1098</p>
                                    <p className="text-white/60 text-xs">For minors in distress</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
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
                        <button onClick={() => navigate('/about')} className="text-blue-400 hover:underline">
                            About Us
                        </button>
                        <span className="text-white/30">•</span>
                        <button onClick={() => navigate('/contact')} className="text-blue-400 hover:underline">
                            Contact Support
                        </button>
                    </div>
                    <p className="text-center text-white/50 text-xs mt-4">
                        © 2026 VibeTalk. Stay Safe, Stay Connected
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SafetyGuidelines;
