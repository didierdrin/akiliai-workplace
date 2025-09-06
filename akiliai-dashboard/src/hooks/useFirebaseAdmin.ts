'use client';

import { useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  where, 
  startAfter,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { firestore, storage } from '../../lib/firebase';

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
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
  status: 'published' | 'draft' | 'scheduled';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  scheduledDate?: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  subcategories: string[];
  slug: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AnalyticsData {
  id: string;
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  topArticles: Array<{ id: string; title: string; views: number }>;
  topCategories: Array<{ name: string; views: number }>;
  trafficSources: Array<{ source: string; visits: number }>;
  deviceTypes: Array<{ type: string; count: number }>;
  countries: Array<{ country: string; visits: number }>;
}

// Articles Management Hook
export const useArticlesAdmin = (options?: {
  status?: string;
  category?: string;
  author?: string;
  limit?: number;
}) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const articlesRef = collection(firestore, 'articles');
      
      let q = query(articlesRef, orderBy('createdAt', 'desc'));
      
      if (options?.status) {
        q = query(q, where('status', '==', options.status));
      }
      
      if (options?.category) {
        q = query(q, where('category', '==', options.category));
      }
      
      if (options?.author) {
        q = query(q, where('authorId', '==', options.author));
      }
      
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
    } catch (err: any) {
      console.error('Error fetching articles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [options?.status, options?.category, options?.author, options?.limit]);

  const createArticle = async (articleData: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>) => {
    try {
      const docRef = await addDoc(collection(firestore, 'articles'), {
        ...articleData,
        viewCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      await fetchArticles(); // Refresh the list
      return docRef.id;
    } catch (error: any) {
      throw new Error(`Failed to create article: ${error.message}`);
    }
  };

  const updateArticle = async (id: string, updates: Partial<Article>) => {
    try {
      await updateDoc(doc(firestore, 'articles', id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
      
      await fetchArticles(); // Refresh the list
    } catch (error: any) {
      throw new Error(`Failed to update article: ${error.message}`);
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'articles', id));
      await fetchArticles(); // Refresh the list
    } catch (error: any) {
      throw new Error(`Failed to delete article: ${error.message}`);
    }
  };

  const bulkUpdateArticles = async (articleIds: string[], updates: Partial<Article>) => {
    try {
      const batch = writeBatch(firestore);
      
      articleIds.forEach(id => {
        const articleRef = doc(firestore, 'articles', id);
        batch.update(articleRef, {
          ...updates,
          updatedAt: Timestamp.now()
        });
      });
      
      await batch.commit();
      await fetchArticles(); // Refresh the list
    } catch (error: any) {
      throw new Error(`Failed to bulk update articles: ${error.message}`);
    }
  };

  return { 
    articles, 
    loading, 
    error, 
    createArticle, 
    updateArticle, 
    deleteArticle, 
    bulkUpdateArticles,
    refetch: fetchArticles 
  };
};

// Categories Management Hook
export const useCategoriesAdmin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const createCategory = async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(collection(firestore, 'categories'), {
        ...categoryData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      await fetchCategories();
    } catch (error: any) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await updateDoc(doc(firestore, 'categories', id), {
        ...updates,
        updatedAt: Timestamp.now()
      });
      
      await fetchCategories();
    } catch (error: any) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, 'categories', id));
      await fetchCategories();
    } catch (error: any) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  };

  const reorderCategories = async (reorderedCategories: Category[]) => {
    try {
      const batch = writeBatch(firestore);
      
      reorderedCategories.forEach((category, index) => {
        const categoryRef = doc(firestore, 'categories', category.id);
        batch.update(categoryRef, {
          order: index + 1,
          updatedAt: Timestamp.now()
        });
      });
      
      await batch.commit();
      await fetchCategories();
    } catch (error: any) {
      throw new Error(`Failed to reorder categories: ${error.message}`);
    }
  };

  return { 
    categories, 
    loading, 
    error, 
    createCategory, 
    updateCategory, 
    deleteCategory, 
    reorderCategories,
    refetch: fetchCategories 
  };
};

// Analytics Hook
export const useAnalytics = (dateRange?: { start: Date; end: Date }) => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch page analytics
      const analyticsRef = collection(firestore, 'page_analytics');
      let q = query(analyticsRef, orderBy('timestamp', 'desc'));
      
      if (dateRange) {
        q = query(q, 
          where('timestamp', '>=', Timestamp.fromDate(dateRange.start)),
          where('timestamp', '<=', Timestamp.fromDate(dateRange.end))
        );
      }
      
      const snapshot = await getDocs(q);
      const analyticsData: any[] = [];
      
      snapshot.forEach((doc) => {
        analyticsData.push(doc.data());
      });
      
      // Process analytics data
      const processedAnalytics: AnalyticsData = {
        id: 'current',
        date: new Date().toISOString().split('T')[0],
        pageViews: analyticsData.length,
        uniqueVisitors: new Set(analyticsData.map(d => d.userAgent)).size,
        topArticles: [],
        topCategories: [],
        trafficSources: [],
        deviceTypes: [],
        countries: []
      };
      
      setAnalytics(processedAnalytics);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  return { analytics, loading, error, refetch: fetchAnalytics };
};

// File Upload Hook
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, folder: string = 'uploads'): Promise<string> => {
    try {
      setUploading(true);
      setError(null);
      
      const fileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (url: string) => {
    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
    } catch (error: any) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  };

  return { uploadFile, deleteFile, uploading, error };
};
