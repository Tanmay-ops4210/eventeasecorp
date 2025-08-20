import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  BarChart3, TrendingUp, Users, Eye, Download, RefreshCw,
  ArrowUp, ArrowDown, Calendar, Globe, Loader2, Filter
} from 'lucide-react';
import { sponsorExhibitorService } from '../../services/sponsorExhibitorService';

const SponsorAnalyticsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  React.useEffect(() => {
    setBreadcrumbs(['Analytics & Performance']);
    loadAnalytics();
  }, [setBreadcrumbs, timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      const analyticsData = await sponsorExhibitorService.getDetailedAnalytics();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!analytics) return;
    
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange,
      analytics: analytics
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sponsor-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics & Performance</h1>
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <button
              onClick={loadAnalytics}
              className="p-2 text-gray-600 hover:text-purple-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportReport}
              disabled={!analytics}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Booth Visits</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.boothVisits}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+15.3%</span>
                  <span className="text-gray-500 ml-1">vs previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Leads Captured</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.leadsCaptured}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+22.7%</span>
                  <span className="text-gray-500 ml-1">vs previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resource Downloads</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.brochureDownloads}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Download className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+8.9%</span>
                  <span className="text-gray-500 ml-1">vs previous period</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.conversionRate.toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-red-600 font-medium">-3.2%</span>
                  <span className="text-gray-500 ml-1">vs previous period</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Visits Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Booth Visits</h2>
                <div className="space-y-4">
                  {analytics.dailyVisits.slice(-7).map((day: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {new Date(day.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                            style={{ width: `${(day.visits / 50) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8 text-right">
                          {day.visits}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lead Sources */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Lead Sources</h2>
                <div className="space-y-4">
                  {analytics.leadSources.map((source: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{source.source}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                            style={{ width: `${source.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">
                          {source.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Interests */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Popular Interests</h2>
                <div className="space-y-4">
                  {analytics.topInterests.map((interest: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{interest.interest}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                            style={{ width: `${(interest.count / 32) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8 text-right">
                          {interest.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Performance Insights</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Strong Performance</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Your booth visits are 15% above average for your tier
                    </p>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">Lead Quality</h4>
                    </div>
                    <p className="text-sm text-blue-700">
                      Your lead conversion rate is excellent at {analytics.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold text-orange-800">Engagement Tip</h4>
                    </div>
                    <p className="text-sm text-orange-700">
                      Consider adding more video content to increase engagement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SponsorAnalyticsPage;