import React from 'react';
import FooterPageLayout from '../components/FooterPageLayout';

const Terms = () => (
  <FooterPageLayout>
    <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">Terms of Service</h1>
      <div className="text-gray-700 space-y-4">
        <p>Welcome to Salenus A.I! These Terms of Service ("Terms") govern your use of the Salenus A.I website, dashboard, and all related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Use of Service</h2>
        <p>You must be at least 16 years old to use Salenus A.I. You agree to use the Service only for lawful purposes and in accordance with these Terms.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. Account Registration</h2>
        <p>You may need to create an account to access certain features. You are responsible for maintaining the confidentiality of your account and password, and for all activities that occur under your account.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Plans & Payments</h2>
        <p>Salenus A.I offers Basic, Pro, and Premium plans. By subscribing, you agree to pay the applicable fees. All payments are processed securely. Plan features and pricing are subject to change with notice.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. User Content</h2>
        <p>You retain ownership of any content you submit (habits, tasks, notes, etc.), but grant Salenus A.I a license to use, display, and improve the Service. You are responsible for your content and must not upload anything unlawful or harmful.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Acceptable Use</h2>
        <p>You agree not to misuse the Service, including (but not limited to): attempting to access accounts of others, reverse engineering, introducing malware, or using the Service for illegal activities.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Termination</h2>
        <p>We may suspend or terminate your access to the Service at any time for violation of these Terms or for any other reason. You may cancel your account at any time.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">7. Disclaimer & Limitation of Liability</h2>
        <p>The Service is provided "as is" without warranties of any kind. Salenus A.I is not liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">8. Changes to Terms</h2>
        <p>We may update these Terms from time to time. We will notify you of significant changes. Continued use of the Service after changes means you accept the new Terms.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">9. Contact</h2>
        <p>If you have questions about these Terms, please contact us at <a href="mailto:support@salenus.ai" className="text-indigo-600 underline">support@salenus.ai</a>.</p>
        <p className="text-gray-500 mt-8">&copy; 2025 Salenus A.I</p>
      </div>
    </div>
  </FooterPageLayout>
);

export default Terms; 