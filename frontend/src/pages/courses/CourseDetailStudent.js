import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getCourseById, unenrollFromCourse, getCourseAttachments, downloadCourseAttachment } from "../../api/courseApi";

// Helper to format date
const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  if (isNaN(date)) return "-";
  return date.toLocaleDateString();
};

// Helper to download file with original filename
const downloadFile = (fileUrl, fileName) => {
  // Simple approach: create a link and trigger download
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper to get course image URL
const getCourseImageUrl = (imageUrl) => {
  if (!imageUrl) return "/placeholder.jpg";
  if (imageUrl.startsWith('http')) return imageUrl;
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081' + imageUrl;
};

// Helper to get profile image URL
const getProfileImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
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

function CourseDetailStudent() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unenrolling, setUnenrolling] = useState(false);
  const [showUnenrollModal, setShowUnenrollModal] = useState(false);

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
      } catch (err) {
        setError("Failed to load course details.");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) fetchCourseData();
  }, [courseId]);

  // Redirect if not student
  if (currentUser?.role !== "STUDENT") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>;
  }

  const handleUnenroll = async () => {
    setUnenrolling(true);
    try {
      await unenrollFromCourse(courseId, currentUser.id);
      navigate('/student/courses', { 
        state: { success: "Successfully unenrolled from course." } 
      });
    } catch (err) {
      setError("Failed to unenroll from course.");
      console.error("Error unenrolling:", err);
    } finally {
      setUnenrolling(false);
      setShowUnenrollModal(false);
    }
  };

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
          onClick={() => navigate('/student/courses')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Back to Courses
        </button>
      </div>
    );
  }

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
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Instructor Information</h3>
        <div className="flex items-center space-x-4">
          {course.instructorProfilePictureUrl ? (
            <img
              src={getProfileImageUrl(course.instructorProfilePictureUrl)}
              alt={course.instructor}
              className="h-12 w-12 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center ${course.instructorProfilePictureUrl ? 'hidden' : ''}`}>
            <span className="text-lg font-medium">
              {course.instructor ? course.instructor.charAt(0).toUpperCase() : 'I'}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{course.instructor || 'Unknown Instructor'}</p>
            <p className="text-sm text-gray-500">Course Instructor</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaterials = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Course Materials</h3>

      {attachments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No materials available yet.</p>
          <p className="text-sm mt-2">Your instructor will upload course materials soon.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-3">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <span className="text-2xl flex-shrink-0">{getFileIcon(attachment.fileType)}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 truncate">{attachment.fileName}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(attachment.uploadDate)} • {attachment.fileType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => downloadFile(attachment.fileUrl, attachment.fileName)}
                className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark whitespace-nowrap flex-shrink-0"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProgress = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Your Progress</h3>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Course Progress</span>
            <span className="text-sm text-gray-500">0%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-600">Materials Viewed</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">Assignments Completed</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-600">Quizzes Taken</p>
          </div>
        </div>

        <div className="text-center text-gray-500">
          <p>Progress tracking will be available once you start engaging with course content.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/student/courses')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            ← Back to Courses
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{course.name}</h1>
            <p className="text-gray-600">{course.code}</p>
          </div>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowUnenrollModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Unenroll from Course
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
            { id: 'progress', label: 'Progress' }
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
      {activeTab === 'progress' && renderProgress()}

      {/* Unenroll Confirmation Modal */}
      {showUnenrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Unenrollment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to unenroll from <strong>{course.name}</strong>? 
              This action cannot be undone and you will lose access to all course materials.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowUnenrollModal(false)}
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
    </div>
  );
}

export default CourseDetailStudent; 