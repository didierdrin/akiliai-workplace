'use client';

import { useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  File, 
  Trash2, 
  Download, 
  Eye, 
  Search,
  Filter,
  Grid,
  List,
  FolderPlus
} from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import { useFileUpload } from '../../../hooks/useFirebaseAdmin';
import { toast } from 'react-hot-toast';

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  alt?: string;
}

const MediaPage = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [showUploader, setShowUploader] = useState(false);
  
  const { uploadFile, uploading } = useFileUpload();

  // Mock media files
  const mockFiles: MediaFile[] = [
    {
      id: '1',
      name: 'hero-image-tech.jpg',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      type: 'image',
      size: 245600,
      uploadedAt: '2025-01-07T10:30:00Z',
      uploadedBy: 'Admin',
      alt: 'Technology innovation concept'
    },
    {
      id: '2',
      name: 'market-chart.png',
      url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400',
      type: 'image',
      size: 189400,
      uploadedAt: '2025-01-07T09:15:00Z',
      uploadedBy: 'Editor',
      alt: 'Financial market charts'
    },
    {
      id: '3',
      name: 'climate-summit.jpg',
      url: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400',
      type: 'image',
      size: 312800,
      uploadedAt: '2025-01-06T16:45:00Z',
      uploadedBy: 'Author',
      alt: 'Climate summit meeting'
    },
    {
      id: '4',
      name: 'annual-report.pdf',
      url: '#',
      type: 'document',
      size: 1024000,
      uploadedAt: '2025-01-06T14:20:00Z',
      uploadedBy: 'Admin',
    },
  ];

  const displayFiles = files.length > 0 ? files : mockFiles;
  const filteredFiles = displayFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.alt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = fileTypeFilter === 'all' || file.type === fileTypeFilter;
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    
    for (const file of uploadedFiles) {
      try {
        const url = await uploadFile(file, 'media');
        const newFile: MediaFile = {
          id: Date.now().toString(),
          name: file.name,
          url,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' : 'document',
          size: file.size,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Admin',
        };
        setFiles(prev => [newFile, ...prev]);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    setSelectedFiles(
      selectedFiles.length === filteredFiles.length 
        ? [] 
        : filteredFiles.map(file => file.id)
    );
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Delete ${selectedFiles.length} selected files?`)) {
      setFiles(prev => prev.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
      toast.success(`${selectedFiles.length} files deleted`);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={20} className="text-blue-500" />;
      case 'video':
        return <File size={20} className="text-purple-500" />;
      case 'document':
        return <File size={20} className="text-green-500" />;
      default:
        return <File size={20} className="text-gray-500" />;
    }
  };

  return (
    <DashboardLayout title="Media Library" description="Manage images, videos, and documents">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search media files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent w-64"
            />
          </div>

          <select
            value={fileTypeFilter}
            onChange={(e) => setFileTypeFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="document">Documents</option>
          </select>

          <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-emerald-700 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-emerald-700 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {selectedFiles.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center px-4 py-2 text-red-700 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} className="mr-2" />
              Delete ({selectedFiles.length})
            </button>
          )}

          <label className="inline-flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer">
            <Upload size={16} className="mr-2" />
            {uploading ? 'Uploading...' : 'Upload Files'}
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* File Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="admin-card p-4 text-center">
          <ImageIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {displayFiles.filter(f => f.type === 'image').length}
          </div>
          <p className="text-sm text-gray-600">Images</p>
        </div>
        
        <div className="admin-card p-4 text-center">
          <File className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {displayFiles.filter(f => f.type === 'video').length}
          </div>
          <p className="text-sm text-gray-600">Videos</p>
        </div>
        
        <div className="admin-card p-4 text-center">
          <File className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {displayFiles.filter(f => f.type === 'document').length}
          </div>
          <p className="text-sm text-gray-600">Documents</p>
        </div>
        
        <div className="admin-card p-4 text-center">
          <FolderPlus className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">
            {formatFileSize(displayFiles.reduce((acc, file) => acc + file.size, 0))}
          </div>
          <p className="text-sm text-gray-600">Total Storage</p>
        </div>
      </div>

      {/* Files Display */}
      <div className="admin-card p-6">
        {selectedFiles.length > 0 && (
          <div className="flex items-center justify-between mb-4 p-3 bg-emerald-50 rounded-lg">
            <p className="text-emerald-800 font-medium">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
            </p>
            <button
              onClick={() => setSelectedFiles([])}
              className="text-emerald-700 hover:text-emerald-800 text-sm"
            >
              Clear selection
            </button>
          </div>
        )}

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                  selectedFiles.includes(file.id) 
                    ? 'border-emerald-500 bg-emerald-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSelectFile(file.id)}
              >
                {file.type === 'image' ? (
                  <img
                    src={file.url}
                    alt={file.alt || file.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                )}
                
                <div className="p-3">
                  <p className="font-medium text-sm truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                </div>

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100">
                      <Download size={16} />
                    </button>
                    <button className="p-2 bg-white text-red-600 rounded-full hover:bg-gray-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Selection indicator */}
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedFiles.includes(file.id) 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'bg-white border-gray-300'
                }`}>
                  {selectedFiles.includes(file.id) && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600">
              <input
                type="checkbox"
                checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                onChange={handleSelectAll}
                className="mr-4"
              />
              <div className="flex-1">Name</div>
              <div className="w-20">Type</div>
              <div className="w-20">Size</div>
              <div className="w-32">Uploaded</div>
              <div className="w-24">Actions</div>
            </div>

            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-center px-4 py-3 border rounded-lg hover:bg-gray-50 ${
                  selectedFiles.includes(file.id) ? 'bg-emerald-50 border-emerald-200' : 'border-gray-200'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => handleSelectFile(file.id)}
                  className="mr-4"
                />
                
                <div className="flex items-center flex-1 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="ml-3">
                    <p className="font-medium text-sm truncate">{file.name}</p>
                    {file.alt && <p className="text-xs text-gray-500 truncate">{file.alt}</p>}
                  </div>
                </div>
                
                <div className="w-20 text-sm text-gray-600 capitalize">
                  {file.type}
                </div>
                
                <div className="w-20 text-sm text-gray-600">
                  {formatFileSize(file.size)}
                </div>
                
                <div className="w-32 text-sm text-gray-600">
                  {new Date(file.uploadedAt).toLocaleDateString()}
                </div>
                
                <div className="w-24 flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-blue-600 p-1" title="Preview">
                    <Eye size={14} />
                  </button>
                  <button className="text-gray-400 hover:text-green-600 p-1" title="Download">
                    <Download size={14} />
                  </button>
                  <button className="text-gray-400 hover:text-red-600 p-1" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || fileTypeFilter !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Upload your first media files to get started.'
              }
            </p>
            <label className="inline-flex items-center px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer">
              <Upload size={16} className="mr-2" />
              Upload Files
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MediaPage;
