import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Clock, Search, Filter, Loader2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  featured: boolean;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of Virtual Events: Trends and Technologies',
    excerpt: 'Explore how virtual and hybrid events are reshaping the industry with cutting-edge technologies and innovative engagement strategies.',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    readTime: '5 min read',
    category: 'Technology',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: true
  },
  {
    id: '2',
    title: 'Creating Memorable Event Experiences',
    excerpt: 'Learn the key principles of designing events that leave lasting impressions on attendees and drive meaningful connections.',
    author: 'Michael Chen',
    date: '2024-01-12',
    readTime: '7 min read',
    category: 'Strategy',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false
  },
  {
    id: '3',
    title: 'Sustainable Event Planning: A Complete Guide',
    excerpt: 'Discover practical strategies for organizing eco-friendly events that minimize environmental impact while maximizing attendee satisfaction.',
    author: 'Emma Rodriguez',
    date: '2024-01-10',
    readTime: '6 min read',
    category: 'Sustainability',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false
  },
  {
    id: '4',
    title: 'Maximizing ROI from Corporate Events',
    excerpt: 'Strategic approaches to measuring and improving the return on investment for your corporate events and conferences.',
    author: 'David Park',
    date: '2024-01-08',
    readTime: '8 min read',
    category: 'Business',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false
  }
];

const categories = ['All', 'Technology', 'Strategy', 'Sustainability', 'Business', 'Marketing', 'Networking'];

const BlogPageNew: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [blogPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(mockBlogPosts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setBreadcrumbs(['Blog']);
  }, [setBreadcrumbs]);

  useEffect(() => {
    filterPosts();
  }, [blogPosts, selectedCategory, searchTerm]);

  const filterPosts = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      let filtered = [...blogPosts];

      // Filter by category
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(post => 
          post.category.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      // Filter by search term
      if (searchTerm) {
        filtered = filtered.filter(post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Sort by date (newest first)
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setFilteredPosts(filtered);
      setIsLoading(false);
    }, 300);
  };

  const featuredPost = filteredPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tips, and trends from the world of event management
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            <Filter className="w-5 h-5 text-gray-500 mt-2" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && !searchTerm && (
          <div className="mb-16">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center space-x-6 mb-6 text-white/80">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <button className="group inline-flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-10 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 lg:h-80 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading articles...</p>
            </div>
          </div>
        ) : (selectedCategory === 'All' && !searchTerm ? regularPosts : filteredPosts).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(selectedCategory === 'All' && !searchTerm ? regularPosts : filteredPosts).map((post, index) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="group/btn inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium">
                      <span>Read</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No articles match your search for "${searchTerm}"`
                  : `No articles found in the ${selectedCategory} category`
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Load More Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPageNew;