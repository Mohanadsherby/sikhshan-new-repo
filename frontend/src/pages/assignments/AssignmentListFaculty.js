"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"

// Mock data for assignments
const mockAssignments = [
  {
    id: 1,
    title: "Programming Basics Assignment",
    course: "CS101",
    courseName: "Introduction to Computer Science",
    dueDate: "2024-03-20",
    dueTime: "23:59",
    totalPoints: 100,
    submissions: 35,
    status: "active",
    description: "Complete the basic programming exercises covering variables, loops, and functions.",
  },
  {
    id: 2,
    title: "Data Structures Project",
    course: "CS201",
    courseName: "Data Structures and Algorithms",
    dueDate: "2024-03-25",
    dueTime: "23:59",
    totalPoints: 150,
    submissions: 28,
    status: "active",
    description: "Implement and analyze various data structures including linked lists, stacks, and queues.",
  },
  {
    id: 3,
    title: "Database Design Assignment",
    course: "CS301",
    courseName: "Database Management Systems",
    dueDate: "2024-03-15",
    dueTime: "23:59",
    totalPoints: 100,
    submissions: 30,
    status: "completed",
    description: "Design and implement a database schema for a library management system.",
  },
]

function AssignmentListFaculty() {
  const { currentUser } = useAuth()
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [filter, setFilter] = useState("all") // all, active, completed
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    description: "",
    dueDate: "",
    dueTime: "",
    totalPoints: "",
    attachments: [],
    plagiarismCheck: false,
  })

  // Mock courses for dropdown
  const courses = [
    { id: 1, name: "Introduction to Computer Science", code: "CS101" },
    { id: 2, name: "Data Structures and Algorithms", code: "CS201" },
    { id: 3, name: "Database Management Systems", code: "CS301" },
  ]

  // Redirect if not faculty
  if (currentUser?.role !== "FACULTY") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === "file") {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...Array.from(files)],
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      })
    }
  }

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = [...formData.attachments]
    updatedAttachments.splice(index, 1)
    setFormData({
      ...formData,
      attachments: updatedAttachments,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    alert("Assignment created successfully!")

    // Reset form and return to list view
    setFormData({
      title: "",
      course: "",
      description: "",
      dueDate: "",
      dueTime: "",
      totalPoints: "",
      attachments: [],
      plagiarismCheck: false,
    })
    setIsCreating(false)
  }

  const filteredAssignments = mockAssignments.filter((assignment) => {
    if (filter === "all") return true
    return assignment.status === filter
  })

  const handleDelete = (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      // Here you would typically make an API call to delete the assignment
      alert("Assignment deleted (mock)")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Assignments</h1>
        <div className="flex space-x-4 mt-4 md:mt-0">
          {!isCreating && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="all">All Assignments</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          )}
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            {isCreating ? "Back to List" : "Create Assignment"}
          </button>
        </div>
      </div>

      {isCreating ? (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Course */}
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.code}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Points */}
              <div>
                <label htmlFor="totalPoints" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Points
                </label>
                <input
                  type="number"
                  id="totalPoints"
                  name="totalPoints"
                  value={formData.totalPoints}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Due Date */}
              <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Due Time */}
              <div>
                <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Time
                </label>
                <input
                  type="time"
                  id="dueTime"
                  name="dueTime"
                  value={formData.dueTime}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              {/* Attachments */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      >
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="attachments"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, ZIP up to 10MB</p>
                  </div>
                </div>

                {/* Display attached files */}
                {formData.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Attached Files:</h4>
                    <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                      {formData.attachments.map((file, index) => (
                        <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <svg
                              className="flex-shrink-0 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(index)}
                              className="font-medium text-red-600 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="col-span-2 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                  Create Assignment
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Assignment List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">All Assignments</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`p-6 hover:bg-gray-50 cursor-pointer ${selectedAssignment?.id === assignment.id ? 'bg-primary-50' : ''}`}
                    onClick={() => setSelectedAssignment(assignment)}
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {assignment.course} - {assignment.courseName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due: {assignment.dueDate} at {assignment.dueTime}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          assignment.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">{assignment.submissions} Submissions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Assignment Details */}
          <div>
            {selectedAssignment ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{selectedAssignment.title}</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Course</p>
                    <p className="text-base text-gray-900">
                      {selectedAssignment.course} - {selectedAssignment.courseName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Due Date</p>
                    <p className="text-base text-gray-900">
                      {selectedAssignment.dueDate} at {selectedAssignment.dueTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Points</p>
                    <p className="text-base text-gray-900">{selectedAssignment.totalPoints}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Submissions</p>
                    <p className="text-base text-gray-900">{selectedAssignment.submissions}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-base text-gray-900">{selectedAssignment.description}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => handleDelete(selectedAssignment.id)}
                    className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  >
                    Delete Assignment
                  </button>
                  <Link
                    to={`/faculty/assignments/${selectedAssignment.id}/view`}
                    className="block w-full px-4 py-2 border border-primary text-primary text-center rounded-md hover:bg-primary-50"
                  >
                    View Submissions
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Select an assignment to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AssignmentListFaculty 