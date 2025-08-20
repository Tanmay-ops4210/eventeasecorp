import React from 'react';
import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, BarChart3, TrendingUp, Eye, Download, Calendar,
  MessageCircle, Star, Award, ArrowUp, ArrowDown, Activity,
  Loader2, Plus, Mail, Phone, Globe
} from 'lucide-react';
import { SponsorDashboardStats, SponsorActivity } from '../../types/sponsorExhibitor';
import { sponsorExhibitorService } from '../../services/sponsorExhibitorService';

const SponsorDashboard: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { user } = useAuth();
  const [stats, setStats] = useState<SponsorDashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<SponsorActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setBreadcrumbs(['Dashboard']);
    loadDashboardData();
  }, [setBreadcrumbs]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsData, activityData] = await Promise.all([
        sponsorExhibitorService.getDashboardStats(),
        sponsorExhibitorService.getRecentActivity()
      ]);
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead_captured': return <Users className="w-4 h-4 text-blue-600" />;
      case 'booth_visit': return <Eye className="w-4 h-4 text-green-600" />;
      case 'brochure_download': return <Download className="w-4 h-4 text-purple-600" />;
      case 'video_view': return <Activity className="w-4 h-4 text-orange-600" />;
      case 'contact_made': return <MessageCircle className="w-4 h-4 text-indigo-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">Manage your sponsorship and track your event performance</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalLeads}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">+12.5%</span>
                <span className="text-gray-500 ml-1">vs last week</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Qualified Leads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.qualifiedLeads}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">+8.3%</span>
                <span className="text-gray-500 ml-1">vs last week</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Booth Visits</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.boothVisits}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-red-600 font-medium">-2.1%</span>
                <span className="text-gray-500 ml-1">vs last week</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">+5.2%</span>
                <span className="text-gray-500 ml-1">vs last week</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">{activity.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No recent activity</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setBreadcrumbs(['Virtual Booth Customization'])}
                  className="w-full flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                >
                  <Award className="w-5 h-5" />
                  <span>Customize Booth</span>
                </button>
                <button
                  onClick={() => setBreadcrumbs(['Lead Capture & Analytics'])}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Users className="w-5 h-5" />
                  <span>Manage Leads</span>
                </button>
                <button
                  onClick={() => setBreadcrumbs(['Attendee Interaction Tools'])}
                  className="w-full flex items-center space-x-3 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Attendee Tools</span>
                </button>
              </div>
            </div>

            {/* Performance Summary */}
            {stats && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lead Quality Score</span>
                    <span className="font-semibold text-gray-900">
                      {stats.totalLeads > 0 ? Math.round((stats.qualifiedLeads / stats.totalLeads) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Engagement Rate</span>
                    <span className="font-semibold text-gray-900">
                      {stats.boothVisits > 0 ? Math.round((stats.totalLeads / stats.boothVisits) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Resource Downloads</span>
                    <span className="font-semibold text-purple-600">{stats.brochureDownloads}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Video Views</span>
                    <span className="font-semibold text-orange-600">{stats.videoViews}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Support Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email Support</p>
                    <p className="font-medium text-gray-900">sponsor-support@eventease.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Support</p>
                    <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Help Center</p>
                    <a href="#" className="font-medium text-purple-600 hover:text-purple-700">
                      Visit Help Center
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDashboard;