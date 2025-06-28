import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';

const FooterPageLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-gray-50">
    {/* Header */}
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Salenus A.I Logo" className="h-10 w-10 rounded-full" />
            <span className="text-2xl font-bold text-indigo-600">Salenus A.I</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-indigo-600 transition-colors">Home</Link>
            <Link to="/features" className="text-gray-700 hover:text-indigo-600 transition-colors">Features</Link>
            <Link to="/pricing" className="text-gray-700 hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link to="/community" className="text-gray-700 hover:text-indigo-600 transition-colors">Community</Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 transition-colors">About</Link>
          </nav>
        </div>
      </div>
    </header>
    {/* Main Content */}
    <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 w-full">
      {children}
    </main>
    {/* Enhanced Footer */}
    <footer className="bg-gradient-to-br from-indigo-600 via-purple-600 to-teal-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="fade-in-element opacity-0 transition-all duration-1000 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src="/logo.png" alt="Salenus A.I Logo" className="h-8 w-8 rounded-full" />
              <span className="text-2xl font-bold">Salenus A.I</span>
            </div>
            <p className="text-white/80 mb-4">
              Revolutionize your life with Salenus A.I, your AI personal assistant for productivity and habit transformation.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter className="h-6 w-6 hover:text-blue-300 transition" /></a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook className="h-6 w-6 hover:text-blue-200 transition" /></a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin className="h-6 w-6 hover:text-blue-100 transition" /></a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram className="h-6 w-6 hover:text-pink-300 transition" /></a>
            </div>
          </div>
          <div className="fade-in-element opacity-0 transition-all duration-1000">
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-white/80 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="text-white/80 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/community" className="text-white/80 hover:text-white transition-colors">Community</Link></li>
              <li><Link to="/testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</Link></li>
            </ul>
          </div>
          <div className="fade-in-element opacity-0 transition-all duration-1000">
            <h3 className="text-lg font-semibold mb-4">Legal & Info</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-white/80 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-white/80 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/about" className="text-white/80 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/cookies" className="text-white/80 hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </div>
          <div className="fade-in-element opacity-0 transition-all duration-1000">
            <h3 className="text-lg font-semibold mb-4">Help & Community</h3>
            <ul className="space-y-2">
              <li><Link to="/tutorial" className="text-white/80 hover:text-white transition-colors">Tutorial</Link></li>
              <li><Link to="/wiki" className="text-white/80 hover:text-white transition-colors">Community Wiki</Link></li>
            </ul>
          </div>
          <div className="fade-in-element opacity-0 transition-all duration-1000 md:col-span-1 flex flex-col justify-between">
            <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
            <p className="text-white/80 mb-4">Subscribe to our newsletter for updates and exclusive tips.</p>
            <form className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-3 py-2 rounded-md text-gray-900"
              />
              <button className="bg-white text-indigo-600 hover:bg-gray-100 px-4 py-2 rounded-md font-semibold transition-colors">Subscribe</button>
            </form>
            <span className="text-xs text-white/60 mt-2">No spam. Unsubscribe anytime.</span>
          </div>
        </div>
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/80">© 2025 Salenus A.I. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  </div>
);

export default FooterPageLayout; 