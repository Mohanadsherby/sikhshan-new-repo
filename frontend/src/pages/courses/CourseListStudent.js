"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Link } from "react-router-dom"
import { getCoursesByStudent, unenrollFromCourse, getAvailableCoursesForStudent, enrollInCourse } from '../../api/courseApi';

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

function CourseListStudent() {
  const { currentUser } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [previousCourses, setPreviousCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("enrolled");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unenrolling, setUnenrolling] = useState(false);
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);
  const [courseToUnenroll, setCourseToUnenroll] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [courseToEnroll, setCourseToEnroll] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        // Fetch enrolled courses
        const enrolledRes = await getCoursesByStudent(currentUser.id);
        setEnrolledCourses(enrolledRes.data);
        
        // Fetch available courses (not enrolled)
        const availableRes = await getAvailableCoursesForStudent(currentUser.id);
        setAvailableCourses(availableRes.data);
        
        // TODO: Fetch previous courses (completed)
        // const previousRes = await getPreviousCourses(currentUser.id);
        // setPreviousCourses(previousRes.data);
        
      } catch (err) {
        setError("Failed to load courses.");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.id) fetchCourses();
  }, [currentUser]);

  // Redirect if not student
  if (currentUser?.role !== "STUDENT") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>
  }

  const handleUnenroll = async () => {
    if (!courseToUnenroll) return;
    
    setUnenrolling(true);
    try {
      await unenrollFromCourse(courseToUnenroll.id, currentUser.id);
      setEnrolledCourses(prev => prev.filter(c => c.id !== courseToUnenroll.id));
      // Add the course back to available courses
      setAvailableCourses(prev => [...prev, courseToUnenroll]);
      setSelectedCourse(null);
      setShowUnenrollModal(false);
      setCourseToUnenroll(null);
    } catch (err) {
      setError("Failed to unenroll from course.");
      console.error("Error unenrolling:", err);
    } finally {
      setUnenrolling(false);
    }
  };

  const handleEnroll = async () => {
    if (!courseToEnroll) return;
    
    setEnrolling(true);
    try {
      await enrollInCourse(courseToEnroll.id, currentUser.id);
      setEnrolledCourses(prev => [...prev, courseToEnroll]);
      // Remove the course from available courses
      setAvailableCourses(prev => prev.filter(c => c.id !== courseToEnroll.id));
      setSelectedCourse(null);
      setShowEnrollModal(false);
      setCourseToEnroll(null);
    } catch (err) {
      setError("Failed to enroll in course.");
      console.error("Error enrolling:", err);
    } finally {
      setEnrolling(false);
    }
  };

  const confirmUnenroll = (course) => {
    setCourseToUnenroll(course);
    setShowUnenrollModal(true);
  };

  const confirmEnroll = (course) => {
    setCourseToEnroll(course);
    setShowEnrollModal(true);
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
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: "enrolled", label: "Enrolled Courses", count: enrolledCourses.length },
            { id: "available", label: "Available Courses", count: availableCourses.length },
            { id: "previous", label: "Previous Courses", count: previousCourses.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List */}
        <div className="lg:col-span-2">
          {activeTab === "enrolled" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">
                  Enrolled Courses ({enrolledCourses.length})
                </h2>
              </div>
              {enrolledCourses.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>You are not enrolled in any courses yet.</p>
                  <p className="text-sm mt-2">Check available courses to get started!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {enrolledCourses.map((course) => (
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
                              Instructor: {course.instructor || 'Unknown'}
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
                      
                      {/* Action buttons */}
                      <div className="flex flex-col gap-2 mt-4">
                        <Link 
                          to={`/student/courses/${course.id}`} 
                          className="w-full py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors duration-200 block text-center"
                        >
                          View Course Materials
                        </Link>
                        <button
                          className="w-full py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmUnenroll(course);
                          }}
                          disabled={unenrolling}
                        >
                          Unenroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "available" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">
                  Available Courses ({availableCourses.length})
                </h2>
              </div>
              {availableCourses.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No available courses found.</p>
                  <p className="text-sm mt-2">Check back later for new courses!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {availableCourses.map((course) => (
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
                              Instructor: {course.instructor || 'Unknown'}
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
                      
                      {/* Enroll button */}
                      <div className="mt-4">
                        <button
                          className="w-full py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-dark transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmEnroll(course);
                          }}
                          disabled={enrolling}
                        >
                          Enroll in Course
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "previous" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800">
                  Previous Courses ({previousCourses.length})
                </h2>
              </div>
              {previousCourses.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No previous courses found.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {previousCourses.map((course) => (
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
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              Completed
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
                              Instructor: {course.instructor || 'Unknown'}
                            </p>
                            <p className="text-xs text-gray-400">
                              Completed: {formatDate(course.completedDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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
                  <p className="text-sm font-medium text-gray-500">Instructor</p>
                  <p className="text-base text-gray-900">{selectedCourse.instructor || 'Unknown'}</p>
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
              </div>

              <div className="space-y-3">
                {activeTab === "enrolled" && (
                  <>
                    <Link 
                      to={`/student/courses/${selectedCourse.id}`} 
                      className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark block text-center"
                    >
                      View Course Materials
                    </Link>
                    <button
                      onClick={() => confirmUnenroll(selectedCourse)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      disabled={unenrolling}
                    >
                      {unenrolling ? "Unenrolling..." : "Unenroll"}
                    </button>
                  </>
                )}
                {activeTab === "available" && (
                  <button
                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    onClick={() => confirmEnroll(selectedCourse)}
                    disabled={enrolling}
                  >
                    {enrolling ? "Enrolling..." : "Enroll in Course"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Select a course to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Unenroll Confirmation Modal */}
      {showUnenrollModal && courseToUnenroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Unenrollment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to unenroll from <strong>{courseToUnenroll.name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowUnenrollModal(false);
                  setCourseToUnenroll(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={unenrolling}
              >
                Cancel
              </button>
              <button
                onClick={handleUnenroll}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={unenrolling}
              >
                {unenrolling ? "Unenrolling..." : "Unenroll"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Confirmation Modal */}
      {showEnrollModal && courseToEnroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Enrollment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to enroll in <strong>{courseToEnroll.name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEnrollModal(false);
                  setCourseToEnroll(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                disabled={enrolling}
              >
                Cancel
              </button>
              <button
                onClick={handleEnroll}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                disabled={enrolling}
              >
                {enrolling ? "Enrolling..." : "Enroll"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseListStudent
