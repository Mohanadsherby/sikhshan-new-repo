import React, { useState, useEffect } from 'react';
import DocumentList from './DocumentList';
import UploadModal from './UploadModal';
import Stats from './Stats';

export default function PlagiarismDetection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    course: 'all',
    status: 'all',
    dateRange: 'all',
    search: ''
  });

  const documentsPerPage = 3;
  const totalDocuments = 24;

  useEffect(() => {
    loadDocuments();
  }, [filters, currentPage]);

  const loadDocuments = () => {
    // This would typically fetch documents from an API
    console.log('Loading documents with filters:', filters);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
  };

  const handleSearch = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    setCurrentPage(1);
  };

  const handlePageChange = (delta) => {
    const newPage = currentPage + delta;
    const totalPages = Math.ceil(totalDocuments / documentsPerPage);
    
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Plagiarism Detection
        </h1>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          <i className="fas fa-upload mr-2"></i>
          Upload Document
        </button>
      </div>

      <Stats
        totalDocuments={totalDocuments}
        scannedDocuments={15}
        plagiarizedDocuments={3}
        averageSimilarity={25.5}
      />

      <DocumentList
        filters={filters}
        currentPage={currentPage}
        documentsPerPage={documentsPerPage}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
      />

      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={(file) => {
            console.log('Uploading file:', file);
            setIsUploadModalOpen(false);
          }}
        />
      )}
    </div>
  );
} 