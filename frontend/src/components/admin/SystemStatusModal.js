"use client"

import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faServer,
  faDatabase,
  faNetworkWired,
  faShieldAlt,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons"

function SystemStatusModal({ isOpen, onClose }) {
  const [systemStatus] = useState({
    server: { status: "operational", uptime: "99.9%", responseTime: "45ms" },
    database: { status: "operational", connections: 156, queriesPerSecond: 120 },
    network: { status: "operational", bandwidth: "1.2 Gbps", latency: "25ms" },
    security: { status: "operational", lastScan: "2 hours ago", threats: 0 },
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return "text-green-500"
      case "degraded":
        return "text-yellow-500"
      case "down":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "operational":
        return faCheckCircle
      case "degraded":
        return faExclamationTriangle
      case "down":
        return faTimesCircle
      default:
        return faCheckCircle
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">System Status</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Server Status */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faServer} className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Server Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`flex items-center ${getStatusColor(systemStatus.server.status)}`}>
                    <FontAwesomeIcon icon={getStatusIcon(systemStatus.server.status)} className="mr-2" />
                    {systemStatus.server.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Uptime</span>
                  <span className="text-gray-900">{systemStatus.server.uptime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Response Time</span>
                  <span className="text-gray-900">{systemStatus.server.responseTime}</span>
                </div>
              </div>
            </div>

            {/* Database Status */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faDatabase} className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Database Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`flex items-center ${getStatusColor(systemStatus.database.status)}`}>
                    <FontAwesomeIcon icon={getStatusIcon(systemStatus.database.status)} className="mr-2" />
                    {systemStatus.database.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Connections</span>
                  <span className="text-gray-900">{systemStatus.database.connections}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Queries/Second</span>
                  <span className="text-gray-900">{systemStatus.database.queriesPerSecond}</span>
                </div>
              </div>
            </div>

            {/* Network Status */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faNetworkWired} className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Network Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`flex items-center ${getStatusColor(systemStatus.network.status)}`}>
                    <FontAwesomeIcon icon={getStatusIcon(systemStatus.network.status)} className="mr-2" />
                    {systemStatus.network.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bandwidth</span>
                  <span className="text-gray-900">{systemStatus.network.bandwidth}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Latency</span>
                  <span className="text-gray-900">{systemStatus.network.latency}</span>
                </div>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faShieldAlt} className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Security Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`flex items-center ${getStatusColor(systemStatus.security.status)}`}>
                    <FontAwesomeIcon icon={getStatusIcon(systemStatus.security.status)} className="mr-2" />
                    {systemStatus.security.status}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Security Scan</span>
                  <span className="text-gray-900">{systemStatus.security.lastScan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Threats</span>
                  <span className="text-gray-900">{systemStatus.security.threats}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatusModal 