import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { Check, Star, Users, Calendar } from 'lucide-react';
import NewAuthModal from '../auth/NewAuthModal';

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for small events and getting started',
    features: [
      'Up to 2 events per month',
      'Up to 50 attendees per event',
      'Basic event page',
      'Email support',
      'Basic analytics'
    ],
    icon: Users,
    color: 'from-gray-600 to-gray-700',
    maxEvents: '2 events/month',
    maxAttendees: '50 attendees'
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 49,
    period: 'month',
    description: 'Ideal for regular event organizers',
    features: [
      'Up to 10 events per month',
      'Up to 500 attendees per event',
      'Advanced customization',
      'Priority support',
      'Detailed analytics',
      'Custom branding',
      'Marketing tools'
    ],
    popular: true,
    icon: Star,
    color: 'from-indigo-600 to-purple-600',
    maxEvents: '10 events/month',
    maxAttendees: '500 attendees'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    period: 'month',
    description: 'For large organizations',
    features: [
      'Unlimited events',
      'Unlimited attendees',
      'White-label solution',
      'Dedicated support',
      'Advanced analytics',
      'Custom integrations',
      'API access',
      'Team management'
    ],
    icon: Calendar,
    color: 'from-purple-600 to-pink-600',
    maxEvents: 'Unlimited',
    maxAttendees: 'Unlimited'
  }
];

const SimplePricingPage: React.FC = () => {
  const { setBreadcrumbs, setCurrentView } = useApp();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string>('');

  React.useEffect(() => {
    setBreadcrumbs(['Pricing']);
  }, [setBreadcrumbs]);

  const handlePlanSelect = (planId: string) => {
    if (!isAuthenticated) {
      setSelectedPlan(planId);
      setShowAuthModal(true);
    } else {
      // User is already authenticated, handle plan upgrade
      alert(`Plan upgrade to ${planId} would be handled here`);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    // After successful auth, redirect to organizer dashboard
    setCurrentView('organizer-dashboard');
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            PRICING PLANS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the perfect plan for your event organizing needs. Start free and scale as you grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            
            return (
              <div
                onClick={() => handlePlanSelect(plan.id)}
                key={plan.id}
                className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden ${
                  plan.popular ? 'ring-2 ring-indigo-600' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-2 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 ml-1">/{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>{plan.maxEvents}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>{plan.maxAttendees}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.price === 0 ? 'Get Started Free' : 'Start Free Trial'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-600 mb-6">
            Contact our sales team to discuss enterprise plans and custom requirements
          </p>
          <button
            onClick={() => setCurrentView('contact')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Contact Sales
          </button>
        </div>
      </div>

      {/* Auth Modal for Plan Selection */}
      <NewAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleAuthSuccess}
        defaultRole="organizer"
        redirectTo="organizer-dashboard"
      />
    </div>
  );
};

export default SimplePricingPage;