"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useState, useEffect } from "react"
import { getCoursesByInstructor, getStudentsInCourse } from "../../api/courseApi"
import { getAssignmentsByInstructor } from "../../api/assignmentApi"
import { getQuizzesByInstructor } from "../../api/quizApi"

function FacultyDashboard() {
  const { currentUser } = useAuth()
  const [greeting, setGreeting] = useState("")
  const [courses, setCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    activeCourses: 0,
    totalStudents: 0,
    pendingAssignments: 0
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
        
        // Fetch courses by instructor
        const coursesResponse = await getCoursesByInstructor(currentUser.id)
        const instructorCourses = coursesResponse.data || []
        
        // Fetch enrollment count for each course
        const coursesWithEnrollments = await Promise.all(
          instructorCourses.map(async (course) => {
            try {
              console.log(`Fetching enrollments for course ${course.id} (${course.name})`)
              const studentsResponse = await getStudentsInCourse(course.id)
              console.log(`Students response for course ${course.id}:`, studentsResponse)
              
              console.log(`Full students response for course ${course.id}:`, studentsResponse)
              
              if (studentsResponse.data) {
                const enrollmentCount = studentsResponse.data.length || 0
                console.log(`Enrollment count for course ${course.id}:`, enrollmentCount)
                return {
                  ...course,
                  enrollmentCount: enrollmentCount
                }
              } else if (studentsResponse.data && typeof studentsResponse.data === 'object' && studentsResponse.data.enrollmentCount !== undefined) {
                // Fallback: check if response has enrollmentCount property
                const enrollmentCount = studentsResponse.data.enrollmentCount || 0
                console.log(`Enrollment count from object for course ${course.id}:`, enrollmentCount)
                return {
                  ...course,
                  enrollmentCount: enrollmentCount
                }
              } else {
                console.error(`No valid data in students response for course ${course.id}:`, studentsResponse)
              }
            } catch (error) {
              console.error(`Error fetching enrollments for course ${course.id}:`, error)
            }
            return {
              ...course,
              enrollmentCount: 0
            }
          })
        )
        
        setCourses(coursesWithEnrollments)
        
        // Fetch assignments by instructor
        const assignmentsResponse = await getAssignmentsByInstructor(currentUser.id)
        const instructorAssignments = assignmentsResponse.data || []
        setAssignments(instructorAssignments)
        
        // Fetch quizzes by instructor
        const quizzesResponse = await getQuizzesByInstructor(currentUser.id)
        const instructorQuizzes = quizzesResponse.data || []
        setQuizzes(instructorQuizzes)
        
        // Calculate stats
        console.log('Courses with enrollments:', coursesWithEnrollments)
        const totalStudents = coursesWithEnrollments.reduce((total, course) => {
          const courseStudents = course.enrollmentCount || 0
          console.log(`Course ${course.name}: ${courseStudents} students`)
          return total + courseStudents
        }, 0)
        
        const pendingAssignments = instructorAssignments.filter(assignment => 
          assignment.status === 'ACTIVE'
        ).length
        
        console.log('Final stats calculation:', {
          activeCourses: coursesWithEnrollments.length,
          totalStudents: totalStudents,
          pendingAssignments: pendingAssignments
        })
        
        setStats({
          activeCourses: coursesWithEnrollments.length,
          totalStudents: totalStudents,
          pendingAssignments: pendingAssignments
        })
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [currentUser?.id])

  // Helper function to get upcoming tasks (assignments and quizzes)
  const getUpcomingTasks = () => {
    const tasks = []
    
    // Add assignments due soon
    assignments
      .filter(assignment => assignment.status === 'ACTIVE' && new Date(assignment.dueDate) > new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 3)
      .forEach(assignment => {
        const dueDate = new Date(assignment.dueDate)
        const now = new Date()
        const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24))
        
        let priority = 'Low'
        if (diffDays <= 2) priority = 'High'
        else if (diffDays <= 7) priority = 'Medium'
        
        tasks.push({
          id: `assignment-${assignment.id}`,
          title: `Grade ${assignment.title}`,
          due: diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `${diffDays} days`,
          priority: priority,
          type: 'assignment'
        })
      })
    
    // Add quizzes starting soon
    quizzes
      .filter(quiz => quiz.status === 'ACTIVE' && new Date(quiz.startTime) > new Date())
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 2)
      .forEach(quiz => {
        const startDate = new Date(quiz.startTime)
        const now = new Date()
        const diffDays = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24))
        
        let priority = 'Low'
        if (diffDays <= 2) priority = 'High'
        else if (diffDays <= 7) priority = 'Medium'
        
        tasks.push({
          id: `quiz-${quiz.id}`,
          title: `Prepare ${quiz.title}`,
          due: diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `${diffDays} days`,
          priority: priority,
          type: 'quiz'
        })
      })
    
    return tasks.sort((a, b) => {
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }).slice(0, 5)
  }

  // Redirect if not faculty
  if (currentUser?.role !== "FACULTY") {
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

  const upcomingTasks = getUpcomingTasks()

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-primary text-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {greeting}, {currentUser.name}
            </h1>
            <p className="text-white text-opacity-90">Welcome to your faculty dashboard</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Link
              to="/faculty/courses"
              className="px-4 py-2 bg-white text-primary rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              View All Courses
            </Link>
            <Link
              to="/faculty/assignments"
              className="px-4 py-2 bg-white text-primary rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              Create Assignment
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
              <p className="text-sm font-medium text-gray-500">Active Courses</p>
              <p className="text-3xl font-bold text-gray-900">{stats.activeCourses}</p>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Assignments</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingAssignments}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Active Courses */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="h-32 bg-cover bg-center" style={{ 
                    backgroundImage: course.imageUrl 
                      ? `url(${course.imageUrl})` 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}>
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
                     <div className="flex justify-between items-center mb-2">
                       <p className="text-sm text-gray-600">{course.enrollmentCount || 0} Students</p>
                       <span className="text-xs bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full">
                         {course.status || 'Active'}
                       </span>
                     </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/faculty/courses/${course.id}`}
                        className="flex-1 text-center py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
                      >
                        Manage
                      </Link>
                      <Link
                        to={`/faculty/courses/${course.id}/students`}
                        className="flex-1 text-center py-2 border border-primary text-primary rounded-md hover:bg-primary-light/10 transition-colors duration-200"
                      >
                        Students
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No courses created yet.</p>
                <Link
                  to="/faculty/courses"
                  className="mt-2 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200"
                >
                  Create Course
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Tasks</h2>
          <div className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div key={task.id} className="border-b border-gray-200 pb-4">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : task.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Due in {task.due}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No upcoming tasks.</p>
            )}
          </div>
          <Link
            to="/faculty/assignments"
            className="w-full mt-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-200 block text-center"
          >
            View All Tasks
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="space-y-4">
          {assignments.length > 0 || quizzes.length > 0 ? (
            <>
              {assignments.slice(0, 3).map((assignment) => (
                <div key={`assignment-${assignment.id}`} className="flex items-start space-x-4 border-b border-gray-200 pb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                      A
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Assignment Created</p>
                    <p className="text-sm text-gray-600">
                      {assignment.title} in <span className="text-primary">{assignment.course?.code || 'Course'}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {quizzes.slice(0, 2).map((quiz) => (
                <div key={`quiz-${quiz.id}`} className="flex items-start space-x-4 border-b border-gray-200 pb-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center">
                      Q
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Quiz Created</p>
                    <p className="text-sm text-gray-600">
                      {quiz.title} in <span className="text-primary">{quiz.course?.code || 'Course'}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Starts: {new Date(quiz.startTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="text-gray-500 text-sm">No recent activity.</p>
          )}
        </div>
        <Link
          to="/faculty/assignments"
          className="w-full mt-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-light/10 transition-colors duration-200 block text-center"
        >
          View All Activity
        </Link>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/faculty/courses"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary bg-opacity-10 text-primary">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Manage Courses</h3>
              <p className="text-sm text-gray-600">Create and manage your courses</p>
            </div>
          </div>
        </Link>
        
        <Link
          to="/faculty/assignments"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-rose-500 bg-opacity-10 text-rose-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Create Assignment</h3>
              <p className="text-sm text-gray-600">Create new assignments for students</p>
            </div>
          </div>
        </Link>
        
        <Link
          to="/faculty/quizzes"
          className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-amber-500 bg-opacity-10 text-amber-500">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Create Quiz</h3>
              <p className="text-sm text-gray-600">Create quizzes and assessments</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default FacultyDashboard
