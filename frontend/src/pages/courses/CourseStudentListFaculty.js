import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getCourseById, getStudentsInCourse, unenrollFromCourse } from "../../api/courseApi";

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

function CourseStudentListFaculty() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch course details
        const courseRes = await getCourseById(courseId);
        setCourse(courseRes.data);
        
        // Fetch students
        const studentsRes = await getStudentsInCourse(courseId);
        setStudents(studentsRes.data);
      } catch (err) {
        setError("Failed to load course or student data.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) fetchData();
  }, [courseId]);

  const handleUnenrollStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to unenroll this student from the course?")) return;
    
    try {
      await unenrollFromCourse(courseId, studentId);
      // Remove the student from the list
      setStudents(prev => prev.filter(student => student.id !== studentId));
    } catch (err) {
      setError("Failed to unenroll student. " + (err.response?.data || ""));
      console.error("Error unenrolling student:", err);
    }
  };

  // Redirect if not faculty
  if (currentUser?.role !== "FACULTY") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || "Course not found"}
        </div>
        <button
          onClick={() => navigate('/faculty/courses')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/faculty/courses')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            ← Back to Courses
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student List</h1>
            <p className="text-gray-600">{course.name} ({course.code})</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to={`/faculty/courses/${courseId}`}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Manage Course
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Course Info Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-4">
          <img
            src={getCourseImageUrl(course.imageUrl)}
            alt={course.name}
            className="h-16 w-16 rounded-lg object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{course.name}</h2>
            <p className="text-gray-600">{course.code} • {course.category || 'No category'} • {course.credits || 0} credits</p>
            <p className="text-sm text-gray-500">
              {course.startDate && course.endDate ? 
                `${formatDate(course.startDate)} - ${formatDate(course.endDate)}` : 
                'No dates set'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Enrolled Students ({students.length})
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              course.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              course.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {course.status}
            </span>
          </div>
        </div>
        
        {students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No students enrolled in this course yet.</p>
            <p className="text-sm mt-2">Students will appear here once they enroll.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">ID: {student.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(student.enrolledDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        student.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleUnenrollStudent(student.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Unenroll
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseStudentListFaculty; 