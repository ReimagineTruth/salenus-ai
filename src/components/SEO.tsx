import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  twitterHandle?: string;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Salenus AI — Pi-Powered Verified AI Coaching',
  description = 'Salenus AI helps you beat procrastination and build better habits with Pi-powered verified AI coaching, smart tasks, mood-based suggestions, and community challenges.',
  keywords = 'Salenus AI, Pi Network, AI Coaching, Smart Task Manager, Productivity, Habit Building, Personal Assistant, Pi Cryptocurrency, Verified AI, Habit Tracker, Task Management, Mood Tracking, Community Challenges',
  image = 'https://salenus.xyz/og-image.jpg',
  url = 'https://salenus.xyz',
  type = 'website',
  twitterHandle = '@salenus_ai',
  canonical
}) => {
  const fullUrl = canonical || url;
  const fullImageUrl = image.startsWith('http') ? image : `${url}${image}`;

  React.useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullUrl);

    // Update primary meta tags
    updateMetaTag('title', title);
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', 'Salenus AI Team');

    // Update Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:image', fullImageUrl, true);
    updateMetaTag('og:site_name', 'Salenus AI', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Update Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image', true);
    updateMetaTag('twitter:title', title, true);
    updateMetaTag('twitter:description', description, true);
    updateMetaTag('twitter:image', fullImageUrl, true);
    updateMetaTag('twitter:site', twitterHandle, true);
    updateMetaTag('twitter:creator', twitterHandle, true);

  }, [title, description, keywords, image, url, type, twitterHandle, canonical, fullUrl, fullImageUrl]);

  return null; // This component doesn't render anything
};

// Predefined SEO configurations for different pages
export const SEOConfigs = {
  home: {
    title: 'Salenus AI — Pi-Powered Verified AI Coaching',
    description: 'Salenus AI helps you beat procrastination and build better habits with Pi-powered verified AI coaching, smart tasks, mood-based suggestions, and community challenges.',
    keywords: 'Salenus AI, Pi Network, AI Coaching, Smart Task Manager, Productivity, Habit Building, Personal Assistant, Pi Cryptocurrency, Verified AI, Habit Tracker, Task Management, Mood Tracking, Community Challenges'
  },
  dashboard: {
    title: 'Dashboard — Salenus AI',
    description: 'Your personal Salenus AI dashboard. Track habits, manage tasks, and get AI-powered insights to boost your productivity.',
    keywords: 'Salenus AI dashboard, habit tracking, task management, productivity, AI insights'
  },
  pricing: {
    title: 'Pricing Plans — Salenus AI',
    description: 'Choose your Salenus AI plan. Start free or upgrade to Pro/Premium for advanced AI coaching and premium features.',
    keywords: 'Salenus AI pricing, plans, Basic, Pro, Premium, Pi payments, AI coaching'
  },
  features: {
    title: 'Features — Salenus AI',
    description: 'Discover Salenus AI features: habit tracking, smart task management, mood tracking, AI coaching, and Pi Network integration.',
    keywords: 'Salenus AI features, habit tracker, task manager, mood tracking, AI coach, Pi Network'
  },
  about: {
    title: 'About — Salenus AI',
    description: 'Learn about Salenus AI, the Pi-powered verified AI coaching platform helping millions build better habits and achieve their goals.',
    keywords: 'About Salenus AI, Pi Network, AI coaching, productivity, habit building'
  },
  privacy: {
    title: 'Privacy Policy — Salenus AI',
    description: 'Salenus AI privacy policy. Learn how we protect your data and maintain your privacy while providing AI-powered coaching.',
    keywords: 'Salenus AI privacy, data protection, privacy policy'
  },
  terms: {
    title: 'Terms of Service — Salenus AI',
    description: 'Salenus AI terms of service. Read our terms and conditions for using the Pi-powered AI coaching platform.',
    keywords: 'Salenus AI terms, terms of service, conditions'
  }
};

// Hook for easy SEO management
export const useSEO = (config: keyof typeof SEOConfigs | SEOProps) => {
  const seoProps = typeof config === 'string' ? SEOConfigs[config] : config;
  return <SEO {...seoProps} />;
}; 