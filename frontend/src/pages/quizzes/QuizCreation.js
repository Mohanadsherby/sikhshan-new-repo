"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

function QuizCreation() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
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

    // Reset form
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Quiz</h1>

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

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) => handleQuestionChange(question.id, "text", e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                        <input
                          type="number"
                          value={question.points}
                          onChange={(e) => handleQuestionChange(question.id, "points", Number.parseInt(e.target.value))}
                          required
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Question type specific fields */}
                    {question.type === "multiple_choice" && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">Options</label>
                          <button
                            type="button"
                            onClick={() => addOption(question.id)}
                            className="text-sm text-primary hover:text-primary-800"
                          >
                            Add Option
                          </button>
                        </div>

                        {question.options.map((option) => (
                          <div key={option.id} className="flex items-center space-x-2 mb-2">
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
                              placeholder="Option text"
                              required
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            />
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(question.id, option.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === "true_false" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`true-${question.id}`}
                              checked={question.answer === "true"}
                              onChange={() => handleQuestionChange(question.id, "answer", "true")}
                              className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                            />
                            <label htmlFor={`true-${question.id}`} className="ml-2 block text-sm text-gray-700">
                              True
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              id={`false-${question.id}`}
                              checked={question.answer === "false"}
                              onChange={() => handleQuestionChange(question.id, "answer", "false")}
                              className="focus:ring-primary h-4 w-4 text-primary border-gray-300"
                            />
                            <label htmlFor={`false-${question.id}`} className="ml-2 block text-sm text-gray-700">
                              False
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {question.type === "short_answer" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Correct Answer</label>
                        <input
                          type="text"
                          value={question.answer}
                          onChange={(e) => handleQuestionChange(question.id, "answer", e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                          placeholder="Enter the correct answer"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Create Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuizCreation
