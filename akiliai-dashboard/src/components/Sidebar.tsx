'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  FolderOpen,
  Image,
  Calendar,
  Tag,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  permissions?: string[];
  badge?: string | number;
}

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser, logout } = useAuth();

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/dashboard',
    },
    {
      id: 'articles',
      label: 'Articles',
      icon: FileText,
      href: '/dashboard/articles',
      permissions: ['read_articles'],
      badge: 12
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: FolderOpen,
      href: '/dashboard/categories',
      permissions: ['manage_categories'],
    },
    {
      id: 'media',
      label: 'Media Library',
      icon: Image,
      href: '/dashboard/media',
      permissions: ['upload_media'],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/dashboard/analytics',
      permissions: ['view_analytics'],
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      href: '/dashboard/users',
      permissions: ['manage_users'],
    },
    {
      id: 'calendar',
      label: 'Content Calendar',
      icon: Calendar,
      href: '/dashboard/calendar',
      permissions: ['schedule_content'],
    },
    {
      id: 'tags',
      label: 'Tags',
      icon: Tag,
      href: '/dashboard/tags',
      permissions: ['manage_tags'],
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      href: '/dashboard/security',
      permissions: ['admin_security'],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/settings',
      permissions: ['admin_settings'],
    }
  ];

  const filteredNavItems = navigationItems.filter(item => {
    if (!item.permissions) return true;
    return item.permissions.some(permission => 
      currentUser?.permissions.includes(permission)
    );
  });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-30 transition-all duration-300 ease-in-out
        gradient-emerald-sidebar text-white shadow-2xl
        ${collapsed ? 'w-16' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white border-opacity-20">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="font-display font-bold text-emerald-700">A</span>
              </div>
              <div>
                <h1 className="font-display text-lg font-bold">Akiliai</h1>
                <p className="text-xs text-emerald-100">Admin Dashboard</p>
              </div>
            </div>
          )}
          
          {/* Toggle buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-white border-opacity-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="font-semibold text-sm">
                {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
              </span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {currentUser?.displayName || 'Admin User'}
                </p>
                <p className="text-emerald-100 text-xs truncate">
                  {currentUser?.role?.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`
                      sidebar-nav-item flex items-center space-x-3 px-3 py-2.5 rounded-lg
                      transition-colors duration-200 group
                      ${isActive ? 'active bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}
                    `}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="font-medium text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto bg-white bg-opacity-30 text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white border-opacity-20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            <LogOut size={20} />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-emerald-700 text-white shadow-lg"
      >
        <Menu size={20} />
      </button>
    </>
  );
};

export default Sidebar;
