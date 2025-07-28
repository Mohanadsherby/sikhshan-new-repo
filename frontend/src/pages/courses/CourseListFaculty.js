"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"
import { getCoursesByInstructor, createCourse, uploadCourseImage, deleteCourse } from '../../api/courseApi';

// Helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date)) return "-";
  return date.toLocaleDateString();
};

// Helper to get course image URL
const getCourseImageUrl = (imageUrl) => {
  if (!imageUrl) return "/placeholder.jpg";
  if (imageUrl.startsWith('http')) return imageUrl;
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081' + imageUrl;
};

function CourseListFaculty() {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    category: "",
    startDate: "",
    endDate: "",
    credits: "",
    status: "ACTIVE"
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await getCoursesByInstructor(currentUser.id);
        setCourses(res.data);
      } catch (err) {
        setError("Failed to load courses.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.id) fetchCourses();
  }, [currentUser]);

  // Redirect if not faculty
  if (currentUser?.role !== "FACULTY") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true);
    setError("");
    
    try {
      const courseData = {
        ...formData,
        instructorId: currentUser.id,
        credits: parseInt(formData.credits) || 0
      };
      
      // Create course first
      const res = await createCourse(courseData);
      const createdCourse = res.data;
      
      // Upload image if selected
      if (selectedImage) {
        try {
          const formData = new FormData();
          formData.append('file', selectedImage);
          const imageRes = await uploadCourseImage(createdCourse.id, formData);
          // Update the course with the new image URL
          createdCourse.imageUrl = imageRes.data.imageUrl;
        } catch (imageErr) {
          console.error("Error uploading image:", imageErr);
          // Don't fail the entire operation if image upload fails
        }
      }
      
      setCourses(prev => [createdCourse, ...prev]);
      
      // Reset form and return to list view
      setFormData({
        name: "",
        code: "",
        description: "",
        category: "",
        startDate: "",
        endDate: "",
        credits: "",
        status: "ACTIVE"
      });
      setSelectedImage(null);
      setImagePreview(null);
      setIsCreating(false);
    } catch (err) {
      setError(err.response?.data || "Failed to create course.");
      console.error("Error creating course:", err);
    } finally {
      setSubmitting(false);
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    try {
      await deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      setSelectedCourse(null);
    } catch (err) {
      setError("Failed to delete course. " + (err.response?.data || ""));
      console.error("Error deleting course:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark mt-4 md:mt-0"
        >
          {isCreating ? "Back to List" : "Create New Course"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isCreating ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Course</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Name */}
              <div className="col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name *
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

              {/* Course Code */}
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Code *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Credits */}
              <div>
                <label htmlFor="credits" className="block text-sm font-medium text-gray-700 mb-1">
                  Credits
                </label>
                <input
                  type="number"
                  id="credits"
                  name="credits"
                  value={formData.credits}
                  onChange={handleChange}
                  min="0"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
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
                  Course Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              {/* Image Upload */}
              <div className="col-span-2">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                  Course Image
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark"
                  />
                  {selectedImage && (
                    <div className="flex items-center space-x-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <span className="text-sm text-green-600">✓ Image selected</span>
                    </div>
                  )}
                </div>
                {selectedImage && (
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {selectedImage.name}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="col-span-2 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? "Creating..." : "Create Course"}
                </button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Course List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">
                  All Courses ({courses.length})
                </h2>
              </div>
              {courses.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No courses found. Create your first course to get started!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCourse?.id === course.id ? 'bg-primary-50' : ''}`}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={getCourseImageUrl(course.imageUrl)}
                            alt={course.name}
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {course.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              course.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              course.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {course.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {course.code} • {course.category || 'No category'} • {course.credits || 0} credits
                          </p>
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {course.description || 'No description available'}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-xs text-gray-400">
                              Created: {formatDate(course.createdAt)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {course.startDate && course.endDate ? 
                                `${formatDate(course.startDate)} - ${formatDate(course.endDate)}` : 
                                'No dates set'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Course Details */}
          <div>
            {selectedCourse ? (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-4">
                  <img
                    src={getCourseImageUrl(selectedCourse.imageUrl)}
                    alt={selectedCourse.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{selectedCourse.name}</h2>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedCourse.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    selectedCourse.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedCourse.status}
                  </span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Course Code</p>
                    <p className="text-base text-gray-900">{selectedCourse.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="text-base text-gray-900">{selectedCourse.category || 'No category'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Credits</p>
                    <p className="text-base text-gray-900">{selectedCourse.credits || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duration</p>
                    <p className="text-base text-gray-900">
                      {selectedCourse.startDate && selectedCourse.endDate ? 
                        `${formatDate(selectedCourse.startDate)} - ${formatDate(selectedCourse.endDate)}` : 
                        'No dates set'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-base text-gray-900">{selectedCourse.description || 'No description available'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-base text-gray-900">{formatDate(selectedCourse.createdAt)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link 
                    to={`/faculty/courses/${selectedCourse.id}`} 
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark block text-center"
                  >
                    Manage Course
                  </Link>
                  <Link
                    to={`/faculty/courses/${selectedCourse.id}/students`}
                    className="w-full px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-50 block text-center"
                  >
                    View Student List
                  </Link>
                  <Link 
                    to={`/faculty/courses/${selectedCourse.id}/edit`}
                    className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 block text-center"
                  >
                    Edit Course
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(selectedCourse.id)}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 block text-center"
                  >
                    Delete Course
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <p className="text-gray-500">Select a course to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseListFaculty
