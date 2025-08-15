import React from 'react';
import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  BarChart3, TrendingUp, Users, DollarSign, Eye, Calendar,
  Download, Filter, RefreshCw, Loader2, ArrowUp, ArrowDown
} from 'lucide-react';
import { OrganizerEvent } from '../../types/organizerEvent';
import { organizerEventService } from '../../services/organizerEventService';

const AnalyticsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  React.useEffect(() => {
    setBreadcrumbs(['Analytics & Reports']);
    loadEvents();
  }, [setBreadcrumbs]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await organizerEventService.getMyEvents();
      setEvents(eventsData.filter(e => e.status !== 'draft'));
      if (eventsData.length > 0 && !selectedEvent) {
        const firstEvent = eventsData[0];
        setSelectedEvent(firstEvent.id);
        loadAnalytics(firstEvent.id);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalytics = async (eventId: string) => {
    try {
      const analyticsData = await organizerEventService.getEventAnalytics(eventId);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEvent(eventId);
    loadAnalytics(eventId);
  };

  const handleExportReport = () => {
    if (!analytics) return;
    
    const reportData = {
      event: events.find(e => e.id === selectedEvent)?.title,
      generatedAt: new Date().toISOString(),
      analytics: analytics
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${selectedEvent}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const currentEvent = events.find(e => e.id === selectedEvent);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics & Reports</h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedEvent}
              onChange={(e) => handleEventChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <button
              onClick={() => loadAnalytics(selectedEvent)}
              className="p-2 text-gray-600 hover:text-indigo-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleExportReport}
              disabled={!analytics}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {currentEvent && analytics ? (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.views.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+12.5%</span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registrations</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.registrations}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+8.3%</span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.conversionRate.toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowDown className="w-4 h-4 text-red-600 mr-1" />
                  <span className="text-red-600 font-medium">-2.1%</span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">${currentEvent.revenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="w-4 h-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+15.7%</span>
                  <span className="text-gray-500 ml-1">vs last period</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ticket Sales Chart */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Ticket Sales by Type</h2>
                <div className="space-y-4">
                  {analytics.ticketSales.map((ticket: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${
                          index === 0 ? 'from-blue-500 to-blue-600' :
                          index === 1 ? 'from-green-500 to-green-600' :
                          index === 2 ? 'from-purple-500 to-purple-600' :
                          'from-orange-500 to-orange-600'
                        }`} />
                        <span className="font-medium text-gray-900">{ticket.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">{ticket.sold} sold</p>
                        <p className="text-sm text-gray-500">${ticket.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registration Timeline */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Registration Timeline</h2>
                <div className="space-y-3">
                  {analytics.dailyRegistrations.slice(-7).map((day: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {new Date(day.date).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                            style={{ width: `${(day.registrations / 20) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8 text-right">
                          {day.registrations}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Referrers */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Traffic Sources</h2>
                <div className="space-y-4">
                  {analytics.topReferrers.map((referrer: string, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{referrer}</span>
                      <span className="font-medium text-gray-900">
                        {Math.floor(Math.random() * 30) + 10}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attendee Geography */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Attendee Geography</h2>
                <div className="space-y-4">
                  {analytics.attendeeGeography.map((location: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{location.country}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                            style={{ width: `${(location.attendees / 50) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-6 text-right">
                          {location.attendees}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No analytics available</h3>
              <p className="text-gray-600 mb-6">
                {events.length === 0 
                  ? 'Create and publish an event to view analytics'
                  : 'Select an event to view its analytics'
                }
              </p>
              {events.length === 0 && (
                <button
                  onClick={() => setBreadcrumbs(['Event Builder'])}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Create Event
                </button>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
  );
};

export default AnalyticsPage;