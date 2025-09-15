'use client';

import { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  GripVertical,
  FolderOpen,
  Tag
} from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useCategoriesAdmin } from '../../../hooks/useFirebaseAdmin';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  subcategories: string[];
  slug: string;
  isActive: boolean;
}

const CategoriesPage = () => {
  const { categories, loading, createCategory, updateCategory, deleteCategory, reorderCategories } = useCategoriesAdmin();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#047857',
    subcategories: [] as string[],
    isActive: true
  });
  const [newSubcategory, setNewSubcategory] = useState('');

  // Mock data for development
  const mockCategories: Category[] = [
    {
      id: '1',
      name: 'Finance',
      description: 'Financial markets, banking, economics, and business analysis',
      color: '#047857',
      order: 1,
      subcategories: ['Banking & Insurance', 'ETFs & Mutual Funds', 'Fintech', 'Crypto', 'Markets', 'Economics'],
      slug: 'finance',
      isActive: true
    },
    {
      id: '2',
      name: 'Tech',
      description: 'Technology news, innovation, and digital transformation',
      color: '#3b82f6',
      order: 2,
      subcategories: ['AI & Machine Learning', 'Energy Tech', 'Entrepreneurs', 'Software', 'Hardware', 'Cybersecurity'],
      slug: 'tech',
      isActive: true
    },
    {
      id: '3',
      name: 'Politics',
      description: 'Political news, policy analysis, and government affairs',
      color: '#ef4444',
      order: 3,
      subcategories: ['Elections', 'Policy', 'International Relations', 'Government', 'Law & Justice'],
      slug: 'politics',
      isActive: true
    },
    {
      id: '4',
      name: 'World News',
      description: 'International news and global affairs',
      color: '#f59e0b',
      order: 4,
      subcategories: ['Europe', 'Asia', 'Americas', 'Africa', 'Middle East', 'Climate'],
      slug: 'world-news',
      isActive: true
    },
    {
      id: '5',
      name: 'Medicine',
      description: 'Healthcare, medical research, and public health',
      color: '#8b5cf6',
      order: 5,
      subcategories: ['Research', 'Public Health', 'Pharmaceuticals', 'Medical Devices', 'Mental Health'],
      slug: 'medicine',
      isActive: true
    }
  ];

  const displayCategories = categories.length > 0 ? categories : mockCategories;

  const predefinedColors = [
    '#047857', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#ec4899', '#f97316', '#6366f1'
  ];

  const handleAddCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      const categoryData = {
        name: newCategory.name,
        description: newCategory.description,
        color: newCategory.color,
        order: displayCategories.length + 1,
        subcategories: newCategory.subcategories,
        slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
        isActive: newCategory.isActive
      };

      await createCategory(categoryData);
      
      // Reset form
      setNewCategory({
        name: '',
        description: '',
        color: '#047857',
        subcategories: [],
        isActive: true
      });
      setShowAddForm(false);
      toast.success('Category created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
    }
  };

  const handleUpdateCategory = async (categoryId: string, updates: Partial<Category>) => {
    try {
      await updateCategory(categoryId, updates);
      setEditingCategory(null);
      toast.success('Category updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteCategory(categoryId);
        toast.success('Category deleted successfully!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  const addSubcategory = () => {
    if (newSubcategory.trim() && !newCategory.subcategories.includes(newSubcategory.trim())) {
      setNewCategory(prev => ({
        ...prev,
        subcategories: [...prev.subcategories, newSubcategory.trim()]
      }));
      setNewSubcategory('');
    }
  };

  const removeSubcategory = (subcategory: string) => {
    setNewCategory(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(sub => sub !== subcategory)
    }));
  };

  // Drag and Drop for reordering (simplified version)
  const DraggableCategory = ({ category, index }: { category: Category; index: number }) => {
    const [, drag] = useDrag({
      type: 'category',
      item: { index },
    });

    const [, drop] = useDrop({
      accept: 'category',
      hover: (draggedItem: { index: number }) => {
        if (draggedItem.index !== index) {
          // Handle reordering logic here
        }
      },
    });

    return (
      <tr ref={(node) => { if (node) { drag(drop(node)); } }} className="hover:bg-gray-50 cursor-move">
        <td className="px-6 py-4">
          <div className="flex items-center">
            <GripVertical size={16} className="text-gray-400 mr-3" />
            <div 
              className="w-4 h-4 rounded-full mr-3" 
              style={{ backgroundColor: category.color }}
            />
            <div>
              <p className="font-medium text-gray-900">{category.name}</p>
              <p className="text-sm text-gray-500">{category.slug}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <p className="text-sm text-gray-600 max-w-xs truncate">
            {category.description}
          </p>
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1">
            {category.subcategories.slice(0, 3).map((sub, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {sub}
              </span>
            ))}
            {category.subcategories.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                +{category.subcategories.length - 3} more
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            category.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {category.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditingCategory(category.id)}
              className="text-gray-400 hover:text-blue-600 p-1"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="text-gray-400 hover:text-red-600 p-1"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Categories" description="Manage content categories">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Categories" description="Organize your content with categories and subcategories">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <FolderOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Category Management</h2>
            <p className="text-sm text-gray-600">
              {displayCategories.length} categories • Drag to reorder
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="admin-card p-6 mb-6 border-emerald-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Add New Category</h3>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Technology"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="admin-input w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Brief description of this category..."
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  className="admin-input w-full h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex space-x-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 ${
                        newCategory.color === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newCategory.isActive}
                    onChange={(e) => setNewCategory(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="mr-2 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategories
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  placeholder="Add subcategory..."
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubcategory())}
                  className="flex-1 admin-input"
                />
                <button
                  onClick={addSubcategory}
                  className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {newCategory.subcategories.map((sub, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-800 text-sm rounded-full"
                  >
                    {sub}
                    <button
                      onClick={() => removeSubcategory(sub)}
                      className="ml-2 text-emerald-600 hover:text-emerald-800"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCategory}
              className="flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <Save size={16} className="mr-2" />
              Create Category
            </button>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="admin-card overflow-hidden">
        <DndProvider backend={HTML5Backend}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subcategories
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayCategories.map((category, index) => (
                  <DraggableCategory key={category.id} category={category} index={index} />
                ))}
              </tbody>
            </table>
          </div>
        </DndProvider>

        {displayCategories.length === 0 && (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first category to organize your content.
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Create Category
            </button>
          </div>
        )}
      </div>

      {/* Category Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="admin-card p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {displayCategories.length}
          </div>
          <p className="text-gray-600">Total Categories</p>
        </div>
        
        <div className="admin-card p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {displayCategories.reduce((acc, cat) => acc + cat.subcategories.length, 0)}
          </div>
          <p className="text-gray-600">Total Subcategories</p>
        </div>
        
        <div className="admin-card p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {displayCategories.filter(cat => cat.isActive).length}
          </div>
          <p className="text-gray-600">Active Categories</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CategoriesPage;
