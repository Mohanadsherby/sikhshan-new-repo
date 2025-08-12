import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createAssignment, uploadAssignmentFile } from '../../api/assignmentApi';
import { getCoursesByInstructor } from '../../api/courseApi';

function AssignmentCreateFaculty() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dueDate: '',
        dueTime: '',
        courseId: '',
        totalPoints: 100,
        status: 'ACTIVE'
    });

    useEffect(() => {
        fetchCourses();
    }, [currentUser?.id]);

    const fetchCourses = async () => {
        if (!currentUser?.id) return;
        
        try {
            const response = await getCoursesByInstructor(currentUser.id);
            setCourses(response.data);
        } catch (err) {
            setError("Failed to load courses.");
            console.error("Error fetching courses:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setFilePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.name || !formData.courseId || !formData.dueDate || !formData.totalPoints) {
            setError("Please fill in all required fields including total points.");
            return;
        }
        
        if (formData.totalPoints <= 0) {
            setError("Total points must be greater than 0.");
            return;
        }
        
        setSubmitting(true);
        setError("");
        
        try {
            // Combine due date and time into a single datetime string
            const dueDateTime = formData.dueDate && formData.dueTime 
                ? `${formData.dueDate}T${formData.dueTime}:00`
                : formData.dueDate;
            
            const assignmentData = {
                ...formData,
                dueDate: dueDateTime
            };
            
            console.log('Sending assignment data:', assignmentData);
            
            const response = await createAssignment(assignmentData);
            navigate('/faculty/assignments', { 
                state: { success: "Assignment created successfully!" } 
            });
        } catch (err) {
            console.error('Assignment creation error:', err);
            setError("Failed to create assignment. " + (err.response?.data || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/faculty/assignments');
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Create Assignment</h1>
                    <p className="text-gray-600 mt-2">Create a new assignment for your course</p>
                </div>
                <button
                    onClick={handleCancel}
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

            {/* Form */}
            <div className="max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Course Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Course *
                        </label>
                        <select
                            name="courseId"
                            value={formData.courseId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        >
                            <option value="">Select a course</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.name} ({course.code})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Assignment Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assignment Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter assignment name"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter assignment description"
                        />
                    </div>

                    {/* Due Date and Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Due Date *
                            </label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Due Time *
                            </label>
                            <input
                                type="time"
                                name="dueTime"
                                value={formData.dueTime}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="DRAFT">Draft</option>
                        </select>
                    </div>

                    {/* Total Points */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Total Points <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={formData.totalPoints || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFormData(prev => ({ 
                                    ...prev, 
                                    totalPoints: value === '' ? null : parseInt(value) || null 
                                }));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="100"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Total possible points for this assignment
                        </p>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assignment File (Optional)
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Supported formats: PDF, DOC, DOCX, TXT, ZIP, RAR (Max 10MB)
                        </p>
                        {filePreview && (
                            <div className="mt-2 p-2 bg-gray-50 rounded">
                                <p className="text-sm text-gray-600">
                                    Selected file: {selectedFile?.name}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-6">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                        >
                            {submitting ? 'Creating...' : 'Create Assignment'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AssignmentCreateFaculty; 