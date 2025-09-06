'use client';

import { Clock, User, Eye, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  imageUrl: string;
  viewCount?: number;
  size?: 'small' | 'medium' | 'large' | 'hero';
  className?: string;
}

const ArticleCard = ({
  title,
  excerpt,
  author,
  publishDate,
  readTime,
  category,
  imageUrl,
  viewCount,
  size = 'medium',
  className = ''
}: ArticleCardProps) => {
  const sizeClasses = {
    small: {
      container: 'p-4',
      image: 'h-32',
      title: 'text-lg font-semibold',
      excerpt: 'text-sm line-clamp-2'
    },
    medium: {
      container: 'p-4',
      image: 'h-48',
      title: 'text-xl font-semibold',
      excerpt: 'text-sm line-clamp-3'
    },
    large: {
      container: 'p-6',
      image: 'h-64',
      title: 'text-2xl font-bold',
      excerpt: 'text-base line-clamp-4'
    },
    hero: {
      container: 'p-8',
      image: 'h-96',
      title: 'text-4xl font-bold',
      excerpt: 'text-lg line-clamp-4'
    }
  };

  const styles = sizeClasses[size];

  return (
    <article className={`group cursor-pointer transition-all-smooth hover:shadow-lg bg-white border border-gray-100 rounded-lg overflow-hidden ${className}`}>
      <div className={styles.container}>
        {/* Image */}
        <div className={`relative ${styles.image} mb-4 overflow-hidden rounded-md bg-gray-200`}>
          <Image
            src={imageUrl || '/api/placeholder/600/400'}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-emerald-600 text-white text-xs font-semibold rounded angular-clip">
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Title */}
          <h2 className={`font-display ${styles.title} text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-3`}>
            {title}
          </h2>

          {/* Excerpt */}
          {size !== 'small' && (
            <p className={`font-reading text-gray-600 ${styles.excerpt}`}>
              {excerpt}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span className="font-medium">{author}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>{readTime}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {viewCount && (
                <div className="flex items-center space-x-1">
                  <Eye size={14} />
                  <span>{viewCount.toLocaleString()}</span>
                </div>
              )}
              <div className="text-xs text-gray-400">
                {new Date(publishDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Read More */}
          {size === 'hero' && (
            <div className="flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700 transition-colors">
              <span>Read Full Story</span>
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
