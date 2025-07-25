"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"

// Mock data for quizzes
const mockQuizzes = [
  {
    id: 1,
    title: "Programming Basics Quiz",
    course: "CS101",
    courseName: "Introduction to Computer Science",
    startDate: "2024-03-20",
    startTime: "10:00",
    duration: 30,
    totalPoints: 20,
    submissions: 35,
    status: "active",
    description: "Test your knowledge of basic programming concepts.",
  },
  {
    id: 2,
    title: "Data Structures Quiz",
    course: "CS201",
    courseName: "Data Structures and Algorithms",
    startDate: "2024-03-25",
    startTime: "14:00",
    duration: 45,
    totalPoints: 30,
    submissions: 28,
    status: "active",
    description: "Quiz covering arrays, linked lists, and basic algorithms.",
  },
  {
    id: 3,
    title: "Database Concepts Quiz",
    course: "CS301",
    courseName: "Database Management Systems",
    startDate: "2024-03-15",
    startTime: "11:00",
    duration: 40,
    totalPoints: 25,
    submissions: 30,
    status: "completed",
    description: "Test your understanding of database fundamentals.",
  },
]

function QuizListFaculty() {
  const { currentUser } = useAuth()
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [filter, setFilter] = useState("all") // all, active, completed
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    description: "",
    startDate: "",
    startTime: "",
    duration: "",
    totalPoints: "",
    shuffleQuestions: false,
    showResults: "immediately",
    questions: [],
  })

  // Mock courses for dropdown
  const courses = [
    { id: 1, name: "Introduction to Computer Science", code: "CS101" },
    { id: 2, name: "Data Structures and Algorithms", code: "CS201" },
    { id: 3, name: "Database Management Systems", code: "CS301" },
  ]

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
      id: Date.now(),
      type,
      text: "",
      points: 1,
      options:
        type === "multiple_choice"
          ? [
              { id: Date.now() + 1, text: "", isCorrect: false },
              { id: Date.now() + 2, text: "", isCorrect: false },
            ]
          : [],
      answer: type === "true_false" ? "true" : "",
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
              // If setting this option as correct, make sure others are not correct
              if (field === "isCorrect" && value === true) {
                return { ...o, isCorrect: o.id === optionId }
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
            options: [...q.options, { id: Date.now(), text: "", isCorrect: false }],
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Quiz created:", formData)
    alert("Quiz created successfully!")

    // Reset form and return to list view
    setFormData({
      title: "",
      course: "",
      description: "",
      startDate: "",
      startTime: "",
      duration: "",
      totalPoints: "",
      shuffleQuestions: false,
      showResults: "immediately",
      questions: [],
    })
    setIsCreating(false)
  }

  const filteredQuizzes = mockQuizzes.filter((quiz) => {
    if (filter === "all") return true
    return quiz.status === filter
  })

  const handleDelete = (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      // Here you would typically make an API call to delete the quiz
      alert("Quiz deleted (mock)")
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quizzes</h1>
        <div className="flex space-x-4 mt-4 md:mt-0">
          {!isCreating && (
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
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            {isCreating ? "Back to List" : "Create Quiz"}
          </button>
        </div>
      </div>

      {isCreating ? (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Course */}
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
                  Course
                </label>
                <select
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.code}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Points */}
              <div>
                <label htmlFor="totalPoints" className="block text-sm font-medium text-gray-700 mb-1">
                  Total Points
                </label>
                <input
                  type="number"
                  id="totalPoints"
                  name="totalPoints"
                  value={formData.totalPoints}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
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
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Show Results */}
              <div>
                <label htmlFor="showResults" className="block text-sm font-medium text-gray-700 mb-1">
                  Show Results
                </label>
                <select
                  id="showResults"
                  name="showResults"
                  value={formData.showResults}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  <option value="immediately">Immediately after submission</option>
                  <option value="after_due">After due date</option>
                  <option value="manual">Manual release</option>
                </select>
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              {/* Shuffle Questions */}
              <div className="col-span-2">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="shuffleQuestions"
                      name="shuffleQuestions"
                      type="checkbox"
                      checked={formData.shuffleQuestions}
                      onChange={handleChange}
                      className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="shuffleQuestions" className="font-medium text-gray-700">
                      Shuffle Questions
                    </label>
                    <p className="text-gray-500">Randomize the order of questions for each student.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Questions</h2>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => addQuestion("multiple_choice")}
                    className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-700"
                  >
                    Add Multiple Choice
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuestion("true_false")}
                    className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-700"
                  >
                    Add True/False
                  </button>
                  <button
                    type="button"
                    onClick={() => addQuestion("short_answer")}
                    className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary-700"
                  >
                    Add Short Answer
                  </button>
                </div>
              </div>

              {formData.questions.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-md">
                  <p className="text-gray-500">No questions added yet. Use the buttons above to add questions.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-md font-medium text-gray-800">Question {index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeQuestion(question.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                          <input
                            type="text"
                            value={question.text}
                            onChange={(e) => handleQuestionChange(question.id, "text", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Enter your question"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                          <input
                            type="number"
                            value={question.points}
                            onChange={(e) => handleQuestionChange(question.id, "points", e.target.value)}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          />
                        </div>

                        {question.type === "multiple_choice" && (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Options</label>
                            {question.options.map((option) => (
                              <div key={option.id} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={option.isCorrect}
                                  onChange={() => handleOptionChange(question.id, option.id, "isCorrect", true)}
                                  className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                                />
                                <input
                                  type="text"
                                  value={option.text}
                                  onChange={(e) => handleOptionChange(question.id, option.id, "text", e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                                  placeholder="Enter option text"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeOption(question.id, option.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addOption(question.id)}
                              className="text-sm text-primary hover:text-primary-dark"
                            >
                              + Add Option
                            </button>
                          </div>
                        )}

                        {question.type === "true_false" && (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                            <select
                              value={question.answer}
                              onChange={(e) => handleQuestionChange(question.id, "answer", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            >
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          </div>
                        )}

                        {question.type === "short_answer" && (
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                            <input
                              type="text"
                              value={question.answer}
                              onChange={(e) => handleQuestionChange(question.id, "answer", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                              placeholder="Enter the correct answer"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                Create Quiz
              </button>
            </div>
          </form>
        </div>
      ) : (
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
                    className={`p-6 hover:bg-gray-50 cursor-pointer ${selectedQuiz?.id === quiz.id ? 'bg-primary-50' : ''}`}
                    onClick={() => setSelectedQuiz(quiz)}
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{quiz.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {quiz.course} - {quiz.courseName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Start: {quiz.startDate} at {quiz.startTime} (Duration: {quiz.duration} minutes)
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          quiz.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                      </span>
                      <span className="text-sm text-gray-500">{quiz.submissions} Submissions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quiz Details */}
          <div>
            {selectedQuiz ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">{selectedQuiz.title}</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Course</p>
                    <p className="text-base text-gray-900">
                      {selectedQuiz.course} - {selectedQuiz.courseName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Time</p>
                    <p className="text-base text-gray-900">
                      {selectedQuiz.startDate} at {selectedQuiz.startTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="text-base text-gray-900">{selectedQuiz.duration} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Points</p>
                    <p className="text-base text-gray-900">{selectedQuiz.totalPoints}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Submissions</p>
                    <p className="text-base text-gray-900">{selectedQuiz.submissions}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-base text-gray-900">{selectedQuiz.description}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => handleDelete(selectedQuiz.id)}
                    className="w-full px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  >
                    Delete Quiz
                  </button>
                  <Link
                    to={`/faculty/quizzes/${selectedQuiz.id}/view`}
                    className="block w-full px-4 py-2 border border-primary text-primary text-center rounded-md hover:bg-primary-50"
                  >
                    View Quiz
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
      )}
    </div>
  )
}

export default QuizListFaculty 