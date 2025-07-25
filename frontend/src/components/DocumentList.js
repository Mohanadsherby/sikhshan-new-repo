import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';

export default function DocumentList({
  filters,
  currentPage,
  documentsPerPage,
  onFilterChange,
  onSearch,
  onPageChange
}) {
  const [searchValue, setSearchValue] = useState(filters.search);

  const debouncedSearch = debounce((value) => {
    onSearch(value);
  }, 300);

  useEffect(() => {
    setSearchValue(filters.search);
  }, [filters.search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearch(value);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <select
          value={filters.course}
          onChange={(e) => onFilterChange('course', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Courses</option>
          <option value="cs101">CS101</option>
          <option value="math101">MATH101</option>
          <option value="phys101">PHYS101</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="flagged">Flagged</option>
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) => onFilterChange('dateRange', e.target.value)}
          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search documents..."
          className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Document List */}
      <div className="space-y-4">
        {/* This would be populated with actual documents */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">No documents found</p>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => onPageChange(-1)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <i className="fas fa-chevron-left mr-2"></i>
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {currentPage}
        </span>
        <button
          onClick={() => onPageChange(1)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Next
          <i className="fas fa-chevron-right ml-2"></i>
        </button>
      </div>
    </div>
  );
} 