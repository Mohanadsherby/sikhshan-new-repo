import React, { useState } from "react"
import { Link } from "react-router-dom"

function AllNotifications() {
  // Mock notifications data (replace with API call)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Assignment Posted",
      message: "CS101 - Assignment 3 has been posted",
      time: "2 hours ago",
      isRead: false,
      type: "assignment",
    },
    {
      id: 2,
      title: "Assignment Due Reminder",
      message: "CS201 - Project submission due in 2 days",
      time: "1 day ago",
      isRead: true,
      type: "reminder",
    },
    {
      id: 3,
      title: "Grade Posted",
      message: "Your grade for CS101 - Assignment 2 has been posted",
      time: "3 days ago",
      isRead: true,
      type: "grade",
    },
    {
      id: 4,
      title: "Course Update",
      message: "New study material added to CS301 course",
      time: "4 days ago",
      isRead: true,
      type: "course",
    },
    {
      id: 5,
      title: "Attendance Alert",
      message: "Your attendance is below 75% in CS201",
      time: "5 days ago",
      isRead: false,
      type: "alert",
    },
  ])

  const [filter, setFilter] = useState("all")

  const getNotificationIcon = (type) => {
    switch (type) {
      case "assignment":
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case "reminder":
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case "grade":
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case "course":
        return (
          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      case "alert":
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      default:
        return null
    }
  }

  const filteredNotifications = filter === "all" 
    ? notifications 
    : notifications.filter(n => n.type === filter)

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, isRead: true })))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <div className="flex space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Notifications</option>
              <option value="assignment">Assignments</option>
              <option value="reminder">Reminders</option>
              <option value="grade">Grades</option>
              <option value="course">Course Updates</option>
              <option value="alert">Alerts</option>
            </select>
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
            >
              Mark All as Read
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No notifications found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 ${
                    notification.isRead ? "bg-white" : "bg-primary bg-opacity-5"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <span className="text-sm text-gray-500">{notification.time}</span>
                      </div>
                      <p className="mt-1 text-gray-600">{notification.message}</p>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="mt-2 text-sm text-primary hover:text-primary-dark"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllNotifications 