import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getCourseById, getCourseAttachments, uploadCourseAttachment, deleteCourseAttachment, deleteCourse } from "../../api/courseApi";

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

// Helper to get file icon based on file type
const getFileIcon = (fileType) => {
  if (fileType?.includes('pdf')) return '📄';
  if (fileType?.includes('image')) return '🖼️';
  if (fileType?.includes('video')) return '🎥';
  if (fileType?.includes('audio')) return '🎵';
  if (fileType?.includes('word') || fileType?.includes('document')) return '📝';
  if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return '📊';
  if (fileType?.includes('powerpoint') || fileType?.includes('presentation')) return '📈';
  return '📁';
};

function CourseDetailFaculty() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const res = await getCourseById(courseId);
        setCourse(res.data);
        
        // Fetch attachments
        try {
          const attachmentsRes = await getCourseAttachments(courseId);
          setAttachments(attachmentsRes.data);
        } catch (err) {
          console.error("Error fetching attachments:", err);
        }
        
        // TODO: Fetch students when API is ready
        // const studentsRes = await getCourseStudents(courseId);
        // setStudents(studentsRes.data);
      } catch (err) {
        setError("Failed to load course details.");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) fetchCourseData();
  }, [courseId]);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadCourseAttachment(courseId, formData);
      setAttachments(prev => [...prev, res.data]);
    } catch (err) {
      setError("Failed to upload file.");
      console.error("Error uploading file:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    
    try {
      await deleteCourseAttachment(courseId, attachmentId);
      setAttachments(prev => prev.filter(a => a.id !== attachmentId));
    } catch (err) {
      setError("Failed to delete file.");
      console.error("Error deleting file:", err);
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) return;
    try {
      await deleteCourse(courseId);
      navigate('/faculty/courses', { state: { success: "Course deleted successfully!" } });
    } catch (err) {
      setError("Failed to delete course. " + (err.response?.data || ""));
      console.error("Error deleting course:", err);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Course Name</p>
            <p className="text-base text-gray-900">{course.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Course Code</p>
            <p className="text-base text-gray-900">{course.code}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Category</p>
            <p className="text-base text-gray-900">{course.category || 'No category'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Credits</p>
            <p className="text-base text-gray-900">{course.credits || 0}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              course.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
              course.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {course.status}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Created</p>
            <p className="text-base text-gray-900">{formatDate(course.createdAt)}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">Duration</p>
            <p className="text-base text-gray-900">
              {course.startDate && course.endDate ? 
                `${formatDate(course.startDate)} - ${formatDate(course.endDate)}` : 
                'No dates set'
              }
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-base text-gray-900">{course.description || 'No description available'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{students.length}</p>
            <p className="text-sm text-gray-600">Enrolled Students</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{attachments.length}</p>
            <p className="text-sm text-gray-600">Course Materials</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-600">Active Assignments</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Course Materials</h3>
        <label className="cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <span className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50">
            {uploading ? "Uploading..." : "Upload Material"}
          </span>
        </label>
      </div>

      {attachments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No materials uploaded yet.</p>
          <p className="text-sm mt-2">Upload course materials to help your students learn better.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getFileIcon(attachment.fileType)}</span>
                <div>
                  <p className="font-medium text-gray-900">{attachment.fileName}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(attachment.uploadDate)} • {attachment.fileType}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={getCourseImageUrl(attachment.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Download
                </a>
                <button
                  onClick={() => handleDeleteAttachment(attachment.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderStudents = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Enrolled Students</h3>
      
      {students.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No students enrolled yet.</p>
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
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
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

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
            <h1 className="text-3xl font-bold text-gray-800">{course.name}</h1>
            <p className="text-gray-600">{course.code}</p>
          </div>
        </div>
        <div className="flex flex-col space-y-2 mt-4 md:mt-0">
          <Link
            to={`/faculty/courses/${courseId}/edit`}
            className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-50 text-center"
          >
            Edit Course
          </Link>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={handleDeleteCourse}
          >
            Delete Course
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Course Image */}
      <div className="mb-6">
        <img
          src={getCourseImageUrl(course.imageUrl)}
          alt={course.name}
          className="w-full h-48 object-cover rounded-lg"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'materials', label: 'Materials' },
            { id: 'students', label: 'Students' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'materials' && renderMaterials()}
      {activeTab === 'students' && renderStudents()}
    </div>
  );
}

export default CourseDetailFaculty; 