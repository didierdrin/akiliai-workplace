'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  Eye, 
  Calendar, 
  Upload, 
  Tag, 
  Settings,
  ArrowLeft,
  Clock
} from 'lucide-react';
import DashboardLayout from '../../../../components/DashboardLayout';
import RichTextEditor from '../../../../components/RichTextEditor';
import { useArticlesAdmin, useFileUpload } from '../../../../hooks/useFirebaseAdmin';
import { useAuth } from '../../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const NewArticlePage = () => {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { createArticle } = useArticlesAdmin();
  const { uploadFile, uploading } = useFileUpload();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    subcategory: '',
    tags: [] as string[],
    imageUrl: '',
    featured: false,
    status: 'draft' as 'published' | 'draft' | 'scheduled',
    publishDate: '',
    scheduledDate: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[]
  });

  const [tagInput, setTagInput] = useState('');
  const [seoKeywordInput, setSeoKeywordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    { name: 'Finance', subcategories: ['Banking & Insurance', 'ETFs & Mutual Funds', 'Fintech', 'Crypto', 'Markets', 'Economics'] },
    { name: 'Tech', subcategories: ['AI & Machine Learning', 'Energy Tech', 'Entrepreneurs', 'Software', 'Hardware', 'Cybersecurity'] },
    { name: 'Politics', subcategories: ['Elections', 'Policy', 'International Relations', 'Government', 'Law & Justice'] },
    { name: 'World News', subcategories: ['Europe', 'Asia', 'Americas', 'Africa', 'Middle East', 'Climate'] },
    { name: 'Medicine', subcategories: ['Research', 'Public Health', 'Pharmaceuticals', 'Medical Devices', 'Mental Health'] },
    { name: 'Business', subcategories: ['Corporate', 'Startups', 'Industry Analysis', 'Supply Chain', 'Real Estate'] },
    { name: 'Sports', subcategories: ['Football', 'Basketball', 'Baseball', 'International Sports', 'Olympics'] },
    { name: 'Opinion', subcategories: [] }
  ];

  const selectedCategory = categories.find(cat => cat.name === formData.category);
  
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadFile(file, 'articles');
      setFormData(prev => ({ ...prev, imageUrl }));
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addSeoKeyword = () => {
    if (seoKeywordInput.trim() && !formData.seoKeywords.includes(seoKeywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        seoKeywords: [...prev.seoKeywords, seoKeywordInput.trim()]
      }));
      setSeoKeywordInput('');
    }
  };

  const removeSeoKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter(k => k !== keyword)
    }));
  };

  const handleSubmit = async (status: 'draft' | 'published' | 'scheduled') => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in the title and content');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (status === 'scheduled' && !formData.scheduledDate) {
      toast.error('Please select a scheduled date');
      return;
    }

    setIsSubmitting(true);

    try {
      const articleData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt || formData.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        author: currentUser?.displayName || currentUser?.email || 'Admin',
        authorId: currentUser?.uid || '',
        publishDate: status === 'published' ? new Date().toISOString() : (formData.publishDate || new Date().toISOString()),
        category: formData.category,
        subcategory: formData.subcategory,
        imageUrl: formData.imageUrl,
        tags: formData.tags,
        readTime: calculateReadTime(formData.content),
        featured: formData.featured,
        status,
        seoTitle: formData.seoTitle || formData.title,
        seoDescription: formData.seoDescription || formData.excerpt,
        seoKeywords: formData.seoKeywords,
        ...(status === 'scheduled' && { scheduledDate: new Date(formData.scheduledDate) as any })
      };

      await createArticle(articleData as any);
      
      toast.success(`Article ${status === 'published' ? 'published' : status === 'scheduled' ? 'scheduled' : 'saved as draft'} successfully!`);
      router.push('/dashboard/articles');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save article');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-emerald-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Article</h1>
            <p className="text-gray-600">Write and publish your content</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye size={16} className="mr-2" />
            Preview
          </button>
          
          <button
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} className="mr-2" />
            Save Draft
          </button>

          <button
            onClick={() => handleSubmit('scheduled')}
            disabled={isSubmitting || !formData.scheduledDate}
            className="flex items-center px-4 py-2 text-blue-700 border border-blue-300 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Calendar size={16} className="mr-2" />
            Schedule
          </button>

          <button
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Title */}
          <div className="admin-card p-6">
            <input
              type="text"
              placeholder="Enter article title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full text-3xl font-bold border-none outline-none placeholder-gray-400"
            />
          </div>

          {/* Featured Image */}
          <div className="admin-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Featured Image</h3>
            {formData.imageUrl ? (
              <div className="relative">
                <img
                  src={formData.imageUrl}
                  alt="Featured"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Content Editor */}
          <div className="admin-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Content</h3>
            <RichTextEditor
              value={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              placeholder="Start writing your article..."
            />
          </div>

          {/* Excerpt */}
          <div className="admin-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Excerpt (Optional)</h3>
            <textarea
              placeholder="Brief description of the article..."
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            />
            <p className="text-sm text-gray-500 mt-2">
              If not provided, this will be auto-generated from the content.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Publishing Options */}
          <div className="admin-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Settings size={16} className="mr-2" />
              Publishing
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm">Featured Article</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, publishDate: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={14} className="inline mr-1" />
                  Schedule For Later
                </label>
                <input
                  type="datetime-local"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="admin-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
            
            <div className="space-y-4">
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  category: e.target.value, 
                  subcategory: '' 
                }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>

              {selectedCategory && selectedCategory.subcategories.length > 0 && (
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Select Subcategory (Optional)</option>
                  {selectedCategory.subcategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="admin-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Tag size={16} className="mr-2" />
              Tags
            </h3>
            
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 text-sm"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-emerald-600 hover:text-emerald-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="admin-card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">SEO Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  placeholder="SEO optimized title..."
                  value={formData.seoTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  placeholder="Brief description for search engines..."
                  value={formData.seoDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                  className="w-full h-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seoDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add keyword..."
                    value={seoKeywordInput}
                    onChange={(e) => setSeoKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSeoKeyword())}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={addSeoKeyword}
                    className="px-3 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 text-sm"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.seoKeywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {keyword}
                      <button
                        onClick={() => removeSeoKeyword(keyword)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Article Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Featured"
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <h1 className="text-3xl font-bold mb-4">{formData.title || 'Untitled Article'}</h1>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formData.content }} />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default NewArticlePage;
