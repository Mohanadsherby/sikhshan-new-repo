"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useState, useEffect } from "react"

// Mock data
const courses = [
  {
    id: 1,
    name: "Introduction to Computer Science",
    code: "CS101",
    students: 45,
    progress: 60,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 2,
    name: "Data Structures and Algorithms",
    code: "CS201",
    students: 38,
    progress: 40,
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 3,
    name: "Database Management Systems",
    code: "CS301",
    students: 32,
    progress: 75,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
]

const upcomingTasks = [
  { id: 1, title: "Grade CS101 Assignments", due: "2 days", priority: "High" },
  { id: 2, title: "Prepare Quiz for CS201", due: "1 week", priority: "Medium" },
  { id: 3, title: "Update Course Materials", due: "3 days", priority: "Low" },
]

const recentActivities = [
  { id: 1, user: "John Doe", action: "Submitted Assignment 3", course: "CS101", time: "2 hours ago" },
  { id: 2, user: "Jane Smith", action: "Asked a question", course: "CS201", time: "5 hours ago" },
  { id: 3, user: "Mike Johnson", action: "Completed Quiz 2", course: "CS101", time: "1 day ago" },
]

function FacultyDashboard() {
  const { currentUser } = useAuth()
  const [greeting, setGreeting] = useState("")

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  // Redirect if not faculty
  if (currentUser?.role !== "FACULTY") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-primary text-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {greeting}, {currentUser.name}
            </h1>
            <p className="text-white text-opacity-90">Welcome to your faculty dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/faculty/courses"
              className="px-4 py-2 bg-white text-primary rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              View All Courses
            </Link>
            <Link
              to="/faculty/assignments"
              className="px-4 py-2 bg-white text-primary rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              Create Assignment
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-primary">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary bg-opacity-10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Courses</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-rose-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-rose-500 bg-opacity-10 text-rose-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">115</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-amber-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-500 bg-opacity-10 text-amber-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Assignments</p>
              <p className="text-3xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Courses */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${course.image})` }}>
                  <div className="h-full w-full bg-black bg-opacity-30 flex items-end p-4">
                    <div>
                      <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-md mb-2">
                        {course.code}
                      </span>
                      <h3 className="text-lg font-bold text-white">{course.name}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">{course.students} Students</p>
                    <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full">
                      {course.progress}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/faculty/courses/${course.id}`}
                      className="flex-1 text-center py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
                    >
                      Manage
                    </Link>
                    <Link
                      to={`/faculty/courses/${course.id}/students`}
                      className="flex-1 text-center py-2 border border-primary text-primary rounded-md hover:bg-primary-light/10 transition-colors duration-200"
                    >
                      Students
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between">
                  <p className="text-sm font-medium text-gray-900">{task.title}</p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "Medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Due in {task.due}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200">
            View All Tasks
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Student Activity</h2>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 border-b border-gray-200 pb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                  {activity.user.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-600">
                  {activity.action} in <span className="text-primary">{activity.course}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-light/10 transition-colors duration-200">
          View All Activity
        </button>
      </div>

      {/* Student Performance */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Performance</h2>
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Overall class performance across all courses</p>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200">
            Export Report
          </button>
        </div>
        <div className="h-64 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="mt-2 text-gray-500">Performance chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyDashboard
