"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { getCoursesByStudent, unenrollFromCourse } from '../../api/courseApi';

// Helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date)) return "-";
  return date.toLocaleDateString();
};

function CourseListStudent() {
  const { currentUser } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("enrolled");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);
  const [unenrolling, setUnenrolling] = useState(false);
  const [unenrollSuccess, setUnenrollSuccess] = useState("");
  // Add previousCourses state (TODO: fetch from API)
  const [previousCourses, setPreviousCourses] = useState([]); // TODO: fetch from API

  const handleUnenroll = async () => {
    setUnenrolling(true);
    try {
      await unenrollFromCourse(selectedCourse.id);
      setEnrolledCourses((prev) => prev.filter((c) => c.id !== selectedCourse.id));
      setSelectedCourse(null);
      setUnenrollSuccess("You have been unenrolled from the course.");
    } catch (err) {
      setError("Failed to unenroll. Please try again.");
    } finally {
      setUnenrolling(false);
      setShowUnenrollModal(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await getCoursesByStudent(currentUser.id);
        setEnrolledCourses(res.data);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.id) fetchCourses();
  }, [currentUser]);

  // Redirect if not student
  if (currentUser?.role !== "STUDENT") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>;
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Courses</h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "enrolled" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("enrolled")}
        >
          Enrolled Courses
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "available" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("available")}
        >
          Available Courses
        </button>
        <button
          className={`py-2 px-4 text-sm font-medium ${
            activeTab === "previous" ? "border-b-2 border-primary text-primary" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("previous")}
        >
          Previous Courses
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course List and Details */}
        {activeTab === "previous" ? (
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previousCourses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No previous courses found.</td>
                      </tr>
                    ) : (
                      previousCourses.map((course) => (
                        <tr key={course.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.semester}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.instructor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.credits}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.grade}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{course.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTab === "enrolled"
                  ? enrolledCourses.map((course) => (
                      <div
                        key={course.id}
                        className={`bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                          selectedCourse?.id === course.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => setSelectedCourse(course)}
                      >
                        <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${course.image})` }}>
                          <div className="h-full w-full bg-black bg-opacity-30 flex items-end p-4">
                            <div>
                              <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-md mb-2">
                                {course.code}
                              </span>
                              <h3 className="text-lg font-bold text-white">{course.name}</h3>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                          <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  : (
                      <div className="bg-white shadow rounded-lg overflow-hidden lg:col-span-2">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {/* TODO: Fetch available courses from API */}
                              <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">No available courses found.</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
              </div>
            </div>
            {/* Course Details */}
            {activeTab !== "previous" && (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {selectedCourse ? (
                  <div>
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${selectedCourse.image})` }}>
                      <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                          <span className="inline-block bg-primary text-white text-xs px-2 py-1 rounded-md mb-2">
                            {selectedCourse.code}
                          </span>
                          <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Instructor</p>
                          <p className="text-base text-gray-900">{selectedCourse.instructor}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Description</p>
                          <p className="text-base text-gray-900">{selectedCourse.description}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Duration</p>
                          <p className="text-base text-gray-900">
                            {selectedCourse.startDate} - {selectedCourse.endDate}
                          </p>
                        </div>
                        {activeTab === "enrolled" && (
                          <>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Progress</p>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div
                                  className="bg-primary h-2.5 rounded-full"
                                  style={{ width: `${selectedCourse.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500 mt-1">{selectedCourse.progress}% Complete</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Current Grade</p>
                              <p className="text-base text-gray-900">{selectedCourse.grade}</p>
                            </div>
                          </>
                        )}
                        {activeTab === "available" && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Credits</p>
                            <p className="text-base text-gray-900">{selectedCourse.credits}</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 space-y-3">
                        {activeTab === "enrolled" ? (
                          <>
                            <Link to={`/student/courses/${selectedCourse.id}`} className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 block text-center">
                              View Course Materials
                            </Link>
                            <button className="w-full py-2 border border-primary text-primary rounded-md hover:bg-primary-light/10 transition-colors duration-200">
                              View Assignments
                            </button>
                            <button className="w-full py-2 border border-primary text-primary rounded-md hover:bg-primary-light/10 transition-colors duration-200">
                              View Quizzes
                            </button>
                            {/* Unenroll Button */}
                            <button
                              className="w-full py-2 rounded-md text-white font-semibold bg-red-600 hover:bg-red-700 transition-colors duration-200 mt-2"
                              onClick={() => setShowUnenrollModal(true)}
                              disabled={unenrolling}
                            >
                              Unenroll
                            </button>
                            {unenrollSuccess && (
                              <div className="text-green-600 font-semibold mt-2">{unenrollSuccess}</div>
                            )}
                          </>
                        ) : (
                          <button className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200">
                            Enroll in Course
                          </button>
                        )}
                      </div>
                    </div>
                    {/* Unenroll Modal */}
                    {showUnenrollModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                          <h2 className="text-lg font-bold mb-2">Confirm Unenrollment</h2>
                          <p className="mb-4">Are you sure you want to unenroll from <span className="font-semibold">{selectedCourse.name}</span>?</p>
                          <div className="flex justify-end gap-2">
                            <button
                              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                              onClick={() => setShowUnenrollModal(false)}
                              disabled={unenrolling}
                            >
                              Cancel
                            </button>
                            <button
                              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                              onClick={handleUnenroll}
                              disabled={unenrolling}
                            >
                              {unenrolling ? "Unenrolling..." : "Confirm"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[400px]">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-2">Select a course to view details</p>
                      <p className="text-sm text-gray-400">Click on any course card to see more information</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CourseListStudent
