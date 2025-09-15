'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useArticles } from '@/hooks/useFirebase';
import ArticleCard from '@/components/ArticleCard';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CategoryPage() {
  const params = useParams();
  const category = decodeURIComponent((params?.category as string) || '');
  const { articles, loading, error } = useArticles({ category, orderBy: 'publishDate', limit: 24 });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold text-gray-900">{category} News</h1>
        </div>
        {loading && (
          <div className="flex justify-center py-16"><LoadingSpinner size="large" /></div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">{error}</div>
        )}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((a) => (
              <ArticleCard key={a.id} {...a} size="small" />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}


