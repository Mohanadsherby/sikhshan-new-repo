import React, { useState } from 'react';

export default function UploadModal({ onClose, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [course, setCourse] = useState('cs101');
  const [documentType, setDocumentType] = useState('assignment');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Upload Document
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Course
            </label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="cs101">CS101 - Introduction to Programming</option>
              <option value="math101">MATH101 - Calculus I</option>
              <option value="phys101">PHYS101 - Physics Fundamentals</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="assignment">Assignment</option>
              <option value="research">Research Paper</option>
              <option value="lab">Lab Report</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              File
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <i className="fas fa-cloud-upload-alt text-gray-400 dark:text-gray-500 text-3xl"></i>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOC, DOCX up to 10MB
                </p>
                {selectedFile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 