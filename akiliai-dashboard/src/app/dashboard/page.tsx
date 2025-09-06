'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Eye, 
  TrendingUp, 
  Calendar,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { useArticlesAdmin, useAnalytics } from '../../hooks/useFirebaseAdmin';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { articles } = useArticlesAdmin({ limit: 10 });
  const { analytics } = useAnalytics();
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data for development - replace with real analytics
  const mockStats = {
    totalArticles: 247,
    totalViews: 125640,
    totalUsers: 3547,
    avgReadTime: 4.2,
    todayViews: 8245,
    yesterdayViews: 7532,
    viewsGrowth: 9.5,
    articlesGrowth: 12.3,
    usersGrowth: 5.7,
    readTimeGrowth: -2.1
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f1f5f9',
        },
      },
      x: {
        grid: {
          color: '#f1f5f9',
        },
      },
    },
  };

  // Line chart data for page views
  const viewsChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Page Views',
        data: [12400, 13200, 11800, 14600, 16200, 15800, 17200],
        borderColor: '#047857',
        backgroundColor: 'rgba(4, 120, 87, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Bar chart data for top articles
  const topArticlesData = {
    labels: ['Tech Innovation', 'Market Update', 'Climate News', 'Politics Today', 'Health Report'],
    datasets: [
      {
        label: 'Views',
        data: [2400, 1800, 1600, 1400, 1200],
        backgroundColor: [
          '#047857',
          '#059669',
          '#10b981',
          '#34d399',
          '#6ee7b7'
        ],
      },
    ],
  };

  // Doughnut chart for traffic sources
  const trafficSourcesData = {
    labels: ['Direct', 'Google', 'Social Media', 'Referrals', 'Email'],
    datasets: [
      {
        data: [35, 28, 20, 12, 5],
        backgroundColor: [
          '#047857',
          '#059669',
          '#10b981',
          '#34d399',
          '#6ee7b7'
        ],
      },
    ],
  };

  const StatCard = ({ title, value, change, icon: Icon, trend }: {
    title: string;
    value: string;
    change: string;
    icon: any;
    trend: 'up' | 'down';
  }) => (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 bg-emerald-50 rounded-lg">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {trend === 'up' ? (
          <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change}%
        </span>
        <span className="text-sm text-gray-600 ml-2">vs last week</span>
      </div>
    </div>
  );

  const recentArticles = articles.slice(0, 5);

  return (
    <DashboardLayout 
      title="Dashboard Overview" 
      description="Monitor your content performance and site analytics"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Articles"
          value={mockStats.totalArticles.toLocaleString()}
          change={mockStats.articlesGrowth.toString()}
          icon={FileText}
          trend="up"
        />
        <StatCard
          title="Total Views"
          value={mockStats.totalViews.toLocaleString()}
          change={mockStats.viewsGrowth.toString()}
          icon={Eye}
          trend="up"
        />
        <StatCard
          title="Active Users"
          value={mockStats.totalUsers.toLocaleString()}
          change={mockStats.usersGrowth.toString()}
          icon={Users}
          trend="up"
        />
        <StatCard
          title="Avg. Read Time"
          value={`${mockStats.avgReadTime}m`}
          change={Math.abs(mockStats.readTimeGrowth).toString()}
          icon={Clock}
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Page Views Chart */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Page Views Trend</h3>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <Line data={viewsChartData} options={chartOptions} />
        </div>

        {/* Top Articles Chart */}
        <div className="admin-card p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Top Performing Articles</h3>
          <Bar data={topArticlesData} options={chartOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Traffic Sources */}
        <div className="admin-card p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Traffic Sources</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={trafficSourcesData} />
          </div>
        </div>

        {/* Recent Articles */}
        <div className="admin-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Recent Articles</h3>
            <a href="/dashboard/articles" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              View All
            </a>
          </div>
          <div className="space-y-4">
            {recentArticles.map((article, index) => (
              <div key={article.id || index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                    {article.title || `Sample Article ${index + 1}`}
                  </h4>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">
                      {article.author || 'Admin'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {article.publishDate || 'Jan 7, 2025'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      article.status === 'published' ? 'status-published' : 
                      article.status === 'draft' ? 'status-draft' : 'status-scheduled'
                    }`}>
                      {article.status || 'published'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {article.viewCount?.toLocaleString() || '1,234'} views
                  </p>
                  <p className="text-xs text-gray-500">
                    {article.readTime || '4 min read'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/dashboard/articles/new"
            className="flex items-center p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors group"
          >
            <FileText className="w-8 h-8 text-emerald-600 mr-3" />
            <div>
              <p className="font-medium text-emerald-900 group-hover:text-emerald-800">New Article</p>
              <p className="text-sm text-emerald-600">Create content</p>
            </div>
          </a>
          
          <a
            href="/dashboard/media"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
          >
            <Calendar className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-blue-900 group-hover:text-blue-800">Schedule Post</p>
              <p className="text-sm text-blue-600">Plan content</p>
            </div>
          </a>

          <a
            href="/dashboard/analytics"
            className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
          >
            <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-purple-900 group-hover:text-purple-800">View Analytics</p>
              <p className="text-sm text-purple-600">Track performance</p>
            </div>
          </a>

          <a
            href="/dashboard/users"
            className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
          >
            <Users className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="font-medium text-orange-900 group-hover:text-orange-800">Manage Users</p>
              <p className="text-sm text-orange-600">Admin access</p>
            </div>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
