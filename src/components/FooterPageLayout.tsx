import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa6';
import { X } from 'lucide-react';

// Responsive Modal Component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ 
  isOpen, 
  onClose, 
  title, 
  children 
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden z-[10000]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

const FooterPageLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12 px-4 w-full">
        {children}
      </main>
      
      {/* Enhanced Responsive Footer */}
      <footer className="bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
            <div className="fade-in-element opacity-0 transition-all duration-1000 sm:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                <img src="/logo.png" alt="Salenus A.I Logo" className="h-6 w-6 sm:h-8 sm:w-8 rounded-full" />
                <span className="text-xl sm:text-2xl font-bold">Salenus A.I</span>
              </div>
              <p className="text-white/80 mb-4 text-sm sm:text-base">
                Revolutionize your life with Salenus A.I, your AI personal assistant for productivity and habit transformation.
              </p>
              <div className="flex space-x-3 sm:space-x-4 mt-4">
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter className="h-5 w-5 sm:h-6 sm:w-6 hover:text-blue-300 transition" /></a>
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook className="h-5 w-5 sm:h-6 sm:w-6 hover:text-blue-200 transition" /></a>
                <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin className="h-5 w-5 sm:h-6 sm:w-6 hover:text-blue-100 transition" /></a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram className="h-5 w-5 sm:h-6 sm:w-6 hover:text-pink-300 transition" /></a>
              </div>
            </div>
            <div className="fade-in-element opacity-0 transition-all duration-1000">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Explore</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><Link to="/features" className="text-white/80 hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-white/80 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/community" className="text-white/80 hover:text-white transition-colors">Community</Link></li>
                <li><Link to="/testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</Link></li>
              </ul>
            </div>
            <div className="fade-in-element opacity-0 transition-all duration-1000">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Legal & Info</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><button onClick={() => openModal('privacy')} className="text-white/80 hover:text-white transition-colors text-left w-full">Privacy Policy</button></li>
                <li><button onClick={() => openModal('terms')} className="text-white/80 hover:text-white transition-colors text-left w-full">Terms of Service</button></li>
                <li><button onClick={() => openModal('about')} className="text-white/80 hover:text-white transition-colors text-left w-full">About</button></li>
                <li><button onClick={() => openModal('cookies')} className="text-white/80 hover:text-white transition-colors text-left w-full">Cookies</button></li>
              </ul>
            </div>
            <div className="fade-in-element opacity-0 transition-all duration-1000">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Help & Community</h3>
              <ul className="space-y-2 text-sm sm:text-base">
                <li><button onClick={() => openModal('tutorial')} className="text-white/80 hover:text-white transition-colors text-left w-full">Tutorial</button></li>
                <li><button onClick={() => openModal('wiki')} className="text-white/80 hover:text-white transition-colors text-left w-full">Community Wiki</button></li>
              </ul>
            </div>
            <div className="fade-in-element opacity-0 transition-all duration-1000 sm:col-span-2 lg:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Stay Connected</h3>
              <p className="text-white/80 mb-4 text-sm sm:text-base">Subscribe to our newsletter for updates and exclusive tips.</p>
              <form className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-3 py-2 rounded-md text-gray-900 text-sm sm:text-base"
                />
                <button className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-md font-semibold transition-colors text-sm sm:text-base">Subscribe</button>
              </form>
              <span className="text-xs text-white/60 mt-2">No spam. Unsubscribe anytime.</span>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center">
            <p className="text-white/80 text-sm sm:text-base">© 2025 Salenus A.I. All Rights Reserved.</p>
          </div>
        </div>
      </footer>



      {/* Modals */}
      <Modal isOpen={activeModal === 'privacy'} onClose={closeModal} title="Privacy Policy">
        <div className="text-gray-700 space-y-4">
          <p>This Privacy Policy explains how Salenus A.I ("we", "us", or "our") collects, uses, and protects your information when you use our website, dashboard, and related services (the "Service").</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h3>
          <ul className="list-disc ml-6">
            <li><b>Account Info:</b> Name, email, and plan details when you register.</li>
            <li><b>Usage Data:</b> Habits, tasks, preferences, and interactions with the Service.</li>
            <li><b>Cookies:</b> We use cookies to improve your experience and analyze usage.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h3>
          <ul className="list-disc ml-6">
            <li>To provide and improve the Service</li>
            <li>To personalize your experience</li>
            <li>To communicate with you (e.g., updates, support)</li>
            <li>To process payments and manage subscriptions</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h3>
          <p>We do not sell your personal information. We may share data with trusted third parties for payment processing, analytics, or as required by law.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h3>
          <p>We use industry-standard security measures to protect your data. However, no system is 100% secure.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">5. Your Choices</h3>
          <ul className="list-disc ml-6">
            <li>You can update or delete your account at any time.</li>
            <li>You can manage cookie preferences in your browser.</li>
            <li>You may opt out of marketing emails at any time.</li>
          </ul>
          <h3 className="text-xl font-semibold mt-6 mb-2">6. Children's Privacy</h3>
          <p>Salenus A.I is not intended for children under 16. We do not knowingly collect data from children under 16.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">7. Changes to This Policy</h3>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">8. Contact</h3>
          <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a>.</p>
          <p className="text-gray-500 mt-8">&copy; 2025 Salenus A.I</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'terms'} onClose={closeModal} title="Terms of Service">
        <div className="text-gray-700 space-y-4">
          <p>Welcome to Salenus A.I! These Terms of Service ("Terms") govern your use of the Salenus A.I website, dashboard, and all related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">1. Use of Service</h3>
          <p>You must be at least 16 years old to use Salenus A.I. You agree to use the Service only for lawful purposes and in accordance with these Terms.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">2. Account Registration</h3>
          <p>You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account and password, and for all activities that occur under your account.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">3. Plans & Payments</h3>
          <p>Salenus A.I offers Basic, Pro, and Premium plans. By subscribing, you agree to pay the applicable fees. All payments are processed securely. Plan features and pricing are subject to change with notice.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">4. User Content</h3>
          <p>You retain ownership of any content you submit (habits, tasks, notes, etc.), but grant Salenus A.I a license to use, display, and improve the Service. You are responsible for your content and must not upload anything unlawful or harmful.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">5. Acceptable Use</h3>
          <p>You agree not to misuse the Service, including (but not limited to): attempting to access accounts of others, reverse engineering, introducing malware, or using the Service for illegal activities.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">6. Termination</h3>
          <p>We may suspend or terminate your access to the Service at any time for violation of these Terms or for any other reason. You may cancel your account at any time.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">7. Disclaimer & Limitation of Liability</h3>
          <p>The Service is provided "as is" without warranties of any kind. Salenus A.I is not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">8. Changes to Terms</h3>
          <p>We may update these Terms from time to time. We will notify you of significant changes. Continued use of the Service after changes means you accept the new Terms.</p>
          <h3 className="text-xl font-semibold mt-6 mb-2">9. Contact</h3>
          <p>If you have questions about these Terms, please contact us at <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a>.</p>
          <p className="text-gray-500 mt-8">&copy; 2025 Salenus A.I</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'about'} onClose={closeModal} title="About Salenus A.I">
        <div className="text-gray-700 space-y-4">
          <p className="mb-4">Salenus A.I is your personal AI-powered coach for habit building, productivity, and personal growth. Our mission is to help you achieve your goals with smart, supportive technology.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Our Mission</h3>
          <p>We believe everyone deserves access to personalized coaching and support. Salenus A.I combines cutting-edge AI technology with proven behavioral science to help you build lasting habits and achieve your goals.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">What We Do</h3>
          <ul className="list-disc ml-6">
            <li>AI-powered habit tracking and coaching</li>
            <li>Personalized goal setting and progress monitoring</li>
            <li>Smart reminders and motivation systems</li>
            <li>Community support and challenges</li>
            <li>Advanced analytics and insights</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Our Values</h3>
          <ul className="list-disc ml-6">
            <li><b>Privacy First:</b> Your data is yours, and we protect it fiercely</li>
            <li><b>User-Centered:</b> Every feature is designed with you in mind</li>
            <li><b>Evidence-Based:</b> Our methods are grounded in behavioral science</li>
            <li><b>Continuous Improvement:</b> We're always learning and evolving</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Contact Us</h3>
          <p>Have questions or feedback? We'd love to hear from you! Reach out at <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a></p>
          
          <p className="text-gray-500 mt-8">&copy; 2025 Salenus A.I</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'cookies'} onClose={closeModal} title="Cookies Policy">
        <div className="text-gray-700 space-y-4">
          <p>This Cookies Policy explains how Salenus A.I uses cookies and similar technologies when you visit our website and use our services.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">What Are Cookies?</h3>
          <p>Cookies are small text files that are stored on your device when you visit a website. They help us provide you with a better experience and understand how you use our services.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Types of Cookies We Use</h3>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Essential Cookies</h4>
          <p>These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.</p>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Analytics Cookies</h4>
          <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Functional Cookies</h4>
          <p>These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.</p>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Marketing Cookies</h4>
          <p>These cookies are used to track visitors across websites to display relevant and engaging advertisements.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Managing Your Cookie Preferences</h3>
          <p>You can control and manage cookies through your browser settings. However, disabling certain cookies may affect the functionality of our website.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Third-Party Cookies</h3>
          <p>We may use third-party services that also use cookies. These services help us provide better functionality and analytics.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Updates to This Policy</h3>
          <p>We may update this Cookies Policy from time to time. We will notify you of any significant changes.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Contact Us</h3>
          <p>If you have questions about our use of cookies, please contact us at <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a></p>
          
          <p className="text-gray-500 mt-8">&copy; 2025 Salenus A.I</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'tutorial'} onClose={closeModal} title="Getting Started Tutorial">
        <div className="text-gray-700 space-y-4">
          <p>Welcome to Salenus A.I! This tutorial will help you get started with your personal AI coach and make the most of our features.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Getting Started</h3>
          <ol className="list-decimal ml-6 space-y-2">
            <li><b>Create Your Account:</b> Sign up with your email and create a secure password</li>
            <li><b>Complete Your Profile:</b> Tell us about your goals and preferences</li>
            <li><b>Set Your First Goal:</b> Choose from our templates or create your own</li>
            <li><b>Start Tracking:</b> Begin logging your daily habits and progress</li>
          </ol>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Key Features</h3>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">🎯 Goal Setting</h4>
          <p>Create specific, measurable goals with our AI-powered goal-setting assistant. Break down big goals into manageable steps.</p>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">📊 Habit Tracking</h4>
          <p>Track your daily habits with our intuitive interface. Set reminders and get notifications to stay on track.</p>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">🤖 AI Coaching</h4>
          <p>Get personalized advice and motivation from your AI coach. Receive insights based on your progress and patterns.</p>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">📈 Progress Analytics</h4>
          <p>View detailed analytics and insights about your progress. Identify patterns and areas for improvement.</p>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">👥 Community</h4>
          <p>Connect with other users, join challenges, and share your achievements with the community.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Pro Tips</h3>
          <ul className="list-disc ml-6">
            <li>Start with 1-3 habits to build momentum</li>
            <li>Use the streak protection feature to maintain consistency</li>
            <li>Check in with your AI coach regularly for personalized advice</li>
            <li>Join community challenges for extra motivation</li>
            <li>Review your analytics weekly to track progress</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">Need Help?</h3>
          <p>If you need assistance, check out our Community Wiki or contact our support team at <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a></p>
          
          <p className="text-gray-500 mt-8">&copy; 2025 Salenus A.I</p>
        </div>
      </Modal>

      <Modal isOpen={activeModal === 'wiki'} onClose={closeModal} title="Community Wiki">
        <div className="text-gray-700 space-y-4">
          <p>Welcome to the Salenus A.I Community Wiki! Here you'll find comprehensive guides, FAQs, and community-contributed tips to help you succeed.</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">📚 User Guides</h3>
          <ul className="list-disc ml-6">
            <li><b>Getting Started:</b> Complete setup guide for new users</li>
            <li><b>Feature Deep Dives:</b> Detailed explanations of all features</li>
            <li><b>Advanced Techniques:</b> Pro tips and advanced strategies</li>
            <li><b>Integration Guides:</b> How to connect with other apps</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">❓ Frequently Asked Questions</h3>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Account & Billing</h4>
          <ul className="list-disc ml-6">
            <li>How do I change my subscription plan?</li>
            <li>Can I export my data?</li>
            <li>How do I delete my account?</li>
            <li>What payment methods do you accept?</li>
          </ul>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Features & Usage</h4>
          <ul className="list-disc ml-6">
            <li>How does the AI coaching work?</li>
            <li>Can I customize my habit tracking?</li>
            <li>How do community challenges work?</li>
            <li>What analytics are available?</li>
          </ul>
          
          <h4 className="text-lg font-semibold mt-4 mb-2">Privacy & Security</h4>
          <ul className="list-disc ml-6">
            <li>How is my data protected?</li>
            <li>Can I control what data is shared?</li>
            <li>How do you handle data breaches?</li>
            <li>What are my privacy rights?</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">💡 Community Tips</h3>
          <p>Discover tips and strategies shared by our community members:</p>
          <ul className="list-disc ml-6">
            <li>Morning routine optimization</li>
            <li>Habit stacking techniques</li>
            <li>Motivation strategies</li>
            <li>Goal achievement stories</li>
            <li>Productivity hacks</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">🔧 Troubleshooting</h3>
          <p>Common issues and solutions:</p>
          <ul className="list-disc ml-6">
            <li>App not syncing properly</li>
            <li>Notifications not working</li>
            <li>Data not saving</li>
            <li>Performance issues</li>
          </ul>
          
          <h3 className="text-xl font-semibold mt-6 mb-2">📞 Support</h3>
          <p>Need additional help? Contact our support team:</p>
          <ul className="list-disc ml-6">
            <li>Email: <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a></li>
            <li>Response time: Within 24 hours</li>
            <li>Available: Monday-Friday, 9 AM - 6 PM EST</li>
          </ul>
          
          <p className="text-gray-500 mt-8">&copy; 2025 Salenus A.I</p>
        </div>
      </Modal>
    </div>
  );
};

export default FooterPageLayout; 