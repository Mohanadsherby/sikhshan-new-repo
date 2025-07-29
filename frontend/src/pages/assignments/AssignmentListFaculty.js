import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    getAssignmentsByInstructor, 
    deleteAssignment,
    downloadFile 
} from '../../api/assignmentApi';

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusBadge = (assignment) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = dueDate < now;
    
    if (assignment.status === 'INACTIVE') {
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Inactive</span>;
    } else if (isOverdue) {
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Overdue</span>;
    } else {
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Active</span>;
    }
};

function AssignmentListFaculty() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [assignmentToDelete, setAssignmentToDelete] = useState(null);

    useEffect(() => {
        fetchAssignments();
    }, [currentUser?.id]);

    // Refresh assignments when navigating back from edit/create
    useEffect(() => {
        if (location.state?.refresh) {
            fetchAssignments();
            // Clear the refresh flag
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state]);

    const fetchAssignments = async () => {
        if (!currentUser?.id) return;
        
        setLoading(true);
        try {
            const response = await getAssignmentsByInstructor(currentUser.id);
            setAssignments(response.data);
        } catch (err) {
            setError("Failed to load assignments.");
            console.error("Error fetching assignments:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAssignment = () => {
        navigate('/faculty/assignments/create');
    };

    const handleEditAssignment = (assignmentId) => {
        navigate(`/faculty/assignments/${assignmentId}/edit`);
    };

    const handleViewAssignment = (assignmentId) => {
        navigate(`/faculty/assignments/${assignmentId}`);
    };

    const handleDeleteAssignment = async () => {
        if (!assignmentToDelete) return;
        
        setDeleting(true);
        try {
            await deleteAssignment(assignmentToDelete.id);
            setAssignments(prev => prev.filter(a => a.id !== assignmentToDelete.id));
            setShowDeleteModal(false);
            setAssignmentToDelete(null);
        } catch (err) {
            setError("Failed to delete assignment.");
            console.error("Error deleting assignment:", err);
        } finally {
            setDeleting(false);
        }
    };

    const confirmDelete = (assignment) => {
        setAssignmentToDelete(assignment);
        setShowDeleteModal(true);
    };

    const handleDownloadFile = (assignment) => {
        if (assignment.cloudinaryUrl) {
            downloadFile(assignment.cloudinaryUrl, assignment.originalFileName || 'assignment_file');
        }
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">My Assignments</h1>
                    <p className="text-gray-600 mt-2">Manage assignments for your courses</p>
                </div>
                <button
                    onClick={handleCreateAssignment}
                    className="mt-4 md:mt-0 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                    Create Assignment
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {location.state?.success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {location.state.success}
                </div>
            )}

            {/* Assignments List */}
            {assignments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                    <p className="text-gray-500 mb-6">Create your first assignment to get started</p>
                    <button
                        onClick={handleCreateAssignment}
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    >
                        Create Assignment
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {assignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {assignment.name}
                                        </h3>
                                        {getStatusBadge(assignment)}
                                    </div>
                                    
                                    <p className="text-gray-600 mb-3">
                                        {assignment.description || 'No description provided'}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-500">Course:</span>
                                            <span className="ml-2 text-gray-900">{assignment.courseName}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-500">Due Date:</span>
                                            <span className="ml-2 text-gray-900">{formatDate(assignment.dueDate)}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-500">Total Points:</span>
                                            <span className="ml-2 text-gray-900">{assignment.totalPoints || 100}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-500">Submissions:</span>
                                            <span className="ml-2 text-gray-900">
                                                {assignment.submissionCount} submitted, {assignment.gradedCount} graded
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-2">
                                    {assignment.cloudinaryUrl && (
                                        <button
                                            onClick={() => handleDownloadFile(assignment)}
                                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                        >
                                            Download File
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleViewAssignment(assignment.id)}
                                        className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleEditAssignment(assignment.id)}
                                        className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(assignment)}
                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Assignment</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "{assignmentToDelete?.name}"? This action cannot be undone and will also delete all associated submissions.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                                disabled={deleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAssignment}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                disabled={deleting}
                            >
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssignmentListFaculty; 