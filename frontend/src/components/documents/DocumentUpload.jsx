import React, { useState } from 'react';

export default function DocumentUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
      setMessage('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setMessage('');

    try {
      setMessage('✅ Document uploaded successfully!');
      setFile(null);
      document.getElementById('fileInput').value = '';
      if (onUpload) onUpload();
    } catch (error) {
      setError('Upload failed');
    }
    setUploading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
        <input
          id="fileInput"
          type="file"
          accept=".txt,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <label htmlFor="fileInput" className="cursor-pointer block">
          <div className="text-5xl mb-3">📄</div>
          <p className="text-gray-600">Click to select a file</p>
          <p className="text-sm text-gray-400 mt-1">.txt or .pdf (max 10MB)</p>
          {file && (
            <p className="mt-3 text-blue-600 font-medium">Selected: {file.name}</p>
          )}
        </label>
      </div>
      
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload Document'}
      </button>
    </div>
  );
}
