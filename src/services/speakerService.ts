import React, { useState, useEffect, useCallback } from 'react';
import { sponsorService } from '../../services/sponsorService';
import { Sponsor } from '../../types/sponsor';
import { debounce } from 'lodash';

const SponsorCard: React.FC<{ sponsor: Sponsor }> = ({ sponsor }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
    <div className="relative">
      <img className="w-full h-40 object-cover" src={sponsor.banner} alt={`${sponsor.name} banner`} />
      <div className={`absolute top-0 right-0 mt-2 mr-2 text-xs font-semibold px-2 py-1 rounded-full text-white ${
        sponsor.tier === 'platinum' ? 'bg-gray-800' : 
        sponsor.tier === 'gold' ? 'bg-yellow-500' : 
        'bg-gray-500'
      }`}>
        {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
      </div>
    </div>
    <div className="p-5">
      <div className="flex items-center mb-3">
        <img className="h-12 w-12 rounded-full object-contain mr-4 border-2 border-gray-200" src={sponsor.logo} alt={`${sponsor.name} logo`} />
        <h3 className="text-xl font-bold text-gray-800">{sponsor.name}</h3>
      </div>
      <p className="text-gray-600 text-sm mb-4">{sponsor.description}</p>
      <a 
        href={sponsor.website} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition-colors"
      >
        Visit Website
      </a>
    </div>
  </div>
);

const SponsorDirectoryPage: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const loadSponsors = useCallback(async (currentPage: number, currentTier: string) => {
    setLoading(true);
    try {
      const response = await sponsorService.getSponsors(currentPage, 12, currentTier);
      setSponsors(prev => currentPage === 1 ? response.sponsors : [...prev, ...response.sponsors]);
      setHasMore(response.hasMore);
    } catch (error) {
      console.error('Failed to fetch sponsors:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (query.length > 2) {
        setLoading(true);
        try {
          const results = await sponsorService.searchSponsors(query);
          setSponsors(results);
          setHasMore(false);
        } catch (error) {
          console.error("Failed to search sponsors:", error);
        } finally {
          setLoading(false);
        }
      } else if (query.length === 0) {
        setPage(1);
        loadSponsors(1, tierFilter);
      }
    }, 500),
    [tierFilter, loadSponsors]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    setPage(1);
    loadSponsors(1, tierFilter);
  }, [tierFilter, loadSponsors]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 100 || loading || !hasMore) {
      return;
    }
    setPage(prevPage => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);
  
  useEffect(() => {
      if(page > 1) {
          loadSponsors(page, tierFilter)
      }
  }, [page, tierFilter, loadSponsors])

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-center mb-4 text-gray-800">Our Valued Sponsors</h1>
        <p className="text-center text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          We are incredibly grateful for the support of our sponsors who make our events possible. Explore the companies and organizations that are committed to our community.
        </p>

        <div className="sticky top-0 bg-gray-50/90 backdrop-blur-sm z-10 py-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="text"
              placeholder="Search sponsors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/3"
            />
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="All">All Tiers</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sponsors.map(sponsor => (
            <SponsorCard key={sponsor.id} sponsor={sponsor} />
          ))}
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-500">Loading more sponsors...</p>
          </div>
        )}

        {!hasMore && !loading && (
          <div className="text-center py-8 mt-4 border-t">
            <p className="text-lg text-gray-500">You've reached the end of the list.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorDirectoryPage;
