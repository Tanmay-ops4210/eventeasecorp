import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Plus, Trash2, DollarSign, 
  Ticket, Users, Calendar, Clock, Save, Eye,
  AlertTriangle, CheckCircle, Loader2, Settings,
  Percent, Hash, Globe
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  saleStart: string;
  saleEnd: string;
  isActive: boolean;
  benefits: string[];
  restrictions: string[];
  earlyBirdDiscount?: number;
  groupDiscountThreshold?: number;
  groupDiscountPercent?: number;
}

interface PricingSettings {
  currency: string;
  taxRate: number;
  processingFeePercent: number;
  refundPolicy: string;
  cancellationDeadline: number; // days before event
}

const TicketPricingPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { setBreadcrumbs } = useApp();
  
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [pricingSettings, setPricingSettings] = useState<PricingSettings>({
    currency: 'USD',
    taxRate: 0,
    processingFeePercent: 2.9,
    refundPolicy: 'Full refund available up to 7 days before the event',
    cancellationDeadline: 7
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  React.useEffect(() => {
    setBreadcrumbs(['Event Management', 'Ticket Pricing']);
    loadTicketData();
  }, [setBreadcrumbs, eventId]);

  const loadTicketData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock loading existing ticket data
      const mockTickets: TicketType[] = [
        {
          id: 'ticket_1',
          name: 'Early Bird',
          description: 'Limited time early bird pricing',
          price: 99,
          currency: 'USD',
          quantity: 100,
          saleStart: new Date().toISOString().slice(0, 16),
          saleEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          isActive: true,
          benefits: ['Early access to sessions', 'Welcome kit'],
          restrictions: ['Non-refundable', 'Limited quantity'],
          earlyBirdDiscount: 20
        }
      ];
      
      setTicketTypes(mockTickets);
    } catch (error) {
      console.error('Failed to load ticket data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTicketType = () => {
    const newTicket: TicketType = {
      id: `ticket_${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      currency: pricingSettings.currency,
      quantity: 100,
      saleStart: new Date().toISOString().slice(0, 16),
      saleEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      isActive: true,
      benefits: [],
      restrictions: []
    };
    setTicketTypes([...ticketTypes, newTicket]);
  };

  const updateTicketType = (index: number, field: keyof TicketType, value: any) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[index] = { ...updatedTickets[index], [field]: value };
    setTicketTypes(updatedTickets);
  };

  const removeTicketType = (index: number) => {
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const addBenefit = (ticketIndex: number, benefit: string) => {
    if (!benefit.trim()) return;
    const updatedTickets = [...ticketTypes];
    updatedTickets[ticketIndex].benefits.push(benefit.trim());
    setTicketTypes(updatedTickets);
  };

  const removeBenefit = (ticketIndex: number, benefitIndex: number) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[ticketIndex].benefits.splice(benefitIndex, 1);
    setTicketTypes(updatedTickets);
  };

  const addRestriction = (ticketIndex: number, restriction: string) => {
    if (!restriction.trim()) return;
    const updatedTickets = [...ticketTypes];
    updatedTickets[ticketIndex].restrictions.push(restriction.trim());
    setTicketTypes(updatedTickets);
  };

  const removeRestriction = (ticketIndex: number, restrictionIndex: number) => {
    const updatedTickets = [...ticketTypes];
    updatedTickets[ticketIndex].restrictions.splice(restrictionIndex, 1);
    setTicketTypes(updatedTickets);
  };

  const validateTickets = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (ticketTypes.length === 0) {
      newErrors.tickets = 'At least one ticket type is required';
    }

    ticketTypes.forEach((ticket, index) => {
      if (!ticket.name.trim()) {
        newErrors[`ticket_${index}_name`] = `Ticket ${index + 1} name is required`;
      }
      if (ticket.price < 0) {
        newErrors[`ticket_${index}_price`] = `Ticket ${index + 1} price cannot be negative`;
      }
      if (ticket.quantity < 1) {
        newErrors[`ticket_${index}_quantity`] = `Ticket ${index + 1} quantity must be at least 1`;
      }
      if (new Date(ticket.saleEnd) <= new Date(ticket.saleStart)) {
        newErrors[`ticket_${index}_saleEnd`] = `Ticket ${index + 1} sale end date must be after start date`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateTickets()) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Ticket pricing saved successfully!');
    } catch (error) {
      alert('Failed to save ticket pricing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validateTickets()) return;

    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Event published successfully! It will now appear in the Discover Events section.');
      navigate('/my-events');
    } catch (error) {
      alert('Failed to publish event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getTotalRevenue = () => {
    return ticketTypes.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  };

  const getTotalTickets = () => {
    return ticketTypes.reduce((total, ticket) => total + ticket.quantity, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading ticket pricing...</p>
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/organizer/event/${eventId}/edit`)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Event Details</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Ticket Pricing & Configuration</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Pricing</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Pricing Settings */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Settings className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Pricing Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={pricingSettings.currency}
                      onChange={(e) => setPricingSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={pricingSettings.taxRate}
                      onChange={(e) => setPricingSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      max="50"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Processing Fee (%)</label>
                    <input
                      type="number"
                      value={pricingSettings.processingFeePercent}
                      onChange={(e) => setPricingSettings(prev => ({ ...prev, processingFeePercent: parseFloat(e.target.value) || 0 }))}
                      min="0"
                      max="10"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="2.9"
                    />
                  </div>
                </div>
              </div>

              {/* Ticket Types */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Ticket className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-900">Ticket Types</h2>
                  </div>
                  <button
                    onClick={addTicketType}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Ticket Type</span>
                  </button>
                </div>

                {errors.tickets && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{errors.tickets}</p>
                  </div>
                )}

                {ticketTypes.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No ticket types created yet</p>
                    <button
                      onClick={addTicketType}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    >
                      Create Your First Ticket Type
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {ticketTypes.map((ticket, index) => (
                      <div key={ticket.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Ticket Type {index + 1}
                            {ticket.name && ` - ${ticket.name}`}
                          </h3>
                          <button
                            onClick={() => removeTicketType(index)}
                            className="text-red-600 hover:text-red-700 transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ticket Name</label>
                            <input
                              type="text"
                              value={ticket.name}
                              onChange={(e) => updateTicketType(index, 'name', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors[`ticket_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="e.g., Early Bird, VIP, General"
                            />
                            {errors[`ticket_${index}_name`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`ticket_${index}_name`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Price ({pricingSettings.currency})
                            </label>
                            <input
                              type="number"
                              value={ticket.price}
                              onChange={(e) => updateTicketType(index, 'price', parseFloat(e.target.value) || 0)}
                              min="0"
                              step="0.01"
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors[`ticket_${index}_price`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="0.00"
                            />
                            {errors[`ticket_${index}_price`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`ticket_${index}_price`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Available</label>
                            <input
                              type="number"
                              value={ticket.quantity}
                              onChange={(e) => updateTicketType(index, 'quantity', parseInt(e.target.value) || 0)}
                              min="1"
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors[`ticket_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="100"
                            />
                            {errors[`ticket_${index}_quantity`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`ticket_${index}_quantity`]}</p>
                            )}
                          </div>

                          <div>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={ticket.isActive}
                                onChange={(e) => updateTicketType(index, 'isActive', e.target.checked)}
                                className="text-indigo-600 focus:ring-indigo-500 rounded"
                              />
                              <span className="text-sm font-medium text-gray-700">Active for Sale</span>
                            </label>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={ticket.description}
                            onChange={(e) => updateTicketType(index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="What's included with this ticket?"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sale Start Date</label>
                            <input
                              type="datetime-local"
                              value={ticket.saleStart}
                              onChange={(e) => updateTicketType(index, 'saleStart', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Sale End Date</label>
                            <input
                              type="datetime-local"
                              value={ticket.saleEnd}
                              onChange={(e) => updateTicketType(index, 'saleEnd', e.target.value)}
                              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                                errors[`ticket_${index}_saleEnd`] ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                            {errors[`ticket_${index}_saleEnd`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`ticket_${index}_saleEnd`]}</p>
                            )}
                          </div>
                        </div>

                        {/* Benefits */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
                          <div className="space-y-2">
                            {ticket.benefits.map((benefit, benefitIndex) => (
                              <div key={benefitIndex} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="flex-1 text-sm text-gray-700">{benefit}</span>
                                <button
                                  onClick={() => removeBenefit(index, benefitIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                placeholder="Add a benefit"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addBenefit(index, e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                              <button
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                  addBenefit(index, input.value);
                                  input.value = '';
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Restrictions */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Restrictions</label>
                          <div className="space-y-2">
                            {ticket.restrictions.map((restriction, restrictionIndex) => (
                              <div key={restrictionIndex} className="flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4 text-orange-500" />
                                <span className="flex-1 text-sm text-gray-700">{restriction}</span>
                                <button
                                  onClick={() => removeRestriction(index, restrictionIndex)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                placeholder="Add a restriction"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addRestriction(index, e.currentTarget.value);
                                    e.currentTarget.value = '';
                                  }
                                }}
                              />
                              <button
                                onClick={(e) => {
                                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                  addRestriction(index, input.value);
                                  input.value = '';
                                }}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                              >
                                Add
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Refund Policy */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Refund Policy</h3>
                <textarea
                  value={pricingSettings.refundPolicy}
                  onChange={(e) => setPricingSettings(prev => ({ ...prev, refundPolicy: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Describe your refund policy and cancellation terms"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tickets</span>
                  <span className="font-medium text-gray-900">{getTotalTickets().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Potential Revenue</span>
                  <span className="font-medium text-gray-900">
                    {pricingSettings.currency} {getTotalRevenue().toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Ticket Types</span>
                  <span className="font-medium text-gray-900">
                    {ticketTypes.filter(t => t.isActive).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Range</span>
                  <span className="font-medium text-gray-900">
                    {ticketTypes.length > 0 ? (
                      `${pricingSettings.currency} ${Math.min(...ticketTypes.map(t => t.price))} - ${Math.max(...ticketTypes.map(t => t.price))}`
                    ) : (
                      'No tickets'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Ticket Preview */}
            {showPreview && ticketTypes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Preview</h3>
                <div className="space-y-3">
                  {ticketTypes.filter(t => t.isActive).map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">{ticket.name || 'Unnamed Ticket'}</h4>
                          <p className="text-sm text-gray-600">{ticket.description}</p>
                        </div>
                        <span className="font-bold text-indigo-600">
                          {pricingSettings.currency} {ticket.price}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {ticket.quantity} available
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publish Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Publish?</h3>
              
              {ticketTypes.length > 0 && Object.keys(errors).length === 0 ? (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-800 font-medium">Event is ready to publish</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      {ticketTypes.length} ticket type(s) configured
                    </p>
                  </div>
                  
                  <button
                    onClick={handlePublish}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                    <span>Publish Event Live</span>
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Once published, your event will be visible to attendees and they can start registering
                  </p>
                </div>
              ) : (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-800 font-medium">Complete setup to publish</span>
                  </div>
                  <p className="text-orange-700 text-sm mt-1">
                    {ticketTypes.length === 0 
                      ? 'Add at least one ticket type to publish your event'
                      : 'Fix the errors above to publish your event'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPricingPage;