import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Database, Bell, Trash2 } from 'lucide-react';

const PrivacyPolicy = () => {
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
                        <h1 className="text-xl font-bold">Privacy Policy</h1>
                        <p className="text-xs text-white/60">Last Updated: January 21, 2026</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Introduction */}
                <div className="glass p-6 rounded-2xl mb-6 border border-white/10">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="bg-green-500/20 p-3 rounded-xl">
                            <Shield className="text-green-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Your Privacy Matters</h2>
                            <p className="text-white/70 leading-relaxed">
                                At VibeTalk, we are committed to protecting your privacy and personal data.
                                This Privacy Policy explains how we collect, use, and safeguard your information.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 1. Information We Collect */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Database className="text-blue-400" size={28} />
                        Information We Collect
                    </h2>

                    <div className="space-y-4">
                        <div className="glass p-6 rounded-xl">
                            <h3 className="font-bold text-lg mb-3 text-blue-400">Information You Provide</h3>
                            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                                <li><strong>Account Information:</strong> Username, email address, password (encrypted)</li>
                                <li><strong>Profile Information:</strong> Name, age, gender, bio, profile pictures, gallery images</li>
                                <li><strong>Preferences:</strong> Interested in (gender preferences), search filters</li>
                                <li><strong>Communications:</strong> Messages, voice notes, images shared in chats</li>
                                <li><strong>User Content:</strong> Posts, comments, likes, and other interactions</li>
                            </ul>
                        </div>

                        <div className="glass p-6 rounded-xl">
                            <h3 className="font-bold text-lg mb-3 text-purple-400">Information Collected Automatically</h3>
                            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                                <li><strong>Device Information:</strong> IP address, browser type, device type, operating system</li>
                                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the app</li>
                                <li><strong>Location Data:</strong> Approximate location based on IP address (if enabled)</li>
                                <li><strong>Cookies:</strong> Session cookies for authentication and preferences</li>
                            </ul>
                        </div>

                        <div className="glass p-6 rounded-xl">
                            <h3 className="font-bold text-lg mb-3 text-green-400">Third-Party Information</h3>
                            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                                <li><strong>Google OAuth:</strong> If you sign in with Google, we receive your Google email and profile information</li>
                                <li><strong>Analytics:</strong> Anonymous usage statistics via analytics providers</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 2. How We Use Your Information */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Eye className="text-blue-400" size={28} />
                        How We Use Your Information
                    </h2>

                    <div className="glass p-6 rounded-xl space-y-3 text-white/80">
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Provide Services:</strong> Create and manage your account, enable messaging and matching</li>
                            <li><strong>Personalization:</strong> Show you relevant matches based on your preferences</li>
                            <li><strong>Communication:</strong> Send notifications, updates, and respond to support requests</li>
                            <li><strong>Safety & Security:</strong> Detect and prevent fraud, spam, and abuse</li>
                            <li><strong>Improve Service:</strong> Analyze usage patterns to enhance features and user experience</li>
                            <li><strong>Legal Compliance:</strong> Comply with legal obligations and enforce our Terms</li>
                        </ul>
                    </div>
                </section>

                {/* 3. Data Sharing */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Lock className="text-yellow-400" size={28} />
                        Data Sharing & Disclosure
                    </h2>

                    <div className="glass p-6 rounded-xl space-y-4 border border-yellow-500/20">
                        <div className="bg-yellow-500/10 p-4 rounded-lg">
                            <p className="font-semibold text-yellow-400 mb-2">🛡️ We DO NOT sell your personal data</p>
                            <p className="text-sm text-white/70">
                                Your privacy is our priority. We will never sell your personal information to third parties.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-bold mb-2 text-white">We may share your information with:</h3>
                            <ul className="list-disc list-inside space-y-2 text-white/80 ml-4">
                                <li><strong>Other Users:</strong> Your profile information, messages, and content you share are visible to users you interact with</li>
                                <li><strong>Service Providers:</strong> Cloud hosting (Render.com, Netlify), database providers, authentication services</li>
                                <li><strong>Law Enforcement:</strong> If required by law or to protect safety and prevent illegal activity</li>
                                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 4. Data Security */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="text-green-400" size={28} />
                        Data Security
                    </h2>

                    <div className="glass p-6 rounded-xl space-y-3 text-white/80">
                        <p>We implement industry-standard security measures to protect your data:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using HTTPS/TLS</li>
                            <li><strong>Password Protection:</strong> Passwords are hashed and salted using bcrypt</li>
                            <li><strong>Secure Storage:</strong> Data stored in secure databases with access controls</li>
                            <li><strong>Regular Audits:</strong> Security reviews and updates to prevent vulnerabilities</li>
                        </ul>
                        <p className="mt-4 text-yellow-400 font-semibold">
                            ⚠️ Note: No method of transmission over the internet is 100% secure.
                            While we strive to protect your data, we cannot guarantee absolute security.
                        </p>
                    </div>
                </section>

                {/* 5. Your Privacy Rights */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Bell className="text-blue-400" size={28} />
                        Your Privacy Rights
                    </h2>

                    <div className="glass p-6 rounded-xl space-y-4 text-white/80">
                        <p>You have the following rights regarding your personal data:</p>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h4 className="font-bold text-blue-400 mb-2">Access & Download</h4>
                                <p className="text-sm">Request a copy of your personal data</p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h4 className="font-bold text-green-400 mb-2">Correction</h4>
                                <p className="text-sm">Update or correct inaccurate information</p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h4 className="font-bold text-yellow-400 mb-2">Deletion</h4>
                                <p className="text-sm">Request deletion of your account and data</p>
                            </div>

                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h4 className="font-bold text-purple-400 mb-2">Portability</h4>
                                <p className="text-sm">Export your data in a readable format</p>
                            </div>
                        </div>

                        <p className="mt-4">
                            To exercise these rights, contact us at <strong className="text-blue-400">privacy@vibetalk.app</strong>
                        </p>
                    </div>
                </section>

                {/* 6. Data Retention */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <Trash2 className="text-red-400" size={28} />
                        Data Retention & Deletion
                    </h2>

                    <div className="glass p-6 rounded-xl space-y-3 text-white/80">
                        <p>We retain your personal data for as long as necessary to provide our services and comply with legal obligations.</p>

                        <div className="mt-4 space-y-3">
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p><strong>Active Accounts:</strong> Data retained while your account is active</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p><strong>Deleted Accounts:</strong> Most data deleted within 30 days; some may be retained for legal/safety purposes</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p><strong>Messages:</strong> Stored until deleted by users or account closure</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg">
                                <p><strong>Analytics:</strong> Anonymous usage data may be retained indefinitely</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7. Cookies */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">🍪</span> Cookies & Tracking
                    </h2>

                    <div className="glass p-6 rounded-xl space-y-3 text-white/80">
                        <p>We use cookies and similar technologies to:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Keep you logged in securely</li>
                            <li>Remember your preferences and settings</li>
                            <li>Analyze site traffic and user behavior</li>
                            <li>Improve functionality and user experience</li>
                        </ul>
                        <p className="mt-4">
                            You can control cookies through your browser settings. Note that disabling cookies may affect functionality.
                        </p>
                    </div>
                </section>

                {/* 8. Children's Privacy */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-red-400">8.</span> Children's Privacy
                    </h2>

                    <div className="glass p-6 rounded-xl text-white/80 border border-red-500/20">
                        <p className="font-semibold text-red-400 mb-3">
                            VibeTalk is NOT intended for users under 18 years of age.
                        </p>
                        <p>
                            We do not knowingly collect personal information from children under 18.
                            If we discover that a child under 18 has provided us with personal information,
                            we will promptly delete such information from our servers.
                        </p>
                    </div>
                </section>

                {/* 9. International Users */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">9.</span> International Data Transfers
                    </h2>

                    <div className="glass p-6 rounded-xl space-y-3 text-white/80">
                        <p>
                            VibeTalk is operated from India. Your information may be transferred to and stored on servers located in India.
                        </p>
                        <p>
                            By using VibeTalk, you consent to the transfer of your information to India and other countries where our service providers operate.
                        </p>
                    </div>
                </section>

                {/* 10. Changes to Privacy Policy */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">10.</span> Changes to This Policy
                    </h2>

                    <div className="glass p-6 rounded-xl space-y-3 text-white/80">
                        <p>
                            We may update this Privacy Policy from time to time. We will notify you of significant changes by:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Posting the updated policy on this page</li>
                            <li>Updating the "Last Updated" date</li>
                            <li>Sending an in-app notification or email for material changes</li>
                        </ul>
                        <p className="mt-4">
                            Your continued use of VibeTalk after changes constitutes acceptance of the updated Privacy Policy.
                        </p>
                    </div>
                </section>

                {/* 11. Contact Us */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">11.</span> Contact Us
                    </h2>

                    <div className="glass p-6 rounded-xl text-white/80">
                        <p className="mb-4">
                            If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
                        </p>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10 space-y-2">
                            <p><strong>Privacy Email:</strong> privacy@vibetalk.app</p>
                            <p><strong>Support Email:</strong> support@vibetalk.app</p>
                            <p><strong>Data Protection Officer:</strong> Yash Ankush Mishra</p>
                            <p><strong>Address:</strong> Rangra, Bhagalpur, Bihar - 813208, India</p>
                        </div>
                    </div>
                </section>

                {/* GDPR Compliance Note */}
                <div className="glass p-6 rounded-xl mb-8 border border-blue-500/20">
                    <h3 className="font-bold text-lg mb-3 text-blue-400">GDPR Compliance</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                        For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR).
                        You have the right to access, rectify, erase, restrict processing, and port your data.
                        You also have the right to object to processing and withdraw consent.
                        To exercise these rights, please contact us at privacy@vibetalk.app.
                    </p>
                </div>

                {/* Footer Links */}
                <div className="mt-12 pt-6 border-t border-white/10">
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
                        <button onClick={() => navigate('/terms')} className="text-blue-400 hover:underline">
                            Terms & Conditions
                        </button>
                        <span className="text-white/30">•</span>
                        <button onClick={() => navigate('/about')} className="text-blue-400 hover:underline">
                            About Us
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
                        © 2026 VibeTalk. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
