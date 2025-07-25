"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

// Mock data for assignments
const mockAssignments = [
  {
    id: 1,
    title: "Introduction to Programming Assignment",
    course: "CS101 - Introduction to Computer Science",
    dueDate: "2024-03-25T23:59:59",
    status: "upcoming",
    description: "Complete the basic programming exercises and submit your solutions.",
    totalMarks: 100,
    submittedMarks: null,
    submissionType: "file",
  },
  {
    id: 2,
    title: "Data Structures Project",
    course: "CS201 - Data Structures and Algorithms",
    dueDate: "2024-03-20T23:59:59",
    status: "overdue",
    description: "Implement a binary search tree and perform various operations on it.",
    totalMarks: 150,
    submittedMarks: null,
    submissionType: "file",
  },
  {
    id: 3,
    title: "Database Design Assignment",
    course: "CS301 - Database Management Systems",
    dueDate: "2024-03-15T23:59:59",
    status: "completed",
    description: "Design a database schema for a library management system.",
    totalMarks: 100,
    submittedMarks: 85,
    submissionType: "file",
  },
  {
    id: 4,
    title: "Web Development Quiz",
    course: "CS401 - Web Development",
    dueDate: "2024-03-30T23:59:59",
    status: "upcoming",
    description: "Quiz covering HTML, CSS, and JavaScript basics.",
    totalMarks: 50,
    submittedMarks: null,
    submissionType: "quiz",
  },
  {
    id: 5,
    title: "Machine Learning Project",
    course: "CS501 - Machine Learning",
    dueDate: "2024-03-10T23:59:59",
    status: "completed",
    description: "Implement a simple machine learning model for classification.",
    totalMarks: 200,
    submittedMarks: 175,
    submissionType: "file",
  },
]

function AssignmentListStudent() {
  const { currentUser } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true)
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setAssignments(mockAssignments)
      } catch (err) {
        setError("Failed to load assignments")
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const getFilteredAssignments = () => {
    return assignments.filter(assignment => assignment.status === activeTab)
  }

  const formatDueDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Assignments</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "upcoming" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "overdue" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("overdue")}
        >
          Overdue
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "completed" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed
        </button>
      </div>

      {/* Assignment List */}
      <div className="grid grid-cols-1 gap-6">
        {getFilteredAssignments().map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{assignment.course}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(assignment.status)}`}>
                  {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">{assignment.description}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                  <p className="text-sm text-gray-900">{formatDueDate(assignment.dueDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Marks</p>
                  <p className="text-sm text-gray-900">{assignment.totalMarks}</p>
                </div>
                {assignment.submittedMarks !== null && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marks Obtained</p>
                    <p className="text-sm text-gray-900">{assignment.submittedMarks}</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                {assignment.status === "completed" ? (
                  <button
                    disabled
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-400 cursor-not-allowed"
                  >
                    Submitted
                  </button>
                ) : (
                  <Link
                    to={`/student/assignments/${assignment.id}`}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    {assignment.status === "overdue" ? "Submit Late" : "Submit Assignment"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}

        {getFilteredAssignments().length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No {activeTab} assignments</h3>
            <p className="text-gray-500">You don't have any {activeTab} assignments at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignmentListStudent 