import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getCourseById, updateCourse } from "../../api/courseApi";

// Helper to format date for input fields
const formatDateForInput = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return "";
  return date.toISOString().split('T')[0];
};

// Helper to get course image URL
const getCourseImageUrl = (imageUrl) => {
  if (!imageUrl) return "/placeholder.jpg";
  if (imageUrl.startsWith('http')) return imageUrl;
  return process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081' + imageUrl;
};

function CourseEditFaculty() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
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
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const res = await getCourseById(courseId);
        const courseData = res.data;
        setCourse(courseData);
        
        // Populate form with existing data
        setFormData({
          name: courseData.name || "",
          code: courseData.code || "",
          description: courseData.description || "",
          category: courseData.category || "",
          startDate: formatDateForInput(courseData.startDate),
          endDate: formatDateForInput(courseData.endDate),
          credits: courseData.credits?.toString() || "",
          status: courseData.status || "ACTIVE"
        });
      } catch (err) {
        setError("Failed to load course details.");
        console.error("Error fetching course:", err);
      } finally {
        setLoading(false);
      }
    };
    
    if (courseId) fetchCourse();
  }, [courseId]);

  // Redirect if not faculty
  if (currentUser?.role !== "FACULTY") {
    return <div className="text-center p-8">You don't have permission to view this page.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    try {
      const updateData = {
        ...formData,
        instructorId: currentUser.id,
        credits: parseInt(formData.credits) || 0
      };
      
      await updateCourse(courseId, updateData);
      navigate(`/faculty/courses/${courseId}`, { 
        state: { success: "Course updated successfully!" } 
      });
    } catch (err) {
      setError(err.response?.data || "Failed to update course.");
      console.error("Error updating course:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Course</h1>
          <p className="text-gray-600 mt-1">Update course information and settings</p>
        </div>
        <button
          onClick={() => navigate(`/faculty/courses/${courseId}`)}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
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

                {/* Submit Button */}
                <div className="col-span-2 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/faculty/courses/${courseId}`)}
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
                    {submitting ? "Updating..." : "Update Course"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Course Preview</h3>
            
            <div className="mb-4">
              <img
                src={getCourseImageUrl(course?.imageUrl)}
                alt={formData.name || "Course"}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Course Name</p>
                <p className="text-base text-gray-900">{formData.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Course Code</p>
                <p className="text-base text-gray-900">{formData.code || "Not set"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-base text-gray-900">{formData.category || "No category"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Credits</p>
                <p className="text-base text-gray-900">{formData.credits || "0"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  formData.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  formData.status === 'INACTIVE' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {formData.status}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="text-base text-gray-900">
                  {formData.startDate && formData.endDate ? 
                    `${formData.startDate} - ${formData.endDate}` : 
                    'No dates set'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-base text-gray-900 text-sm">
                  {formData.description || "No description available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseEditFaculty; 