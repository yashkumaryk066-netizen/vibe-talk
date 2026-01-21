import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, AlertCircle } from 'lucide-react';

const TermsAndConditions = () => {
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
                        <h1 className="text-xl font-bold">Terms & Conditions</h1>
                        <p className="text-xs text-white/60">Last Updated: January 21, 2026</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Introduction */}
                <div className="glass p-6 rounded-2xl mb-6 border border-white/10">
                    <div className="flex items-start gap-4 mb-4">
                        <div className="bg-blue-500/20 p-3 rounded-xl">
                            <FileText className="text-blue-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Welcome to VibeTalk</h2>
                            <p className="text-white/70 leading-relaxed">
                                By accessing or using VibeTalk, you agree to be bound by these Terms and Conditions.
                                Please read them carefully before using our services.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 1. Acceptance of Terms */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">1.</span> Acceptance of Terms
                    </h2>
                    <div className="glass p-6 rounded-xl space-y-3 text-white/80 leading-relaxed">
                        <p>
                            By creating an account, accessing, or using VibeTalk ("the Service"), you acknowledge that you have read,
                            understood, and agree to be bound by these Terms and Conditions and our Privacy Policy.
                        </p>
                        <p>
                            If you do not agree to these terms, you must not use VibeTalk.
                        </p>
                    </div>
                </section>

                {/* 2. Eligibility */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">2.</span> Eligibility
                    </h2>
                    <div className="glass p-6 rounded-xl space-y-3 text-white/80 leading-relaxed">
                        <p className="font-semibold text-white">
                            You must be at least 18 years old to use VibeTalk.
                        </p>
                        <p>
                            By using our service, you represent and warrant that:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>You are at least 18 years of age</li>
                            <li>You have the legal capacity to enter into these Terms</li>
                            <li>You will comply with all applicable local, state, national, and international laws</li>
                            <li>You are not prohibited from using the Service under any applicable law</li>
                        </ul>
                    </div>
                </section>

                {/* 3. Account Registration */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">3.</span> Account Registration & Security
                    </h2>
                    <div className="glass p-6 rounded-xl space-y-3 text-white/80 leading-relaxed">
                        <p><strong>Account Creation:</strong></p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>You must provide accurate, current, and complete information during registration</li>
                            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                            <li>You must notify us immediately of any unauthorized use of your account</li>
                            <li>One person may not maintain more than one account</li>
                        </ul>
                        <p className="mt-4"><strong>Account Termination:</strong></p>
                        <p>
                            We reserve the right to suspend or terminate your account at any time for violations of these Terms,
                            including but not limited to harassment, spam, or fraudulent activity.
                        </p>
                    </div>
                </section>

                {/* 4. User Conduct */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-red-400">4.</span> User Conduct & Prohibited Activities
                    </h2>
                    <div className="glass p-6 rounded-xl space-y-4 text-white/80 leading-relaxed border border-red-500/20">
                        <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                            <p className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                                <AlertCircle size={20} /> Zero Tolerance Policy
                            </p>
                            <p className="text-sm">
                                VibeTalk has a zero-tolerance policy for harassment, hate speech, and inappropriate content.
                            </p>
                        </div>

                        <p><strong>You agree NOT to:</strong></p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>Harass, threaten, or intimidate other users</li>
                            <li>Post or share sexually explicit, violent, or offensive content</li>
                            <li>Impersonate any person or entity</li>
                            <li>Use the service for commercial purposes without authorization</li>
                            <li>Spam or send unsolicited messages to other users</li>
                            <li>Share content that violates intellectual property rights</li>
                            <li>Attempt to hack, reverse engineer, or compromise the service</li>
                            <li>Collect or harvest user data without consent</li>
                            <li>Use bots or automated systems to access the service</li>
                            <li>Share harmful links, malware, or viruses</li>
                        </ul>

                        <p className="font-semibold text-white mt-4">
                            Violation of these rules may result in immediate account suspension or permanent ban.
                        </p>
                    </div>
                </section>

                {/* 5. Privacy & Data */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">5.</span> Privacy & Data Protection
                    </h2>
                    <div className="glass p-6 rounded-xl space-y-3 text-white/80 leading-relaxed">
                        <p>
                            Your privacy is important to us. Our collection and use of personal information is described in our{' '}
                            <button
                                onClick={() => navigate('/privacy-policy')}
                                className="text-blue-400 hover:underline font-semibold"
                            >
                                Privacy Policy
                            </button>.
                        </p>
                        <p><strong>Key Points:</strong></p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>We do not sell your personal data to third parties</li>
                            <li>Your profile information is visible to other users as per your privacy settings</li>
                            <li>Messages and communications are encrypted in transit</li>
                            <li>You can request deletion of your data at any time</li>
                        </ul>
                    </div>
                </section>

                {/* 6. Content & Intellectual Property */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">6.</span> Content & Intellectual Property
                    </h2>
                    <div className="glass p-6 rounded-xl space-y-3 text-white/80 leading-relaxed">
                        <p><strong>Your Content:</strong></p>
                        <p>
                            You retain ownership of content you upload (photos, messages, profile information).
                            By posting content, you grant VibeTalk a worldwide, non-exclusive, royalty-free license to use,
                            display, and distribute your content within the service.
                        </p>
                        <p className="mt-4"><strong>Our Content:</strong></p>
                        <p>
                            All content, features, and functionality of VibeTalk (including but not limited to text, graphics, logos,
                            and software) are owned by VibeTalk and are protected by copyright, trademark, and other intellectual property laws.
                        </p>
                    </div>
                </section>

                {/* 7. Third-Party Services */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">7.</span> Third-Party Services
                    </h2>
                    <div className="glass p-6 rounded-xl space-y-3 text-white/80 leading-relaxed">
                        <p>
                            VibeTalk may integrate with third-party services (such as Google OAuth for authentication).
                            Your use of these services is subject to their respective terms and privacy policies.
                        </p>
                        <p>
                            We are not responsible for the practices or content of third-party services.
                        </p>
                    </div>
                </section>

                {/* 8. Disclaimer of Warranties */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-yellow-400">8.</span> Disclaimer of Warranties
                    </h2>
                    <div className="glass p-6 rounded-xl space-y-3 text-white/80 leading-relaxed border border-yellow-500/20">
                        <p className="uppercase font-semibold text-yellow-400">
                            VibeTalk is provided "AS IS" and "AS AVAILABLE" without warranties of any kind.
                        </p>
                        <p>
                            We do not guarantee that:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>The service will be uninterrupted, secure, or error-free</li>
                            <li>The results obtained from using the service will be accurate or reliable</li>
                            <li>Any defects will be corrected</li>
                        </ul>
                        <p className="mt-4">
                            You use VibeTalk at your own risk. We are not responsible for interactions with other users.
                        </p>
                    </div>
                </section>

                {/* 9. Limitation of Liability */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-yellow-400">9.</span> Limitation of Liability
                    </h2>
                    <div className="glass p-6 rounded-xl space-y-3 text-white/80 leading-relaxed">
                        <p>
                            To the maximum extent permitted by law, VibeTalk and its affiliates shall not be liable for any indirect,
                            incidental, special, consequential, or punitive damages arising from your use of the service.
                        </p>
                        <p>
                            This includes damages for loss of profits, data, goodwill, or other intangible losses.
                        </p>
                    </div>
                </section>

                {/* 10. Modifications to Terms */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">10.</span> Modifications to Terms
                    </h2>
                    <div className="glass p-6 rounded-xl space-y-3 text-white/80 leading-relaxed">
                        <p>
                            We reserve the right to modify these Terms at any time. We will notify users of significant changes
                            via email or in-app notification.
                        </p>
                        <p>
                            Your continued use of VibeTalk after changes constitutes acceptance of the updated Terms.
                        </p>
                    </div>
                </section>

                {/* 11. Governing Law */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">11.</span> Governing Law
                    </h2>
                    <div className="glass p-6 rounded-xl space-y-3 text-white/80 leading-relaxed">
                        <p>
                            These Terms shall be governed by and construed in accordance with the laws of India,
                            without regard to its conflict of law provisions.
                        </p>
                        <p>
                            Any disputes arising from these Terms or your use of VibeTalk shall be resolved in the courts of Bihar, India.
                        </p>
                    </div>
                </section>

                {/* 12. Contact Information */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-blue-400">12.</span> Contact Us
                    </h2>
                    <div className="glass p-6 rounded-xl text-white/80 leading-relaxed">
                        <p className="mb-4">
                            If you have any questions about these Terms and Conditions, please contact us:
                        </p>
                        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                            <p><strong>Email:</strong> support@vibetalk.app</p>
                            <p><strong>Developer:</strong> Yash Ankush Mishra - Rangra Developer</p>
                            <p><strong>Location:</strong> Rangra, Bhagalpur, Bihar, India</p>
                        </div>
                    </div>
                </section>

                {/* Footer Links */}
                <div className="mt-12 pt-6 border-t border-white/10">
                    <div className="flex flex-wrap gap-4 justify-center text-sm">
                        <button onClick={() => navigate('/privacy-policy')} className="text-blue-400 hover:underline">
                            Privacy Policy
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

export default TermsAndConditions;
