"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTimesCircle,
  faDownload,
  faFileAlt,
  faUsers,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons"

function GenerateReportModal({ isOpen, onClose }) {
  const [selectedReport, setSelectedReport] = useState("")
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = [
    {
      id: "user_activity",
      name: "User Activity Report",
      description: "Comprehensive report of all user activities across the platform",
      icon: faUsers,
    },
    {
      id: "course_enrollment",
      name: "Course Enrollment Report",
      description: "Enrollment statistics and trends for all courses",
      icon: faFileAlt,
    },
    {
      id: "system_performance",
      name: "System Performance Report",
      description: "System metrics, logs, and performance analytics",
      icon: faChartBar,
    },
  ]

  const handleGenerate = async () => {
    if (!selectedReport || !dateRange.start || !dateRange.end) {
      alert("Please select a report type and date range")
      return
    }

    setIsGenerating(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      // Mock download
      const link = document.createElement("a")
      link.href = "#"
      link.download = `${selectedReport}_${dateRange.start}_${dateRange.end}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      onClose()
    } catch (error) {
      alert("Failed to generate report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Generate Report</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="h-6 w-6" />
            </button>
          </div>

          {/* Report Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Report Type
            </label>
            <div className="space-y-3">
              {reportTypes.map((report) => (
                <div
                  key={report.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedReport === report.id
                      ? "border-primary bg-primary-50"
                      : "border-gray-200 hover:border-primary"
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <div className="flex items-start">
                    <FontAwesomeIcon
                      icon={report.icon}
                      className={`h-5 w-5 mt-1 ${
                        selectedReport === report.id ? "text-primary" : "text-gray-400"
                      }`}
                    />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-500">{report.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 flex items-center"
            >
              {isGenerating ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateReportModal 