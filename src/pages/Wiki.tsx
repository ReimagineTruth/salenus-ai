import React from 'react';
import FooterPageLayout from '../components/FooterPageLayout';

const Wiki = () => (
  <FooterPageLayout>
    <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">Community Wiki</h1>
      <p className="text-gray-700 mb-4">This is a placeholder for the Salenus A.I Community Wiki. Here you will find user guides, FAQs, and community-contributed tips.</p>
      <p className="text-gray-500">&copy; 2025 Salenus A.I</p>
    </div>
  </FooterPageLayout>
);

export default Wiki; 