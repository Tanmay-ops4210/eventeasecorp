import { Speaker, SpeakerListResponse } from '../types/speaker';

// Mock speaker data
const mockSpeakers: Speaker[] = [
  {
    id: '1',
    name: 'ZAWADI THANDWE',
    title: 'Chief Technology Officer',
    company: 'TechCorp Industries',
    bio: 'Professional with 20 years of experience helping brands reach their goals through innovative technology solutions and strategic leadership.',
    fullBio: `Zawadi Thandwe is a visionary technology leader with over two decades of experience in driving digital transformation and innovation across Fortune 500 companies. As the Chief Technology Officer at TechCorp Industries, she leads a team of 200+ engineers and data scientists in developing cutting-edge solutions that have revolutionized the industry.

Her expertise spans artificial intelligence, machine learning, cloud architecture, and enterprise software development. Zawadi has been instrumental in launching over 15 major technology initiatives that have generated over $500M in revenue for her organizations.

She holds a Ph.D. in Computer Science from MIT and an MBA from Stanford Graduate School of Business. Zawadi is a frequent keynote speaker at major technology conferences and has been featured in Forbes, TechCrunch, and Wired magazine.

When she's not revolutionizing technology, Zawadi mentors young women in STEM and serves on the board of several non-profit organizations focused on technology education in underserved communities.`,
    image: 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=800',
    expertise: ['Technology', 'Leadership', 'Innovation', 'AI/ML', 'Cloud Architecture'],
    location: 'San Francisco, CA',
    rating: 4.9,
    events: 25,
    featured: true,
    achievements: [
      'Forbes 40 Under 40 Technology Leader',
      'MIT Technology Review Innovator',
      'Women in Tech Leadership Award',
      'Patent holder for 12 technology innovations'
    ],
    upcomingEvents: [
      {
        id: '1',
        name: 'Tech Innovation Summit 2024',
        date: '2024-03-15',
        location: 'San Francisco, CA',
        topic: 'The Future of AI in Enterprise'
      },
      {
        id: '2',
        name: 'Digital Transformation Conference',
        date: '2024-04-20',
        location: 'New York, NY',
        topic: 'Leading Through Technology Change'
      }
    ],
    pastEvents: [
      {
        id: '3',
        name: 'Global Tech Leaders Forum',
        date: '2023-11-10',
        location: 'London, UK',
        topic: 'Building Scalable Tech Teams'
      },
      {
        id: '4',
        name: 'Innovation Summit Asia',
        date: '2023-09-15',
        location: 'Singapore',
        topic: 'AI Ethics and Governance'
      }
    ],
    socialLinks: {
      email: 'zawadi@techcorp.com',
      linkedin: 'https://linkedin.com/in/zawadi-thandwe',
      twitter: 'https://twitter.com/zawadi_tech',
      website: 'https://zawadi-thandwe.com'
    },
    sessions: [
      {
        id: '1',
        title: 'The Future of AI in Enterprise',
        description: 'Exploring how artificial intelligence is transforming business operations and decision-making processes.',
        date: '2024-03-15',
        time: '10:00 AM',
        duration: '45 minutes',
        room: 'Main Auditorium',
        eventId: '1',
        eventName: 'Tech Innovation Summit 2024'
      },
      {
        id: '2',
        title: 'Building Scalable Tech Teams',
        description: 'Strategies for recruiting, managing, and scaling technology teams in fast-growing organizations.',
        date: '2024-03-15',
        time: '2:30 PM',
        duration: '60 minutes',
        room: 'Conference Room A',
        eventId: '1',
        eventName: 'Tech Innovation Summit 2024'
      }
    ]
  },
  {
    id: '2',
    name: 'EJIRO RUDO',
    title: 'Senior Product Manager',
    company: 'Innovation Labs',
    bio: 'Skilled in problem solving, communication, and strategic thinking with a focus on user-centered design and product development.',
    fullBio: `Ejiro Rudo is a seasoned product management professional with over 12 years of experience building and launching successful digital products. Currently serving as Senior Product Manager at Innovation Labs, she leads cross-functional teams in developing cutting-edge solutions that serve millions of users worldwide.

Her expertise lies in user research, product strategy, agile development, and data-driven decision making. Ejiro has successfully launched over 20 products, including three that achieved unicorn status. She's particularly passionate about creating inclusive products that serve diverse user bases.

Ejiro holds an MBA from Wharton and a BS in Computer Science from Stanford. She's a regular contributor to Product Management publications and has spoken at over 30 conferences worldwide. She also mentors aspiring product managers through various industry programs.

Outside of work, Ejiro is an advocate for diversity in tech and serves on the advisory board of several organizations promoting women and underrepresented minorities in technology careers.`,
    image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=800',
    expertise: ['Product Management', 'Strategy', 'Design', 'User Research', 'Agile'],
    location: 'New York, NY',
    rating: 4.8,
    events: 18,
    featured: true,
    achievements: [
      'Product Manager of the Year 2023',
      'Top 100 Product Leaders',
      'Innovation in UX Design Award',
      'Diversity in Tech Leadership Recognition'
    ],
    upcomingEvents: [
      {
        id: '5',
        name: 'Product Management Conference',
        date: '2024-03-22',
        location: 'New York, NY',
        topic: 'Building Products Users Love'
      }
    ],
    pastEvents: [
      {
        id: '6',
        name: 'UX Design Summit',
        date: '2023-10-15',
        location: 'Austin, TX',
        topic: 'User-Centered Product Development'
      }
    ],
    socialLinks: {
      email: 'ejiro@innovationlabs.com',
      linkedin: 'https://linkedin.com/in/ejiro-rudo',
      twitter: 'https://twitter.com/ejiro_pm',
      website: 'https://ejiro-rudo.com'
    },
    sessions: [
      {
        id: '3',
        title: 'Building Products Users Love',
        description: 'A deep dive into user research methodologies and product development best practices.',
        date: '2024-03-22',
        time: '11:00 AM',
        duration: '50 minutes',
        room: 'Workshop Room B',
        eventId: '2',
        eventName: 'Product Management Conference'
      }
    ]
  },
  {
    id: '3',
    name: 'DANIEL SAOIRSE',
    title: 'Creative Director',
    company: 'Design Studio Pro',
    bio: 'Dedicated to crafting innovative solutions throughout the year with change-driven creativity and forward-thinking design approaches.',
    fullBio: `Daniel Saoirse is an award-winning creative director with 15 years of experience in brand design, digital experiences, and creative strategy. As Creative Director at Design Studio Pro, he leads a team of 50+ designers and creatives in developing brand identities and digital experiences for Fortune 500 companies.

His work has been recognized with numerous industry awards, including Cannes Lions, D&AD Pencils, and Webby Awards. Daniel's approach combines strategic thinking with innovative design to create memorable brand experiences that drive business results.

He holds a Master's in Design from RISD and has taught design thinking workshops at leading universities. Daniel is also a frequent speaker at design conferences and has been featured in design publications worldwide.

Daniel is passionate about sustainable design practices and leads initiatives to reduce the environmental impact of creative work. He also mentors emerging designers through various industry programs.`,
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=800',
    expertise: ['Design', 'Creativity', 'Innovation', 'Brand Strategy', 'Digital Experience'],
    location: 'Los Angeles, CA',
    rating: 4.7,
    events: 22,
    featured: false,
    achievements: [
      'Cannes Lions Gold Winner',
      'D&AD Pencil Award',
      'Webby Award for Best Design',
      'Design Leader of the Year 2023'
    ],
    upcomingEvents: [
      {
        id: '7',
        name: 'Creative Design Conference',
        date: '2024-04-10',
        location: 'Los Angeles, CA',
        topic: 'The Future of Brand Design'
      }
    ],
    pastEvents: [
      {
        id: '8',
        name: 'Design Thinking Workshop',
        date: '2023-09-20',
        location: 'San Francisco, CA',
        topic: 'Human-Centered Design Principles'
      }
    ],
    socialLinks: {
      email: 'daniel@designstudiopro.com',
      linkedin: 'https://linkedin.com/in/daniel-saoirse',
      twitter: 'https://twitter.com/daniel_design',
      website: 'https://daniel-saoirse.design'
    },
    sessions: [
      {
        id: '4',
        title: 'The Future of Brand Design',
        description: 'Exploring emerging trends and technologies shaping the future of brand identity and visual communication.',
        date: '2024-04-10',
        time: '9:30 AM',
        duration: '45 minutes',
        room: 'Design Studio',
        eventId: '3',
        eventName: 'Creative Design Conference'
      }
    ]
  }
];

class SpeakerService {
  private static instance: SpeakerService;
  private speakers: Speaker[] = mockSpeakers;

  static getInstance(): SpeakerService {
    if (!SpeakerService.instance) {
      SpeakerService.instance = new SpeakerService();
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
    return SpeakerService.instance;
  }

  async getSpeakers(page: number = 1, limit: number = 9, expertise?: string, sortBy: 'name' | 'rating' | 'events' = 'name'): Promise<SpeakerListResponse> {
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredSpeakers = [...this.speakers];

    if (expertise && expertise !== 'All') {
      filteredSpeakers = filteredSpeakers.filter(speaker =>
        speaker.expertise.includes(expertise)
      );
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

    // Sort speakers
    filteredSpeakers.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'events':
          return b.events - a.events;
        default:
          return 0;
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
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedSpeakers = filteredSpeakers.slice(startIndex, endIndex);

    return {
      speakers: paginatedSpeakers,
      hasMore: endIndex < filteredSpeakers.length,
      total: filteredSpeakers.length,
      page,
      limit
    };
  }

  async getSpeakerById(id: string): Promise<Speaker | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.speakers.find(speaker => speaker.id === id) || null;
  }

  async searchSpeakers(query: string, limit: number = 10): Promise<Speaker[]> {
    const searchTerm = query.toLowerCase();
    
    return this.speakers
      .filter(speaker => 
        speaker.name.toLowerCase().includes(searchTerm) ||
        speaker.title.toLowerCase().includes(searchTerm) ||
        speaker.company.toLowerCase().includes(searchTerm) ||
        speaker.expertise.some(exp => exp.toLowerCase().includes(searchTerm))
      )
      .slice(0, limit);
  }

  async getFeaturedSpeakers(): Promise<Speaker[]> {
    return this.speakers.filter(speaker => speaker.featured);
  }
}

export const speakerService = SpeakerService.getInstance();
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
