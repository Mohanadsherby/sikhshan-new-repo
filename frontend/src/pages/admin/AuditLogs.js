"use client"

import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faSearch,
  faDownload,
  faUser,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle,
  faTrash,
  faChartBar,
  faClock,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons"
import {
  getAllAuditLogs,
  getAuditLogsWithFilters,
  getLogStatistics,
  downloadAuditLogs,
  getStatusColor,
  getStatusIcon,
  getActionDisplay,
  formatTimestamp,
  formatDuration,
} from "../../api/auditLogApi"

// Function to create test audit logs
const createTestAuditLogs = async () => {
  try {
    const response = await fetch('http://localhost:8081/api/audit-logs/test/create-sample-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      alert('Test audit logs created successfully!');
      window.location.reload(); // Refresh the page to show new logs
    } else {
      alert('Failed to create test logs');
    }
  } catch (error) {
    console.error('Error creating test logs:', error);
    alert('Error creating test logs');
  }
};

function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  })
  const [selectedAction, setSelectedAction] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedResourceType, setSelectedResourceType] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statistics, setStatistics] = useState({})
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [pageSize, setPageSize] = useState(20)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true)
        setError("")
        
        // Fetch logs with filters
        const filters = {}
        if (searchQuery) filters.searchTerm = searchQuery
        if (selectedAction !== "all") filters.action = selectedAction
        if (selectedStatus !== "all") filters.status = selectedStatus
        if (selectedResourceType !== "all") filters.resourceType = selectedResourceType
        if (dateRange.start) filters.startDate = new Date(dateRange.start).toISOString()
        if (dateRange.end) filters.endDate = new Date(dateRange.end).toISOString()
        
        const response = await getAuditLogsWithFilters(filters, currentPage, pageSize)
        const logsData = response.data
        
        setLogs(logsData.content || [])
        setFilteredLogs(logsData.content || [])
        setTotalPages(logsData.totalPages || 0)
        setTotalElements(logsData.totalElements || 0)
        
        // Fetch statistics
        const statsResponse = await getLogStatistics()
        setStatistics(statsResponse.data || {})
        
      } catch (error) {
        console.error('Error fetching audit logs:', error)
        setError("Failed to load audit logs. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [currentPage, pageSize, searchQuery, selectedAction, selectedStatus, selectedResourceType, dateRange])

  // Remove the old filtering useEffect since we're now filtering on the backend

  // Use utility functions from API
  const getStatusIconComponent = (status) => {
    const iconName = getStatusIcon(status)
    switch (iconName) {
      case "check-circle":
        return faCheckCircle
      case "exclamation-triangle":
        return faExclamationTriangle
      case "exclamation-circle":
        return faExclamationCircle
      case "information-circle":
        return faInfoCircle
      default:
        return faInfoCircle
    }
  }

  const handleExport = async () => {
    try {
      const filters = {}
      if (searchQuery) filters.searchTerm = searchQuery
      if (selectedAction !== "all") filters.action = selectedAction
      if (selectedStatus !== "all") filters.status = selectedStatus
      if (selectedResourceType !== "all") filters.resourceType = selectedResourceType
      if (dateRange.start) filters.startDate = new Date(dateRange.start).toISOString()
      if (dateRange.end) filters.endDate = new Date(dateRange.end).toISOString()
      
      await downloadAuditLogs(filters)
    } catch (error) {
      console.error('Error exporting logs:', error)
      setError("Failed to export logs. Please try again.")
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize)
    setCurrentPage(0) // Reset to first page when changing page size
  }



  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <div className="flex gap-2">
          <button
            onClick={createTestAuditLogs}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={faChartBar} className="mr-2" />
            Create Test Data
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export Logs
          </button>
        </div>
        </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Bar */}
            <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faSearch} className="h-5 w-5 text-gray-400" />
            </div>
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <input
                type="date"
                value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

          {/* Action Filter */}
            <div>
              <select
                value={selectedAction}
                onChange={(e) => setSelectedAction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Actions</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="CREATE_USER">Create User</option>
              <option value="UPDATE_USER">Update User</option>
              <option value="DELETE_USER">Delete User</option>
              <option value="CREATE_COURSE">Create Course</option>
              <option value="UPDATE_COURSE">Update Course</option>
              <option value="DELETE_COURSE">Delete Course</option>
              <option value="CREATE_ASSIGNMENT">Create Assignment</option>
              <option value="UPDATE_ASSIGNMENT">Update Assignment</option>
              <option value="DELETE_ASSIGNMENT">Delete Assignment</option>
              <option value="CREATE_QUIZ">Create Quiz</option>
              <option value="UPDATE_QUIZ">Update Quiz</option>
              <option value="DELETE_QUIZ">Delete Quiz</option>
              <option value="SUBMIT_ASSIGNMENT">Submit Assignment</option>
              <option value="GRADE_ASSIGNMENT">Grade Assignment</option>
              <option value="TAKE_QUIZ">Take Quiz</option>
              <option value="GRADE_QUIZ">Grade Quiz</option>
              <option value="ENROLL_COURSE">Enroll Course</option>
              <option value="UNENROLL_COURSE">Unenroll Course</option>
              <option value="UPLOAD_FILE">Upload File</option>
              <option value="DELETE_FILE">Delete File</option>
              <option value="SYSTEM_BACKUP">System Backup</option>
              <option value="SYSTEM_RESTORE">System Restore</option>
              <option value="PASSWORD_CHANGE">Password Change</option>
              <option value="PROFILE_UPDATE">Profile Update</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="ERROR">Error</option>
              <option value="WARNING">Warning</option>
              <option value="INFO">Info</option>
            </select>
          </div>

          {/* Resource Type Filter */}
          <div>
            <select
              value={selectedResourceType}
              onChange={(e) => setSelectedResourceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="all">All Resources</option>
              <option value="USER">User</option>
              <option value="COURSE">Course</option>
              <option value="ASSIGNMENT">Assignment</option>
              <option value="QUIZ">Quiz</option>
              <option value="FILE">File</option>
              <option value="SYSTEM">System</option>
              </select>
            </div>
          </div>
        </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500 bg-opacity-10 text-blue-500">
              <FontAwesomeIcon icon={faChartBar} className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.totalLogs || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500 bg-opacity-10 text-green-500">
              <FontAwesomeIcon icon={faClock} className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recent (24h)</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.recentLogsCount || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-500 bg-opacity-10 text-red-500">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Errors</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.errorLogsCount || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-500 bg-opacity-10 text-yellow-500">
              <FontAwesomeIcon icon={faExclamationCircle} className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Failed Requests</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.failedRequestsCount || 0}</p>
            </div>
          </div>
        </div>
      </div>

        {/* Logs Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{log.username}</div>
                        {log.userId && (
                          <div className="text-xs text-gray-500">ID: {log.userId}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary bg-opacity-10 text-primary">
                      {getActionDisplay(log.action)}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                    <div>
                      <div>{log.details}</div>
                      {log.resourceType && log.resourceId && (
                        <div className="text-xs text-gray-400 mt-1">
                          {log.resourceType}: {log.resourceId}
                        </div>
                      )}
                      {log.executionTime && (
                        <div className="text-xs text-gray-400">
                          Duration: {formatDuration(log.executionTime)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center ${getStatusColor(log.status)}`}>
                      <FontAwesomeIcon icon={getStatusIconComponent(log.status)} className="mr-2" />
                        {log.status}
                      </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <div>{log.ipAddress || 'N/A'}</div>
                      {log.requestMethod && (
                        <div className="text-xs text-gray-400">{log.requestMethod}</div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl shadow-md p-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} results
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </select>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(totalPages - 5, currentPage - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border rounded-md text-sm ${
                        currentPage === pageNum
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}

export default AuditLogs 