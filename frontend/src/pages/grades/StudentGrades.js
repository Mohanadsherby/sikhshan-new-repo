"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { getStudentGrades, getStudentGPA, getLetterGradeColor, getGradePointColor, getPerformanceColor, formatPercentage, formatGradePoint, formatPoints } from "../../api/gradeApi"

function StudentGrades() {
  const { currentUser } = useAuth()
  const [grades, setGrades] = useState([])
  const [overallGPA, setOverallGPA] = useState(0.0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (currentUser?.id) {
      fetchGrades()
    }
  }, [currentUser?.id])

  const fetchGrades = async () => {
    try {
      setLoading(true)
      setError("")
      
      const [gradesRes, gpaRes] = await Promise.all([
        getStudentGrades(currentUser.id),
        getStudentGPA(currentUser.id)
      ])
      
      setGrades(gradesRes.data)
      setOverallGPA(gpaRes.data.gpa)
    } catch (err) {
      console.error("Error fetching grades:", err)
      setError("Failed to load grades")
    } finally {
      setLoading(false)
    }
  }

  if (currentUser?.role !== "STUDENT") {
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
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Grades</h1>
        <p className="text-gray-600">Track your academic performance across all courses</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Overall GPA Card */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Overall GPA</h2>
            <p className="text-blue-100">Cumulative Grade Point Average</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{formatGradePoint(overallGPA)}</div>
            <div className="text-blue-100 text-sm">out of 4.0</div>
          </div>
        </div>
      </div>

      {/* Grades Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {grades.length > 0 ? (
          grades.map((grade) => (
            <div key={grade.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              {/* Course Header */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{grade.courseName}</h3>
                <p className="text-gray-600 text-sm">{grade.courseCode}</p>
              </div>

              {/* Final Grade */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Final Grade</span>
                  <span className={`text-lg font-bold ${getLetterGradeColor(grade.letterGrade)}`}>
                    {grade.letterGrade || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Grade Point</span>
                  <span className={`font-semibold ${getGradePointColor(grade.gradePoint)}`}>
                    {formatGradePoint(grade.gradePoint)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">Percentage</span>
                  <span className="font-semibold text-gray-800">
                    {formatPercentage(grade.finalPercentage)}
                  </span>
                </div>
                {grade.performanceDescription && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className={`text-sm font-medium ${getPerformanceColor(grade.performanceDescription)}`}>
                      {grade.performanceDescription}
                    </span>
                  </div>
                )}
              </div>

              {/* Assignment Grades */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Assignments</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Points Earned</span>
                    <span className="font-medium">
                      {formatPoints(grade.assignmentPointsEarned, grade.assignmentTotalPoints)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Percentage</span>
                    <span className="font-medium">{formatPercentage(grade.assignmentPercentage)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{grade.assignmentWeight}%</span>
                  </div>
                </div>
              </div>

              {/* Quiz Grades */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Quizzes</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Points Earned</span>
                    <span className="font-medium">
                      {formatPoints(grade.quizPointsEarned, grade.quizTotalPoints)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Percentage</span>
                    <span className="font-medium">{formatPercentage(grade.quizPercentage)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{grade.quizWeight}%</span>
                  </div>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Assignments Completed</span>
                  <span className="font-medium">{grade.assignmentGradedCount}/{grade.assignmentCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quizzes Attempted</span>
                  <span className="font-medium">{grade.quizAttemptedCount}/{grade.quizCount}</span>
                </div>
              </div>

              {/* Last Updated */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last updated: {new Date(grade.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Grades Available</h3>
              <p className="text-gray-600">Your grades will appear here once your instructors have graded your assignments and quizzes.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentGrades 