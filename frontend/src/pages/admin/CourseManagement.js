"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBook,
  faSearch,
  faPlus,
  faEdit,
  faTrash,
  faUsers,
  faCalendarAlt,
  faFilter,
  faTimes,
  faExclamationTriangle,
  faCheckCircle,
  faClock,
} from "@fortawesome/free-solid-svg-icons"

function CourseManagement() {
  const { currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState(null)

  // Mock data - replace with actual API call
  const courses = [
    {
      id: 1,
      title: "Introduction to Programming",
      instructor: "John Doe",
      students: 45,
      status: "active",
      startDate: "2024-03-01",
      endDate: "2024-06-30",
      category: "Computer Science",
    },
    {
      id: 2,
      title: "Advanced Mathematics",
      instructor: "Jane Smith",
      students: 32,
      status: "active",
      startDate: "2024-03-15",
      endDate: "2024-07-15",
      category: "Mathematics",
    },
    {
      id: 3,
      title: "Web Development Bootcamp",
      instructor: "Mike Johnson",
      students: 28,
      status: "upcoming",
      startDate: "2024-04-01",
      endDate: "2024-07-31",
      category: "Computer Science",
    },
  ]

  const handleAddCourse = () => {
    setShowAddCourseModal(true)
  }

  const handleEditCourse = (courseId) => {
    // Here you would typically open an edit modal
    console.log(`Editing course ${courseId}`)
  }

  const handleDeleteCourse = (courseId) => {
    setCourseToDelete(courseId)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    // Here you would typically make an API call to delete the course
    console.log(`Deleting course ${courseToDelete}`)
    setShowDeleteConfirm(false)
    setCourseToDelete(null)
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setCourseToDelete(null)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        )
      case "upcoming":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Upcoming
          </span>
        )
      case "completed":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Completed
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FontAwesomeIcon icon={faBook} className="text-2xl text-primary mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Course Management</h1>
          </div>
          <button
            onClick={handleAddCourse}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 flex items-center"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Course
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    <div className="text-sm text-gray-500">{course.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course.instructor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faUsers} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{course.students}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(course.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {new Date(course.startDate).toLocaleDateString()} -{" "}
                        {new Date(course.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEditCourse(course.id)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 1 to {courses.length} of {courses.length} entries
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-red-500 text-xl mr-3"
              />
              <h2 className="text-xl font-bold">Confirm Delete</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Course Modal - To be implemented */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Course</h2>
              <button
                onClick={() => setShowAddCourseModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            {/* Add course form will go here */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddCourseModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
                Add Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseManagement 