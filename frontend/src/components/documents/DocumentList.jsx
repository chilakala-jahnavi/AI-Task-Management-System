// src/components/documents/DocumentList.jsx
import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { documentAPI } from '../../api/endpoints';
import LoadingSpinner from '../common/LoadingSpinner';
import DocumentCard from './DocumentCard';
import { useAuth } from '../../hooks/useAuth';

export default function DocumentList({ documents: propDocuments, loading: propLoading, onUpdate }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Use props if provided, otherwise fetch
  const { data: fetchedDocuments, loading: fetchLoading, refetch } = useApi(
    documentAPI.getAll,
    [],
    { enabled: !propDocuments }
  );

  const documents = propDocuments || fetchedDocuments || [];
  const isLoading = propLoading || fetchLoading;

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    if (!searchQuery) return true;
    return doc.filename.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDelete = () => {
    if (onUpdate) onUpdate();
    refetch();
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading documents..." />;
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
        <div className="text-6xl mb-4">📂</div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">No documents uploaded</h3>
        <p className="text-gray-500 mb-4">
          {user?.role === 'admin' 
            ? 'Upload your first document to build your knowledge base!' 
            : 'No documents available yet.'}
        </p>
        {user?.role === 'admin' && (
          <button
            onClick={() => document.getElementById('upload-trigger')?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
          >
            + Upload Document
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search documents..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-800"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
        </p>
        {user?.role === 'admin' && (
          <button
            onClick={() => document.getElementById('upload-trigger')?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
          >
            <span>+</span> Upload
          </button>
        )}
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            isAdmin={user?.role === 'admin'}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}