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
} from "@fortawesome/free-solid-svg-icons"

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        
        // Mock data
        const mockLogs = [
    {
      id: 1,
      timestamp: "2024-03-20T10:30:00",
      user: "John Doe",
      action: "login",
      details: "User logged in successfully",
      status: "success",
      ipAddress: "192.168.1.1",
    },
    {
      id: 2,
      timestamp: "2024-03-20T10:35:00",
      user: "Jane Smith",
      action: "create_course",
      details: "Created new course 'Introduction to Programming'",
      status: "success",
      ipAddress: "192.168.1.2",
    },
    {
      id: 3,
      timestamp: "2024-03-20T10:40:00",
      user: "Admin User",
      action: "delete_user",
      details: "Failed to delete user account",
      status: "error",
      ipAddress: "192.168.1.3",
    },
    {
      id: 4,
      timestamp: "2024-03-20T10:45:00",
      user: "System",
      action: "backup",
      details: "System backup completed",
      status: "info",
      ipAddress: "192.168.1.4",
    },
  ]
        
        setLogs(mockLogs)
        setFilteredLogs(mockLogs)
      } catch (error) {
        setError("Failed to load audit logs. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [])

  useEffect(() => {
    // Filter logs based on search query and filters
    const filtered = logs.filter((log) => {
      const matchesSearch = 
        log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesAction = selectedAction === "all" || log.action === selectedAction
      const matchesStatus = selectedStatus === "all" || log.status === selectedStatus
      
      const logDate = new Date(log.timestamp)
      const startDate = dateRange.start ? new Date(dateRange.start) : null
      const endDate = dateRange.end ? new Date(dateRange.end) : null
      
      const matchesDateRange = 
        (!startDate || logDate >= startDate) &&
        (!endDate || logDate <= endDate)
      
      return matchesSearch && matchesAction && matchesStatus && matchesDateRange
    })
    
    setFilteredLogs(filtered)
  }, [searchQuery, dateRange, selectedAction, selectedStatus, logs])

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return faCheckCircle
      case "error":
        return faExclamationTriangle
      case "info":
        return faInfoCircle
      default:
        return faInfoCircle
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-500"
      case "error":
        return "text-red-500"
      case "info":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  const handleExport = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Mock download
      const link = document.createElement("a")
      link.href = "#"
      link.download = `audit_logs_${new Date().toISOString()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      setError("Failed to export logs. Please try again.")
    }
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
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Export Logs
          </button>
        </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <option value="login">Login</option>
                <option value="create_course">Create Course</option>
                <option value="delete_user">Delete User</option>
              <option value="backup">Backup</option>
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
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="info">Info</option>
              </select>
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
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{log.user}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary bg-opacity-10 text-primary">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                    {log.details}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center ${getStatusColor(log.status)}`}>
                      <FontAwesomeIcon icon={getStatusIcon(log.status)} className="mr-2" />
                        {log.status}
                      </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          </div>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}

export default AuditLogs 