import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Award, Handshake, Star, Globe, Users, Loader2, Play } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Sponsor, SponsorListResponse } from '../../types/sponsor';
import { sponsorService } from '../../services/sponsorService';

const tiers = ['All', 'Platinum', 'Gold', 'Silver', 'Bronze'];

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

const SponsorDirectoryPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [sponsorData, setSponsorData] = useState<SponsorListResponse | null>(null);
  const [selectedTier, setSelectedTier] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredSponsor, setHoveredSponsor] = useState<string | null>(null);

  React.useEffect(() => {
    setBreadcrumbs(['Sponsor Directory']);
  }, [setBreadcrumbs]);

  const loadSponsors = async (page: number = 1, tier: string = 'All', reset: boolean = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      const tierFilter = tier === 'All' ? undefined : tier;
      const response = await sponsorService.getSponsors(page, 12, tierFilter);

      if (reset || page === 1) {
        setSponsorData(response);
      } else {
        setSponsorData(prev => prev ? {
          ...response,
          sponsors: [...prev.sponsors, ...response.sponsors]
        } : response);
      }

      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load sponsors. Please try again.');
      console.error('Error loading sponsors:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    loadSponsors(1, selectedTier, true);
  }, [selectedTier]);

  const handleLoadMore = () => {
    if (sponsorData && sponsorData.hasMore && !isLoadingMore) {
      loadSponsors(currentPage + 1, selectedTier, false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadSponsors(1, selectedTier, true);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const searchResults = await sponsorService.searchSponsors(searchTerm);
      setSponsorData({
        sponsors: searchResults,
        hasMore: false,
        total: searchResults.length,
        page: 1,
        limit: searchResults.length
      });
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    loadSponsors(1, selectedTier, true);
  };

  if (isLoading && !sponsorData) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading sponsors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="text-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => loadSponsors(1, selectedTier, true)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Group sponsors by tier for display
  const platinumSponsors = sponsorData?.sponsors.filter(s => s.tier === 'platinum') || [];
  const goldSponsors = sponsorData?.sponsors.filter(s => s.tier === 'gold') || [];
  const silverSponsors = sponsorData?.sponsors.filter(s => s.tier === 'silver') || [];
  const bronzeSponsors = sponsorData?.sponsors.filter(s => s.tier === 'bronze') || [];

  const renderSponsorCard = (sponsor: Sponsor, size: 'large' | 'medium' | 'small') => {
    const isHovered = hoveredSponsor === sponsor.id;
    
    return (
      <div
        key={sponsor.id}
        className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden ${
          size === 'large' ? 'p-8' : size === 'medium' ? 'p-6' : 'p-4'
        }`}
        onMouseEnter={() => setHoveredSponsor(sponsor.id)}
        onMouseLeave={() => setHoveredSponsor(null)}
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className={`relative ${size === 'large' ? 'w-16 h-16' : size === 'medium' ? 'w-12 h-12' : 'w-10 h-10'}`}>
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className={`w-full h-full rounded-lg object-cover transition-all duration-300 ${
                isHovered ? 'scale-110 shadow-lg' : ''
              }`}
            />
            {sponsor.promotionalVideo && isHovered && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h4 className={`font-bold text-gray-900 ${size === 'large' ? 'text-xl' : 'text-lg'}`}>
              {sponsor.name}
            </h4>
            <p className="text-xs text-gray-500">{sponsor.industry}</p>
          </div>
          <div className={`px-3 py-1 bg-gradient-to-r ${tierColors[sponsor.tier]} text-white rounded-full text-xs font-medium`}>
            {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
          </div>
        </div>

        {size === 'large' && (
          <>
            <p className="text-gray-600 mb-4">{sponsor.description}</p>
            <div className="mb-4">
              <h5 className="font-semibold text-gray-900 mb-2">Partnership Benefits</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {sponsor.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index}>• {benefit}</li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium text-indigo-600 ${size === 'large' ? 'text-sm' : 'text-xs'}`}>
              {sponsor.partnership}
            </p>
            {sponsor.socialLinks.linkedin && (
              <div className="flex space-x-2 mt-2">
                <a
                  href={sponsor.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                  <span className="text-xs">LinkedIn</span>
                </a>
              </div>
            )}
          </div>
          <a
            href={sponsor.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm">Visit</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            SPONSORS & PARTNERS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're grateful to our amazing sponsors and partners who make our events possible and help us create exceptional experiences for our community.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search sponsors by name, industry, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Search
                </button>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* Tier Filter */}
          <div className="flex flex-wrap gap-3">
            <span className="text-sm font-medium text-gray-700 mt-2">Filter by Tier:</span>
            {tiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedTier === tier
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tier !== 'All' && tierIcons[tier.toLowerCase() as keyof typeof tierIcons]} {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Sponsors by Tier */}
        {!searchTerm && (
          <>
            {/* Platinum Sponsors */}
            {platinumSponsors.length > 0 && (selectedTier === 'All' || selectedTier === 'Platinum') && (
              <div className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
                    <span>{tierIcons.platinum}</span>
                    <span>Platinum Sponsors</span>
                  </h2>
                  <div className={`h-1 w-24 bg-gradient-to-r ${tierColors.platinum} mx-auto rounded-full`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {platinumSponsors.map((sponsor, index) => (
                    <div key={sponsor.id} style={{ animationDelay: `${index * 0.1}s` }}>
                      {renderSponsorCard(sponsor, 'large')}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gold Sponsors */}
            {goldSponsors.length > 0 && (selectedTier === 'All' || selectedTier === 'Gold') && (
              <div className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center space-x-2">
                    <span>{tierIcons.gold}</span>
                    <span>Gold Sponsors</span>
                  </h2>
                  <div className={`h-1 w-24 bg-gradient-to-r ${tierColors.gold} mx-auto rounded-full`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goldSponsors.map((sponsor, index) => (
                    <div key={sponsor.id} style={{ animationDelay: `${index * 0.1}s` }}>
                      {renderSponsorCard(sponsor, 'medium')}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Silver & Bronze Sponsors */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Silver Sponsors */}
              {silverSponsors.length > 0 && (selectedTier === 'All' || selectedTier === 'Silver') && (
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
                      <div key={sponsor.id} style={{ animationDelay: `${index * 0.1}s` }}>
                        {renderSponsorCard(sponsor, 'small')}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bronze Sponsors */}
              {bronzeSponsors.length > 0 && (selectedTier === 'All' || selectedTier === 'Bronze') && (
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
                      <div key={sponsor.id} style={{ animationDelay: `${index * 0.1}s` }}>
                        {renderSponsorCard(sponsor, 'small')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Search Results */}
        {searchTerm && sponsorData && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Search Results</h2>
            {sponsorData.sponsors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sponsorData.sponsors.map((sponsor, index) => (
                  <div key={sponsor.id} style={{ animationDelay: `${index * 0.1}s` }}>
                    {renderSponsorCard(sponsor, 'medium')}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="bg-white rounded-2xl p-12 shadow-lg">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No sponsors found</h3>
                  <p className="text-gray-600 mb-6">
                    No sponsors match your search for "{searchTerm}"
                  </p>
                  <button
                    onClick={clearSearch}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Load More Button */}
        {sponsorData && sponsorData.hasMore && !searchTerm && (
          <div className="text-center mb-12">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Load More Sponsors</span>
              )}
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center">
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

export default SponsorDirectoryPage;