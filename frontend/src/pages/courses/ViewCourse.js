"use client"

import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

function ViewCourse() {
  const { courseId } = useParams()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [previousCourses, setPreviousCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("current") // "current" or "previous"

  useEffect(() => {
    // Simulate fetching course data
    const fetchCourseData = async () => {
      try {
        setLoading(true)
        // This would be replaced with actual API call
        const mockCourse = {
          id: courseId,
          title: "Introduction to Computer Science",
          code: "CS101",
          instructor: "Dr. John Smith",
          description: "A comprehensive introduction to computer science fundamentals including programming, algorithms, and data structures.",
          schedule: "Mon, Wed, Fri 10:00 AM - 11:30 AM",
          location: "Room 101, Science Building",
          credits: 3,
          semester: "Fall 2024",
          enrolledStudents: 45,
          maxStudents: 50,
          assignments: [
            {
              id: 1,
              title: "Programming Assignment 1",
              dueDate: "2024-03-15",
              status: "Not Submitted"
            },
            {
              id: 2,
              title: "Midterm Project",
              dueDate: "2024-04-01",
              status: "Not Started"
            }
          ],
          materials: [
            {
              id: 1,
              title: "Course Syllabus",
              type: "PDF",
              uploadDate: "2024-01-15"
            },
            {
              id: 2,
              title: "Week 1 Lecture Notes",
              type: "PDF",
              uploadDate: "2024-01-20"
            }
          ]
        }

        // Mock previous courses data
        const mockPreviousCourses = [
          {
            id: "CS100",
            title: "Introduction to Programming",
            code: "CS100",
            semester: "Spring 2023",
            grade: "A",
            instructor: "Dr. Sarah Johnson",
            credits: 3,
            status: "Completed"
          },
          {
            id: "CS102",
            title: "Data Structures",
            code: "CS102",
            semester: "Fall 2023",
            grade: "B+",
            instructor: "Prof. Michael Brown",
            credits: 4,
            status: "Completed"
          },
          {
            id: "CS103",
            title: "Algorithms",
            code: "CS103",
            semester: "Spring 2024",
            grade: "A-",
            instructor: "Dr. Emily Davis",
            credits: 4,
            status: "Completed"
          }
        ]
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setCourse(mockCourse)
        setPreviousCourses(mockPreviousCourses)
      } catch (err) {
        setError("Failed to load course details")
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId])

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

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Course not found</h2>
        <p className="mt-2 text-gray-600">The course you're looking for doesn't exist or you don't have access to it.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Course Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="mt-1 text-xl text-gray-600">Course Code: {course.code}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Semester: {course.semester}</p>
            <p className="text-sm text-gray-600">Credits: {course.credits}</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-700">{course.description}</p>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Instructor</h3>
            <p className="mt-1 text-lg text-gray-900">{course.instructor}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
            <p className="mt-1 text-lg text-gray-900">{course.schedule}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="mt-1 text-lg text-gray-900">{course.location}</p>
          </div>
        </div>
      </div>

      {/* Course Content Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("current")}
              className={`${
                activeTab === "current"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Current Course
            </button>
            <button
              onClick={() => setActiveTab("previous")}
              className={`${
                activeTab === "previous"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Previous Courses
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "current" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assignments Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assignments</h2>
            <div className="space-y-4">
              {course.assignments.map((assignment) => (
                <div key={assignment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                      <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      assignment.status === "Not Submitted" ? "bg-yellow-100 text-yellow-800" :
                      assignment.status === "Not Started" ? "bg-gray-100 text-gray-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {assignment.status}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/student/assignments/${assignment.id}`)}
                    className="mt-2 text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Course Materials Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Materials</h2>
            <div className="space-y-4">
              {course.materials.map((material) => (
                <div key={material.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{material.title}</h3>
                      <p className="text-sm text-gray-500">Uploaded: {material.uploadDate}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {material.type}
                    </span>
                  </div>
                  <button
                    onClick={() => {/* Handle download */}}
                    className="mt-2 text-primary hover:text-primary-dark text-sm font-medium"
                  >
                    Download →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Previous Courses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previousCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                      <div className="text-sm text-gray-500">{course.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.semester}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.credits}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.grade === "A" ? "bg-green-100 text-green-800" :
                        course.grade === "B+" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {course.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {course.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enrollment Status */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Enrollment Status</h2>
            <p className="text-gray-600">You are currently enrolled in this course</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Class Capacity</p>
            <p className="text-lg font-medium text-gray-900">
              {course.enrolledStudents} / {course.maxStudents} students
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewCourse 