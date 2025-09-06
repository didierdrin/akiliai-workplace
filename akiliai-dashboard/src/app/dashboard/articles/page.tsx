'use client';

import { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  MoreVertical,
  CheckSquare,
  Square
} from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useArticlesAdmin } from '../../../hooks/useFirebaseAdmin';
import { toast } from 'react-hot-toast';

const ArticlesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  const { articles, loading, error, updateArticle, deleteArticle, bulkUpdateArticles } = useArticlesAdmin();

  // Mock data for development
  const mockArticles = [
    {
      id: '1',
      title: 'Revolutionary AI Technology Transforms Healthcare Industry',
      author: 'Dr. Sarah Johnson',
      category: 'Tech',
      status: 'published',
      publishDate: '2025-01-07',
      viewCount: 15420,
      readTime: '5 min read',
      featured: true
    },
    {
      id: '2',
      title: 'Global Markets Rally as Tech Stocks Surge',
      author: 'Michael Chen',
      category: 'Finance',
      status: 'draft',
      publishDate: '2025-01-08',
      viewCount: 0,
      readTime: '3 min read',
      featured: false
    },
    {
      id: '3',
      title: 'Climate Summit Reaches Historic Agreement',
      author: 'Emma Rodriguez',
      category: 'World News',
      status: 'scheduled',
      publishDate: '2025-01-10',
      viewCount: 0,
      readTime: '6 min read',
      featured: true
    },
  ];

  const displayArticles = articles.length > 0 ? articles : mockArticles;

  const filteredArticles = displayArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || article.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleSelectAll = () => {
    if (selectedArticles.length === filteredArticles.length) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(filteredArticles.map(article => article.id));
    }
  };

  const handleSelectArticle = (articleId: string) => {
    if (selectedArticles.includes(articleId)) {
      setSelectedArticles(selectedArticles.filter(id => id !== articleId));
    } else {
      setSelectedArticles([...selectedArticles, articleId]);
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedArticles.length === 0) return;

    try {
      switch (bulkAction) {
        case 'publish':
          await bulkUpdateArticles(selectedArticles, { status: 'published' as any });
          toast.success(`${selectedArticles.length} articles published`);
          break;
        case 'draft':
          await bulkUpdateArticles(selectedArticles, { status: 'draft' as any });
          toast.success(`${selectedArticles.length} articles moved to draft`);
          break;
        case 'feature':
          await bulkUpdateArticles(selectedArticles, { featured: true });
          toast.success(`${selectedArticles.length} articles featured`);
          break;
        case 'unfeature':
          await bulkUpdateArticles(selectedArticles, { featured: false });
          toast.success(`${selectedArticles.length} articles unfeatured`);
          break;
        case 'delete':
          if (window.confirm(`Are you sure you want to delete ${selectedArticles.length} articles?`)) {
            for (const articleId of selectedArticles) {
              await deleteArticle(articleId);
            }
            toast.success(`${selectedArticles.length} articles deleted`);
          }
          break;
      }
      setSelectedArticles([]);
      setBulkAction('');
    } catch (error) {
      toast.error('Action failed. Please try again.');
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(articleId);
        toast.success('Article deleted successfully');
      } catch (error) {
        toast.error('Failed to delete article');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'published':
        return `${baseClasses} status-published`;
      case 'draft':
        return `${baseClasses} status-draft`;
      case 'scheduled':
        return `${baseClasses} status-scheduled`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Articles" description="Manage your content">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Articles" description="Manage your content and publications">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="Finance">Finance</option>
            <option value="Tech">Tech</option>
            <option value="Politics">Politics</option>
            <option value="World News">World News</option>
            <option value="Medicine">Medicine</option>
          </select>
        </div>

        <a
          href="/dashboard/articles/new"
          className="inline-flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          New Article
        </a>
      </div>

      {/* Bulk Actions */}
      {selectedArticles.length > 0 && (
        <div className="admin-card p-4 mb-6 bg-emerald-50 border-emerald-200">
          <div className="flex items-center justify-between">
            <p className="text-emerald-800 font-medium">
              {selectedArticles.length} article{selectedArticles.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex items-center space-x-3">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="border border-emerald-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Bulk Actions</option>
                <option value="publish">Publish</option>
                <option value="draft">Move to Draft</option>
                <option value="feature">Feature</option>
                <option value="unfeature">Unfeature</option>
                <option value="delete">Delete</option>
              </select>
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="px-3 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Articles Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={handleSelectAll}
                    className="text-gray-500 hover:text-emerald-600"
                  >
                    {selectedArticles.length === filteredArticles.length ? 
                      <CheckSquare size={16} /> : <Square size={16} />
                    }
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSelectArticle(article.id)}
                      className="text-gray-500 hover:text-emerald-600"
                    >
                      {selectedArticles.includes(article.id) ? 
                        <CheckSquare size={16} /> : <Square size={16} />
                      }
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {article.featured && (
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3" title="Featured" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                          {article.title}
                        </p>
                        <p className="text-sm text-gray-500">{article.readTime}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{article.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(article.status)}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar size={16} className="mr-2" />
                      {new Date(article.publishDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Eye size={16} className="mr-2" />
                      {article.viewCount?.toLocaleString() || '0'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <a
                        href={`/dashboard/articles/${article.id}`}
                        className="text-gray-400 hover:text-emerald-600 p-1"
                        title="View"
                      >
                        <Eye size={16} />
                      </a>
                      <a
                        href={`/dashboard/articles/${article.id}/edit`}
                        className="text-gray-400 hover:text-blue-600 p-1"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </a>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Get started by creating your first article.'
              }
            </p>
            <a
              href="/dashboard/articles/new"
              className="inline-flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Create Article
            </a>
          </div>
        )}
      </div>

      {/* Pagination would go here */}
      {filteredArticles.length > 10 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing 1 to 10 of {filteredArticles.length} articles
          </p>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ArticlesPage;
