'use client';

import { useState } from 'react';
import { ChevronDown, Search, Menu, X, User, Bell } from 'lucide-react';

const categories = [
  {
    name: 'Finance',
    subcategories: ['Banking & Insurance', 'ETFs & Mutual Funds', 'Fintech', 'Crypto']
  },
  {
    name: 'Tech',
    subcategories: ['Energy Tech', 'Entrepreneurs']
  },
  {
    name: 'Politics',
    subcategories: ['Elections', 'Policy', 'International Relations']
  },
  {
    name: 'World News',
    subcategories: ['Europe', 'Asia', 'Americas', 'Africa', 'Middle East']
  },
  {
    name: 'Business',
    subcategories: ['Markets', 'Economy', 'Startups', 'Corporate']
  },
  {
    name: 'Opinion',
    subcategories: []
  },
  {
    name: 'Sports',
    subcategories: ['Football', 'Basketball', 'Baseball', 'International']
  },
  {
    name: 'Arts & Entertainment',
    subcategories: ['Movies', 'Music', 'Books', 'Theater']
  },
  {
    name: 'Lifestyle',
    subcategories: ['Health', 'Food', 'Travel', 'Fashion']
  },
  {
    name: 'Weather',
    subcategories: []
  },
  {
    name: 'Local News',
    subcategories: []
  }
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Breaking News Ticker */}
      <div className="bg-emerald-700 text-white px-4 py-1 text-sm">
        <div className="flex items-center max-w-7xl mx-auto">
          <span className="font-semibold mr-4 text-emerald-100">BREAKING:</span>
          <div className="flex-1 overflow-hidden">
            <div className="animate-pulse">
              Latest market updates show significant growth in tech sector...
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar with Date and User Actions */}
        <div className="flex justify-between items-center py-2 text-sm border-b border-gray-100">
          <div className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-emerald-700 transition-colors">
              <Bell size={16} />
            </button>
            <button className="text-gray-600 hover:text-emerald-700 transition-colors">
              <User size={16} />
            </button>
            <button className="text-emerald-700 hover:text-emerald-800 font-medium">
              Subscribe
            </button>
          </div>
        </div>

        {/* Masthead */}
        <div className="flex items-center justify-between py-6">
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-gradient">
              Akiliai
            </h1>
            <p className="text-sm text-gray-600 font-medium tracking-wide">
              PREMIUM NEWS & ANALYSIS
            </p>
          </div>

          {/* Search */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <button
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search size={20} />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 animate-slide-down">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:block border-t border-gray-200 py-2">
          <ul className="flex items-center space-x-8">
            {categories.map((category) => (
              <li key={category.name} className="relative">
                <button
                  className="flex items-center space-x-1 py-2 text-sm font-medium text-gray-700 hover:text-emerald-700 transition-colors"
                  onMouseEnter={() => setActiveDropdown(category.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <span>{category.name}</span>
                  {category.subcategories.length > 0 && (
                    <ChevronDown size={14} />
                  )}
                </button>
                
                {/* Dropdown */}
                {activeDropdown === category.name && category.subcategories.length > 0 && (
                  <div
                    className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 animate-slide-down"
                    onMouseEnter={() => setActiveDropdown(category.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {category.subcategories.map((subcategory) => (
                      <a
                        key={subcategory}
                        href={`/category/${category.name.toLowerCase()}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        {subcategory}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 animate-slide-down">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.name}>
                  <a
                    href={`/category/${category.name.toLowerCase()}`}
                    className="block py-2 text-gray-700 hover:text-emerald-700 font-medium"
                  >
                    {category.name}
                  </a>
                  {category.subcategories.length > 0 && (
                    <div className="ml-4 space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <a
                          key={subcategory}
                          href={`/category/${category.name.toLowerCase()}/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block py-1 text-sm text-gray-600 hover:text-emerald-600"
                        >
                          {subcategory}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
