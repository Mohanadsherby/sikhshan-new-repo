"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate, useParams } from "react-router-dom"
import { getQuizById, startQuizAttempt, submitQuizAttempt, getTimeRemaining, getStudentAttemptForQuiz } from "../../api/quizApi"
import { formatTimeRemaining } from "../../api/quizApi"

function QuizAttemptStudent() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { quizId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  useEffect(() => {
    initializeQuiz()
  }, [quizId, currentUser?.id])

  useEffect(() => {
    let interval
    if (timeRemaining !== null && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            handleSubmitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timeRemaining])

  const initializeQuiz = async () => {
    try {
      setLoading(true)
      
      // Get quiz data
      const quizRes = await getQuizById(quizId)
      setQuiz(quizRes.data)
      
      // Check if student already has an attempt for this quiz
      try {
        const existingAttemptRes = await getStudentAttemptForQuiz(quizId, currentUser.id)
        if (existingAttemptRes.data) {
          setAttempt(existingAttemptRes.data)
          // If attempt is in progress, start timer
          if (existingAttemptRes.data.status === 'IN_PROGRESS') {
            startTimer()
          }
          return
        }
      } catch (err) {
        // No existing attempt found, continue to start new one
      }
      
      // Start new quiz attempt
      try {
        console.log('Starting new quiz attempt with data:', {
          quizId: parseInt(quizId),
          studentId: currentUser.id
        })
        const attemptRes = await startQuizAttempt({
          quizId: parseInt(quizId),
          studentId: parseInt(currentUser.id) // Convert to integer
        })
        setAttempt(attemptRes.data)
        
        // Start timer
        startTimer()
      } catch (err) {
        console.error("Error starting quiz attempt:", err)
        console.error("Error response:", err.response?.data)
        setError(err.response?.data || "Failed to start quiz")
      }
    } catch (err) {
      console.error("Error initializing quiz:", err)
      setError("Failed to load quiz")
    } finally {
      setLoading(false)
    }
  }

  const startTimer = async () => {
    try {
      const timeRes = await getTimeRemaining(quizId, currentUser.id)
      setTimeRemaining(timeRes.data.timeRemaining * 60) // Convert minutes to seconds
    } catch (err) {
      console.error("Error getting time remaining:", err)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmitQuiz = async () => {
    if (!attempt) return

    setSubmitting(true)
    try {
      await submitQuizAttempt({
        id: attempt.id,
        studentId: currentUser.id,
        studentAnswers: answers
      })
      
      navigate(`/student/quizzes/${quizId}/result`, {
        state: { success: "Quiz submitted successfully!" }
      })
    } catch (err) {
      console.error("Error submitting quiz:", err)
      setError(err.response?.data || "Failed to submit quiz")
      setSubmitting(false)
    }
  }

  const handleConfirmSubmit = () => {
    setShowConfirmSubmit(true)
  }

  const handleCancelSubmit = () => {
    setShowConfirmSubmit(false)
  }

  const handleFinalSubmit = () => {
    setShowConfirmSubmit(false)
    handleSubmitQuiz()
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
          {error || "Quiz not available"}
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

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getTimeRemainingColor = () => {
    if (timeRemaining === null) return 'text-gray-600'
    if (timeRemaining > 300) return 'text-green-600' // More than 5 minutes
    if (timeRemaining > 60) return 'text-yellow-600' // More than 1 minute
    return 'text-red-600' // Less than 1 minute
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with Timer */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{quiz.name}</h1>
            <p className="text-gray-600">{quiz.courseName}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getTimeRemainingColor()}`}>
              {timeRemaining !== null ? formatTime(timeRemaining) : '--:--'}
            </div>
            <p className="text-sm text-gray-500">Time Remaining</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Quiz Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Quiz Instructions</h2>
        <ul className="text-blue-700 space-y-1">
          <li>• Read each question carefully before answering</li>
          <li>• You can review and change your answers before submitting</li>
          <li>• The quiz will automatically submit when time runs out</li>
          <li>• Make sure to submit your answers before the time expires</li>
        </ul>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {quiz.questions?.map((question, index) => (
          <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-800">
                Question {index + 1} ({question.type.replace('_', ' ')})
              </h3>
              <span className="text-sm text-gray-500">{question.points} points</span>
            </div>
            
            <p className="text-gray-700 mb-4">{question.text}</p>
            
            {question.type === 'MULTIPLE_CHOICE' && question.options && (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-gray-700">
                      {String.fromCharCode(65 + optionIndex)}. {option.text}
                    </span>
                  </label>
                ))}
              </div>
            )}
            
            {question.type === 'TRUE_FALSE' && (
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value="true"
                    checked={answers[question.id] === 'true'}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">True</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value="false"
                    checked={answers[question.id] === 'false'}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-gray-700">False</span>
                </label>
              </div>
            )}
            
            {question.type === 'SHORT_ANSWER' && (
              <input
                type="text"
                value={answers[question.id] || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Enter your answer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            )}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Questions answered: {Object.keys(answers).length} / {quiz.questions?.length || 0}
            </p>
          </div>
          <button
            onClick={handleConfirmSubmit}
            disabled={submitting}
            className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 font-medium"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Submission</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your quiz? You won't be able to change your answers after submission.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleCancelSubmit}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuizAttemptStudent 