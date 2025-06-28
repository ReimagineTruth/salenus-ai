import React from 'react';
import FooterPageLayout from '../components/FooterPageLayout';

const Privacy = () => (
  <FooterPageLayout>
    <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">Privacy Policy</h1>
      <div className="text-gray-700 space-y-4">
        <p>This Privacy Policy explains how Salenus A.I ("we", "us", or "our") collects, uses, and protects your information when you use our website, dashboard, and related services (the "Service").</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Information We Collect</h2>
        <ul className="list-disc ml-6">
          <li><b>Account Info:</b> Name, email, and plan details when you register.</li>
          <li><b>Usage Data:</b> Habits, tasks, preferences, and interactions with the Service.</li>
          <li><b>Cookies:</b> We use cookies to improve your experience and analyze usage.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6">
          <li>To provide and improve the Service</li>
          <li>To personalize your experience</li>
          <li>To communicate with you (e.g., updates, support)</li>
          <li>To process payments and manage subscriptions</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Data Sharing</h2>
        <p>We do not sell your personal information. We may share data with trusted third parties for payment processing, analytics, or as required by law.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. Data Security</h2>
        <p>We use industry-standard security measures to protect your data. However, no system is 100% secure.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Your Choices</h2>
        <ul className="list-disc ml-6">
          <li>You can update or delete your account at any time.</li>
          <li>You can manage cookie preferences in your browser.</li>
          <li>You may opt out of marketing emails at any time.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Children's Privacy</h2>
        <p>Salenus A.I is not intended for children under 16. We do not knowingly collect data from children under 16.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">7. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of significant changes.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">8. Contact</h2>
        <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a>.</p>
        <p className="text-gray-500 mt-8">&copy; 2025 Salenus A.I</p>
      </div>
    </div>
  </FooterPageLayout>
);

export default Privacy; 