'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Users, 
  Clock, 
  Globe,
  Calendar,
  Download
} from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';
import { Line, Bar, Doughnut, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Tooltip,
  Legend,
  Title,
);
import { useAnalytics } from '../../../hooks/useFirebaseAdmin';

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [reportType, setReportType] = useState('overview');
  
  // Mock analytics data - replace with real Firebase data
  const mockData = {
    pageViews: {
      total: 125640,
      change: 12.5,
      trend: 'up' as const
    },
    uniqueVisitors: {
      total: 45230,
      change: 8.2,
      trend: 'up' as const
    },
    avgSessionDuration: {
      total: '4:32',
      change: -2.1,
      trend: 'down' as const
    },
    bounceRate: {
      total: '42%',
      change: -5.3,
      trend: 'up' as const
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
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

  const pageViewsData = {
    labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'],
    datasets: [
      {
        label: 'Page Views',
        data: [12400, 13200, 11800, 14600, 16200, 15800, 17200],
        borderColor: '#047857',
        backgroundColor: 'rgba(4, 120, 87, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Unique Visitors',
        data: [8400, 9200, 8100, 10200, 11400, 11000, 12100],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const topArticlesData = {
    labels: ['AI Healthcare Revolution', 'Global Market Rally', 'Climate Agreement', 'Tech Innovation 2025', 'Political Analysis'],
    datasets: [
      {
        label: 'Views',
        data: [15420, 12350, 18900, 9800, 11200],
        backgroundColor: ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7'],
      },
    ],
  };

  const trafficSourcesData = {
    labels: ['Direct', 'Google Search', 'Social Media', 'Referrals', 'Email'],
    datasets: [
      {
        data: [35, 28, 20, 12, 5],
        backgroundColor: ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7'],
      },
    ],
  };

  const deviceTypeData = {
    labels: ['Desktop', 'Mobile', 'Tablet'],
    datasets: [
      {
        data: [45, 42, 13],
        backgroundColor: ['#047857', '#10b981', '#6ee7b7'],
      },
    ],
  };

  const StatCard = ({ title, value, change, trend, icon: Icon }: {
    title: string;
    value: string;
    change: number;
    trend: 'up' | 'down';
    icon: any;
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
        <TrendingUp 
          className={`w-4 h-4 mr-1 ${trend === 'up' ? 'text-green-500' : 'text-red-500'} ${trend === 'down' ? 'rotate-180' : ''}`} 
        />
        <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-600 ml-2">vs last period</span>
      </div>
    </div>
  );

  return (
    <DashboardLayout 
      title="Analytics Dashboard" 
      description="Monitor your website performance and user engagement"
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>

          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="overview">Overview</option>
            <option value="content">Content Performance</option>
            <option value="audience">Audience</option>
            <option value="traffic">Traffic Sources</option>
          </select>
        </div>

        <button className="flex items-center px-4 py-2 text-emerald-700 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors">
          <Download size={16} className="mr-2" />
          Export Report
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Page Views"
          value={mockData.pageViews.total.toLocaleString()}
          change={mockData.pageViews.change}
          trend={mockData.pageViews.trend}
          icon={Eye}
        />
        <StatCard
          title="Unique Visitors"
          value={mockData.uniqueVisitors.total.toLocaleString()}
          change={mockData.uniqueVisitors.change}
          trend={mockData.uniqueVisitors.trend}
          icon={Users}
        />
        <StatCard
          title="Avg. Session Duration"
          value={mockData.avgSessionDuration.total}
          change={mockData.avgSessionDuration.change}
          trend={mockData.avgSessionDuration.trend}
          icon={Clock}
        />
        <StatCard
          title="Bounce Rate"
          value={mockData.bounceRate.total}
          change={mockData.bounceRate.change}
          trend={mockData.bounceRate.trend}
          icon={BarChart3}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Page Views Trend */}
        <div className="admin-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">Traffic Overview</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={14} className="mr-1" />
              Last 7 days
            </div>
          </div>
          <Line data={pageViewsData} options={chartOptions} />
        </div>

        {/* Top Articles */}
        <div className="admin-card p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Top Performing Articles</h3>
          <Bar data={topArticlesData} options={chartOptions} />
        </div>

        {/* Traffic Sources */}
        <div className="admin-card p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Traffic Sources</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={trafficSourcesData} />
          </div>
        </div>

        {/* Device Types */}
        <div className="admin-card p-6">
          <h3 className="font-semibold text-gray-900 mb-6">Device Types</h3>
          <div className="h-64 flex items-center justify-center">
            <PolarArea data={deviceTypeData} />
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="admin-card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-4">
            {[
              { page: '/articles/ai-healthcare-revolution', views: 15420, bounce: '32%' },
              { page: '/articles/global-market-rally', views: 12350, bounce: '28%' },
              { page: '/articles/climate-agreement', views: 18900, bounce: '35%' },
              { page: '/categories/finance', views: 9800, bounce: '45%' },
              { page: '/articles/tech-innovation', views: 11200, bounce: '38%' },
            ].map((page, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm truncate">{page.page}</p>
                </div>
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Eye size={14} className="mr-1" />
                    {page.views.toLocaleString()}
                  </div>
                  <div className="text-right">
                    {page.bounce} bounce
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Data */}
        <div className="admin-card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Top Countries</h3>
          <div className="space-y-4">
            {[
              { country: 'United States', flag: '🇺🇸', visitors: 18500, percentage: 35 },
              { country: 'United Kingdom', flag: '🇬🇧', visitors: 12300, percentage: 23 },
              { country: 'Canada', flag: '🇨🇦', visitors: 8900, percentage: 17 },
              { country: 'Germany', flag: '🇩🇪', visitors: 6700, percentage: 13 },
              { country: 'France', flag: '🇫🇷', visitors: 6200, percentage: 12 },
            ].map((country, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{country.flag}</span>
                  <p className="font-medium text-gray-900 text-sm">{country.country}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600">
                    {country.visitors.toLocaleString()}
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600 w-10 text-right">
                    {country.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Activity */}
      <div className="admin-card p-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900">Real-time Activity</h3>
          <div className="flex items-center text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">127</div>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">8.4k</div>
            <p className="text-sm text-gray-600">Views Today</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">4:23</div>
            <p className="text-sm text-gray-600">Avg. Session</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">12</div>
            <p className="text-sm text-gray-600">New Articles</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
