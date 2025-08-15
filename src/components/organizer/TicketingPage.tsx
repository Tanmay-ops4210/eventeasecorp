import React from 'react';
import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Plus, Edit, Trash2, DollarSign, Users, Calendar, 
  TrendingUp, Eye, Settings, AlertCircle, CheckCircle,
  Loader2, BarChart3, Download, Filter
} from 'lucide-react';
import { OrganizerEvent, TicketType } from '../../types/organizerEvent';
import { organizerEventService } from '../../services/organizerEventService';

const TicketingPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [currentEvent, setCurrentEvent] = useState<OrganizerEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketType | null>(null);
  const [ticketFormData, setTicketFormData] = useState({
    name: '',
    description: '',
    price: 0,
    currency: 'USD',
    quantity: 100,
    saleStart: '',
    saleEnd: '',
    isActive: true,
    benefits: [] as string[],
    restrictions: [] as string[]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  React.useEffect(() => {
    setBreadcrumbs(['Ticketing']);
    loadEvents();
  }, [setBreadcrumbs]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await organizerEventService.getMyEvents();
      setEvents(eventsData);
      if (eventsData.length > 0 && !selectedEvent) {
        setSelectedEvent(eventsData[0].id);
        setCurrentEvent(eventsData[0]);
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEvent(eventId);
    const event = events.find(e => e.id === eventId);
    setCurrentEvent(event || null);
  };

  const handleTicketFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setTicketFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const resetTicketForm = () => {
    setTicketFormData({
      name: '',
      description: '',
      price: 0,
      currency: 'USD',
      quantity: 100,
      saleStart: '',
      saleEnd: '',
      isActive: true,
      benefits: [],
      restrictions: []
    });
    setEditingTicket(null);
    setErrors({});
  };

  const handleCreateTicket = () => {
    resetTicketForm();
    setShowTicketModal(true);
  };

  const handleEditTicket = (ticket: TicketType) => {
    setTicketFormData({
      name: ticket.name,
      description: ticket.description,
      price: ticket.price,
      currency: ticket.currency,
      quantity: ticket.quantity,
      saleStart: ticket.saleStart.split('T')[0],
      saleEnd: ticket.saleEnd.split('T')[0],
      isActive: ticket.isActive,
      benefits: ticket.benefits,
      restrictions: ticket.restrictions
    });
    setEditingTicket(ticket);
    setShowTicketModal(true);
  };

  const validateTicketForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!ticketFormData.name.trim()) newErrors.name = 'Ticket name is required';
    if (ticketFormData.price < 0) newErrors.price = 'Price cannot be negative';
    if (ticketFormData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';
    if (!ticketFormData.saleStart) newErrors.saleStart = 'Sale start date is required';
    if (!ticketFormData.saleEnd) newErrors.saleEnd = 'Sale end date is required';
    
    if (ticketFormData.saleStart && ticketFormData.saleEnd && 
        new Date(ticketFormData.saleStart) >= new Date(ticketFormData.saleEnd)) {
      newErrors.saleEnd = 'Sale end date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveTicket = async () => {
    if (!validateTicketForm() || !currentEvent) return;

    try {
      const ticketData = {
        ...ticketFormData,
        saleStart: new Date(ticketFormData.saleStart).toISOString(),
        saleEnd: new Date(ticketFormData.saleEnd).toISOString()
      };

      let result;
      if (editingTicket) {
        result = await organizerEventService.updateTicketType(currentEvent.id, editingTicket.id, ticketData);
      } else {
        result = await organizerEventService.createTicketType(currentEvent.id, ticketData);
      }

      if (result.success) {
        await loadEvents();
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
    
    if (confirm('Are you sure you want to delete this ticket type?')) {
      try {
        const result = await organizerEventService.deleteTicketType(currentEvent.id, ticketId);
        if (result.success) {
          await loadEvents();
          alert('Ticket type deleted successfully!');
        } else {
          alert(result.error || 'Failed to delete ticket type');
        }
      } catch (error) {
        alert('Failed to delete ticket type');
      }
    }
  };

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
    <>
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ticketing & Pricing</h1>
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
                
                {currentEvent.ticketTypes.length > 0 ? (
                  <div className="space-y-4">
                    {currentEvent.ticketTypes.map((ticket, index) => (
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
                                ticket.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {ticket.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-4">{ticket.description}</p>
                            
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
                                <p className="font-bold text-gray-900">{ticket.available}</p>
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
                                  className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                                  style={{ width: `${(ticket.sold / ticket.quantity) * 100}%` }}
                                />
                              </div>
                            </div>

                            <div className="text-sm text-gray-500">
                              <p>Sale Period: {new Date(ticket.saleStart).toLocaleDateString()} - {new Date(ticket.saleEnd).toLocaleDateString()}</p>
                            </div>
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
                    <span className="font-bold text-gray-900">{currentEvent?.totalTickets || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sold</span>
                    <span className="font-bold text-green-600">{currentEvent?.soldTickets || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Available</span>
                    <span className="font-bold text-blue-600">
                      {(currentEvent?.totalTickets || 0) - (currentEvent?.soldTickets || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-bold text-indigo-600">${currentEvent?.revenue.toLocaleString() || 0}</span>
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
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="font-bold text-gray-900">
                        {currentEvent?.analytics.conversionRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Page Views</p>
                      <p className="font-bold text-gray-900">{currentEvent?.analytics.views.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Registrations</p>
                      <p className="font-bold text-gray-900">{currentEvent?.analytics.registrations}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {/* Navigate to attendee management */}}
                    className="w-full flex items-center space-x-2 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <Users className="w-4 h-4" />
                    <span>Manage Attendees</span>
                  </button>
                  <button
                    onClick={() => {/* Navigate to analytics */}}
                    className="w-full flex items-center space-x-2 p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>View Analytics</span>
                  </button>
                  <button
                    onClick={() => {/* Export attendee list */}}
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-6">Create your first event to start managing tickets</p>
              <button
                onClick={() => setBreadcrumbs(['Event Builder'])}
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
                <h3 className="text-xl font-bold text-gray-900">
                  {editingTicket ? 'Edit Ticket Type' : 'Create Ticket Type'}
                </h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={ticketFormData.name}
                      onChange={handleTicketFormChange}
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
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        name="price"
                        value={ticketFormData.price}
                        onChange={handleTicketFormChange}
                        min="0"
                        step="0.01"
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
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
                    name="description"
                    value={ticketFormData.description}
                    onChange={handleTicketFormChange}
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
                      name="quantity"
                      value={ticketFormData.quantity}
                      onChange={handleTicketFormChange}
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
                      name="saleStart"
                      value={ticketFormData.saleStart}
                      onChange={handleTicketFormChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.saleStart ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.saleStart && <p className="text-red-500 text-sm mt-1">{errors.saleStart}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sale End *</label>
                    <input
                      type="date"
                      name="saleEnd"
                      value={ticketFormData.saleEnd}
                      onChange={handleTicketFormChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.saleEnd ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.saleEnd && <p className="text-red-500 text-sm mt-1">{errors.saleEnd}</p>}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={ticketFormData.isActive}
                      onChange={(e) => setTicketFormData(prev => ({ ...prev, isActive: e.target.checked }))}
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
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {editingTicket ? 'Update' : 'Create'} Ticket
                </button>
              </div>
            </div>
          </div>
        )}
       </div>
     </div>
    </>
  );
};

export default TicketingPage;