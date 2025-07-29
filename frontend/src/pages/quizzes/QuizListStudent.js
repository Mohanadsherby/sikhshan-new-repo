"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate, useLocation } from "react-router-dom"
import { getActiveQuizzesByCourse, getAttemptsByStudent } from "../../api/quizApi"
import { getCoursesByStudent } from "../../api/courseApi"
import { formatDate, getQuizStatus, isQuizActive, isQuizOverdue, formatTimeRemaining } from "../../api/quizApi"

function QuizListStudent() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [quizzes, setQuizzes] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [studentAttempts, setStudentAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  }, [currentUser?.id])

  // Refresh data if coming from other pages
  useEffect(() => {
    if (location.state?.refresh) {
      fetchData()
    }
  }, [location.state])

  const fetchData = async () => {
    if (!currentUser?.id) return

    try {
      setLoading(true)
      
      // Fetch enrolled courses
      const coursesRes = await getCoursesByStudent(currentUser.id)
      setEnrolledCourses(coursesRes.data)
      
      // Fetch student attempts
      const attemptsRes = await getAttemptsByStudent(currentUser.id)
      setStudentAttempts(attemptsRes.data)
      
      // Fetch active quizzes for all enrolled courses
      const courseIds = coursesRes.data.map(course => course.courseId || course.id).filter(Boolean)
      console.log('Enrolled courses:', coursesRes.data)
      console.log('Course IDs:', courseIds)
      const allQuizzes = []
      
      for (const courseId of courseIds) {
        try {
          const quizzesRes = await getActiveQuizzesByCourse(courseId)
          allQuizzes.push(...quizzesRes.data)
        } catch (err) {
          console.error(`Error fetching quizzes for course ${courseId}:`, err)
        }
      }
      
      setQuizzes(allQuizzes)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load quizzes")
    } finally {
      setLoading(false)
    }
  }

  const getStudentAttemptForQuiz = (quizId) => {
    return studentAttempts.find(attempt => attempt.quizId === quizId)
  }

  const handleStartQuiz = (quiz) => {
    navigate(`/student/quizzes/${quiz.id}/attempt`)
  }

  const handleViewQuiz = (quiz) => {
    navigate(`/student/quizzes/${quiz.id}`)
  }

  const handleViewAttempt = (quiz) => {
    const attempt = getStudentAttemptForQuiz(quiz.id)
    if (attempt) {
      navigate(`/student/quizzes/${quiz.id}/result`)
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

  const getStatusBadge = (quiz) => {
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

  const getActionButton = (quiz) => {
    const attempt = getStudentAttemptForQuiz(quiz.id)
    const status = getQuizStatus(quiz)
    
    if (attempt && attempt.status === 'SUBMITTED') {
      return (
        <button
          onClick={() => handleViewAttempt(quiz)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 w-full"
        >
          View Result
        </button>
      )
    }
    
    if (attempt && attempt.status === 'IN_PROGRESS') {
      return (
        <button
          onClick={() => handleStartQuiz(quiz)}
          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 w-full"
        >
          Continue Quiz
        </button>
      )
    }
    
    if (status === 'ACTIVE') {
      return (
        <button
          onClick={() => handleStartQuiz(quiz)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark w-full"
        >
          Start Quiz
        </button>
      )
    }
    
    if (status === 'NOT_STARTED') {
      return (
        <span className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed w-full text-center block">
          Not Available Yet
        </span>
      )
    }
    
    return (
      <span className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed w-full text-center block">
        Quiz Ended
      </span>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Quizzes</h1>
      </div>

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

      {quizzes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Quizzes Available</h2>
          <p className="text-gray-600">
            There are no quizzes available for your enrolled courses at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Available Quizzes Section */}
          {quizzes.filter(quiz => {
            const attempt = getStudentAttemptForQuiz(quiz.id)
            return !attempt || attempt.status === 'IN_PROGRESS'
          }).length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Available Quizzes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.filter(quiz => {
                  const attempt = getStudentAttemptForQuiz(quiz.id)
                  return !attempt || attempt.status === 'IN_PROGRESS'
                }).map((quiz) => {
                  const attempt = getStudentAttemptForQuiz(quiz.id)
                  const status = getQuizStatus(quiz)
                  
                  return (
                    <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                          {quiz.name}
                        </h3>
                        {getStatusBadge(quiz)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{quiz.courseName}</p>
                      
                      {quiz.description && (
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                          {quiz.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Start Time:</span>
                          <span className="text-gray-900">{formatDate(quiz.startDateTime)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Duration:</span>
                          <span className="text-gray-900">{quiz.durationMinutes} minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Points:</span>
                          <span className="text-gray-900">{quiz.totalPoints}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Questions:</span>
                          <span className="text-gray-900">{quiz.questions?.length || 0}</span>
                        </div>
                      </div>
                      
                      {attempt && attempt.status === 'IN_PROGRESS' && (
                        <div className="mb-4 p-3 bg-yellow-50 rounded-md border border-yellow-200">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Your Attempt:</span>
                            <span className="font-medium text-yellow-600">In Progress</span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        {getActionButton(quiz)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Attempted Quizzes Section */}
          {quizzes.filter(quiz => {
            const attempt = getStudentAttemptForQuiz(quiz.id)
            return attempt && attempt.status === 'SUBMITTED'
          }).length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Attempted Quizzes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.filter(quiz => {
                  const attempt = getStudentAttemptForQuiz(quiz.id)
                  return attempt && attempt.status === 'SUBMITTED'
                }).map((quiz) => {
                  const attempt = getStudentAttemptForQuiz(quiz.id)
                  const status = getQuizStatus(quiz)
                  
                  return (
                    <div key={quiz.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-green-500">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                          {quiz.name}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{quiz.courseName}</p>
                      
                      {quiz.description && (
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                          {quiz.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Start Time:</span>
                          <span className="text-gray-900">{formatDate(quiz.startDateTime)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Duration:</span>
                          <span className="text-gray-900">{quiz.durationMinutes} minutes</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Points:</span>
                          <span className="text-gray-900">{quiz.totalPoints}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Questions:</span>
                          <span className="text-gray-900">{quiz.questions?.length || 0}</span>
                        </div>
                      </div>
                      
                      {attempt && (
                        <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-200">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Your Attempt:</span>
                            <span className="font-medium text-green-600">Completed</span>
                          </div>
                          {attempt.pointsEarned !== null && (
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-gray-500">Score:</span>
                              <span className="font-medium text-gray-900">
                                {attempt.pointsEarned}/{attempt.totalPoints} ({attempt.percentage}%)
                              </span>
                            </div>
                          )}
                          {attempt.letterGrade && (
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-gray-500">Grade:</span>
                              <span className="font-medium text-gray-900">
                                {attempt.letterGrade} - {attempt.performanceDescription}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        {getActionButton(quiz)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QuizListStudent 