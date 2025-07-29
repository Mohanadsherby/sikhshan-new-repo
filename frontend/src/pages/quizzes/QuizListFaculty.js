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
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>
    } else if (status === 'NOT_STARTED') {
      return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Not Started</span>
    } else {
      return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Ended</span>
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
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quizzes</h1>
        <div className="flex space-x-4 mt-4 md:mt-0">
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
            Create Quiz
          </Link>
        </div>
      </div>

      {error && <div className="text-center py-4 text-red-600">{error}</div>}
      
      {location.state?.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {location.state.success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">All Quizzes</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer ${quiz.id === location.state?.selectedQuizId ? 'bg-primary-50' : ''}`}
                  onClick={() => navigate(`/faculty/quizzes/${quiz.id}/view`, { state: { selectedQuizId: quiz.id } })}
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{quiz.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {quiz.courseName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Start: {formatDate(quiz.startDateTime)} (Duration: {quiz.durationMinutes} minutes)
                    </p>
                    <p className="text-sm text-gray-500">
                      Total Points: {quiz.totalPoints} | Attempts: {quiz.attemptCount || 0}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    {getStatusBadge(quiz)}
                    <div className="flex space-x-2">
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

        {/* Quiz Details */}
        <div>
          {location.state?.selectedQuizId && quizzes.find(q => q.id === location.state.selectedQuizId) ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{quizzes.find(q => q.id === location.state.selectedQuizId)?.name}</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Course</p>
                  <p className="text-base text-gray-900">
                    {quizzes.find(q => q.id === location.state.selectedQuizId)?.courseName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Time</p>
                  <p className="text-base text-gray-900">
                    {formatDate(quizzes.find(q => q.id === location.state.selectedQuizId)?.startDateTime)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="text-base text-gray-900">{quizzes.find(q => q.id === location.state.selectedQuizId)?.durationMinutes} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Points</p>
                  <p className="text-base text-gray-900">{quizzes.find(q => q.id === location.state.selectedQuizId)?.totalPoints}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Attempts</p>
                  <p className="text-base text-gray-900">{quizzes.find(q => q.id === location.state.selectedQuizId)?.attemptCount || 0}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-base text-gray-900">{quizzes.find(q => q.id === location.state.selectedQuizId)?.description}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
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
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Select a quiz to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuizListFaculty 