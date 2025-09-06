'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import Sidebar from '@/components/Sidebar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useArticles, trackPageView } from '../hooks/useFirebase';
import ArticleCard from '@/components/ArticleCard';

export default function Home() {
  const { articles: featuredArticles, loading, error } = useArticles({ 
    limit: 12,
    orderBy: 'publishDate'
  });

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      trackPageView(
        window.location.pathname,
        navigator.userAgent,
        document.referrer
      );
    }
  }, []);

  // Fallback data in case Firebase is empty
  const fallbackArticles = [
    {
      id: '8',
      title: 'Federal Reserve Announces New Interest Rate Policy',
      excerpt: 'The Federal Reserve has announced significant changes to its interest rate policy, signaling a shift in monetary approach for the coming year. Market analysts predict substantial impacts across various sectors.',
      author: 'Jennifer Martinez',
      publishDate: '2025-01-07',
      readTime: '4 min read',
      category: 'Finance',
      imageUrl: '/api/placeholder/600/400',
      viewCount: 14200
    },
    {
      id: '9',
      title: 'Breakthrough in Quantum Computing Achieved',
      excerpt: 'Scientists have successfully demonstrated a new quantum computing architecture that could solve complex problems exponentially faster than traditional computers.',
      author: 'Dr. Steven Chang',
      publishDate: '2025-01-07',
      readTime: '6 min read',
      category: 'Tech',
      imageUrl: '/api/placeholder/600/400',
      viewCount: 9800
    },
    {
      id: '10',
      title: 'Historic Peace Agreement Signed in International Summit',
      excerpt: 'World leaders have signed a landmark peace agreement addressing long-standing regional conflicts, marking a new chapter in international diplomacy.',
      author: 'Maria Gonzalez',
      publishDate: '2025-01-06',
      readTime: '8 min read',
      category: 'Politics',
      imageUrl: '/api/placeholder/600/400',
      viewCount: 16700
    },
    {
      id: '11',
      title: 'Revolutionary Cancer Treatment Shows Remarkable Results',
      excerpt: 'A new immunotherapy treatment has shown unprecedented success rates in clinical trials, offering hope to millions of cancer patients worldwide.',
      author: 'Dr. Rachel Adams',
      publishDate: '2025-01-06',
      readTime: '7 min read',
      category: 'Medicine',
      imageUrl: '/api/placeholder/600/400',
      viewCount: 12500
    },
    {
      id: '12',
      title: 'Sustainable Energy Initiative Receives Global Support',
      excerpt: 'A comprehensive sustainable energy initiative has gained unprecedented support from governments and corporations worldwide, promising to accelerate the transition to renewable energy.',
      author: 'Thomas Anderson',
      publishDate: '2025-01-05',
      readTime: '5 min read',
      category: 'Business',
      imageUrl: '/api/placeholder/600/400',
      viewCount: 11300
    },
    {
      id: '13',
      title: 'Olympic Preparations Showcase Technological Innovation',
      excerpt: 'The upcoming Olympics will feature cutting-edge technology and sustainable practices, setting new standards for international sporting events.',
      author: 'Lisa Thompson',
      publishDate: '2025-01-05',
      readTime: '4 min read',
      category: 'Sports',
      imageUrl: '/api/placeholder/600/400',
      viewCount: 8900
    }
  ];

  // Use Firebase data or fallback data
  const displayArticles = featuredArticles.length > 0 ? featuredArticles : fallbackArticles;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between border-b border-emerald-200 pb-4">
              <h2 className="font-display text-2xl font-bold text-gray-900">
                Today&apos;s Top Stories
              </h2>
              <div className="flex space-x-4">
                <button className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">
                  View All
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="large" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600 font-medium">Error loading articles: {error}</p>
                <p className="text-red-500 text-sm mt-1">Displaying sample content instead.</p>
              </div>
            )}

            {/* Featured Articles Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayArticles.slice(0, 6).map((article) => (
                  <ArticleCard
                    key={article.id}
                    {...article}
                    size="medium"
                    className="hover:shadow-xl"
                  />
                ))}
              </div>
            )}

            {/* Category Sections */}
            <div className="space-y-8 mt-12">
              {/* Finance Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-bold text-gray-900 flex items-center">
                    <span className="w-4 h-4 bg-emerald-600 rounded mr-3"></span>
                    Finance & Markets
                  </h3>
                  <a href="/category/finance" className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">
                    See More →
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {displayArticles.filter(article => article.category === 'Finance').slice(0, 3).map((article) => (
                    <ArticleCard
                      key={article.id}
                      {...article}
                      size="small"
                    />
                  ))}
                </div>
              </section>

              {/* Technology Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display text-xl font-bold text-gray-900 flex items-center">
                    <span className="w-4 h-4 bg-blue-600 rounded mr-3"></span>
                    Technology
                  </h3>
                  <a href="/category/tech" className="text-emerald-700 font-semibold hover:text-emerald-800 transition-colors">
                    See More →
                  </a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {displayArticles.filter(article => article.category === 'Tech').slice(0, 3).map((article) => (
                    <ArticleCard
                      key={article.id}
                      {...article}
                      size="small"
                    />
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>

        {/* Opinion Section */}
        <section className="mt-16 py-8 gradient-emerald-subtle rounded-xl">
          <div className="px-8">
            <h3 className="font-display text-2xl font-bold text-gray-900 mb-6 text-center">
              Opinion & Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Opinion</span>
                <h4 className="font-display text-lg font-bold mt-2 mb-3 text-gray-900">
                  The Future of Global Economic Policy
                </h4>
                <p className="font-reading text-gray-600 text-sm mb-4">
                  As we navigate unprecedented economic challenges, policymakers must consider innovative approaches to ensure sustainable growth...
                </p>
                <div className="text-xs text-gray-500">
                  By Economic Policy Institute • 3 min read
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Analysis</span>
                <h4 className="font-display text-lg font-bold mt-2 mb-3 text-gray-900">
                  Technology&apos;s Role in Climate Solutions
                </h4>
                <p className="font-reading text-gray-600 text-sm mb-4">
                  Examining how emerging technologies are being leveraged to address climate change and create sustainable solutions...
                </p>
                <div className="text-xs text-gray-500">
                  By Environmental Research Group • 4 min read
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
