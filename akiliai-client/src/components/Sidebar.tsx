'use client';

import { useState } from 'react';
import { TrendingUp, Clock, Eye, Calendar } from 'lucide-react';

interface SidebarArticle {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  imageUrl: string;
  viewCount: number;
}

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState<'latest' | 'popular'>('latest');

  // Mock data - will be replaced with Firebase data
  const sidebarArticles: SidebarArticle[] = [
    {
      id: '4',
      title: 'Cryptocurrency Market Shows Strong Recovery Signs',
      excerpt: 'Bitcoin and other major cryptocurrencies are showing signs of recovery...',
      author: 'Alex Thompson',
      publishDate: '2025-01-07',
      readTime: '3 min read',
      category: 'Finance',
      imageUrl: '/api/placeholder/400/300',
      viewCount: 8450
    },
    {
      id: '5',
      title: 'New Energy Storage Technology Could Change Everything',
      excerpt: 'Scientists develop revolutionary battery technology with 10x capacity...',
      author: 'Lisa Park',
      publishDate: '2025-01-07',
      readTime: '4 min read',
      category: 'Tech',
      imageUrl: '/api/placeholder/400/300',
      viewCount: 9320
    },
    {
      id: '6',
      title: 'International Trade Negotiations Reach Critical Phase',
      excerpt: 'Major economies work toward comprehensive trade agreement...',
      author: 'Robert Kim',
      publishDate: '2025-01-06',
      readTime: '6 min read',
      category: 'Politics',
      imageUrl: '/api/placeholder/400/300',
      viewCount: 7890
    },
    {
      id: '7',
      title: 'Medical Breakthrough: New Cancer Treatment Shows Promise',
      excerpt: 'Clinical trials reveal 85% success rate in early-stage patients...',
      author: 'Dr. Amanda White',
      publishDate: '2025-01-06',
      readTime: '5 min read',
      category: 'Medicine',
      imageUrl: '/api/placeholder/400/300',
      viewCount: 11200
    }
  ];

  const trendingTopics = [
    { topic: 'AI Revolution', articles: 23, trend: '+15%' },
    { topic: 'Climate Action', articles: 18, trend: '+8%' },
    { topic: 'Market Analysis', articles: 31, trend: '+22%' },
    { topic: 'Tech Innovation', articles: 27, trend: '+12%' },
    { topic: 'Global Politics', articles: 19, trend: '+5%' }
  ];

  const popularArticles = sidebarArticles.sort((a, b) => b.viewCount - a.viewCount).slice(0, 3);
  const latestArticles = sidebarArticles.sort((a, b) => 
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  ).slice(0, 3);

  return (
    <aside className="space-y-8">
      {/* Latest & Popular Toggle */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
              activeTab === 'latest' 
                ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-700' 
                : 'text-gray-600 hover:text-emerald-700'
            }`}
          >
            <Clock className="inline mr-2" size={16} />
            LATEST NEWS
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
              activeTab === 'popular' 
                ? 'text-emerald-700 bg-emerald-50 border-b-2 border-emerald-700' 
                : 'text-gray-600 hover:text-emerald-700'
            }`}
          >
            <TrendingUp className="inline mr-2" size={16} />
            MOST POPULAR
          </button>
        </div>

        <div className="p-4 space-y-4">
          {(activeTab === 'latest' ? latestArticles : popularArticles).map((article) => (
            <div key={article.id} className="flex items-start space-x-3 group cursor-pointer">
              <div className="flex-shrink-0 w-3 h-3 bg-emerald-600 rounded-full mt-2 group-hover:bg-emerald-700 transition-colors"></div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1">
                  {article.title}
                </h4>
                <div className="flex items-center text-xs text-gray-500 space-x-3">
                  <span>{article.author}</span>
                  <span>{article.readTime}</span>
                  <div className="flex items-center space-x-1">
                    <Eye size={12} />
                    <span>{article.viewCount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="font-display text-lg font-bold mb-4 text-gray-900 flex items-center">
          <TrendingUp className="mr-2 text-emerald-600" size={20} />
          Trending Topics
        </h3>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between group cursor-pointer">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {topic.topic}
                </h4>
                <p className="text-sm text-gray-500">{topic.articles} articles</p>
              </div>
              <div className="text-emerald-600 font-semibold text-sm">
                {topic.trend}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Widget */}
      <div className="gradient-emerald-subtle rounded-lg p-6 text-gray-800">
        <h3 className="font-display text-lg font-bold mb-4 flex items-center">
          <Calendar className="mr-2 text-emerald-700" size={20} />
          Today&apos;s Brief
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Temperature</span>
            <span className="font-semibold">72°F</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Market Status</span>
            <span className="font-semibold text-green-600">+2.4%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Articles Today</span>
            <span className="font-semibold">47</span>
          </div>
          <div className="pt-2 border-t border-emerald-200">
            <p className="text-xs text-gray-600 font-reading">
              Stay informed with our comprehensive daily briefing covering the most important stories.
            </p>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="gradient-emerald-angular rounded-lg p-6 text-white">
        <h3 className="font-display text-lg font-bold mb-2">Daily Digest</h3>
        <p className="text-emerald-100 text-sm mb-4 font-reading">
          Get our top stories delivered to your inbox every morning.
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Your email address"
            className="w-full px-3 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button className="w-full py-2 bg-white text-emerald-700 font-semibold rounded-md hover:bg-emerald-50 transition-colors">
            Subscribe Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
