import React from 'react';
import { Calendar, User, ArrowRight, Clock } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
    title: 'Maximizing ROI from Corporate Events',
    excerpt: 'Strategic approaches to measuring and improving the return on investment for your corporate events and conferences.',
    author: 'David Park',
    date: '2024-01-08',
    readTime: '8 min read',
    category: 'Business',
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false
  },
  {
    id: 5,
    title: 'Event Marketing in the Digital Age',
    excerpt: 'Master the art of promoting your events across digital channels to reach and engage your target audience effectively.',
    author: 'Lisa Thompson',
    date: '2024-01-05',
    readTime: '4 min read',
    category: 'Marketing',
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false
  },
  {
    id: 6,
    title: 'Building Strong Speaker Relationships',
    excerpt: 'Tips and strategies for finding, engaging, and maintaining relationships with top-tier speakers for your events.',
    author: 'James Wilson',
    date: '2024-01-03',
    readTime: '5 min read',
    category: 'Networking',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600',
    featured: false
  }
];

const categories = ['All', 'Technology', 'Strategy', 'Sustainability', 'Business', 'Marketing', 'Networking'];

const BlogSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <section id="blog" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 mb-4">
            BLOG
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Insights, tips, and trends from the world of event management
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 text-sm sm:text-base touch-manipulation ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && (
          <div className="mb-12 sm:mb-16">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 mobile-hidden" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24 mobile-hidden" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      Featured
                    </span>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {featuredPost.category}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-white/90 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-4 sm:mb-6 text-white/80 text-sm sm:text-base">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <button className="group inline-flex items-center space-x-2 bg-white text-indigo-600 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 touch-manipulation text-sm sm:text-base">
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
                <div className="relative">
                  <div className="aspect-w-16 aspect-h-10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {(selectedCategory === 'All' ? regularPosts : filteredPosts).map((post, index) => (
            <article
              key={post.id}
              className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <span className="bg-indigo-100 text-indigo-600 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-xs sm:text-sm">{post.readTime}</span>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button className="group/btn inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm sm:text-base touch-manipulation">
                    <span>Read</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8 sm:mt-12">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl touch-manipulation text-sm sm:text-base">
            Load More Articles
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;