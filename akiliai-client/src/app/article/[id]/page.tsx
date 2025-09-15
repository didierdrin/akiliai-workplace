'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useArticle } from '@/hooks/useFirebase';
import Image from 'next/image';

export default function ArticlePage() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const { article, loading, error } = useArticle(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {loading && (
          <div className="flex justify-center py-16"><LoadingSpinner size="large" /></div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">{error}</div>
        )}
        {article && (
          <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative h-80 w-full">
              <Image src={article.imageUrl || '/api/placeholder/800/500'} alt={article.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <div className="mb-3"><span className="px-2 py-1 bg-emerald-600 text-white text-xs font-semibold rounded">{article.category}</span></div>
              <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
              <div className="text-sm text-gray-500 mb-6">
                <span className="mr-3">By {article.author}</span>
                <span className="mr-3">{new Date(article.publishDate).toLocaleDateString()}</span>
                <span>{article.readTime}</span>
              </div>
              <div className="prose max-w-none">
                <p className="font-reading text-gray-800 whitespace-pre-line">{article.content || article.excerpt}</p>
              </div>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}


