"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { getQuizById, getAttemptsByQuiz, deleteQuiz } from "../../api/quizApi"
import { formatDate, getQuizStatus, isQuizActive, isQuizOverdue } from "../../api/quizApi"

function QuizDetailFaculty() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { quizId } = useParams()
  const location = useLocation()
  const [quiz, setQuiz] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchQuizData()
  }, [quizId])

  // Refresh data if coming from edit
  useEffect(() => {
    if (location.state?.refresh) {
      fetchQuizData()
    }
  }, [location.state])

  const fetchQuizData = async () => {
    try {
      const [quizRes, attemptsRes] = await Promise.all([
        getQuizById(quizId),
        getAttemptsByQuiz(quizId)
      ])
      setQuiz(quizRes.data)
      setAttempts(attemptsRes.data)
    } catch (err) {
      console.error("Error fetching quiz data:", err)
      setError("Failed to load quiz data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuiz = async () => {
    if (!window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      return
    }

    setDeleting(true)
    try {
      await deleteQuiz(quizId)
      navigate('/faculty/quizzes', { 
        state: { success: "Quiz deleted successfully!", refresh: true } 
      })
    } catch (err) {
      console.error("Error deleting quiz:", err)
      setError("Failed to delete quiz")
    } finally {
      setDeleting(false)
    }
  }

  const handleEditQuiz = () => {
    navigate(`/faculty/quizzes/${quizId}/edit`, { 
      state: { quizId: quizId } 
    })
  }

  const handleViewAttempts = () => {
    navigate(`/faculty/quizzes/${quizId}/attempts`)
  }

  // Redirect if not faculty
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

  if (error || !quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || "Quiz not found"}
        </div>
        <button
          onClick={() => navigate('/faculty/quizzes')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Back to Quizzes
        </button>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ACTIVE': { color: 'bg-green-100 text-green-800', text: 'Active' },
      'INACTIVE': { color: 'bg-red-100 text-red-800', text: 'Inactive' },
      'DRAFT': { color: 'bg-yellow-100 text-yellow-800', text: 'Draft' }
    }
    const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', text: status }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const getQuizStatusBadge = () => {
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

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/faculty/quizzes')}
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
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{quiz.name}</h1>
            <p className="text-gray-600 mb-2">{quiz.courseName}</p>
            <div className="flex items-center space-x-4">
              {getStatusBadge(quiz.status)}
              {getQuizStatusBadge()}
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleEditQuiz}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Edit Quiz
            </button>
            <button
              onClick={handleDeleteQuiz}
              disabled={deleting}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              {deleting ? 'Deleting...' : 'Delete Quiz'}
            </button>
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
            <p className="text-sm font-medium text-gray-500">Attempts</p>
            <p className="text-gray-900">{attempts.length}</p>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Questions ({quiz.questions?.length || 0})</h2>
        
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
                          checked={option.isCorrect}
                          readOnly
                          className="text-primary"
                        />
                        <span className={`${option.isCorrect ? 'font-semibold text-green-600' : 'text-gray-600'}`}>
                          {String.fromCharCode(65 + optionIndex)}. {option.text}
                          {option.isCorrect && ' (Correct)'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === 'TRUE_FALSE' && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      checked={question.correctAnswer === 'true'}
                      readOnly
                      className="text-primary"
                    />
                    <span className={`${question.correctAnswer === 'true' ? 'font-semibold text-green-600' : 'text-gray-600'}`}>
                      True {question.correctAnswer === 'true' && '(Correct)'}
                    </span>
                    <input
                      type="radio"
                      checked={question.correctAnswer === 'false'}
                      readOnly
                      className="text-primary"
                    />
                    <span className={`${question.correctAnswer === 'false' ? 'font-semibold text-green-600' : 'text-gray-600'}`}>
                      False {question.correctAnswer === 'false' && '(Correct)'}
                    </span>
                  </div>
                )}
                
                {question.type === 'SHORT_ANSWER' && (
                  <div>
                    <p className="text-sm text-gray-500">Correct Answer:</p>
                    <p className="font-semibold text-green-600">{question.correctAnswer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No questions added to this quiz.</p>
        )}
      </div>

      {/* Attempts Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Student Attempts ({attempts.length})</h2>
          {attempts.length > 0 && (
            <button
              onClick={handleViewAttempts}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              View All Attempts
            </button>
          )}
        </div>
        
        {attempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Started At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attempts.slice(0, 5).map((attempt) => (
                  <tr key={attempt.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {attempt.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(attempt.startedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {attempt.submittedAt ? formatDate(attempt.submittedAt) : 'Not submitted'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {attempt.pointsEarned !== null ? `${attempt.pointsEarned}/${attempt.totalPoints} (${attempt.percentage}%)` : 'Not graded'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        attempt.status === 'SUBMITTED' ? 'bg-green-100 text-green-800' :
                        attempt.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {attempt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attempts.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing 5 of {attempts.length} attempts. Click "View All Attempts" to see more.
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No attempts yet.</p>
        )}
      </div>
    </div>
  )
}

export default QuizDetailFaculty 