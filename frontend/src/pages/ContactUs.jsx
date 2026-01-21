import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, MessageCircle, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

const ContactUs = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In real implementation, this would send to backend
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

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
                        <h1 className="text-xl font-bold">Contact & Support</h1>
                        <p className="text-xs text-white/60">We're here to help</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Introduction */}
                <div className="glass p-6 rounded-2xl mb-8 border border-white/10 text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <MessageCircle className="text-blue-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Get in Touch</h2>
                    <p className="text-white/70 max-w-2xl mx-auto">
                        Have questions, feedback, or need support? We'd love to hear from you.
                        Choose your preferred method of contact below.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Send Us a Message</h2>

                        {submitted ? (
                            <div className="glass p-8 rounded-xl border border-green-500/20 text-center">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <CheckCircle className="text-green-400" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-green-400 mb-2">Message Sent!</h3>
                                <p className="text-white/70">
                                    Thank you for contacting us. We'll get back to you within 24-48 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="glass p-6 rounded-xl space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-white/80">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-white/80">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-white/80">Subject</label>
                                    <select
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none transition"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="support">Technical Support</option>
                                        <option value="account">Account Issue</option>
                                        <option value="report">Report Abuse</option>
                                        <option value="feature">Feature Request</option>
                                        <option value="feedback">General Feedback</option>
                                        <option value="partnership">Business/Partnership</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-white/80">Message</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-blue-500 focus:outline-none transition resize-none"
                                        placeholder="Tell us how we can help..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-bold hover:scale-105 transition flex items-center justify-center gap-2"
                                >
                                    <Send size={20} />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Contact Information</h2>

                        <div className="space-y-4">
                            <div className="glass p-5 rounded-xl border border-blue-500/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                        <Mail className="text-blue-400" size={20} />
                                    </div>
                                    <h3 className="font-bold text-blue-400">Email Support</h3>
                                </div>
                                <p className="text-white/70 text-sm mb-2">
                                    For general inquiries and support:
                                </p>
                                <a href="mailto:support@vibetalk.app" className="text-white font-semibold hover:text-blue-400 transition">
                                    support@vibetalk.app
                                </a>
                                <p className="text-white/60 text-xs mt-2">
                                    Response time: 24-48 hours
                                </p>
                            </div>

                            <div className="glass p-5 rounded-xl border border-red-500/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                                        <Mail className="text-red-400" size={20} />
                                    </div>
                                    <h3 className="font-bold text-red-400">Report Abuse</h3>
                                </div>
                                <p className="text-white/70 text-sm mb-2">
                                    For safety concerns and abuse reports:
                                </p>
                                <a href="mailto:safety@vibetalk.app" className="text-white font-semibold hover:text-red-400 transition">
                                    safety@vibetalk.app
                                </a>
                                <p className="text-white/60 text-xs mt-2">
                                    Priority response: Within 12 hours
                                </p>
                            </div>

                            <div className="glass p-5 rounded-xl border border-purple-500/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                        <Mail className="text-purple-400" size={20} />
                                    </div>
                                    <h3 className="font-bold text-purple-400">Privacy & Data</h3>
                                </div>
                                <p className="text-white/70 text-sm mb-2">
                                    For privacy concerns and data requests:
                                </p>
                                <a href="mailto:privacy@vibetalk.app" className="text-white font-semibold hover:text-purple-400 transition">
                                    privacy@vibetalk.app
                                </a>
                                <p className="text-white/60 text-xs mt-2">
                                    GDPR requests processed within 30 days
                                </p>
                            </div>

                            <div className="glass p-5 rounded-xl border border-green-500/20">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <MessageCircle className="text-green-400" size={20} />
                                    </div>
                                    <h3 className="font-bold text-green-400">Business Inquiries</h3>
                                </div>
                                <p className="text-white/70 text-sm mb-2">
                                    For partnerships and collaborations:
                                </p>
                                <a href="mailto:business@vibetalk.app" className="text-white font-semibold hover:text-green-400 transition">
                                    business@vibetalk.app
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Office Address */}
                <div className="mt-8 glass p-6 rounded-xl">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <MapPin className="text-blue-400" size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl mb-2">Our Location</h3>
                            <p className="text-white/70 mb-1">VibeTalk HQ</p>
                            <p className="text-white/80">Rangra, Bhagalpur</p>
                            <p className="text-white/80">Bihar - 813208</p>
                            <p className="text-white/80">India</p>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-white/60 text-sm">
                                    <strong>Developer:</strong> Yash Ankush Mishra - Rangra Developer
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>

                    <div className="space-y-3">
                        <details className="glass p-5 rounded-xl cursor-pointer">
                            <summary className="font-bold text-white mb-2">How quickly will I get a response?</summary>
                            <p className="text-white/70 text-sm">
                                We typically respond to support emails within 24-48 hours. Safety reports are prioritized
                                and reviewed within 12 hours.
                            </p>
                        </details>

                        <details className="glass p-5 rounded-xl cursor-pointer">
                            <summary className="font-bold text-white mb-2">Can I report a user directly?</summary>
                            <p className="text-white/70 text-sm">
                                Yes! The fastest way to report abuse is through the in-app report button on any user's profile.
                                You can also email safety@vibetalk.app with details.
                            </p>
                        </details>

                        <details className="glass p-5 rounded-xl cursor-pointer">
                            <summary className="font-bold text-white mb-2">How do I delete my account?</summary>
                            <p className="text-white/70 text-sm">
                                Go to Settings → Account → Delete Account. You can also request account deletion by emailing
                                privacy@vibetalk.app. All your data will be permanently deleted within 30 days.
                            </p>
                        </details>

                        <details className="glass p-5 rounded-xl cursor-pointer">
                            <summary className="font-bold text-white mb-2">Is there a phone support line?</summary>
                            <p className="text-white/70 text-sm">
                                Currently, we only offer email support. We're working on adding live chat support soon!
                            </p>
                        </details>

                        <details className="glass p-5 rounded-xl cursor-pointer">
                            <summary className="font-bold text-white mb-2">Can I suggest new features?</summary>
                            <p className="text-white/70 text-sm">
                                Absolutely! We love hearing from our users. Send your feature requests to support@vibetalk.app
                                with the subject "Feature Request". We review all suggestions!
                            </p>
                        </details>
                    </div>
                </div>

                {/* Social & Links */}
                <div className="mt-8 glass p-6 rounded-xl text-center">
                    <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
                    <div className="flex flex-wrap justify-center gap-4 text-sm">
                        <button onClick={() => navigate('/about')} className="text-blue-400 hover:underline">
                            About VibeTalk
                        </button>
                        <span className="text-white/30">•</span>
                        <button onClick={() => navigate('/safety')} className="text-blue-400 hover:underline">
                            Safety Center
                        </button>
                        <span className="text-white/30">•</span>
                        <button onClick={() => navigate('/terms')} className="text-blue-400 hover:underline">
                            Terms of Service
                        </button>
                        <span className="text-white/30">•</span>
                        <button onClick={() => navigate('/privacy-policy')} className="text-blue-400 hover:underline">
                            Privacy Policy
                        </button>
                    </div>
                    <p className="text-white/50 text-xs mt-4">
                        © 2026 VibeTalk. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
