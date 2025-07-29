"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate, useParams } from "react-router-dom"
import { getQuizForStudent, getStudentAttemptForQuiz } from "../../api/quizApi"
import { formatDate, getQuizStatus, isQuizActive, isQuizOverdue, formatTimeRemaining } from "../../api/quizApi"

function QuizDetailStudent() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { quizId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchQuizData()
  }, [quizId, currentUser?.id])

  const fetchQuizData = async () => {
    if (!currentUser?.id || !quizId) return

    try {
      setLoading(true)
      
      // Fetch quiz details (without correct answers)
      const quizRes = await getQuizForStudent(quizId)
      setQuiz(quizRes.data)
      
      // Fetch student's attempt for this quiz
      try {
        const attemptRes = await getStudentAttemptForQuiz(quizId, currentUser.id)
        setAttempt(attemptRes.data)
      } catch (err) {
        // No attempt found, which is fine
        setAttempt(null)
      }
    } catch (err) {
      console.error("Error fetching quiz data:", err)
      setError("Failed to load quiz data")
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuiz = () => {
    navigate(`/student/quizzes/${quizId}/attempt`)
  }

  const handleViewResult = () => {
    navigate(`/student/quizzes/${quizId}/result`)
  }

  const handleContinueQuiz = () => {
    navigate(`/student/quizzes/${quizId}/attempt`)
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

  if (error || !quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || "Quiz not found"}
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

  const getStatusBadge = () => {
    const status = getQuizStatus(quiz)
    const statusConfig = {
      'NOT_STARTED': { color: 'bg-blue-100 text-blue-800', text: 'Not Started' },
      'ACTIVE': { color: 'bg-green-100 text-green-800', text: 'Active' },
      'ENDED': { color: 'bg-red-100 text-red-800', text: 'Ended' }
    }
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const getActionButton = () => {
    if (attempt && attempt.status === 'SUBMITTED') {
      return (
        <button
          onClick={handleViewResult}
          className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 font-medium"
        >
          View Result
        </button>
      )
    }
    
    if (attempt && attempt.status === 'IN_PROGRESS') {
      return (
        <button
          onClick={handleContinueQuiz}
          className="px-6 py-3 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 font-medium"
        >
          Continue Quiz
        </button>
      )
    }
    
    if (getQuizStatus(quiz) === 'ACTIVE') {
      return (
        <button
          onClick={handleStartQuiz}
          className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark font-medium"
        >
          Start Quiz
        </button>
      )
    }
    
    if (getQuizStatus(quiz) === 'NOT_STARTED') {
      return (
        <span className="px-6 py-3 bg-gray-300 text-gray-600 rounded-md font-medium cursor-not-allowed">
          Not Available Yet
        </span>
      )
    }
    
    return (
      <span className="px-6 py-3 bg-gray-300 text-gray-600 rounded-md font-medium cursor-not-allowed">
        Quiz Ended
      </span>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/student/quizzes')}
        className="mb-4 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-50"
      >
        &larr; Back to Quizzes
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Quiz Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.name}</h1>
            <p className="text-gray-600 mb-2">{quiz.courseName}</p>
            <div className="flex items-center space-x-4">
              {getStatusBadge()}
            </div>
          </div>
          <div>
            {getActionButton()}
          </div>
        </div>

        {quiz.description && (
          <p className="text-gray-700 mb-4">{quiz.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Start Date & Time</p>
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

      {/* Attempt Status */}
      {attempt && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Attempt Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className={`font-medium ${
                attempt.status === 'SUBMITTED' ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {attempt.status === 'SUBMITTED' ? 'Completed' : 'In Progress'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Started At</p>
              <p className="text-gray-900">{formatDate(attempt.startedAt)}</p>
            </div>
            {attempt.submittedAt && (
              <div>
                <p className="text-sm font-medium text-gray-500">Submitted At</p>
                <p className="text-gray-900">{formatDate(attempt.submittedAt)}</p>
              </div>
            )}
          </div>
          
          {attempt.pointsEarned !== null && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Your Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {attempt.pointsEarned}/{attempt.totalPoints} points
                  </p>
                  <p className="text-lg text-gray-600">
                    {attempt.percentage}% - {attempt.letterGrade} ({attempt.performanceDescription})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Grade</p>
                  <p className="text-3xl font-bold text-primary">{attempt.letterGrade}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Questions Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions Preview</h2>
        
        {quiz.questions && quiz.questions.length > 0 ? (
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-800">
                    Question {index + 1} ({question.type.replace('_', ' ')})
                  </h3>
                  <span className="text-sm text-gray-500">{question.points} points</span>
                </div>
                
                <p className="text-gray-700 mb-3">{question.text}</p>
                
                {question.type === 'MULTIPLE_CHOICE' && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          disabled
                          className="text-gray-400"
                        />
                        <span className="text-gray-600">
                          {String.fromCharCode(65 + optionIndex)}. {option.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'TRUE_FALSE' && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <input type="radio" disabled className="text-gray-400" />
                      <span className="text-gray-600">True</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" disabled className="text-gray-400" />
                      <span className="text-gray-600">False</span>
                    </div>
                  </div>
                )}
                
                {question.type === 'SHORT_ANSWER' && (
                  <div>
                    <input
                      type="text"
                      disabled
                      placeholder="Your answer will appear here..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No questions available for preview.</p>
        )}
      </div>
    </div>
  )
}

export default QuizDetailStudent 