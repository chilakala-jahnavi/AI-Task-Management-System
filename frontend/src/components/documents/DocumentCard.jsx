// src/components/documents/DocumentCard.jsx
import React, { useState } from 'react';
import { useMutation } from '../../hooks/useApi';
import { documentAPI } from '../../api/endpoints';
import { ConfirmModal } from '../common/Modal';

export default function DocumentCard({ document, isAdmin, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const { mutate: deleteDocument, loading: deleting } = useMutation(
    () => documentAPI.delete(document.id),
    {
      onSuccess: () => {
        if (onDelete) onDelete();
        setShowDeleteModal(false);
      }
    }
  );

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch(ext) {
      case 'txt': return '📄';
      case 'pdf': return '📕';
      default: return '📄';
    }
  };

  const getFileColor = (filename) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch(ext) {
      case 'txt': return 'bg-blue-50 text-blue-600';
      case 'pdf': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition">
        {/* Icon and File Name */}
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${getFileColor(document.filename)}`}>
            <span className="text-2xl">{getFileIcon(document.filename)}</span>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 
              className="font-medium text-gray-800 hover:text-blue-600 cursor-pointer truncate"
              onClick={() => setShowDetails(true)}
            >
              {document.filename}
            </h4>
            
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="text-xs text-gray-500">
                📅 {formatDate(document.uploaded_at)}
              </span>
              <span className="text-xs text-gray-500">
                📊 {formatFileSize(document.file_size)}
              </span>
            </div>
            
            {document.is_processed !== undefined && (
              <div className="mt-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  document.is_processed 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {document.is_processed ? '✅ Processed' : '⏳ Processing'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3 pt-3 border-t flex gap-2">
          <button
            onClick={() => setShowDetails(true)}
            className="flex-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
          >
            👁️ View
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={deleting}
              className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteDocument}
        title="Delete Document"
        message={`Are you sure you want to delete "${document.filename}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />

      {/* Document Details Modal */}
      {showDetails && (
        <DocumentDetailsModal
          document={document}
          onClose={() => setShowDetails(false)}
          isAdmin={isAdmin}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

// Document Details Modal
const DocumentDetailsModal = ({ document, onClose, isAdmin, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { mutate: deleteDocument, loading: deleting } = useMutation(
    () => documentAPI.delete(document.id),
    {
      onSuccess: () => {
        if (onDelete) onDelete();
        setShowDeleteModal(false);
        onClose();
      }
    }
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">Document Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* File Icon and Name */}
            <div className="flex items-center gap-4">
              <div className="text-6xl">📄</div>
              <div>
                <h4 className="text-lg font-medium text-gray-800">{document.filename}</h4>
                <p className="text-sm text-gray-500">
                  Uploaded by User #{document.uploaded_by}
                </p>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-500">File Size</p>
                <p className="font-medium">{formatFileSize(document.file_size)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">File Type</p>
                <p className="font-medium uppercase">
                  {document.filename.split('.').pop() || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Uploaded At</p>
                <p className="font-medium">{formatDate(document.uploaded_at)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className={`font-medium ${
                  document.is_processed ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {document.is_processed ? '✅ Processed' : '⏳ Processing'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition"
              >
                Close
              </button>
              
              {isAdmin && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  🗑️ Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={deleteDocument}
        title="Delete Document"
        message={`Are you sure you want to delete "${document.filename}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </>
  );
};

// Helper functions
const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};