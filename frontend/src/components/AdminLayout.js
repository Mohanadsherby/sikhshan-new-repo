"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import Sidebar from "./navigation/Sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBell,
  faCalendarAlt,
  faComments,
  faSignOutAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons"

function AdminLayout({ children }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/admin/login")
    } catch (error) {
      console.error("Failed to log out:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        <FontAwesomeIcon icon={faBars} className="h-5 w-5 text-gray-600" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className={`lg:ml-64 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
              </div>
              <div className="flex items-center space-x-2">
                {/* Calendar Link */}
                <button
                  onClick={() => navigate("/admin/calendar")}
                  className="p-2 text-gray-600 hover:text-primary focus:outline-none"
                  aria-label="Calendar"
                >
                  <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5" />
                </button>

                {/* Chat Link */}
                <button
                  onClick={() => navigate("/admin/chat")}
                  className="p-2 text-gray-600 hover:text-primary focus:outline-none"
                  aria-label="Chat"
                >
                  <FontAwesomeIcon icon={faComments} className="h-5 w-5" />
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-600 hover:text-primary focus:outline-none"
                    aria-label="Notifications"
                  >
                    <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                    {notifications.length > 0 && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                    )}
                  </button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-10">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-500">{notification.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-primary focus:outline-none"
                  aria-label="Logout"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout 