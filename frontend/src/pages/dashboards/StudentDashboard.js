"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useState, useEffect } from "react"

// Mock data
const enrolledCourses = [
  {
    id: 1,
    name: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Smith",
    progress: 75,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 2,
    name: "Data Structures and Algorithms",
    code: "CS201",
    instructor: "Dr. Johnson",
    progress: 45,
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: 3,
    name: "Database Management Systems",
    code: "CS301",
    instructor: "Prof. Williams",
    progress: 60,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
]

const upcomingAssignments = [
  { id: 1, title: "CS101 Assignment 3", course: "CS101", due: "2 days", status: "Not Started" },
  { id: 2, title: "CS201 Project Proposal", course: "CS201", due: "1 week", status: "In Progress" },
  { id: 3, title: "CS301 Database Design", course: "CS301", due: "3 days", status: "Not Started" },
]

const upcomingQuizzes = [
  { id: 1, title: "CS101 Quiz 2", course: "CS101", date: "May 15, 2023", time: "10:00 AM" },
  { id: 2, title: "CS201 Midterm", course: "CS201", date: "May 20, 2023", time: "2:00 PM" },
]

function StudentDashboard() {
  const { currentUser } = useAuth()
  const [greeting, setGreeting] = useState("")

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  // Redirect if not student
  if (currentUser?.role !== "STUDENT") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-primary from-primary to-primary-dark text-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {greeting}, {currentUser.name}
            </h1>
            <p className="text-white text-opacity-90">Welcome to your student dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/student/courses"
              className="px-4 py-2 bg-gray-100 text-primary rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              View All Courses
            </Link>
            <Link
              to="/calendar"
              className="px-4 py-2 bg-gray-100 text-primary rounded-md hover:bg-primary-dark/90 transition-colors duration-200"
            >
              Calendar
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-primary">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary bg-opacity-10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
              <p className="text-3xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-rose-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-rose-500 bg-opacity-10 text-rose-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Assignments Due</p>
              <p className="text-3xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-amber-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-500 bg-opacity-10 text-amber-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming Quizzes</p>
              <p className="text-3xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500 bg-opacity-10 text-green-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Overall GPA</p>
              <p className="text-3xl font-bold text-gray-900">3.7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {enrolledCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${course.image})` }}>
              <div className="h-full w-full bg-black bg-opacity-30 flex items-end p-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{course.name}</h3>
                  <p className="text-sm text-white text-opacity-80">{course.code}</p>
                  <p className="text-sm text-white mt-2">Total Grade: <span className="font-semibold">{course.progress}%</span></p>
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
              <div className="mt-4">
                <Link
                  to={`/student/courses/${course.id}`}
                  className="block w-full text-center py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
                >
                  View Course
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Assignments</h2>
            <Link
              to="/student/assignments/submit"
              className="text-sm text-primary hover:text-primary-dark transition-colors duration-200"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {assignment.course} • Due in {assignment.due}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex items-center justify-center ${
                      assignment.status === "Not Started"
                        ? "bg-red-100 text-red-800"
                        : assignment.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {assignment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Quizzes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Quizzes</h2>
            <Link
              to="/student/quizzes/attempt"
              className="text-sm text-primary hover:text-primary-dark transition-colors duration-200"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingQuizzes.map((quiz) => (
              <div key={quiz.id} className="border-b border-gray-200 pb-4">
                <p className="text-sm font-medium text-gray-900">{quiz.title}</p>
                <p className="text-xs text-gray-500 mt-1">{quiz.course}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full mr-2">
                    {quiz.date}
                  </span>
                  <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full">
                    {quiz.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Feedback */}
      <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Recent Feedback & Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-gray-800">CS101 Assignment 2</h3>
              <p className="text-sm text-gray-500 mt-1">Submitted on May 1, 2023</p>
            </div>
            <span className="text-lg font-bold text-green-600">92%</span>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-md text-sm text-gray-700 border-l-2 border-green-300">
            "Excellent work! Your implementation was very efficient and well-documented."
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-gray-800">CS201 Quiz 1</h3>
              <p className="text-sm text-gray-500 mt-1">Completed on April 28, 2023</p>
            </div>
            <span className="text-lg font-bold text-yellow-600">78%</span>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-md text-sm text-gray-700 border-l-2 border-yellow-300">
            "Good understanding of basic concepts. Review section 3.4 for improvement."
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
