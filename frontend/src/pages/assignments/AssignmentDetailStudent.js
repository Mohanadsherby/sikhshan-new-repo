import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    getAssignmentById,
    getLatestSubmission,
    downloadFile 
} from '../../api/assignmentApi';

const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

const getStatusBadge = (assignment, submission) => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const isOverdue = dueDate < now;
    
    if (submission) {
        if (submission.status === 'GRADED') {
            return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Graded</span>;
        } else if (submission.status === 'LATE_GRADED') {
            return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Late - Graded</span>;
        } else if (submission.status === 'LATE_SUBMITTED') {
            return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Late Submitted</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Submitted</span>;
        }
    } else if (isOverdue) {
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Overdue</span>;
    } else {
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Not Submitted</span>;
    }
};

function AssignmentDetailStudent() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAssignmentData();
    }, [id, currentUser?.id]);

    const fetchAssignmentData = async () => {
        if (!currentUser?.id) return;
        
        setLoading(true);
        try {
            const [assignmentRes, submissionRes] = await Promise.all([
                getAssignmentById(id),
                getLatestSubmission(id, currentUser.id)
            ]);
            
            setAssignment(assignmentRes.data);
            
            // Check if submission exists (might return 404)
            if (submissionRes.status === 200) {
                setSubmission(submissionRes.data);
            }
        } catch (err) {
            if (err.response?.status === 404) {
                // No existing submission, which is fine
                const assignmentRes = await getAssignmentById(id);
                setAssignment(assignmentRes.data);
            } else {
                setError("Failed to load assignment details.");
                console.error("Error fetching assignment data:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAssignment = () => {
        navigate(`/student/assignments/${id}/submit`);
    };

    const handleDownloadAssignmentFile = () => {
        if (assignment?.cloudinaryUrl) {
            downloadFile(assignment.cloudinaryUrl, assignment.originalFileName || 'assignment_file');
        }
    };

    const handleDownloadSubmissionFile = () => {
        if (submission?.cloudinaryUrl) {
            downloadFile(submission.cloudinaryUrl, submission.originalFileName || 'submission_file');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !assignment) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error || "Assignment not found"}
                </div>
                <button
                    onClick={() => navigate('/student/assignments')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                    Back to Assignments
                </button>
            </div>
        );
    }

    const isOverdue = new Date(assignment.dueDate) < new Date();

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/student/assignments')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                        ← Back to Assignments
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{assignment.name}</h1>
                        <p className="text-gray-600">{assignment.courseName}</p>
                    </div>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                    {!submission && (
                        <button
                            onClick={handleSubmitAssignment}
                            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                        >
                            Submit Assignment
                        </button>
                    )}
                    {submission && !submission.status?.includes('GRADED') && (
                        <button
                            onClick={handleSubmitAssignment}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                        >
                            Resubmit
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Assignment Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Assignment Information */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Assignment Details</h3>
                            {getStatusBadge(assignment, submission)}
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <span className="font-medium text-gray-500">Assignment Name:</span>
                                <span className="ml-2 text-gray-900">{assignment.name}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500">Course:</span>
                                <span className="ml-2 text-gray-900">{assignment.courseName}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500">Instructor:</span>
                                <span className="ml-2 text-gray-900">{assignment.instructorName}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500">Due Date:</span>
                                <span className={`ml-2 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                    {formatDate(assignment.dueDate)}
                                    {isOverdue && ' (Overdue)'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500">Total Points:</span>
                                <span className="ml-2 text-gray-900">{assignment.totalPoints || 100}</span>
                            </div>
                            {assignment.description && (
                                <div>
                                    <span className="font-medium text-gray-500">Description:</span>
                                    <p className="mt-2 text-gray-900 whitespace-pre-wrap">{assignment.description}</p>
                                </div>
                            )}
                        </div>

                        {assignment.cloudinaryUrl && (
                            <div className="mt-6 pt-4 border-t">
                                <button
                                    onClick={handleDownloadAssignmentFile}
                                    className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                >
                                    Download Assignment File
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Submission Details */}
                    {submission && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Submission</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <span className="font-medium text-gray-500">Submission Date:</span>
                                    <span className="ml-2 text-gray-900">{formatDate(submission.submittedAt)}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-500">Submission #:</span>
                                    <span className="ml-2 text-gray-900">{submission.submissionNumber}</span>
                                </div>
                                {submission.isLate && (
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                        <p className="text-yellow-800 font-medium">⚠️ This was a late submission</p>
                                    </div>
                                )}
                                {submission.cloudinaryUrl && (
                                    <div>
                                        <button
                                            onClick={handleDownloadSubmissionFile}
                                            className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                                        >
                                            Download Your Submission
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Grading Information */}
                    {submission?.status?.includes('GRADED') && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Grading Results</h3>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-medium text-gray-500">Grade:</span>
                                        <span className="ml-2 text-lg font-semibold text-gray-900">
                                            {submission.grade}% ({submission.letterGrade})
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-500">Graded On:</span>
                                        <span className="ml-2 text-gray-900">{formatDate(submission.gradedAt)}</span>
                                    </div>
                                </div>
                                {submission.feedback && (
                                    <div>
                                        <span className="font-medium text-gray-500">Feedback:</span>
                                        <p className="mt-2 text-gray-900 whitespace-pre-wrap">{submission.feedback}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Assignment Status:</span>
                                <span className="font-medium">{assignment.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Your Status:</span>
                                <span className="font-medium">
                                    {submission ? 'Submitted' : 'Not Submitted'}
                                </span>
                            </div>
                            {submission && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Submission Status:</span>
                                    <span className="font-medium">{submission.status}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
                        <div className="space-y-3">
                            {!submission && (
                                <button
                                    onClick={handleSubmitAssignment}
                                    className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                                >
                                    Submit Assignment
                                </button>
                            )}
                            {submission && !submission.status?.includes('GRADED') && (
                                <button
                                    onClick={handleSubmitAssignment}
                                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                                >
                                    Resubmit Assignment
                                </button>
                            )}
                            {assignment.cloudinaryUrl && (
                                <button
                                    onClick={handleDownloadAssignmentFile}
                                    className="w-full px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                                >
                                    Download Assignment
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssignmentDetailStudent; 