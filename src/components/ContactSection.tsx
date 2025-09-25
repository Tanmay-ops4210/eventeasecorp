import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock, Globe, MessageCircle, Navigation } from 'lucide-react';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    details: 'tanmay365210mogabeera@gmail.com',
    description: 'Send us an email anytime',
    color: 'bg-blue-500'
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+91 8652601487',
    description: 'Mon-Fri from 8am to 6pm',
    color: 'bg-green-500'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    details: 'MHB colony Ambernath (w), Thane, Maharashtra',
    description: 'Come say hello at our office',
    color: 'bg-purple-500'
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: 'Mon-Fri: 8am-6pm',
    description: 'Weekend support available',
    color: 'bg-orange-500'
  }
];

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    eventType: 'conference'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
      eventType: 'conference'
    });
    setIsSubmitting(false);
  };

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse mobile-hidden" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/5 rounded-full animate-bounce mobile-hidden" style={{ animationDuration: '6s' }} />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/10 rounded-2xl animate-pulse transform rotate-45 mobile-hidden" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            CONTACT
          </h2>
          <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto px-4">
            Ready to create an amazing event? Let's talk about your vision and make it happen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Contact Information & Map */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Get In Touch</h3>
              <div className="space-y-4 sm:space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-3 sm:space-x-4 group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 ${info.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">{info.title}</h4>
                        <p className="text-white/90 font-medium text-sm sm:text-base">{info.details}</p>
                        <p className="text-white/70 text-xs sm:text-sm">{info.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Navigation className="w-5 h-5 text-white" />
                <h3 className="text-base sm:text-lg font-bold text-white">Our Location</h3>
              </div>
              <div className="bg-white/10 rounded-xl p-4 sm:p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                    <p className="text-white/80 text-xs sm:text-sm">MHB colony Ambernath (w), Thane, Maharashtra</p>
                  </div>
                </div>
                <div className="text-white/70 text-xs sm:text-sm space-y-1 sm:space-y-2">
                  <p>📍 Located in Ambernath, Thane district</p>
                  <p>🚇 Near Ambernath Railway Station</p>
                  <p>🅿️ Free parking available</p>
                </div>
              </div>
              <p className="text-white/80 text-xs sm:text-sm mt-3">
                Visit our office for in-person consultations
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Why Choose Us</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-sm sm:text-base">Events Planned</span>
                  <span className="text-white font-bold text-sm sm:text-base">500+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-sm sm:text-base">Happy Clients</span>
                  <span className="text-white font-bold text-sm sm:text-base">200+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-sm sm:text-base">Years Experience</span>
                  <span className="text-white font-bold text-sm sm:text-base">10+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90 text-sm sm:text-base">Team Members</span>
                  <span className="text-white font-bold text-sm sm:text-base">25+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl opacity-70 animate-pulse transform rotate-12 mobile-hidden" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-60 animate-bounce mobile-hidden" style={{ animationDuration: '3s' }} />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                  <MessageCircle className="w-8 h-8 text-indigo-600" />
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Send us a message</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                       autoComplete="name"
                        className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                       autoComplete="email"
                        className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                       autoComplete="organization"
                        className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                       autoComplete="tel"
                        className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                       autoComplete="off"
                        className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                        placeholder="What's this about?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                      <select
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base"
                      >
                        <option value="conference">Conference</option>
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                        <option value="networking">Networking Event</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 sm:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-base resize-none"
                      placeholder="Tell us about your event ideas, requirements, or any questions you have..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 touch-manipulation text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4" />
                      <span>Available Worldwide</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;