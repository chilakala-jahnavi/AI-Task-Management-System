import React, { useState } from 'react';

export default function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    setTimeout(() => {
      setResults([
        { document_id: 1, filename: 'sample.txt', content_preview: 'This is a sample document content...', relevance_score: 0.85 }
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold mb-4">🔍 Semantic Search</h2>
      
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything from your knowledge base..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {searched && (
        <div>
          <h3 className="text-sm text-gray-500 mb-3">
            Found {results.length} results
          </h3>
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No relevant documents found. Try a different query.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result, idx) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800">{result.filename}</h4>
                    <span className="text-xs text-gray-400">
                      Score: {(result.relevance_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{result.content_preview}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
