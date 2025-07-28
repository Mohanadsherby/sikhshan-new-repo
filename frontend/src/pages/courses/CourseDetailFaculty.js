import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  getCourseById, 
  getCourseAttachments, 
  uploadCourseAttachment, 
  deleteCourseAttachment, 
  deleteCourse, 
  getStudentsInCourse, 
  downloadCourseAttachment,
  getChaptersByCourse,
  createChapter,
  updateChapter,
  deleteChapter,
  uploadAttachmentToChapter
} from "../../api/courseApi";

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

function CourseDetailFaculty() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [chapterForm, setChapterForm] = useState({ title: '', description: '', chapterNumber: '' });

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
        
        // Fetch chapters
        try {
          const chaptersRes = await getChaptersByCourse(courseId);
          setChapters(chaptersRes.data);
        } catch (err) {
          console.error("Error fetching chapters:", err);
        }
        
        // Fetch students
        try {
          const studentsRes = await getStudentsInCourse(courseId);
          setStudents(studentsRes.data);
        } catch (err) {
          console.error("Error fetching students:", err);
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

    // Check file size (10MB limit for Cloudinary free tier)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError(`File size too large. Maximum size is 10MB for free Cloudinary account. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Consider upgrading your Cloudinary plan or using a smaller file.`);
      return;
    }

    setUploading(true);
    setError(""); // Clear previous errors
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadCourseAttachment(courseId, formData);
      setAttachments(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Error uploading file:", err);
      if (err.code === 'ERR_NETWORK') {
        setError("Network error. Please check your connection and try again.");
      } else if (err.response?.status === 413) {
        setError("File too large. Please try a smaller file.");
      } else if (err.response?.data && err.response.data.includes('File size too large')) {
        setError("File size exceeds Cloudinary's free tier limit (10MB). Please use a smaller file or upgrade your Cloudinary plan.");
      } else if (err.response?.data) {
        setError("Failed to upload file: " + err.response.data);
      } else {
        setError("Failed to upload file. Please try again.");
      }
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

  const handleCreateChapter = async () => {
    if (!chapterForm.title || !chapterForm.chapterNumber) {
      setError("Title and chapter number are required.");
      return;
    }

    try {
      const res = await createChapter(courseId, {
        title: chapterForm.title,
        description: chapterForm.description,
        chapterNumber: parseInt(chapterForm.chapterNumber)
      });
      setChapters(prev => [...prev, res.data]);
      setShowChapterModal(false);
      setChapterForm({ title: '', description: '', chapterNumber: '' });
    } catch (err) {
      setError("Failed to create chapter. " + (err.response?.data || ""));
      console.error("Error creating chapter:", err);
    }
  };

  const handleUpdateChapter = async () => {
    if (!editingChapter || !chapterForm.title || !chapterForm.chapterNumber) {
      setError("Title and chapter number are required.");
      return;
    }

    try {
      const res = await updateChapter(editingChapter.id, {
        title: chapterForm.title,
        description: chapterForm.description,
        chapterNumber: parseInt(chapterForm.chapterNumber)
      });
      setChapters(prev => prev.map(ch => ch.id === editingChapter.id ? res.data : ch));
      setShowChapterModal(false);
      setEditingChapter(null);
      setChapterForm({ title: '', description: '', chapterNumber: '' });
    } catch (err) {
      setError("Failed to update chapter. " + (err.response?.data || ""));
      console.error("Error updating chapter:", err);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!window.confirm("Are you sure you want to delete this chapter? Attachments will be moved to 'No Chapter'.")) return;
    
    try {
      await deleteChapter(chapterId);
      setChapters(prev => prev.filter(ch => ch.id !== chapterId));
    } catch (err) {
      setError("Failed to delete chapter. " + (err.response?.data || ""));
      console.error("Error deleting chapter:", err);
    }
  };

  const handleUploadToChapter = async (chapterId, file) => {
    // Check file size (10MB limit for Cloudinary free tier)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setError(`File size too large. Maximum size is 10MB for free Cloudinary account. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Consider upgrading your Cloudinary plan or using a smaller file.`);
      return;
    }

    setUploading(true);
    setError(""); // Clear previous errors
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadAttachmentToChapter(chapterId, formData);
      
      // Update chapters with new attachment
      setChapters(prev => prev.map(ch => 
        ch.id === chapterId 
          ? { ...ch, attachments: [...ch.attachments, res.data] }
          : ch
      ));
    } catch (err) {
      console.error("Error uploading file to chapter:", err);
      if (err.code === 'ERR_NETWORK') {
        setError("Network error. Please check your connection and try again.");
      } else if (err.response?.status === 413) {
        setError("File too large. Please try a smaller file.");
      } else if (err.response?.data && err.response.data.includes('File size too large')) {
        setError("File size exceeds Cloudinary's free tier limit (10MB). Please use a smaller file or upgrade your Cloudinary plan.");
      } else if (err.response?.data) {
        setError("Failed to upload file to chapter: " + err.response.data);
      } else {
        setError("Failed to upload file to chapter. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const openChapterModal = (chapter = null) => {
    if (chapter) {
      setEditingChapter(chapter);
      setChapterForm({
        title: chapter.title,
        description: chapter.description || '',
        chapterNumber: chapter.chapterNumber.toString()
      });
    } else {
      setEditingChapter(null);
      setChapterForm({ title: '', description: '', chapterNumber: '' });
    }
    setShowChapterModal(true);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-800">Course Materials</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => openChapterModal()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Create Chapter
          </button>
          <label className="cursor-pointer flex items-center">
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <span className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 transition-colors cursor-pointer">
              {uploading ? "Uploading..." : "Upload Material"}
            </span>
          </label>
        </div>
      </div>

      {/* Chapters */}
      {chapters.length > 0 && (
        <div className="space-y-6 mb-6">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    Chapter {chapter.chapterNumber}: {chapter.title}
                  </h4>
                  {chapter.description && (
                    <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openChapterModal(chapter)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {/* Chapter Attachments */}
              <div className="space-y-3">
                {chapter.attachments && chapter.attachments.length > 0 ? (
                  chapter.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border border-gray-100 rounded-lg gap-3">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <span className="text-2xl flex-shrink-0">{getFileIcon(attachment.fileType)}</span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">{attachment.fileName}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(attachment.uploadDate)} • {attachment.fileType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => downloadFile(attachment.fileUrl, attachment.fileName)}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 whitespace-nowrap"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteAttachment(attachment.id)}
                          className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 whitespace-nowrap"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 italic">No materials in this chapter yet.</p>
                )}
                
                {/* Upload to Chapter */}
                <label className="cursor-pointer block">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleUploadToChapter(chapter.id, file);
                    }}
                    disabled={uploading}
                  />
                  <span className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50">
                    {uploading ? "Uploading..." : "+ Add Material to Chapter"}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Materials without chapters */}
      {attachments.filter(a => !a.chapterId).length > 0 && (
        <div className="border-t pt-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Other Materials</h4>
          <div className="space-y-3">
            {attachments.filter(a => !a.chapterId).map((attachment) => (
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
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => downloadFile(attachment.fileUrl, attachment.fileName)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 whitespace-nowrap"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDeleteAttachment(attachment.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 whitespace-nowrap"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {chapters.length === 0 && attachments.filter(a => !a.chapterId).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No materials uploaded yet.</p>
          <p className="text-sm mt-2">Create chapters and upload course materials to help your students learn better.</p>
        </div>
      )}

      {/* Chapter Modal */}
      {showChapterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {editingChapter ? 'Edit Chapter' : 'Create New Chapter'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Number</label>
                <input
                  type="number"
                  value={chapterForm.chapterNumber}
                  onChange={(e) => setChapterForm(prev => ({ ...prev, chapterNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Introduction to Course"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={chapterForm.description}
                  onChange={(e) => setChapterForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                  placeholder="Brief description of this chapter..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowChapterModal(false);
                  setEditingChapter(null);
                  setChapterForm({ title: '', description: '', chapterNumber: '' });
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={editingChapter ? handleUpdateChapter : handleCreateChapter}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
              >
                {editingChapter ? 'Update Chapter' : 'Create Chapter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStudents = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Enrolled Students ({students.length})</h3>
        <Link
          to={`/faculty/courses/${courseId}/students`}
          className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary-50"
        >
          View Full List
        </Link>
      </div>
      
      {students.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No students enrolled yet.</p>
          <p className="text-sm mt-2">Students will appear here once they enroll in the course.</p>
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
              {students.slice(0, 5).map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {student.profilePictureUrl ? (
                        <img
                          src={getProfileImageUrl(student.profilePictureUrl)}
                          alt={student.name}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center ${student.profilePictureUrl ? 'hidden' : ''}`}>
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
                </tr>
              ))}
            </tbody>
          </table>
          
          {students.length > 5 && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Showing 5 of {students.length} students. 
                <Link
                  to={`/faculty/courses/${courseId}/students`}
                  className="text-primary hover:text-primary-dark ml-1"
                >
                  View all students →
                </Link>
              </p>
            </div>
          )}
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