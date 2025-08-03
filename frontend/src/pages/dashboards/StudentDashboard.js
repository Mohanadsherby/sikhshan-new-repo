"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useState, useEffect } from "react"
import { getCoursesByStudent } from "../../api/courseApi"
import { getSubmissionsByStudent, getActiveAssignmentsByCourse } from "../../api/assignmentApi"
import { getActiveQuizzesByCourse } from "../../api/quizApi"

function StudentDashboard() {
  const { currentUser } = useAuth()
  const [greeting, setGreeting] = useState("")
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [upcomingAssignments, setUpcomingAssignments] = useState([])
  const [upcomingQuizzes, setUpcomingQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    assignmentsDue: 0,
    upcomingQuizzes: 0
  })

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!currentUser?.id) return
      
      try {
        setLoading(true)
        
        // Fetch enrolled courses
        const coursesResponse = await getCoursesByStudent(currentUser.id)
        const courses = coursesResponse.data || []
        setEnrolledCourses(courses)
        
        // Fetch upcoming assignments from all enrolled courses
        const allAssignments = []
        for (const course of courses) {
          try {
            const assignmentsResponse = await getActiveAssignmentsByCourse(course.id)
            const courseAssignments = assignmentsResponse.data || []
            allAssignments.push(...courseAssignments.map(assignment => ({
              ...assignment,
              courseName: course.name,
              courseCode: course.code
            })))
          } catch (error) {
            console.error(`Error fetching assignments for course ${course.id}:`, error)
          }
        }
        
        // Sort assignments by due date and take the next 5
        const sortedAssignments = allAssignments
          .filter(assignment => new Date(assignment.dueDate) > new Date())
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
          .slice(0, 5)
        
        setUpcomingAssignments(sortedAssignments)
        
        // Fetch upcoming quizzes from all enrolled courses
        const allQuizzes = []
        for (const course of courses) {
          try {
            const quizzesResponse = await getActiveQuizzesByCourse(course.id)
            const courseQuizzes = quizzesResponse.data || []
            allQuizzes.push(...courseQuizzes.map(quiz => ({
              ...quiz,
              courseName: course.name,
              courseCode: course.code
            })))
          } catch (error) {
            console.error(`Error fetching quizzes for course ${course.id}:`, error)
          }
        }
        
        // Sort quizzes by start date and take the next 5
        const sortedQuizzes = allQuizzes
          .filter(quiz => new Date(quiz.startTime) > new Date())
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
          .slice(0, 5)
        
        setUpcomingQuizzes(sortedQuizzes)
        
        // Update stats
        setStats({
          enrolledCourses: courses.length,
          assignmentsDue: sortedAssignments.length,
          upcomingQuizzes: sortedQuizzes.length
        })
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [currentUser?.id])

  // Helper function to format due date
  const formatDueDate = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return 'Overdue'
    if (diffDays === 0) return 'Due today'
    if (diffDays === 1) return 'Due tomorrow'
    if (diffDays < 7) return `Due in ${diffDays} days`
    if (diffDays < 30) return `Due in ${Math.ceil(diffDays / 7)} weeks`
    return `Due in ${Math.ceil(diffDays / 30)} months`
  }

  // Helper function to format quiz date
  const formatQuizDate = (startTime) => {
    const date = new Date(startTime)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Helper function to format quiz time
  const formatQuizTime = (startTime) => {
    const date = new Date(startTime)
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Redirect if not student
  if (currentUser?.role !== "STUDENT") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              <p className="text-3xl font-bold text-gray-900">{stats.enrolledCourses}</p>
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
              <p className="text-3xl font-bold text-gray-900">{stats.assignmentsDue}</p>
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
              <p className="text-3xl font-bold text-gray-900">{stats.upcomingQuizzes}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Courses */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">My Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="h-40 bg-cover bg-center" style={{ 
                backgroundImage: course.imageUrl 
                  ? `url(${course.imageUrl})` 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}>
                <div className="h-full w-full bg-black bg-opacity-30 flex items-end p-4">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{course.name}</h3>
                    <p className="text-sm text-white text-opacity-80">{course.code}</p>
                                         <p className="text-sm text-white mt-2">Instructor: <span className="font-semibold">{course.instructor || 'N/A'}</span></p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                                 <p className="text-sm text-gray-600">Instructor: {course.instructor || 'N/A'}</p>
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
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No courses enrolled yet.</p>
            <Link
              to="/student/courses"
              className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Assignments */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Assignments</h2>
            <Link
              to="/student/assignments"
              className="text-sm text-primary hover:text-primary-dark transition-colors duration-200"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingAssignments.length > 0 ? (
              upcomingAssignments.map((assignment) => (
                <div key={assignment.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {assignment.courseCode} • {formatDueDate(assignment.dueDate)}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-800">
                      Active
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No upcoming assignments.</p>
            )}
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
            {upcomingQuizzes.length > 0 ? (
              upcomingQuizzes.map((quiz) => (
                <div key={quiz.id} className="border-b border-gray-200 pb-4">
                  <p className="text-sm font-medium text-gray-900">{quiz.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{quiz.courseCode}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full mr-2">
                      {formatQuizDate(quiz.startTime)}
                    </span>
                    <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full">
                      {formatQuizTime(quiz.startTime)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No upcoming quizzes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
