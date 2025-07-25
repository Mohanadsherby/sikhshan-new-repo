"use client"

import { useRef, useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import logo from "../../assets/images/logo.png"

// Helper to get the full profile picture URL
const getProfilePictureUrl = (url) => {
  if (!url) return "/placeholder-user.jpg";
  if (url.startsWith("http")) return url;
  return `http://localhost:8081${url}`;
};

// Helper to get the correct profile route based on role
const getProfileRoute = (role) => {
  if (role === "FACULTY") return "/faculty/profile";
  if (role === "SUPERADMIN") return "/admin/profile";
  return "/student/profile";
};

function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const profileRef = useRef(null);
  useEffect(() => {
    let timeoutId;
    // Close on outside click
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-close after 3 seconds
      timeoutId = setTimeout(() => setIsProfileOpen(false), 3000);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    logout();
    if (currentUser?.role === "SUPERADMIN") {
      navigate("/admin/login", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }

  // Mock notifications
  const notifications = [
    { id: 1, message: "Assignment due tomorrow: Data Structures Project", type: "assignment", time: "2h ago" },
    { id: 2, message: "New grade posted for Database Design Assignment", type: "grade", time: "5h ago" },
    { id: 3, message: "Course enrollment for next semester is open", type: "info", time: "1d ago" },
  ]

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src={logo}
                  alt="Sikhshan Logo"
                  className="h-12 w-auto sm:h-16 object-contain -my-2"
                />
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
              {/* Use existing notification icon */}
              <button
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-200 relative"
                onClick={() => setIsNotificationOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>

            <div className="ml-3 relative" ref={profileRef}>
              <div>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-150 ease-in-out"
                >
                  {currentUser?.profilePictureUrl ? (
                    <img
                      src={getProfilePictureUrl(currentUser.profilePictureUrl)}
                      alt="Profile"
                      className="h-10 w-10 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white">
                      <span className="text-sm font-medium leading-none">
                        {currentUser?.name?.trim()
                          ? currentUser.name.charAt(0).toUpperCase()
                          : currentUser?.role
                            ? currentUser.role.charAt(0).toUpperCase()
                            : "U"}
                      </span>
                    </span>
                  )}
                </button>
              </div>
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg z-50">
                  <div className="py-1 rounded-md bg-white shadow-xs border border-gray-200">
                    <div className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <p className="font-medium">{currentUser?.name}</p>
                      <p className="text-gray-500">{currentUser?.email}</p>
                      <p className="text-gray-500 capitalize">{currentUser?.role}</p>
                    </div>
                    <Link
                      to={getProfileRoute(currentUser?.role)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/notifications"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-200"
            >
              Notifications
            </Link>
            <Link
              to="/help"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors duration-200"
            >
              Help & Support
            </Link>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {isNotificationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-full p-0 relative animate-fade-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Notifications</h2>
              <button
                className="text-gray-400 hover:text-gray-600 transition"
                onClick={() => setIsNotificationOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="py-8 text-center text-gray-400 text-base">No notifications</li>
              ) : (
                notifications.map((notif) => (
                  <li key={notif.id} className="flex items-start px-6 py-4 hover:bg-gray-50 transition">
                    <span className="mr-4 mt-1">
                      {notif.type === "assignment" && (
                        <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      {notif.type === "grade" && (
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {notif.type === "info" && (
                        <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </span>
                    <div className="flex-1">
                      <div className="text-gray-800 text-base font-medium leading-tight">{notif.message}</div>
                      <div className="text-xs text-gray-400 mt-1">{notif.time}</div>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <div className="px-6 py-3 border-t border-gray-100 text-right">
              <button
                className="text-primary font-medium hover:underline text-sm"
                onClick={() => { setIsNotificationOpen(false); window.location.href = '/student/notifications'; }}
              >
                View all notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
