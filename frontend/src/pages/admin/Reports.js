"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faDownload,
  faChartBar,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons"

function Reports() {
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  })

  const reports = [
    {
      id: "user-activity",
      name: "User Activity Report",
      description: "Comprehensive report of all user activities across the platform",
      icon: faChartBar,
    },
    {
      id: "course-performance",
      name: "Course Performance Report",
      description: "Analysis of course completion rates and student performance",
      icon: faChartBar,
    },
    {
      id: "system-usage",
      name: "System Usage Report",
      description: "Platform usage statistics and resource utilization",
      icon: faChartBar,
    },
  ]

  const handleGenerateReport = (reportId) => {
    // Here you would typically generate and download the report
    alert(`Generating ${reportId} report...`)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center mb-6">
          <FontAwesomeIcon icon={faChartBar} className="text-2xl text-primary mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        </div>

        {/* Date Range Filter */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Date Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Available Reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-full bg-primary bg-opacity-10 text-primary">
                  <FontAwesomeIcon icon={report.icon} className="h-6 w-6" />
                </div>
                <h3 className="ml-3 font-medium text-gray-800">{report.name}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">{report.description}</p>
              <button
                onClick={() => handleGenerateReport(report.id)}
                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Generate Report
              </button>
            </div>
          ))}
        </div>

        {/* Export Options */}
        <div className="mt-8 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Export Options</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center">
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
              Export as CSV
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center">
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
              Export as PDF
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 flex items-center">
              <FontAwesomeIcon icon={faFileExport} className="mr-2" />
              Export as Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports 