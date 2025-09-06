'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ArticleCard from './ArticleCard';
import LoadingSpinner from './LoadingSpinner';
import { useArticles } from '../hooks/useFirebase';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { articles: heroArticles, loading, error } = useArticles({ 
    featured: true, 
    limit: 3,
    orderBy: 'publishDate'
  });

  // Fallback data in case Firebase is empty
  const fallbackHeroArticles = [
    {
      id: '1',
      title: 'Global Markets Rally as Tech Stocks Surge to Record Highs',
      excerpt: 'Major technology stocks led a broad market rally today as investors showed renewed confidence in the sector\'s growth prospects. The surge comes amid positive earnings reports and optimistic guidance from industry leaders.',
      author: 'Sarah Johnson',
      publishDate: '2025-01-07',
      readTime: '5 min read',
      category: 'Finance',
      imageUrl: '/api/placeholder/800/500',
      viewCount: 15420
    },
    {
      id: '2',
      title: 'Revolutionary AI Breakthrough Promises to Transform Healthcare',
      excerpt: 'Scientists at leading research institutions have developed a new AI system capable of diagnosing rare diseases with 95% accuracy, potentially revolutionizing medical diagnosis and treatment worldwide.',
      author: 'Dr. Michael Chen',
      publishDate: '2025-01-07',
      readTime: '7 min read',
      category: 'Tech',
      imageUrl: '/api/placeholder/800/500',
      viewCount: 12350
    },
    {
      id: '3',
      title: 'Climate Summit Reaches Historic Agreement on Carbon Reduction',
      excerpt: 'World leaders at the international climate summit have reached a groundbreaking agreement to reduce global carbon emissions by 50% over the next decade, marking a significant step in the fight against climate change.',
      author: 'Emma Rodriguez',
      publishDate: '2025-01-06',
      readTime: '6 min read',
      category: 'World News',
      imageUrl: '/api/placeholder/800/500',
      viewCount: 18900
    }
  ];

  // Use Firebase data or fallback data
  const displayArticles = heroArticles.length > 0 ? heroArticles : fallbackHeroArticles;

  useEffect(() => {
    if (displayArticles.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayArticles.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [displayArticles.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayArticles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayArticles.length) % displayArticles.length);
  };

  if (loading) {
    return (
      <section className="relative mb-12">
        <div className="relative overflow-hidden rounded-xl bg-gray-100 h-[500px] lg:h-[600px] flex items-center justify-center">
          <LoadingSpinner size="large" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative mb-12">
        <div className="relative overflow-hidden rounded-xl bg-red-50 h-[200px] flex items-center justify-center">
          <p className="text-red-600 font-medium">Error loading hero articles: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative mb-12">
      <div className="relative overflow-hidden rounded-xl">
        {/* Hero Carousel */}
        <div className="relative h-[500px] lg:h-[600px]">
          {displayArticles.map((article, index) => (
            <div
              key={article.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
              }`}
            >
              <ArticleCard
                {...article}
                size="hero"
                className="h-full border-0 shadow-2xl"
              />
            </div>
          ))}

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/20 backdrop-blur-sm text-white rounded-full hover:bg-black/40 transition-all"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {displayArticles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Breaking News Banner */}
      <div className="mt-6 p-4 gradient-emerald-light rounded-lg text-white">
        <div className="flex items-center">
          <span className="font-bold text-sm bg-white/20 px-2 py-1 rounded mr-4">
            LIVE
          </span>
          <div className="flex-1">
            <p className="font-medium">
              Markets continue to surge as investors react to positive economic indicators...
            </p>
          </div>
          <button className="ml-4 text-sm underline hover:no-underline transition-all">
            View Live Updates
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
