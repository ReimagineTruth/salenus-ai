import React from 'react';
import FooterPageLayout from '../components/FooterPageLayout';

const About = () => (
  <FooterPageLayout>
    <div className="max-w-2xl w-full bg-white rounded-lg shadow p-8">
      <h1 className="text-3xl font-bold mb-4 text-indigo-700">About Salenus A.I</h1>
      <p className="text-gray-700 mb-4">Salenus A.I is your personal AI-powered coach for habit building, productivity, and personal growth. Our mission is to help you achieve your goals with smart, supportive technology.</p>
      <p className="text-gray-500">&copy; 2025 Salenus A.I</p>
    </div>
  </FooterPageLayout>
);

export default About; 