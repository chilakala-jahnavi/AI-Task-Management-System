// src/components/search/SearchResults.jsx
import React, { useState } from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function SearchResults({ results, loading, error, query, onRetry }) {
  const [expandedResult, setExpandedResult] = useState(null);

  if (loading) {
    return <LoadingSpinner message="Searching..." />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Search failed</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!results || results.results_count === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-6xl mb-4">🔎</div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">No results found</h3>
        <p className="text-gray-500">
          We couldn't find any relevant documents for "{query}"
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Try using different keywords or upload more documents
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-800">
              Found {results.results_count} results for "{query}"
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              Semantic search results ranked by relevance
            </p>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.results.map((result, index) => (
          <SearchResultItem
            key={index}
            result={result}
            index={index}
            isExpanded={expandedResult === index}
            onToggle={() => setExpandedResult(expandedResult === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}

// Individual Result Item
const SearchResultItem = ({ result, index, isExpanded, onToggle }) => {
  const getRelevanceColor = (score) => {
    if (score >= 0.7) return 'bg-green-100 text-green-800';
    if (score >= 0.4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-600';
  };

  const getRelevanceLabel = (score) => {
    if (score >= 0.7) return 'High Relevance';
    if (score >= 0.4) return 'Medium Relevance';
    return 'Low Relevance';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Rank */}
          <div className="flex-shrink-0 w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
            {index + 1}
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Document Name */}
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="h-4 w-4 text-gray-400" />
              <h4 className="font-medium text-gray-800 truncate">
                {result.filename}
              </h4>
            </div>
            
            {/* Content Preview */}
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {result.content_preview}
            </p>
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-3 mt-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRelevanceColor(result.relevance_score)}`}>
                {getRelevanceLabel(result.relevance_score)}
              </span>
              <span className="text-xs text-gray-400">
                Score: {(result.relevance_score * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          {/* Expand Button */}
          <button
            onClick={onToggle}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition"
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-5 w-5" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50 p-4">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Full Content</p>
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                {result.content_preview}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500">Document ID</p>
                <p className="text-sm font-medium">#{result.document_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Relevance Score</p>
                <p className="text-sm font-medium">{(result.relevance_score * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};