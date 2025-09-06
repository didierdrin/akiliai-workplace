'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  where,   
  increment,
  Timestamp
} from 'firebase/firestore';
import { firestore } from '../../lib/firebase';

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  publishDate: string;
  category: string;
  subcategory?: string;
  imageUrl: string;
  tags: string[];
  viewCount: number;
  readTime: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  featured: boolean;
  status: 'published' | 'draft';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  subcategories?: string[];
}

export interface PageAnalytics {
  id: string;
  url: string;
  visits: number;
  timestamp: Timestamp;
  userAgent: string;
  referrer: string;
}

// Custom hook for fetching articles
export const useArticles = (options?: {
  category?: string;
  limit?: number;
  featured?: boolean;
  orderBy?: 'publishDate' | 'viewCount' | 'createdAt';
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const articlesRef = collection(firestore, 'articles');
        
        let q = query(articlesRef, where('status', '==', 'published'));
        
        if (options?.category) {
          q = query(q, where('category', '==', options.category));
        }
        
        if (options?.featured !== undefined) {
          q = query(q, where('featured', '==', options.featured));
        }
        
        const orderByField = options?.orderBy || 'publishDate';
        q = query(q, orderBy(orderByField, 'desc'));
        
        if (options?.limit) {
          q = query(q, limit(options.limit));
        }

        const snapshot = await getDocs(q);
        const fetchedArticles: Article[] = [];
        
        snapshot.forEach((doc) => {
          fetchedArticles.push({
            id: doc.id,
            ...doc.data()
          } as Article);
        });
        
        setArticles(fetchedArticles);
        setError(null);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('Failed to fetch articles');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [options?.category, options?.limit, options?.featured, options?.orderBy]);

  return { articles, loading, error };
};

// Custom hook for fetching a single article
export const useArticle = (id: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const articleDoc = await getDoc(doc(firestore, 'articles', id));
        
        if (articleDoc.exists()) {
          setArticle({
            id: articleDoc.id,
            ...articleDoc.data()
          } as Article);
          
          // Increment view count
          await updateDoc(doc(firestore, 'articles', id), {
            viewCount: increment(1)
          });
          
          setError(null);
        } else {
          setError('Article not found');
          setArticle(null);
        }
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to fetch article');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return { article, loading, error };
};

// Custom hook for fetching categories
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesRef = collection(firestore, 'categories');
        const q = query(categoriesRef, orderBy('order', 'asc'));
        
        const snapshot = await getDocs(q);
        const fetchedCategories: Category[] = [];
        
        snapshot.forEach((doc) => {
          fetchedCategories.push({
            id: doc.id,
            ...doc.data()
          } as Category);
        });
        
        setCategories(fetchedCategories);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

// Function to track page analytics
export const trackPageView = async (url: string, userAgent: string, referrer: string) => {
  try {
    await addDoc(collection(firestore, 'page_analytics'), {
      url,
      visits: 1,
      timestamp: Timestamp.now(),
      userAgent,
      referrer
    });
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Function to search articles
export const searchArticles = async (searchQuery: string, category?: string) => {
  try {
    const articlesRef = collection(firestore, 'articles');
    let q = query(articlesRef, where('status', '==', 'published'));
    
    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    const snapshot = await getDocs(q);
    const articles: Article[] = [];
    
    snapshot.forEach((doc) => {
      const articleData = { id: doc.id, ...doc.data() } as Article;
      
      // Simple text search - in production, consider using Algolia or similar
      const searchTerm = searchQuery.toLowerCase();
      const titleMatch = articleData.title.toLowerCase().includes(searchTerm);
      const contentMatch = articleData.content.toLowerCase().includes(searchTerm);
      const tagMatch = articleData.tags.some(tag => tag.toLowerCase().includes(searchTerm));
      
      if (titleMatch || contentMatch || tagMatch) {
        articles.push(articleData);
      }
    });
    
    return articles;
  } catch (error) {
    console.error('Error searching articles:', error);
    throw new Error('Search failed');
  }
};

// Function to get popular articles
export const getPopularArticles = async (limitCount: number = 10) => {
  try {
    const articlesRef = collection(firestore, 'articles');
    const q = query(
      articlesRef,
      where('status', '==', 'published'),
      orderBy('viewCount', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const articles: Article[] = [];
    
    snapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      } as Article);
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching popular articles:', error);
    throw new Error('Failed to fetch popular articles');
  }
};

// Function to get latest articles
export const getLatestArticles = async (limitCount: number = 10) => {
  try {
    const articlesRef = collection(firestore, 'articles');
    const q = query(
      articlesRef,
      where('status', '==', 'published'),
      orderBy('publishDate', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    const articles: Article[] = [];
    
    snapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data()
      } as Article);
    });
    
    return articles;
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    throw new Error('Failed to fetch latest articles');
  }
};
