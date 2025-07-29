import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    getAssignmentById, 
    updateAssignment, 
    uploadAssignmentFile 
} from '../../api/assignmentApi';

function AssignmentEditFaculty() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dueDate: '',
        dueTime: '',
        status: 'ACTIVE',
        totalPoints: 100,
        courseId: null
    });

    useEffect(() => {
        fetchAssignment();
    }, [id]);

    const fetchAssignment = async () => {
        try {
            const response = await getAssignmentById(id);
            const assignmentData = response.data;
            console.log('Assignment data received:', assignmentData);
            setAssignment(assignmentData);
            
            // Set form data - handle Kathmandu timezone properly
            const dueDate = new Date(assignmentData.dueDate);
            
            // Convert UTC to Kathmandu time (UTC+5:45)
            const kathmanduDate = new Date(dueDate.getTime() + (5.75 * 60 * 60 * 1000));
            
            setFormData({
                name: assignmentData.name || '',
                description: assignmentData.description || '',
                dueDate: kathmanduDate.toISOString().split('T')[0],
                dueTime: kathmanduDate.toTimeString().slice(0, 5),
                status: assignmentData.status || 'ACTIVE',
                totalPoints: assignmentData.totalPoints || 100,
                courseId: assignmentData.courseId
            });
        } catch (err) {
            setError("Failed to load assignment details.");
            console.error("Error fetching assignment:", err);
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
            // Check file size (10MB limit)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                setError(`File size too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
                return;
            }
            
            setSelectedFile(file);
            setFilePreview(URL.createObjectURL(file));
            setError(""); // Clear any previous errors
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!formData.name || !formData.dueDate || !formData.totalPoints || !formData.courseId) {
            setError("Please fill in all required fields including total points.");
            return;
        }
        
        if (formData.totalPoints <= 0) {
            setError("Total points must be greater than 0.");
            return;
        }
        
        setSaving(true);
        setError("");
        
        try {
            // Parse the date and time inputs
            const [year, month, day] = formData.dueDate.split('-').map(Number);
            const [hours, minutes] = formData.dueTime.split(':').map(Number);
            
            // Create date in local timezone (assuming browser is in Kathmandu timezone)
            const localDateTime = new Date(year, month - 1, day, hours, minutes);
            
            // Convert to UTC by subtracting the timezone offset
            const utcDateTime = new Date(localDateTime.getTime() - (localDateTime.getTimezoneOffset() * 60000));
            
            const assignmentData = {
                name: formData.name,
                description: formData.description,
                dueDate: utcDateTime.toISOString(),
                status: formData.status,
                totalPoints: formData.totalPoints,
                courseId: formData.courseId
            };

            // Update assignment first
            const updatedAssignment = await updateAssignment(id, assignmentData);

            // Upload new file if selected
            if (selectedFile) {
                await uploadAssignmentFile(id, selectedFile);
            }

            // Navigate back to the appropriate page
            const returnTo = location.state?.returnTo || '/faculty/assignments';
            navigate(returnTo, { 
                state: { success: "Assignment updated successfully!", refresh: true } 
            });
        } catch (err) {
            console.error("Error updating assignment:", err);
            if (err.response?.data) {
                setError("Failed to update assignment: " + err.response.data);
            } else {
                setError("Failed to update assignment. Please try again.");
            }
        } finally {
            setSaving(false);
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

    if (error && !assignment) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
                <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                    Back to Assignments
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Edit Assignment</h1>
                    <p className="text-gray-600 mt-2">
                        {assignment?.name} - {assignment?.courseName}
                    </p>
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

            <div className="max-w-2xl">
                {/* Assignment Details */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignment Information</h3>
                    
                    <div className="space-y-3">
                        <div>
                            <span className="font-medium text-gray-500">Course:</span>
                            <span className="ml-2 text-gray-900">{assignment?.courseName}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500">Instructor:</span>
                            <span className="ml-2 text-gray-900">{assignment?.instructorName}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500">Current Total Points:</span>
                            <span className="ml-2 text-gray-900">{assignment?.totalPoints || 100}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500">Created:</span>
                            <span className="ml-2 text-gray-900">
                                {assignment?.createdAt ? new Date(assignment.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Assignment Details</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Total possible points for this assignment
                            </p>
                            {assignment && assignment.submissionCount > 0 && formData.totalPoints !== assignment.totalPoints && (
                                <p className="text-xs text-orange-600 mt-1">
                                    ⚠️ Changing total points will proportionally adjust all existing grades
                                </p>
                            )}
                        </div>

                        {/* Current File */}
                        {assignment?.cloudinaryUrl && (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium text-gray-700 mb-2">Current Assignment File</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                    {assignment.originalFileName || 'Assignment file'}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = assignment.cloudinaryUrl;
                                        link.download = assignment.originalFileName || 'assignment_file';
                                        link.target = '_blank';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                >
                                    Download Current File
                                </button>
                            </div>
                        )}

                        {/* New File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Assignment File (Optional)
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
                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
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
        </div>
    );
}

export default AssignmentEditFaculty; 