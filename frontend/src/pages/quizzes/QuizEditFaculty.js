"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { getQuizById, updateQuiz } from "../../api/quizApi"
import { getCoursesByInstructor } from "../../api/courseApi"

function QuizEditFaculty() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { quizId } = useParams()
  const location = useLocation()
  const [formData, setFormData] = useState({
    name: "",
    courseId: "",
    description: "",
    startDate: "",
    startTime: "",
    durationMinutes: "",
    totalPoints: 0, // Will be calculated automatically
    status: "ACTIVE",
    questions: [],
  })
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const calculateTotalPoints = (questions) => {
    return questions.reduce((total, question) => total + (question.points || 0), 0)
  }

  const updateTotalPoints = () => {
    const total = calculateTotalPoints(formData.questions)
    setFormData(prev => ({ ...prev, totalPoints: total }))
  }

  // Update total points whenever questions change
  useEffect(() => {
    updateTotalPoints()
  }, [formData.questions])

  // Fetch courses for the instructor
  useEffect(() => {
    const fetchCourses = async () => {
      if (currentUser?.id) {
        try {
          const response = await getCoursesByInstructor(currentUser.id)
          setCourses(response.data)
        } catch (err) {
          console.error("Error fetching courses:", err)
          setError("Failed to load courses")
        }
      }
    }
    fetchCourses()
  }, [currentUser?.id])

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      if (quizId) {
        try {
          const response = await getQuizById(quizId)
          const quiz = response.data
          
          // Parse the start date and time
          const startDateTime = new Date(quiz.startDateTime)
          const startDate = startDateTime.toISOString().split('T')[0]
          const startTime = startDateTime.toTimeString().slice(0, 5)
          
          setFormData({
            name: quiz.name || "",
            courseId: quiz.courseId?.toString() || "",
            description: quiz.description || "",
            startDate: startDate,
            startTime: startTime,
            durationMinutes: quiz.durationMinutes?.toString() || "",
            totalPoints: quiz.totalPoints || 100,
            status: quiz.status || "ACTIVE",
            questions: quiz.questions?.map(q => ({
              id: q.id || Date.now() + Math.random(),
              type: q.type,
              text: q.text,
              points: q.points || 1,
              correctAnswer: q.correctAnswer || "",
              options: q.options?.map(o => ({
                id: o.id || Date.now() + Math.random(),
                text: o.text,
                isCorrect: o.isCorrect
              })) || []
            })) || []
          })
        } catch (err) {
          console.error("Error fetching quiz:", err)
          setError("Failed to load quiz data")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchQuiz()
  }, [quizId])

  // Refresh data if coming from edit
  useEffect(() => {
    if (location.state?.refresh) {
      window.location.reload()
    }
  }, [location.state])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Redirect if not faculty
  if (currentUser?.role !== "FACULTY") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const addQuestion = (type) => {
    const newQuestion = {
      id: Date.now() + Math.random(),
      type: type.toUpperCase(),
      text: "",
      points: 1,
      correctAnswer: type === "TRUE_FALSE" ? "true" : "",
      options: type === "MULTIPLE_CHOICE" 
        ? [
            { id: Date.now() + 1, text: "", isCorrect: false },
            { id: Date.now() + 2, text: "", isCorrect: false },
          ]
        : [],
    }

    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    })
  }

  const removeQuestion = (questionId) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((q) => q.id !== questionId),
    })
  }

  const handleQuestionChange = (questionId, field, value) => {
    setFormData({
      ...formData,
      questions: formData.questions.map((q) => {
        if (q.id === questionId) {
          return { ...q, [field]: value }
        }
        return q
      }),
    })
  }

  const handleOptionChange = (questionId, optionId, field, value) => {
    setFormData({
      ...formData,
      questions: formData.questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.map((o) => {
              if (o.id === optionId) {
                return { ...o, [field]: value }
              }
              return o
            }),
          }
        }
        return q
      }),
    })
  }

  const addOption = (questionId) => {
    setFormData({
      ...formData,
      questions: formData.questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: [...q.options, { id: Date.now() + Math.random(), text: "", isCorrect: false }],
          }
        }
        return q
      }),
    })
  }

  const removeOption = (questionId, optionId) => {
    setFormData({
      ...formData,
      questions: formData.questions.map((q) => {
        if (q.id === questionId) {
          return {
            ...q,
            options: q.options.filter((o) => o.id !== optionId),
          }
        }
        return q
      }),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      // Validate required fields
      if (!formData.name || !formData.courseId || !formData.startDate || !formData.startTime || !formData.durationMinutes) {
        setError("Please fill in all required fields")
        return
      }

      if (formData.questions.length === 0) {
        setError("Please add at least one question")
        return
      }

      // Parse the date and time inputs
      const [year, month, day] = formData.startDate.split('-').map(Number)
      const [hours, minutes] = formData.startTime.split(':').map(Number)
      
      // Create date in local timezone (assuming browser is in Kathmandu timezone)
      const localDateTime = new Date(year, month - 1, day, hours, minutes)
      
      // Convert to UTC by subtracting the timezone offset
      const utcDateTime = new Date(localDateTime.getTime() - (localDateTime.getTimezoneOffset() * 60000))

      // Prepare quiz data for backend
      const quizData = {
        name: formData.name,
        description: formData.description,
        startDateTime: utcDateTime.toISOString(),
        durationMinutes: parseInt(formData.durationMinutes),
        totalPoints: parseInt(formData.totalPoints),
        status: formData.status,
        courseId: parseInt(formData.courseId),
        instructorId: currentUser.id,
        questions: formData.questions.map(q => ({
          id: q.id,
          text: q.text,
          type: q.type,
          points: parseInt(q.points),
          correctAnswer: q.correctAnswer,
          options: q.options?.map(o => ({
            id: o.id,
            text: o.text,
            isCorrect: o.isCorrect
          })) || []
        }))
      }

      // Update quiz
      await updateQuiz(quizId, quizData)
      
      alert("Quiz updated successfully!")
      navigate('/faculty/quizzes', { 
        state: { success: "Quiz updated successfully!", refresh: true } 
      })

    } catch (err) {
      console.error("Error updating quiz:", err)
      setError(err.response?.data || "Failed to update quiz. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        type="button"
        onClick={() => navigate('/faculty/quizzes')}
        className="mb-4 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-50"
      >
        Go Back
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Quiz</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Quiz Title
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Course */}
            <div>
              <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                Course
              </label>
              <select
                id="courseId"
                name="courseId"
                value={formData.courseId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Points */}
            <div>
              <label htmlFor="totalPoints" className="block text-sm font-medium text-gray-700 mb-1">
                Total Points (Auto-calculated)
              </label>
              <input
                type="number"
                id="totalPoints"
                name="totalPoints"
                value={formData.totalPoints}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
              />
              <p className="text-xs text-gray-500 mt-1">
                Calculated from the sum of all question points
              </p>
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Start Time */}
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="durationMinutes" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                id="durationMinutes"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleChange}
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Questions</h2>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => addQuestion("MULTIPLE_CHOICE")}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Add Multiple Choice
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion("TRUE_FALSE")}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  Add True/False
                </button>
                <button
                  type="button"
                  onClick={() => addQuestion("SHORT_ANSWER")}
                  className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                >
                  Add Short Answer
                </button>
              </div>
            </div>

            {formData.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-800">
                    Question {index + 1} ({question.type.replace('_', ' ')})
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(question.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text
                    </label>
                    <textarea
                      value={question.text}
                      onChange={(e) => handleQuestionChange(question.id, "text", e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter your question..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Points
                    </label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={(e) => handleQuestionChange(question.id, "points", parseInt(e.target.value))}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                {/* Question-specific inputs */}
                {question.type === "MULTIPLE_CHOICE" && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Options</label>
                      <button
                        type="button"
                        onClick={() => addOption(question.id)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Add Option
                      </button>
                    </div>
                    {question.options.map((option, optionIndex) => (
                      <div key={option.id} className="flex items-center space-x-2 mb-2">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={option.isCorrect}
                          onChange={() => {
                            // Set all options to false, then set this one to true
                            setFormData({
                              ...formData,
                              questions: formData.questions.map((q) => {
                                if (q.id === question.id) {
                                  return {
                                    ...q,
                                    options: q.options.map((o, idx) => ({
                                      ...o,
                                      isCorrect: idx === optionIndex
                                    }))
                                  }
                                }
                                return q
                              })
                            })
                          }}
                          className="text-primary focus:ring-primary"
                        />
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => handleOptionChange(question.id, option.id, "text", e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(question.id, option.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "TRUE_FALSE" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correct Answer
                    </label>
                    <select
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(question.id, "correctAnswer", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                )}

                {question.type === "SHORT_ANSWER" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(question.id, "correctAnswer", e.target.value)}
                      placeholder="Enter the correct answer..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/faculty/quizzes')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuizEditFaculty 