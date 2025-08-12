import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, ArrowLeft, Clock, Search, Filter, Loader2, MessageCircle, Share2, ThumbsUp, Tag } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { BlogArticle, BlogListResponse } from '../../types/blog';
import { blogService } from '../../services/blogService';

const categories = ['All', 'Technology', 'Strategy', 'Sustainability', 'Business', 'Marketing', 'Networking'];

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  avatar: string;
}

const BlogPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [currentView, setCurrentView] = useState<'list' | 'article'>('list');
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [blogData, setBlogData] = useState<BlogListResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  React.useEffect(() => {
    setBreadcrumbs(currentView === 'list' ? ['Blog'] : ['Blog', selectedArticle?.title || 'Article']);
  }, [setBreadcrumbs, currentView, selectedArticle]);

  const loadArticles = async (page: number = 1, category: string = 'All', reset: boolean = false) => {
    try {
      if (reset) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      const categoryFilter = category === 'All' ? undefined : category;
      const response = await blogService.getArticles(page, 6, categoryFilter);

      if (reset || page === 1) {
        setBlogData(response);
      } else {
        setBlogData(prev => prev ? {
          ...response,
          articles: [...prev.articles, ...response.articles]
        } : response);
      }

      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load articles. Please try again.');
      console.error('Error loading articles:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (currentView === 'list') {
      loadArticles(1, selectedCategory, true);
    }
  }, [selectedCategory, currentView]);

  const handleArticleClick = async (slug: string) => {
    try {
      setIsLoading(true);
      const article = await blogService.getArticleBySlug(slug);
      if (article) {
        setSelectedArticle(article);
        setCurrentView('article');
        
        // Load related articles and comments
        const [related, mockComments] = await Promise.all([
          blogService.getRelatedArticles(slug, 3),
          loadCommentsForArticle(article.id)
        ]);
        
        setRelatedArticles(related);
        setComments(mockComments);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError('Failed to load article.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedArticle(null);
    setRelatedArticles([]);
    setComments([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (blogData && blogData.hasMore && !isLoadingMore) {
      loadArticles(currentPage + 1, selectedCategory, false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadArticles(1, selectedCategory, true);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const searchResults = await blogService.searchArticles(searchTerm);
      setBlogData({
        articles: searchResults,
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
    loadArticles(1, selectedCategory, true);
  };

  const loadCommentsForArticle = async (articleId: string): Promise<Comment[]> => {
    // Mock comments data
    return [
      {
        id: '1',
        author: 'John Doe',
        content: 'Great article! Very insightful and well-written. Looking forward to implementing these strategies.',
        date: '2024-01-16',
        likes: 5,
        avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100'
      },
      {
        id: '2',
        author: 'Jane Smith',
        content: 'This really helped me understand the current trends. Thank you for sharing your expertise!',
        date: '2024-01-17',
        likes: 3,
        avatar: 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=100'
      }
    ];
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const handleShare = async () => {
    if (navigator.share && selectedArticle) {
      try {
        await navigator.share({
          title: selectedArticle.title,
          text: selectedArticle.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        navigator.clipboard.writeText(window.location.href);
        alert('Article URL copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article URL copied to clipboard!');
    }
  };

  if (currentView === 'article' && selectedArticle) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Article Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={handleBackToList}
              className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>
          </div>
        </div>

        {/* Article Content */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-medium">
                {selectedArticle.category}
              </span>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedArticle.publishedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {selectedArticle.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {selectedArticle.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedArticle.author}</p>
                  <p className="text-sm text-gray-500">Author</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-12">
            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
            />
          </div>

          {/* Tags */}
          {selectedArticle.tags && selectedArticle.tags.length > 0 && (
            <div className="mb-12 pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <Tag className="w-5 h-5 text-gray-500" />
                <div className="flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Social Share Buttons */}
          <div className="mb-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <span>LinkedIn</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200">
                <span>Twitter</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200">
                <span>Facebook</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span>More</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-12 pt-8 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <MessageCircle className="w-6 h-6 text-indigo-600" />
              <h3 className="text-lg font-semibold text-gray-900">Comments ({comments.length})</h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this article..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                />
                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-500">
                    Comments are moderated to prevent spam
                  </p>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-lg p-6 shadow-sm"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={comment.avatar}
                      alt={comment.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{comment.author}</h4>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{comment.likes}</span>
                        </button>
                        <button className="text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Related Articles</h2>
                <p className="text-gray-600">Continue reading with these related articles</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedArticles.map((article, index) => (
                  <article
                    key={article.id}
                    className="group bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
                    onClick={() => handleArticleClick(article.slug)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                          {article.category}
                        </span>
                        <span className="text-gray-500 text-sm">{article.readTime}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }

  // Blog List View
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            BLOG
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, tips, and trends from the world of event management
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
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

        {isLoading && !blogData ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading articles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => loadArticles(1, selectedCategory, true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : blogData && blogData.articles.length > 0 ? (
          <>
            {/* Featured Article */}
            {blogData.articles.find(article => article.featured) && selectedCategory === 'All' && !searchTerm && (
              <div className="mb-16">
                {(() => {
                  const featuredArticle = blogData.articles.find(article => article.featured)!;
                  return (
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
                              {featuredArticle.category}
                            </span>
                          </div>
                          <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                            {featuredArticle.title}
                          </h3>
                          <p className="text-white/90 text-lg mb-6 leading-relaxed">
                            {featuredArticle.excerpt}
                          </p>
                          <div className="flex items-center space-x-6 mb-6 text-white/80">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4" />
                              <span className="text-sm">{featuredArticle.author}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm">{new Date(featuredArticle.publishedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span className="text-sm">{featuredArticle.readTime}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleArticleClick(featuredArticle.slug)}
                            className="group inline-flex items-center space-x-2 bg-white text-indigo-600 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                          >
                            <span>Read Article</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                          </button>
                        </div>
                        <div className="relative">
                          <div className="aspect-w-16 aspect-h-10 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                            <img
                              src={featuredArticle.image}
                              alt={featuredArticle.title}
                              className="w-full h-64 lg:h-80 object-cover"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogData.articles.filter(article => !article.featured || selectedCategory !== 'All' || searchTerm).map((article, index) => (
                <article
                  key={article.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                  onClick={() => handleArticleClick(article.slug)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-sm">{article.readTime}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{article.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(article.publishedDate).toLocaleDateString()}</span>
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

            {/* Load More Button */}
            {blogData.hasMore && (
              <div className="text-center mt-12">
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
                    <span>Load More Articles</span>
                  )}
                </button>
              </div>
            )}
          </>
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
                  onClick={clearSearch}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;