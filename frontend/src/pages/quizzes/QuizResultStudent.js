"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { getQuizForStudent, getStudentAttemptForQuiz } from "../../api/quizApi"
import { formatDate, calculateLetterGrade, getPerformanceDescription } from "../../api/quizApi"

function QuizResultStudent() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { quizId } = useParams()
  const location = useLocation()
  const [quiz, setQuiz] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchResultData()
  }, [quizId, currentUser?.id])

  const fetchResultData = async () => {
    if (!currentUser?.id || !quizId) return

    try {
      setLoading(true)
      
      // Fetch quiz details
      const quizRes = await getQuizForStudent(quizId)
      setQuiz(quizRes.data)
      
      // Fetch student's attempt
      const attemptRes = await getStudentAttemptForQuiz(quizId, currentUser.id)
      setAttempt(attemptRes.data)
    } catch (err) {
      console.error("Error fetching result data:", err)
      setError("Failed to load quiz results")
    } finally {
      setLoading(false)
    }
  }

  // Redirect if not student
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

  if (error || !quiz || !attempt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || "Quiz result not found"}
        </div>
        <button
          onClick={() => navigate('/student/quizzes')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Back to Quizzes
        </button>
      </div>
    )
  }

  const getGradeColor = (letterGrade) => {
    const gradeColors = {
      'A+': 'text-green-600',
      'A': 'text-green-600',
      'B+': 'text-blue-600',
      'B': 'text-blue-600',
      'C+': 'text-yellow-600',
      'C': 'text-yellow-600',
      'D+': 'text-orange-600',
      'F': 'text-red-600'
    }
    return gradeColors[letterGrade] || 'text-gray-600'
  }

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/student/quizzes')}
        className="mb-4 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-50"
      >
        &larr; Back to Quizzes
      </button>

      {location.state?.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {location.state.success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Quiz Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.name}</h1>
        <p className="text-gray-600 mb-4">{quiz.courseName}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Start Time</p>
            <p className="text-gray-900">{formatDate(quiz.startDateTime)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Duration</p>
            <p className="text-gray-900">{quiz.durationMinutes} minutes</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Points</p>
            <p className="text-gray-900">{quiz.totalPoints}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Questions</p>
            <p className="text-gray-900">{quiz.questions?.length || 0}</p>
          </div>
        </div>
      </div>

      {/* Result Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {attempt.pointsEarned}/{attempt.totalPoints}
            </div>
            <p className="text-sm text-gray-500">Points Earned</p>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getPerformanceColor(attempt.percentage)}`}>
              {attempt.percentage}%
            </div>
            <p className="text-sm text-gray-500">Percentage</p>
          </div>
          
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${getGradeColor(attempt.letterGrade)}`}>
              {attempt.letterGrade}
            </div>
            <p className="text-sm text-gray-500">Letter Grade</p>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold mb-2 ${getPerformanceColor(attempt.percentage)}`}>
              {attempt.performanceDescription}
            </div>
            <p className="text-sm text-gray-500">Performance</p>
          </div>
        </div>
      </div>

      {/* Attempt Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Attempt Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Started At</p>
            <p className="text-gray-900">{formatDate(attempt.startedAt)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Submitted At</p>
            <p className="text-gray-900">{formatDate(attempt.submittedAt)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Time Taken</p>
            <p className="text-gray-900">
              {Math.round((new Date(attempt.submittedAt) - new Date(attempt.startedAt)) / 60000)} minutes
            </p>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Performance Analysis</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Score Range</span>
            <span className="font-medium text-gray-900">0 - {attempt.totalPoints} points</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Your Score</span>
            <span className="font-medium text-primary">{attempt.pointsEarned} points</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Percentage</span>
            <span className={`font-medium ${getPerformanceColor(attempt.percentage)}`}>
              {attempt.percentage}%
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Grade</span>
            <span className={`font-medium ${getGradeColor(attempt.letterGrade)}`}>
              {attempt.letterGrade}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Performance Level</span>
            <span className={`font-medium ${getPerformanceColor(attempt.percentage)}`}>
              {attempt.performanceDescription}
            </span>
          </div>
        </div>
      </div>

      {/* Grade Scale Reference */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Scale Reference</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">A+ (90-100%)</div>
            <p className="text-sm text-gray-600">Outstanding</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">B+ (70-79%)</div>
            <p className="text-sm text-gray-600">Very Good</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">C+ (50-59%)</div>
            <p className="text-sm text-gray-600">Satisfactory</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">F (0-34%)</div>
            <p className="text-sm text-gray-600">Fail</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizResultStudent 