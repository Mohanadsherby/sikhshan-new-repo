"use client"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useState } from "react"
import logo from "../../assets/images/logo.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faChartLine,
  faBook,
  faFileAlt,
  faQuestionCircle,
  faComments,
  faCalendarAlt,
  faShieldAlt,
  faBars,
  faTimes,
  faUsers,
  faCog,
  faChartBar,
  faHistory
} from "@fortawesome/free-solid-svg-icons"

function Sidebar() {
  const { currentUser } = useAuth()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  // Define navigation items based on user role
  const getNavItems = () => {
    const role = currentUser?.role

    let chatPath = "/chat"
    let calendarPath = "/calendar"
    if (role === "SUPERADMIN") {
      chatPath = "/admin/chat"
      calendarPath = "/admin/calendar"
    } else if (role === "FACULTY") {
      chatPath = "/faculty/chat"
      calendarPath = "/faculty/calendar"
    } else if (role === "STUDENT") {
      chatPath = "/student/chat"
      calendarPath = "/student/calendar"
    }
    const commonItems = [
      { name: "Chat", path: chatPath, icon: "chat" },
      { name: "Calendar", path: calendarPath, icon: "calendar" },
    ]

    if (role === "SUPERADMIN") {
      return [
        { name: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
        { name: "User Management", path: "/admin/users", icon: "users" },
        { name: "System Settings", path: "/admin/settings", icon: "settings" },
        { name: "Reports", path: "/admin/reports", icon: "reports" },
        { name: "Audit Logs", path: "/admin/logs", icon: "logs" },
        ...commonItems,
      ]
    } else if (role === "FACULTY") {
      return [
        { name: "Dashboard", path: "/faculty", icon: "dashboard" },
        { name: "Courses", path: "/faculty/courses", icon: "book" },
        { name: "Assignments", path: "/faculty/assignments", icon: "assignment" },
        { name: "Quizzes", path: "/faculty/quizzes", icon: "quiz" },
        ...commonItems,
      ]
    } else if (role === "STUDENT") {
      return [
        { name: "Dashboard", path: "/student", icon: "dashboard" },
        { name: "Courses", path: "/student/courses", icon: "book" },
        { name: "Assignments", path: "/student/assignments", icon: "assignment" },
        { name: "Quizzes", path: "/student/quizzes", icon: "quiz" },
        { name: "Plagiarism Check", path: "/student/plagiarism", icon: "security" },
        ...commonItems,
      ]
    }

    return []
  }

  const navItems = getNavItems()

  // Simple icon component (using Font Awesome icons)
  const Icon = ({ name }) => {
    const iconMap = {
      dashboard: faChartLine,
      book: faBook,
      assignment: faFileAlt,
      quiz: faQuestionCircle,
      chat: faComments,
      calendar: faCalendarAlt,
      security: faShieldAlt,
      users: faUsers,
      settings: faCog,
      reports: faChartBar,
      logs: faHistory,
    }

    return <FontAwesomeIcon icon={iconMap[name] || faFileAlt} className="mr-3 w-5 h-5" />
  }

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Hamburger Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed top-4 left-4 z-40 p-2 rounded-md bg-white shadow-md hover:bg-gray-100 transition-colors duration-200"
      >
        <FontAwesomeIcon 
          icon={collapsed ? faBars : faTimes} 
          className="w-5 h-5 text-gray-600"
        />
      </button>

      <div
        className={`bg-white text-gray-800 ${
          collapsed ? "w-16" : "w-64"
        } space-y-6 py-7 px-2 fixed top-0 left-0 h-screen transition duration-200 ease-in-out z-30 shadow-lg`}
      >
        <div className="flex items-center justify-center px-4 h-20" style={{ caretColor: 'transparent' }}>
          {!collapsed ? (
            <img
              src={logo}
              alt="Sikhshan Logo"
              className="h-36 w-auto object-contain -my-8 bg-transparent select-none pointer-events-none"
            />
          ) : (
            <div className="h-20"></div>
          )}
        </div>

        <nav>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center py-2.5 px-4 rounded transition duration-200 ${
                location.pathname === item.path
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
              title={collapsed ? item.name : ""}
            >
              <Icon name={item.icon} />
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="px-4 mt-auto">
          <div className="pt-4 border-t border-gray-200">
            {!collapsed && (
              <div className="text-sm text-gray-600">
                <p>Logged in as:</p>
                <p className="font-medium text-gray-900">{currentUser?.name}</p>
                <p className="capitalize">{currentUser?.role}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add margin to main content to account for sidebar */}
      <div className={`transition-all duration-200 ${collapsed ? "ml-16" : "ml-64"}`}>
        {/* Your main content goes here */}
      </div>
    </>
  )
}

export default Sidebar
