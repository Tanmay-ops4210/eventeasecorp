import React from 'react';
import { ExternalLink, Award, Handshake, Star, Globe, Users } from 'lucide-react';
import Navigation from './Navigation';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
  description: string;
  website: string;
  industry: string;
  partnership: string;
}

interface Partner {
  id: string;
  name: string;
  logo: string;
  type: 'technology' | 'media' | 'community' | 'venue';
  description: string;
  website: string;
  collaboration: string;
}

interface SponsorsPartnersPageProps {
  isAuthenticated?: boolean;
  user?: any;
  onLogin?: () => void;
  onLogout?: () => void;
  onShowBlog?: () => void;
  onShowEvents?: () => void;
  onShowDashboard?: () => void;
}

const sponsors: Sponsor[] = [
  {
    id: '1',
    name: 'TechCorp Industries',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'platinum',
    description: 'Leading technology solutions provider specializing in enterprise software and cloud infrastructure.',
    website: 'https://techcorp.com',
    industry: 'Technology',
    partnership: 'Title Sponsor - Main Stage'
  },
  {
    id: '2',
    name: 'Innovation Labs',
    logo: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'gold',
    description: 'Research and development company focused on breakthrough innovations in AI and machine learning.',
    website: 'https://innovationlabs.com',
    industry: 'Research & Development',
    partnership: 'Innovation Showcase Sponsor'
  },
  {
    id: '3',
    name: 'Design Studio Pro',
    logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'gold',
    description: 'Creative design agency helping brands create memorable experiences through innovative design solutions.',
    website: 'https://designstudiopro.com',
    industry: 'Design & Creative',
    partnership: 'Design Workshop Sponsor'
  },
  {
    id: '4',
    name: 'Marketing Dynamics',
    logo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'silver',
    description: 'Digital marketing agency specializing in data-driven strategies and customer engagement solutions.',
    website: 'https://marketingdynamics.com',
    industry: 'Marketing',
    partnership: 'Networking Lounge Sponsor'
  },
  {
    id: '5',
    name: 'Strategic Solutions Inc',
    logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'silver',
    description: 'Business consulting firm helping organizations navigate complex challenges and drive growth.',
    website: 'https://strategicsolutions.com',
    industry: 'Consulting',
    partnership: 'Business Track Sponsor'
  },
  {
    id: '6',
    name: 'Green Future Corp',
    logo: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=200',
    tier: 'bronze',
    description: 'Sustainability consulting company focused on helping businesses create environmentally responsible practices.',
    website: 'https://greenfuture.com',
    industry: 'Sustainability',
    partnership: 'Eco-Friendly Initiatives Sponsor'
  }
];

const partners: Partner[] = [
  {
    id: '1',
    name: 'EventTech Platform',
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=200',
    type: 'technology',
    description: 'Cutting-edge event management platform providing seamless registration and attendee engagement tools.',
    website: 'https://eventtech.com',
    collaboration: 'Technology Infrastructure Partner'
  },
  {
    id: '2',
    name: 'Industry News Network',
    logo: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=200',
    type: 'media',
    description: 'Leading industry publication covering the latest trends, insights, and news in technology and business.',
    website: 'https://industrynews.com',
    collaboration: 'Official Media Partner'
  },
  {
    id: '3',
    name: 'Professional Network Hub',
    logo: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200',
    type: 'community',
    description: 'Global community of professionals fostering connections and knowledge sharing across industries.',
    website: 'https://professionalhub.com',
    collaboration: 'Community Outreach Partner'
  },
  {
    id: '4',
    name: 'Convention Center Alliance',
    logo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=200',
    type: 'venue',
    description: 'Premier venue management company operating world-class convention centers and event spaces.',
    website: 'https://conventionalliance.com',
    collaboration: 'Venue Partner'
  }
];

const tierColors = {
  platinum: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-300 to-yellow-500',
  silver: 'from-gray-200 to-gray-400',
  bronze: 'from-orange-300 to-orange-500'
};

const tierIcons = {
  platinum: '💎',
  gold: '🥇',
  silver: '🥈',
  bronze: '🥉'
};

const partnerTypeColors = {
  technology: 'bg-blue-100 text-blue-800',
  media: 'bg-purple-100 text-purple-800',
  community: 'bg-green-100 text-green-800',
  venue: 'bg-orange-100 text-orange-800'
};

const SponsorsPartnersPage: React.FC<SponsorsPartnersPageProps> = ({
  isAuthenticated = false,
  user = null,
  onLogin = () => {},
  onLogout = () => {},
  onShowBlog = () => {},
  onShowEvents = () => {},
  onShowDashboard = () => {}
}) => {
  const platinumSponsors = sponsors.filter(s => s.tier === 'platinum');
  const goldSponsors = sponsors.filter(s => s.tier === 'gold');
  const silverSponsors = sponsors.filter(s => s.tier === 'silver');
  const bronzeSponsors = sponsors.filter(s => s.tier === 'bronze');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        isAuthenticated={isAuthenticated}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
        onShowBlog={onShowBlog}
        onShowEvents={onShowEvents}
        onShowDashboard={onShowDashboard}
        currentPage="other"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            SPONSORS & PARTNERS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're grateful to our amazing sponsors and partners who make our events possible and help us create exceptional experiences for our community.
          </p>
        </div>

        {/* Sponsors Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">Our Sponsors</h2>
            <p className="text-lg text-gray-600">
              Thank you to our incredible sponsors for their support and partnership
            </p>
          </div>

          {/* Platinum Sponsors */}
          {platinumSponsors.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
                  <span>{tierIcons.platinum}</span>
                  <span>Platinum Sponsors</span>
                </h3>
                <div className={`h-1 w-24 bg-gradient-to-r ${tierColors.platinum} mx-auto rounded-full`} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {platinumSponsors.map((sponsor, index) => (
                  <div
                    key={sponsor.id}
                    className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-4 mb-6">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{sponsor.name}</h4>
                        <p className="text-sm text-gray-500">{sponsor.industry}</p>
                      </div>
                      <div className={`px-3 py-1 bg-gradient-to-r ${tierColors.platinum} text-white rounded-full text-xs font-medium ml-auto`}>
                        Platinum
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{sponsor.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-600">{sponsor.partnership}</p>
                      </div>
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="text-sm">Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gold Sponsors */}
          {goldSponsors.length > 0 && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
                  <span>{tierIcons.gold}</span>
                  <span>Gold Sponsors</span>
                </h3>
                <div className={`h-1 w-24 bg-gradient-to-r ${tierColors.gold} mx-auto rounded-full`} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goldSponsors.map((sponsor, index) => (
                  <div
                    key={sponsor.id}
                    className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900">{sponsor.name}</h4>
                        <p className="text-xs text-gray-500">{sponsor.industry}</p>
                      </div>
                      <div className={`px-2 py-1 bg-gradient-to-r ${tierColors.gold} text-white rounded-full text-xs font-medium`}>
                        Gold
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{sponsor.description}</p>
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-indigo-600">{sponsor.partnership}</p>
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                      >
                        <Globe className="w-3 h-3" />
                        <span className="text-xs">Visit Website</span>
                        <ExternalLink className="w-2 h-2" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Silver & Bronze Sponsors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Silver Sponsors */}
            {silverSponsors.length > 0 && (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
                    <span>{tierIcons.silver}</span>
                    <span>Silver Sponsors</span>
                  </h3>
                  <div className={`h-1 w-20 bg-gradient-to-r ${tierColors.silver} mx-auto rounded-full`} />
                </div>
                <div className="space-y-4">
                  {silverSponsors.map((sponsor, index) => (
                    <div
                      key={sponsor.id}
                      className="bg-white rounded-lg shadow-md p-4 transform hover:scale-105 transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{sponsor.name}</h4>
                          <p className="text-xs text-gray-500">{sponsor.partnership}</p>
                        </div>
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bronze Sponsors */}
            {bronzeSponsors.length > 0 && (
              <div>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
                    <span>{tierIcons.bronze}</span>
                    <span>Bronze Sponsors</span>
                  </h3>
                  <div className={`h-1 w-20 bg-gradient-to-r ${tierColors.bronze} mx-auto rounded-full`} />
                </div>
                <div className="space-y-4">
                  {bronzeSponsors.map((sponsor, index) => (
                    <div
                      key={sponsor.id}
                      className="bg-white rounded-lg shadow-md p-4 transform hover:scale-105 transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{sponsor.name}</h4>
                          <p className="text-xs text-gray-500">{sponsor.partnership}</p>
                        </div>
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Partners Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-indigo-900 mb-4">Our Partners</h2>
            <p className="text-lg text-gray-600">
              Collaborating with industry leaders to deliver exceptional experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner, index) => (
              <div
                key={partner.id}
                className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{partner.name}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${partnerTypeColors[partner.type]}`}>
                      {partner.type} Partner
                    </span>
                  </div>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
                <p className="text-gray-600 mb-3">{partner.description}</p>
                <p className="text-sm font-medium text-indigo-600">{partner.collaboration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
          <Handshake className="w-16 h-16 mx-auto mb-6 text-white" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Become a Sponsor or Partner</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community of forward-thinking organizations and help us create amazing experiences for thousands of attendees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105">
              Sponsorship Opportunities
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-indigo-600 transition-all duration-200 transform hover:scale-105">
              Partnership Inquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorsPartnersPage;