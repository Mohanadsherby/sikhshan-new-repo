"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { getQuizzesByInstructor, deleteQuiz } from "../../api/quizApi"
import { getCoursesByInstructor } from "../../api/courseApi"
import { formatDate, getQuizStatus, isQuizActive, isQuizOverdue } from "../../api/quizApi"

function QuizListFaculty() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [quizzes, setQuizzes] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all") // all, active, completed
  const [deleting, setDeleting] = useState(false)

  // Fetch quizzes and courses
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.id) {
        setLoading(true)
        try {
          const [quizzesRes, coursesRes] = await Promise.all([
            getQuizzesByInstructor(currentUser.id),
            getCoursesByInstructor(currentUser.id)
          ])
          setQuizzes(quizzesRes.data)
          setCourses(coursesRes.data)
        } catch (err) {
          console.error("Error fetching data:", err)
          setError("Failed to load quizzes")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchData()
  }, [currentUser?.id])

  // Refresh data when returning from create/edit
  useEffect(() => {
    if (location.state?.refresh) {
      const fetchQuizzes = async () => {
        try {
          const response = await getQuizzesByInstructor(currentUser.id)
          setQuizzes(response.data)
        } catch (err) {
          console.error("Error refreshing quizzes:", err)
        }
      }
      fetchQuizzes()
      navigate(location.pathname, { replace: true, state: {} })
    }
  }, [location.state])

  // Redirect if not faculty
  if (currentUser?.role !== "FACULTY") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>
  }

  const handleDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      return
    }
    
    setDeleting(true)
    try {
      await deleteQuiz(quizId)
      setQuizzes(prev => prev.filter(q => q.id !== quizId))
    } catch (err) {
      console.error("Error deleting quiz:", err)
      setError("Failed to delete quiz")
    } finally {
      setDeleting(false)
    }
  }

  const getStatusBadge = (quiz) => {
    const status = getQuizStatus(quiz)
    if (status === 'ACTIVE') {
      return <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full border border-green-200">Active</span>
    } else if (status === 'NOT_STARTED') {
      return <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">Not Started</span>
    } else {
      return <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full border border-gray-200">Ended</span>
    }
  }

  const filteredQuizzes = quizzes.filter(quiz => {
    if (filter === "all") return true
    if (filter === "active") return isQuizActive(quiz)
    if (filter === "completed") return isQuizOverdue(quiz)
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">All Quizzes</h1>
          <p className="text-gray-600">Manage and monitor your course quizzes</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-0">
          {!loading && (
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="all">All Quizzes</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          )}
          <Link
            to="/faculty/quizzes/create"
            state={{ refresh: false }}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            + Create Quiz
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {location.state?.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg mb-6">
          {location.state.success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quiz List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <h2 className="text-xl font-semibold text-gray-800">Quiz Overview</h2>
              <p className="text-gray-600 mt-1">Click on a quiz to view details and manage attempts</p>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className={`p-8 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${quiz.id === location.state?.selectedQuizId ? 'bg-primary-50 border-l-4 border-primary' : ''}`}
                  onClick={() => navigate(`/faculty/quizzes/${quiz.id}/view`, { state: { selectedQuizId: quiz.id } })}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 mb-6 lg:mb-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-900">{quiz.name}</h3>
                        {getStatusBadge(quiz)}
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-600 font-medium">
                          {quiz.courseName}
                        </p>
                        <p className="text-gray-500">
                          Start: {formatDate(quiz.startDateTime)} • Duration: {quiz.durationMinutes} minutes
                        </p>
                        <p className="text-gray-500">
                          Total Points: {quiz.totalPoints} • Attempts: {quiz.attemptCount || 0}
                        </p>
                      </div>
                    </div>
                                          <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/faculty/quizzes/${quiz.id}/edit`)
                          }}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/faculty/quizzes/${quiz.id}`)
                          }}
                          className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
                        >
                          Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/faculty/quizzes/${quiz.id}/view`)
                          }}
                          className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Attempts
                        </button>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz Details Sidebar */}
        <div>
          {location.state?.selectedQuizId && quizzes.find(q => q.id === location.state.selectedQuizId) ? (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 sticky top-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {quizzes.find(q => q.id === location.state.selectedQuizId)?.name}
                </h2>
                {getStatusBadge(quizzes.find(q => q.id === location.state.selectedQuizId))}
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Quiz Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Course</p>
                      <p className="text-base text-gray-900 font-medium">
                        {quizzes.find(q => q.id === location.state.selectedQuizId)?.courseName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Start Time</p>
                      <p className="text-base text-gray-900">
                        {formatDate(quizzes.find(q => q.id === location.state.selectedQuizId)?.startDateTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Duration</p>
                      <p className="text-base text-gray-900">{quizzes.find(q => q.id === location.state.selectedQuizId)?.durationMinutes} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Points</p>
                      <p className="text-base text-gray-900 font-semibold text-primary">{quizzes.find(q => q.id === location.state.selectedQuizId)?.totalPoints} pts</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Attempts</p>
                      <p className="text-base text-gray-900 font-semibold">{quizzes.find(q => q.id === location.state.selectedQuizId)?.attemptCount || 0}</p>
                    </div>
                  </div>
                </div>

                {quizzes.find(q => q.id === location.state.selectedQuizId)?.description && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Description</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {quizzes.find(q => q.id === location.state.selectedQuizId)?.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={() => handleDelete(location.state.selectedQuizId)}
                  className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete Quiz"}
                </button>
                <Link
                  to={`/faculty/quizzes/${location.state.selectedQuizId}/edit`}
                  className="block w-full px-4 py-2 border border-blue-600 text-blue-600 text-center rounded-md hover:bg-blue-50"
                >
                  Edit Quiz
                </Link>
                <Link
                  to={`/faculty/quizzes/${location.state.selectedQuizId}`}
                  className="block w-full px-4 py-2 border border-primary text-primary text-center rounded-md hover:bg-primary-50"
                >
                  View Details
                </Link>
                <Link
                  to={`/faculty/quizzes/${location.state.selectedQuizId}/view`}
                  className="block w-full px-4 py-2 border border-green-600 text-green-600 text-center rounded-md hover:bg-green-50"
                >
                  View Attempts
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Quiz Selected</h3>
              <p className="text-gray-600">Click on a quiz from the list to view its details and manage options</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizListFaculty 