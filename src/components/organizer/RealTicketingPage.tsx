import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Plus, Edit, Trash2, DollarSign, Users, Calendar, 
  TrendingUp, Eye, Settings, AlertCircle, CheckCircle,
  Loader2, BarChart3, Download, Filter, X, Save
} from 'lucide-react';
import { realEventService, RealEvent, RealTicketType, TicketFormData } from '../../services/realEventService';

const RealTicketingPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { user } = useAuth();
  const [events, setEvents] = useState<RealEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [currentEvent, setCurrentEvent] = useState<RealEvent | null>(null);
  const [ticketTypes, setTicketTypes] = useState<RealTicketType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<RealTicketType | null>(null);
  const [ticketFormData, setTicketFormData] = useState<TicketFormData>({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    quantity: 100,
    sale_start: '',
    sale_end: '',
    is_active: true,
    benefits: [],
    restrictions: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [benefitsText, setBenefitsText] = useState('');
  const [restrictionsText, setRestrictionsText] = useState('');

  React.useEffect(() => {
    setBreadcrumbs(['Ticketing & Pricing']);
    loadEvents();
  }, [setBreadcrumbs, user]);

  const loadEvents = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const result = await realEventService.getMyEvents(user.id);
      if (result.success && result.events) {
        const publishedEvents = result.events.filter(e => e.status !== 'draft');
        setEvents(publishedEvents);
        if (publishedEvents.length > 0 && !selectedEvent) {
          setSelectedEvent(publishedEvents[0].id);
          setCurrentEvent(publishedEvents[0]);
          loadTicketTypes(publishedEvents[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTicketTypes = async (eventId: string) => {
    try {
      const result = await realEventService.getTicketTypes(eventId);
      if (result.success && result.tickets) {
        setTicketTypes(result.tickets);
      }
    } catch (error) {
      console.error('Failed to load ticket types:', error);
    }
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEvent(eventId);
    const event = events.find(e => e.id === eventId);
    setCurrentEvent(event || null);
    if (event) {
      loadTicketTypes(eventId);
    }
  };

  const handleTicketFormChange = (field: keyof TicketFormData, value: any) => {
    setTicketFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resetTicketForm = () => {
    setTicketFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      quantity: 100,
      sale_start: '',
      sale_end: '',
      is_active: true,
      benefits: [],
      restrictions: []
    });
    setBenefitsText('');
    setRestrictionsText('');
    setEditingTicket(null);
    setErrors({});
  };

  const handleCreateTicket = () => {
    resetTicketForm();
    // Set default dates
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    
    setTicketFormData(prev => ({
      ...prev,
      sale_start: today.toISOString().split('T')[0],
      sale_end: nextMonth.toISOString().split('T')[0]
    }));
    setShowTicketModal(true);
  };

  const handleEditTicket = (ticket: RealTicketType) => {
    setTicketFormData({
      name: ticket.name,
      description: ticket.description || '',
      price: ticket.price,
      currency: ticket.currency,
      quantity: ticket.quantity,
      sale_start: ticket.sale_start.split('T')[0],
      sale_end: ticket.sale_end.split('T')[0],
      is_active: ticket.is_active,
      benefits: ticket.benefits,
      restrictions: ticket.restrictions
    });
    setBenefitsText(ticket.benefits.join(', '));
    setRestrictionsText(ticket.restrictions.join(', '));
    setEditingTicket(ticket);
    setShowTicketModal(true);
  };

  const validateTicketForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!ticketFormData.name.trim()) newErrors.name = 'Ticket name is required';
    if (ticketFormData.price < 0) newErrors.price = 'Price cannot be negative';
    if (ticketFormData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (!ticketFormData.sale_start) newErrors.sale_start = 'Sale start date is required';
    if (!ticketFormData.sale_end) newErrors.sale_end = 'Sale end date is required';
    
    if (ticketFormData.sale_start && ticketFormData.sale_end && 
        new Date(ticketFormData.sale_start) >= new Date(ticketFormData.sale_end)) {
      newErrors.sale_end = 'Sale end date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTicket = async () => {
    if (!validateTicketForm() || !currentEvent) return;

    try {
      const finalTicketData: TicketFormData = {
        ...ticketFormData,
        benefits: benefitsText.split(',').map(b => b.trim()).filter(b => b),
        restrictions: restrictionsText.split(',').map(r => r.trim()).filter(r => r),
        sale_start: new Date(ticketFormData.sale_start).toISOString(),
        sale_end: new Date(ticketFormData.sale_end).toISOString()
      };

      let result;
      if (editingTicket) {
        result = await realEventService.updateTicketType(editingTicket.id, finalTicketData);
      } else {
        result = await realEventService.createTicketType(currentEvent.id, finalTicketData);
      }

      if (result.success) {
        await loadTicketTypes(currentEvent.id);
        setShowTicketModal(false);
        resetTicketForm();
        alert(`Ticket type ${editingTicket ? 'updated' : 'created'} successfully!`);
      } else {
        alert(result.error || 'Failed to save ticket type');
      }
    } catch (error) {
      alert('Failed to save ticket type');
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!currentEvent) return;
    
    if (confirm('Are you sure you want to delete this ticket type? This action cannot be undone.')) {
      try {
        const result = await realEventService.deleteTicketType(ticketId);
        if (result.success) {
          await loadTicketTypes(currentEvent.id);
          alert('Ticket type deleted successfully!');
        } else {
          alert(result.error || 'Failed to delete ticket type');
        }
      } catch (error) {
        alert('Failed to delete ticket type');
      }
    }
  };

  const totalTickets = ticketTypes.reduce((sum, ticket) => sum + ticket.quantity, 0);
  const totalSold = ticketTypes.reduce((sum, ticket) => sum + ticket.sold, 0);
  const totalRevenue = ticketTypes.reduce((sum, ticket) => sum + (ticket.sold * ticket.price), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading ticketing data...</p>
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
          <h1 className="text-4xl font-bold text-gray-900">Ticketing & Pricing</h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedEvent}
              onChange={(e) => handleEventChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select an event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <button
              onClick={handleCreateTicket}
              disabled={!currentEvent}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Add Ticket Type</span>
            </button>
          </div>
        </div>

        {currentEvent ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ticket Types */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Ticket Types</h2>
                
                {ticketTypes.length > 0 ? (
                  <div className="space-y-4">
                    {ticketTypes.map((ticket, index) => (
                      <div
                        key={ticket.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{ticket.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ticket.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {ticket.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            {ticket.description && (
                              <p className="text-gray-600 mb-4">{ticket.description}</p>
                            )}
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-500">Price</p>
                                <p className="font-bold text-gray-900">${ticket.price}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Sold</p>
                                <p className="font-bold text-gray-900">{ticket.sold}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Available</p>
                                <p className="font-bold text-gray-900">{ticket.quantity - ticket.sold}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Revenue</p>
                                <p className="font-bold text-gray-900">${(ticket.sold * ticket.price).toLocaleString()}</p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Sales Progress</span>
                                <span>{Math.round((ticket.sold / ticket.quantity) * 100)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(ticket.sold / ticket.quantity) * 100}%` }}
                                />
                              </div>
                            </div>

                            <div className="text-sm text-gray-500">
                              <p>Sale Period: {new Date(ticket.sale_start).toLocaleDateString()} - {new Date(ticket.sale_end).toLocaleDateString()}</p>
                            </div>

                            {/* Benefits and Restrictions */}
                            {(ticket.benefits.length > 0 || ticket.restrictions.length > 0) && (
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ticket.benefits.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Benefits:</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                      {ticket.benefits.map((benefit, idx) => (
                                        <li key={idx}>• {benefit}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {ticket.restrictions.length > 0 && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-700 mb-1">Restrictions:</p>
                                    <ul className="text-xs text-gray-600 space-y-1">
                                      {ticket.restrictions.map((restriction, idx) => (
                                        <li key={idx}>• {restriction}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEditTicket(ticket)}
                              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                              title="Edit Ticket"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteTicket(ticket.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                              title="Delete Ticket"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No ticket types yet</h3>
                    <p className="text-gray-600 mb-6">Create your first ticket type to start selling tickets</p>
                    <button
                      onClick={handleCreateTicket}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Create Ticket Type
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Analytics */}
            <div className="space-y-6">
              {/* Sales Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Tickets</span>
                    <span className="font-bold text-gray-900">{totalTickets}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sold</span>
                    <span className="font-bold text-green-600">{totalSold}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Available</span>
                    <span className="font-bold text-blue-600">{totalTickets - totalSold}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-bold text-indigo-600">${totalRevenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Sales Rate</p>
                      <p className="font-bold text-gray-900">
                        {totalTickets > 0 ? Math.round((totalSold / totalTickets) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Avg Ticket Price</p>
                      <p className="font-bold text-gray-900">
                        ${ticketTypes.length > 0 ? Math.round(ticketTypes.reduce((sum, t) => sum + t.price, 0) / ticketTypes.length) : 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Capacity Used</p>
                      <p className="font-bold text-gray-900">
                        {Math.round((totalSold / currentEvent.capacity) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setBreadcrumbs(['Attendee Management'])}
                    className="w-full flex items-center space-x-2 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Users className="w-4 h-4" />
                    <span>Manage Attendees</span>
                  </button>
                  <button
                    onClick={() => setBreadcrumbs(['Analytics & Reports'])}
                    className="w-full flex items-center space-x-2 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>View Analytics</span>
                  </button>
                  <button
                    onClick={() => {/* Export ticket data */}}
                    className="w-full flex items-center space-x-2 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Data</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No published events found</h3>
              <p className="text-gray-600 mb-6">Create and publish an event to start managing tickets</p>
              <button
                onClick={() => setBreadcrumbs(['Create Event'])}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Create Event
              </button>
            </div>
          </div>
        )}

        {/* Ticket Modal */}
        {showTicketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">
                    {editingTicket ? 'Edit Ticket Type' : 'Create Ticket Type'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowTicketModal(false);
                      resetTicketForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Name *</label>
                    <input
                      type="text"
                      value={ticketFormData.name}
                      onChange={(e) => handleTicketFormChange('name', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Early Bird, VIP, General"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <div className="relative">
                      <select
                        value={ticketFormData.currency}
                        onChange={(e) => handleTicketFormChange('currency', e.target.value)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-transparent border-none text-sm focus:ring-0 focus:outline-none"
                      >
                        <option value="USD">$</option>
                        <option value="EUR">€</option>
                        <option value="GBP">£</option>
                        <option value="INR">₹</option>
                      </select>
                      <input
                        type="number"
                        value={ticketFormData.price}
                        onChange={(e) => handleTicketFormChange('price', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={ticketFormData.description}
                    onChange={(e) => handleTicketFormChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe what's included with this ticket"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                    <input
                      type="number"
                      value={ticketFormData.quantity}
                      onChange={(e) => handleTicketFormChange('quantity', parseInt(e.target.value) || 0)}
                      min="1"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.quantity ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sale Start *</label>
                    <input
                      type="date"
                      value={ticketFormData.sale_start}
                      onChange={(e) => handleTicketFormChange('sale_start', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.sale_start ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.sale_start && <p className="text-red-500 text-sm mt-1">{errors.sale_start}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sale End *</label>
                    <input
                      type="date"
                      value={ticketFormData.sale_end}
                      onChange={(e) => handleTicketFormChange('sale_end', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.sale_end ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.sale_end && <p className="text-red-500 text-sm mt-1">{errors.sale_end}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                  <textarea
                    value={benefitsText}
                    onChange={(e) => setBenefitsText(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter benefits separated by commas (e.g., Early access, Welcome kit, Networking dinner)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple benefits with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Restrictions</label>
                  <textarea
                    value={restrictionsText}
                    onChange={(e) => setRestrictionsText(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter restrictions separated by commas (e.g., Non-refundable, Non-transferable)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple restrictions with commas</p>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={ticketFormData.is_active}
                      onChange={(e) => handleTicketFormChange('is_active', e.target.checked)}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Active (available for sale)</span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setShowTicketModal(false);
                    resetTicketForm();
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTicket}
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingTicket ? 'Update' : 'Create'} Ticket</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTicketingPage;