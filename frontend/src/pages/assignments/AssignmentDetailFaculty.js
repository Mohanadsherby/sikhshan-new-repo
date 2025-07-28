import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    getAssignmentById, 
    deleteAssignment,
    downloadFile 
} from '../../api/assignmentApi';
import { 
    getSubmissionsByAssignment, 
    gradeSubmission,
    downloadFile as downloadSubmissionFile 
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

const getSubmissionStatusBadge = (submission) => {
    if (submission.status === 'GRADED') {
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Graded</span>;
    } else if (submission.status === 'LATE_GRADED') {
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Late - Graded</span>;
    } else if (submission.status === 'LATE_SUBMITTED') {
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Late</span>;
    } else {
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Submitted</span>;
    }
};

function AssignmentDetailFaculty() {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState('overview');
    const [grading, setGrading] = useState(false);
    const [showGradeModal, setShowGradeModal] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [gradeData, setGradeData] = useState({ grade: '', letterGrade: '', feedback: '' });

    useEffect(() => {
        fetchAssignmentData();
    }, [id]);

    const fetchAssignmentData = async () => {
        setLoading(true);
        try {
            const [assignmentRes, submissionsRes] = await Promise.all([
                getAssignmentById(id),
                getSubmissionsByAssignment(id)
            ]);
            setAssignment(assignmentRes.data);
            setSubmissions(submissionsRes.data);
        } catch (err) {
            setError("Failed to load assignment details.");
            console.error("Error fetching assignment data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditAssignment = () => {
        navigate(`/faculty/assignments/${id}/edit`);
    };

    const handleDeleteAssignment = async () => {
        if (!window.confirm('Are you sure you want to delete this assignment? This will also delete all submissions.')) {
            return;
        }
        
        try {
            await deleteAssignment(id);
            navigate('/faculty/assignments', { 
                state: { success: "Assignment deleted successfully!" } 
            });
        } catch (err) {
            setError("Failed to delete assignment.");
            console.error("Error deleting assignment:", err);
        }
    };

    const handleGradeSubmission = async () => {
        if (!selectedSubmission) return;
        
        setGrading(true);
        try {
            const gradePayload = {
                grade: parseFloat(gradeData.grade),
                letterGrade: gradeData.letterGrade,
                feedback: gradeData.feedback
            };
            
            await gradeSubmission(selectedSubmission.id, gradePayload);
            
            // Update local state
            setSubmissions(prev => prev.map(s => 
                s.id === selectedSubmission.id 
                    ? { ...s, ...gradePayload, status: s.isLate ? 'LATE_GRADED' : 'GRADED', gradedAt: new Date().toISOString() }
                    : s
            ));
            
            setShowGradeModal(false);
            setSelectedSubmission(null);
            setGradeData({ grade: '', letterGrade: '', feedback: '' });
        } catch (err) {
            setError("Failed to grade submission.");
            console.error("Error grading submission:", err);
        } finally {
            setGrading(false);
        }
    };

    const openGradeModal = (submission) => {
        setSelectedSubmission(submission);
        setGradeData({
            grade: submission.grade?.toString() || '',
            letterGrade: submission.letterGrade || '',
            feedback: submission.feedback || ''
        });
        setShowGradeModal(true);
    };

    const handleDownloadAssignmentFile = () => {
        if (assignment?.cloudinaryUrl) {
            downloadFile(assignment.cloudinaryUrl, assignment.originalFileName || 'assignment_file');
        }
    };

    const handleDownloadSubmissionFile = (submission) => {
        if (submission.cloudinaryUrl) {
            downloadSubmissionFile(submission.cloudinaryUrl, submission.originalFileName || 'submission_file');
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
                    onClick={() => navigate('/faculty/assignments')}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                    Back to Assignments
                </button>
            </div>
        );
    }

    const renderOverview = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Assignment Name</p>
                        <p className="text-base text-gray-900">{assignment.name}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Course</p>
                        <p className="text-base text-gray-900">{assignment.courseName}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Due Date</p>
                        <p className="text-base text-gray-900">{formatDate(assignment.dueDate)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p className="text-base text-gray-900">{assignment.status}</p>
                    </div>
                    <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="text-base text-gray-900">{assignment.description || 'No description provided'}</p>
                    </div>
                </div>
                
                {assignment.cloudinaryUrl && (
                    <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium text-gray-500 mb-2">Assignment File</p>
                        <button
                            onClick={handleDownloadAssignmentFile}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                            Download {assignment.originalFileName || 'Assignment File'}
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Submission Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{submissions.length}</p>
                        <p className="text-sm text-gray-600">Total Submissions</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">
                            {submissions.filter(s => s.status?.includes('GRADED')).length}
                        </p>
                        <p className="text-sm text-gray-600">Graded</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">
                            {submissions.filter(s => s.isLate).length}
                        </p>
                        <p className="text-sm text-gray-600">Late Submissions</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSubmissions = () => (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Student Submissions</h3>
            </div>
            
            {submissions.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    <p>No submissions yet.</p>
                </div>
            ) : (
                <div className="divide-y">
                    {submissions.map((submission) => (
                        <div key={submission.id} className="p-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-medium text-gray-900">{submission.studentName}</h4>
                                        {getSubmissionStatusBadge(submission)}
                                        {submission.isLate && (
                                            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                                Late
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-500">Submitted:</span>
                                            <span className="ml-2 text-gray-900">{formatDate(submission.submittedAt)}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-500">Submission #:</span>
                                            <span className="ml-2 text-gray-900">{submission.submissionNumber}</span>
                                        </div>
                                        {submission.grade && (
                                            <div>
                                                <span className="font-medium text-gray-500">Grade:</span>
                                                <span className="ml-2 text-gray-900">
                                                    {submission.grade}% ({submission.letterGrade})
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {submission.feedback && (
                                        <div className="mt-2">
                                            <span className="font-medium text-gray-500">Feedback:</span>
                                            <p className="text-gray-900 mt-1">{submission.feedback}</p>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex flex-col sm:flex-row gap-2">
                                    {submission.cloudinaryUrl && (
                                        <button
                                            onClick={() => handleDownloadSubmissionFile(submission)}
                                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                        >
                                            Download
                                        </button>
                                    )}
                                    <button
                                        onClick={() => openGradeModal(submission)}
                                        className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
                                    >
                                        {submission.status?.includes('GRADED') ? 'Update Grade' : 'Grade'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
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
                        onClick={() => navigate('/faculty/assignments')}
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
                    <button
                        onClick={handleEditAssignment}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    >
                        Edit Assignment
                    </button>
                    <button
                        onClick={handleDeleteAssignment}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Delete Assignment
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="mb-6">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'overview'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('submissions')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'submissions'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Submissions ({submissions.length})
                        </button>
                    </nav>
                </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'submissions' && renderSubmissions()}

            {/* Grade Modal */}
            {showGradeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Grade Submission - {selectedSubmission?.studentName}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Grade (%)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                    value={gradeData.grade}
                                    onChange={(e) => setGradeData(prev => ({ ...prev, grade: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Letter Grade
                                </label>
                                <select
                                    value={gradeData.letterGrade}
                                    onChange={(e) => setGradeData(prev => ({ ...prev, letterGrade: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select grade</option>
                                    <option value="A+">A+</option>
                                    <option value="A">A</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B">B</option>
                                    <option value="B-">B-</option>
                                    <option value="C+">C+</option>
                                    <option value="C">C</option>
                                    <option value="C-">C-</option>
                                    <option value="D+">D+</option>
                                    <option value="D">D</option>
                                    <option value="F">F</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Feedback
                                </label>
                                <textarea
                                    value={gradeData.feedback}
                                    onChange={(e) => setGradeData(prev => ({ ...prev, feedback: e.target.value }))}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="Provide feedback to the student..."
                                />
                            </div>
                        </div>
                        
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowGradeModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                                disabled={grading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGradeSubmission}
                                className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
                                disabled={grading}
                            >
                                {grading ? 'Grading...' : 'Save Grade'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssignmentDetailFaculty; 