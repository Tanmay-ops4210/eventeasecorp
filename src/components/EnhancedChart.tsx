import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, BarChart3, TrendingUp, Users, Activity } from 'lucide-react';

interface ChartDataPoint {
  id: string;
  label: string;
  value: number;
  category: string;
  color: string;
  description?: string;
}

interface ChartPage {
  title: string;
  data: ChartDataPoint[];
  type: 'bar' | 'line' | 'flow' | 'pie';
}

const EnhancedChart: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const chartRef = useRef<HTMLDivElement>(null);

  // Sample data for different chart pages
  const chartPages: ChartPage[] = [
    {
      title: 'User Onboarding Flow',
      type: 'flow',
      data: [
        { id: '1', label: 'Onboarding Screens', value: 100, category: 'entry', color: 'bg-blue-500', description: 'Initial user experience' },
        { id: '2', label: 'Sign In', value: 85, category: 'auth', color: 'bg-indigo-500', description: 'User authentication' },
        { id: '3', label: 'Sign Up', value: 65, category: 'auth', color: 'bg-purple-500', description: 'New user registration' },
        { id: '4', label: 'Home', value: 90, category: 'main', color: 'bg-green-500', description: 'Main dashboard' },
        { id: '5', label: 'Choose a City', value: 75, category: 'selection', color: 'bg-teal-500', description: 'Location selection' }
      ]
    },
    {
      title: 'App Navigation Analytics',
      type: 'bar',
      data: [
        { id: '1', label: 'Home', value: 2450, category: 'navigation', color: 'bg-blue-500', description: 'Homepage visits' },
        { id: '2', label: 'Profile', value: 1890, category: 'navigation', color: 'bg-indigo-500', description: 'Profile page views' },
        { id: '3', label: 'Settings', value: 1200, category: 'navigation', color: 'bg-purple-500', description: 'Settings access' },
        { id: '4', label: 'Help Center', value: 890, category: 'navigation', color: 'bg-green-500', description: 'Support requests' },
        { id: '5', label: 'Account', value: 1560, category: 'navigation', color: 'bg-teal-500', description: 'Account management' }
      ]
    },
    {
      title: 'Feature Usage Trends',
      type: 'line',
      data: [
        { id: '1', label: 'Search', value: 3200, category: 'feature', color: 'bg-blue-500', description: 'Search functionality' },
        { id: '2', label: 'Filters', value: 2100, category: 'feature', color: 'bg-indigo-500', description: 'Filter usage' },
        { id: '3', label: 'Favorites', value: 1800, category: 'feature', color: 'bg-purple-500', description: 'Favorite items' },
        { id: '4', label: 'Sharing', value: 950, category: 'feature', color: 'bg-green-500', description: 'Content sharing' },
        { id: '5', label: 'Notifications', value: 1450, category: 'feature', color: 'bg-teal-500', description: 'Push notifications' }
      ]
    },
    {
      title: 'User Engagement Metrics',
      type: 'pie',
      data: [
        { id: '1', label: 'Daily Active', value: 45, category: 'engagement', color: 'bg-blue-500', description: 'Daily active users' },
        { id: '2', label: 'Weekly Active', value: 30, category: 'engagement', color: 'bg-indigo-500', description: 'Weekly active users' },
        { id: '3', label: 'Monthly Active', value: 15, category: 'engagement', color: 'bg-purple-500', description: 'Monthly active users' },
        { id: '4', label: 'Inactive', value: 10, category: 'engagement', color: 'bg-gray-400', description: 'Inactive users' }
      ]
    }
  ];

  const totalPages = chartPages.length;
  const currentChart = chartPages[currentPage];

  const handlePageChange = async (newPage: number) => {
    if (newPage < 0 || newPage >= totalPages || newPage === currentPage) return;
    
    setIsLoading(true);
    setAnimationKey(prev => prev + 1);
    
    // Simulate data loading
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCurrentPage(newPage);
    setIsLoading(false);
  };

  const getChartIcon = (type: string) => {
    switch (type) {
      case 'bar': return <BarChart3 className="w-5 h-5" />;
      case 'line': return <TrendingUp className="w-5 h-5" />;
      case 'flow': return <Activity className="w-5 h-5" />;
      case 'pie': return <Users className="w-5 h-5" />;
      default: return <BarChart3 className="w-5 h-5" />;
    }
  };

  const renderChart = () => {
    switch (currentChart.type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'flow':
        return renderFlowChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...currentChart.data.map(d => d.value));
    
    return (
      <div className="space-y-4">
        {currentChart.data.map((item, index) => (
          <div
            key={`${animationKey}-${item.id}`}
            className="chart-bar-item"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {item.value.toLocaleString()}
              </span>
            </div>
            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`chart-bar-fill h-full ${item.color} rounded-full relative`}
                style={{ 
                  width: `${(item.value / maxValue) * 100}%`,
                  animationDelay: `${index * 0.1 + 0.2}s`
                }}
              >
                <div className="absolute inset-0 bg-white/20 chart-bar-shine"></div>
              </div>
            </div>
            {item.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(...currentChart.data.map(d => d.value));
    const points = currentChart.data.map((item, index) => ({
      x: (index / (currentChart.data.length - 1)) * 100,
      y: 100 - (item.value / maxValue) * 80,
      ...item
    }));

    const pathData = points.map((point, index) => 
      `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    ).join(' ');

    return (
      <div className="relative">
        <svg className="w-full h-64 chart-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[20, 40, 60, 80].map(y => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="currentColor"
              strokeWidth="0.2"
              className="text-gray-300 dark:text-gray-600"
            />
          ))}
          
          {/* Area fill */}
          <path
            d={`${pathData} L 100 100 L 0 100 Z`}
            fill="url(#lineGradient)"
            className="chart-line-area"
          />
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="rgb(59, 130, 246)"
            strokeWidth="0.8"
            className="chart-line-path"
          />
          
          {/* Points */}
          {points.map((point, index) => (
            <circle
              key={`${animationKey}-point-${index}`}
              cx={point.x}
              cy={point.y}
              r="1.5"
              fill="rgb(59, 130, 246)"
              className="chart-line-point"
              style={{ animationDelay: `${index * 0.1 + 0.5}s` }}
            />
          ))}
        </svg>
        
        {/* Labels */}
        <div className="flex justify-between mt-4 text-xs text-gray-600 dark:text-gray-400">
          {currentChart.data.map((item, index) => (
            <div
              key={`${animationKey}-label-${index}`}
              className="text-center chart-label"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="font-medium">{item.label}</div>
              <div className="text-gray-500">{item.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFlowChart = () => {
    return (
      <div className="flow-chart-container">
        <div className="flow-chart-grid">
          {currentChart.data.map((item, index) => (
            <div
              key={`${animationKey}-flow-${item.id}`}
              className="flow-chart-node"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={`flow-node-content ${item.color}`}>
                <div className="flow-node-inner">
                  <h4 className="text-white font-semibold text-sm mb-1">
                    {item.label}
                  </h4>
                  <p className="text-white/80 text-xs">
                    {item.value}% completion
                  </p>
                </div>
                <div className="flow-node-progress">
                  <div 
                    className="flow-progress-bar"
                    style={{ 
                      width: `${item.value}%`,
                      animationDelay: `${index * 0.2 + 0.3}s`
                    }}
                  ></div>
                </div>
              </div>
              {index < currentChart.data.length - 1 && (
                <div className="flow-connector">
                  <div className="flow-arrow"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = currentChart.data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="flex items-center justify-center space-x-8">
        <div className="relative">
          <svg className="w-48 h-48 chart-pie-svg transform -rotate-90" viewBox="0 0 100 100">
            {currentChart.data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;

              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;

              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');

              return (
                <path
                  key={`${animationKey}-pie-${index}`}
                  d={pathData}
                  className={`chart-pie-slice ${item.color.replace('bg-', 'fill-')}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              );
            })}
          </svg>
        </div>
        
        <div className="space-y-3">
          {currentChart.data.map((item, index) => (
            <div
              key={`${animationKey}-legend-${index}`}
              className="flex items-center space-x-3 chart-legend-item"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.label}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {item.value}% ({item.description})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="enhanced-chart-container w-full">
      {/* Header */}
      <div className="chart-header">
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="chart-icon">
            {getChartIcon(currentChart.type)}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="chart-title">
              {currentChart.title}
            </h2>
            <p className="chart-subtitle hidden sm:block">
              Interactive data visualization with smooth animations
            </p>
          </div>
        </div>
        
        {/* Page Indicator */}
        <div className="page-indicator flex-shrink-0">
          <span className="page-info">
            Page {currentPage + 1} of {totalPages}
          </span>
        </div>
      </div>

      {/* Chart Content */}
      <div className="chart-content" ref={chartRef}>
        {isLoading ? (
          <div className="chart-loading">
            <div className="loading-spinner"></div>
            <p className="loading-text text-center">Loading chart data...</p>
          </div>
        ) : (
          <div className="chart-wrapper">
            {renderChart()}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0 || isLoading}
          className="pagination-btn pagination-prev"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </button>

        <div className="pagination-dots">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index)}
              disabled={isLoading}
              className={`pagination-dot ${
                index === currentPage ? 'active' : ''
              }`}
            >
              <span className="sr-only">Go to page {index + 1}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1 || isLoading}
          className="pagination-btn pagination-next"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EnhancedChart;