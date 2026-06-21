// src/components/search/SemanticSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import { searchAPI } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';
import SearchResults from './SearchResults';
import SearchFilters from './SearchFilters';

export default function SemanticSearch() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [filters, setFilters] = useState({
    topK: 5,
    minScore: 0
  });
  const inputRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Search API call
  const { data: results, loading, error, execute: performSearch } = useApi(
    () => searchAPI.semantic(query, filters.topK),
    [],
    { immediate: false }
  );

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Popular search queries
  const popularQueries = [
    'artificial intelligence',
    'machine learning',
    'natural language processing',
    'deep learning',
    'computer vision',
    'data science'
  ];

  // Auto-suggestions (mock - could be replaced with real API)
  useEffect(() => {
    if (query.length > 1) {
      const mockSuggestions = popularQueries
        .filter(q => q.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
      setSuggestions(mockSuggestions);
      setShowSuggestions(mockSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setSearchPerformed(true);
    setShowSuggestions(false);
    await performSearch();
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    // Auto-search on suggestion click
    setTimeout(() => {
      performSearch();
      setSearchPerformed(true);
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClear = () => {
    setQuery('');
    setSearchPerformed(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold">🔍 Semantic Search</h2>
        <p className="text-blue-100 mt-1">
          Ask questions and find answers from your knowledge base using AI-powered semantic search
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSearch} className="relative">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything from your knowledge base..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                disabled={loading}
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 transition flex items-center gap-2"
                    >
                      <span className="text-gray-400">🔍</span>
                      <span className="text-sm">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
            >
              {loading ? (
                <LoadingSpinner size="sm" message="Searching..." />
              ) : (
                <>
                  <span>🔍</span> Search
                </>
              )}
            </button>
            
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            )}
          </div>
          
          <p className="mt-2 text-xs text-gray-400">
            💡 Try asking about concepts from your uploaded documents
          </p>
        </form>

        {/* Popular Queries */}
        {!searchPerformed && !loading && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Popular searches:</p>
            <div className="flex flex-wrap gap-2">
              {popularQueries.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuery(q);
                    setTimeout(() => {
                      performSearch();
                      setSearchPerformed(true);
                    }, 100);
                  }}
                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <SearchFilters 
        filters={filters} 
        onFilterChange={handleFilterChange}
        disabled={loading}
      />

      {/* Results */}
      {searchPerformed && (
        <SearchResults 
          results={results}
          loading={loading}
          error={error}
          query={query}
          onRetry={performSearch}
        />
      )}
    </div>
  );
}