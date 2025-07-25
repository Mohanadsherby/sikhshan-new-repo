"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

function AssignmentCreation() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    course: "",
    description: "",
    dueDate: "",
    dueTime: "",
    totalPoints: "",
    attachments: [],
    plagiarismCheck: false,
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
    const { name, value, type, checked, files } = e.target

    if (type === "file") {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...Array.from(files)],
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      })
    }
  }

  const handleRemoveAttachment = (index) => {
    const updatedAttachments = [...formData.attachments]
    updatedAttachments.splice(index, 1)
    setFormData({
      ...formData,
      attachments: updatedAttachments,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
    alert("Assignment created successfully!")

    // Reset form
    setFormData({
      title: "",
      course: "",
      description: "",
      dueDate: "",
      dueTime: "",
      totalPoints: "",
      attachments: [],
      plagiarismCheck: false,
    })
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        type="button"
        onClick={() => navigate('/faculty/assignments')}
        className="mb-4 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-50"
      >
        Go Back
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Assignment</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Title
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

            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Due Time */}
            <div>
              <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">
                Due Time
              </label>
              <input
                type="time"
                id="dueTime"
                name="dueTime"
                value={formData.dueTime}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Assignment Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              ></textarea>
            </div>

            {/* Attachments */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="attachments"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX, ZIP up to 10MB</p>
                </div>
              </div>

              {/* Display attached files */}
              {formData.attachments.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Attached Files:</h4>
                  <ul className="mt-2 divide-y divide-gray-200 border border-gray-200 rounded-md">
                    {formData.attachments.map((file, index) => (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <svg
                            className="flex-shrink-0 h-5 w-5 text-gray-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(index)}
                            className="font-medium text-primary hover:text-primary-dark"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Plagiarism Check */}
            <div className="col-span-2">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="plagiarismCheck"
                    name="plagiarismCheck"
                    type="checkbox"
                    checked={formData.plagiarismCheck}
                    onChange={handleChange}
                    className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="plagiarismCheck" className="font-medium text-gray-700">
                    Enable Plagiarism Check
                  </label>
                  <p className="text-gray-500">Automatically check student submissions for plagiarism.</p>
                </div>
              </div>
            </div>
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
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignmentCreation
