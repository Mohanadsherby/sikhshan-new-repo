import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    getAssignmentById,
    submitAssignment,
    uploadSubmissionFile,
    getLatestSubmission,
    deleteSubmission,
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

function AssignmentSubmitStudent() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [existingSubmission, setExistingSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [showResubmitModal, setShowResubmitModal] = useState(false);

    useEffect(() => {
        // Validate that id is a valid number
        if (!id || isNaN(parseInt(id))) {
            setError("Invalid assignment ID");
            setLoading(false);
            return;
        }
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
                setExistingSubmission(submissionRes.data);
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
        
        if (!selectedFile) {
            setError("Please select a file to submit.");
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            let submission;
            
            if (existingSubmission) {
                // This is a resubmission
                submission = existingSubmission;
            } else {
                // Create new submission
                const submissionData = {
                    assignmentId: parseInt(id),
                    studentId: currentUser.id
                };
                const submissionRes = await submitAssignment(submissionData);
                submission = submissionRes.data;
            }

            // Upload file
            await uploadSubmissionFile(submission.id, selectedFile);

            navigate('/student/assignments', { 
                state: { success: existingSubmission ? "Assignment resubmitted successfully!" : "Assignment submitted successfully!" } 
            });
        } catch (err) {
            console.error("Error submitting assignment:", err);
            if (err.response?.data) {
                setError("Failed to submit assignment: " + err.response.data);
            } else {
                setError("Failed to submit assignment. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleResubmit = async () => {
        if (!existingSubmission) return;
        
        setSubmitting(true);
        setError("");

        try {
            // Delete existing submission
            await deleteSubmission(existingSubmission.id);
            
            // Create new submission
            const submissionData = {
                assignmentId: parseInt(id),
                studentId: currentUser.id
            };
            const submissionRes = await submitAssignment(submissionData);
            const submission = submissionRes.data;

            // Upload new file
            if (selectedFile) {
                await uploadSubmissionFile(submission.id, selectedFile);
            }

            setShowResubmitModal(false);
            navigate('/student/assignments', { 
                state: { success: "Assignment resubmitted successfully!" } 
            });
        } catch (err) {
            console.error("Error resubmitting assignment:", err);
            setError("Failed to resubmit assignment. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/student/assignments');
    };

    const handleDownloadAssignmentFile = () => {
        if (assignment?.cloudinaryUrl) {
            downloadFile(assignment.cloudinaryUrl, assignment.originalFileName || 'assignment_file');
        }
    };

    const handleDownloadExistingFile = () => {
        if (existingSubmission?.cloudinaryUrl) {
            downloadFile(existingSubmission.cloudinaryUrl, existingSubmission.originalFileName || 'submission_file');
        }
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

    const isOverdue = assignment && new Date(assignment.dueDate) < new Date();

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {existingSubmission ? 'Resubmit Assignment' : 'Submit Assignment'}
                    </h1>
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignment Details</h3>
                    
                    <div className="space-y-3">
                        <div>
                            <span className="font-medium text-gray-500">Assignment:</span>
                            <span className="ml-2 text-gray-900">{assignment?.name}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500">Course:</span>
                            <span className="ml-2 text-gray-900">{assignment?.courseName}</span>
                        </div>
                        <div>
                            <span className="font-medium text-gray-500">Due Date:</span>
                            <span className={`ml-2 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                {formatDate(assignment?.dueDate)}
                                {isOverdue && ' (Overdue)'}
                            </span>
                        </div>
                        {assignment?.description && (
                            <div>
                                <span className="font-medium text-gray-500">Description:</span>
                                <p className="mt-1 text-gray-900">{assignment.description}</p>
                            </div>
                        )}
                    </div>

                    {assignment?.cloudinaryUrl && (
                        <div className="mt-4 pt-4 border-t">
                            <button
                                onClick={handleDownloadAssignmentFile}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                                Download Assignment File
                            </button>
                        </div>
                    )}
                </div>

                {/* Existing Submission */}
                {existingSubmission && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-yellow-800 mb-2">Previous Submission</h4>
                        <div className="text-sm text-yellow-700 space-y-1">
                            <p>Submitted: {formatDate(existingSubmission.submittedAt)}</p>
                            <p>Submission #: {existingSubmission.submissionNumber}</p>
                            {existingSubmission.isLate && (
                                <p className="font-medium">⚠️ This was a late submission</p>
                            )}
                            {existingSubmission.cloudinaryUrl && (
                                <button
                                    onClick={handleDownloadExistingFile}
                                    className="text-blue-600 hover:text-blue-800 underline"
                                >
                                    Download previous submission
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Submission Form */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {existingSubmission ? 'Upload New File' : 'Upload Submission'}
                    </h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assignment File *
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                accept=".pdf,.doc,.docx,.txt,.zip,.rar"
                                required
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

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={submitting || !selectedFile}
                                className="flex-1 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : (existingSubmission ? 'Resubmit' : 'Submit Assignment')}
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

                    {existingSubmission && (
                        <div className="mt-6 pt-6 border-t">
                            <button
                                onClick={() => setShowResubmitModal(true)}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                            >
                                Delete Previous Submission & Start Fresh
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Resubmit Confirmation Modal */}
            {showResubmitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Resubmission</h3>
                        <p className="text-gray-600 mb-6">
                            This will delete your previous submission and create a new one. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowResubmitModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResubmit}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                disabled={submitting}
                            >
                                {submitting ? 'Processing...' : 'Confirm Resubmission'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssignmentSubmitStudent; 