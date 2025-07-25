import React from 'react';

export default function Stats({
  totalDocuments,
  scannedDocuments,
  plagiarizedDocuments,
  averageSimilarity,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <i className="fas fa-file-alt text-blue-600 dark:text-blue-300"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Total Documents
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {totalDocuments}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <i className="fas fa-check-circle text-green-600 dark:text-green-300"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Scanned Documents
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {scannedDocuments}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
            <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-300"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Plagiarized Documents
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {plagiarizedDocuments}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <i className="fas fa-chart-line text-yellow-600 dark:text-yellow-300"></i>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Average Similarity
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {averageSimilarity.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 