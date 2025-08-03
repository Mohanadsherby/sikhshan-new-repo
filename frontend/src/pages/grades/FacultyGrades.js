"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { getCourseGrades, updateGradingWeights, recalculateCourseGrades, getLetterGradeColor, getGradePointColor, getPerformanceColor, formatPercentage, formatGradePoint, formatPoints } from "../../api/gradeApi"
import { getCoursesByInstructor } from "../../api/courseApi"

function FacultyGrades() {
  const { currentUser } = useAuth()
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (currentUser?.id) {
      fetchCourses()
    }
  }, [currentUser?.id])

  useEffect(() => {
    if (selectedCourse) {
      fetchGrades()
    }
  }, [selectedCourse])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await getCoursesByInstructor(currentUser.id)
      setCourses(response.data)
      if (response.data.length > 0) {
        setSelectedCourse(response.data[0])
      }
    } catch (err) {
      console.error("Error fetching courses:", err)
      setError("Failed to load courses")
    } finally {
      setLoading(false)
    }
  }

  const fetchGrades = async () => {
    if (!selectedCourse) return
    
    try {
      setLoading(true)
      const response = await getCourseGrades(selectedCourse.id)
      setGrades(response.data)
    } catch (err) {
      console.error("Error fetching grades:", err)
      setError("Failed to load grades")
    } finally {
      setLoading(false)
    }
  }

  const handleRecalculateGrades = async () => {
    if (!selectedCourse) return
    
    try {
      setUpdating(true)
      await recalculateCourseGrades(selectedCourse.id)
      await fetchGrades() // Refresh grades after recalculation
      alert("Grades recalculated successfully!")
    } catch (err) {
      console.error("Error recalculating grades:", err)
      alert("Failed to recalculate grades")
    } finally {
      setUpdating(false)
    }
  }

  const handleUpdateWeights = async (studentId, assignmentWeight, quizWeight) => {
    if (!selectedCourse) return
    
    try {
      setUpdating(true)
      await updateGradingWeights(selectedCourse.id, studentId, assignmentWeight, quizWeight)
      await fetchGrades() // Refresh grades after weight update
      alert("Grading weights updated successfully!")
    } catch (err) {
      console.error("Error updating weights:", err)
      alert("Failed to update grading weights")
    } finally {
      setUpdating(false)
    }
  }

  if (currentUser?.role !== "FACULTY") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Student Grades</h1>
        <p className="text-gray-600">Manage and view student grades for your courses</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Course Selection */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Select Course</h2>
            <select
              value={selectedCourse?.id || ""}
              onChange={(e) => {
                const course = courses.find(c => c.id === parseInt(e.target.value))
                setSelectedCourse(course)
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>
          
          {selectedCourse && (
            <div className="flex gap-3">
              <button
                onClick={handleRecalculateGrades}
                disabled={updating}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {updating ? "Recalculating..." : "Recalculate Grades"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grades Table */}
      {selectedCourse && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">
              {selectedCourse.name} - Student Grades
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {grades.length} student{grades.length !== 1 ? 's' : ''} enrolled
            </p>
          </div>

          {grades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Final Grade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assignments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quizzes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weights
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grades.map((grade) => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {grade.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {grade.studentEmail}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-center">
                          <div className={`text-lg font-bold ${getLetterGradeColor(grade.letterGrade)}`}>
                            {grade.letterGrade || 'N/A'}
                          </div>
                          <div className={`text-sm ${getGradePointColor(grade.gradePoint)}`}>
                            {formatGradePoint(grade.gradePoint)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatPercentage(grade.finalPercentage)}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium">
                            {formatPoints(grade.assignmentPointsEarned, grade.assignmentTotalPoints)}
                          </div>
                          <div className="text-gray-500">
                            {formatPercentage(grade.assignmentPercentage)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {grade.assignmentGradedCount}/{grade.assignmentCount} graded
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium">
                            {formatPoints(grade.quizPointsEarned, grade.quizTotalPoints)}
                          </div>
                          <div className="text-gray-500">
                            {formatPercentage(grade.quizPercentage)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {grade.quizAttemptedCount}/{grade.quizCount} attempted
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="text-gray-600">
                            Assignments: {grade.assignmentWeight}%
                          </div>
                          <div className="text-gray-600">
                            Quizzes: {grade.quizWeight}%
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => {
                            const newAssignmentWeight = prompt(
                              `Enter new assignment weight for ${grade.studentName} (current: ${grade.assignmentWeight}%)`,
                              grade.assignmentWeight
                            )
                            if (newAssignmentWeight && !isNaN(newAssignmentWeight)) {
                              const assignmentWeight = parseFloat(newAssignmentWeight)
                              const quizWeight = 100 - assignmentWeight
                              handleUpdateWeights(grade.studentId, assignmentWeight, quizWeight)
                            }
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Update Weights
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Students Enrolled</h3>
              <p className="text-gray-600">No students are currently enrolled in this course.</p>
            </div>
          )}
        </div>
      )}

      {!selectedCourse && courses.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Courses Available</h3>
          <p className="text-gray-600">You don't have any courses assigned to view grades.</p>
        </div>
      )}
    </div>
  )
}

export default FacultyGrades 