import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAssignmentById } from '../../api/assignmentApi';
import { getSubmissionById, gradeSubmission, downloadFile } from '../../api/assignmentApi';

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

export default function FacultyAssignmentGrade() {
    const { assignmentId, submissionId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [grading, setGrading] = useState(false);
    const [gradeData, setGradeData] = useState({ grade: '', letterGrade: '', feedback: '' });

    useEffect(() => {
        fetchData();
    }, [assignmentId, submissionId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [assignmentRes, submissionRes] = await Promise.all([
                getAssignmentById(assignmentId),
                getSubmissionById(submissionId)
            ]);
            
            setAssignment(assignmentRes.data);
            setSubmission(submissionRes.data);
            
            // Pre-populate grade data if submission is already graded
            if (submissionRes.data.grade) {
                setGradeData({
                    grade: submissionRes.data.grade.toString(),
                    letterGrade: submissionRes.data.letterGrade || '',
                    feedback: submissionRes.data.feedback || ''
                });
            }
        } catch (err) {
            setError("Failed to load submission details.");
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGradeSubmit = async () => {
        if (!submission) return;
        
        setGrading(true);
        try {
            const gradePayload = {
                grade: parseFloat(gradeData.grade),
                letterGrade: gradeData.letterGrade,
                feedback: gradeData.feedback
            };
            
            await gradeSubmission(submission.id, gradePayload);
            
            // Update local state
            setSubmission(prev => ({
                ...prev,
                ...gradePayload,
                status: prev.isLate ? 'LATE_GRADED' : 'GRADED',
                gradedAt: new Date().toISOString()
            }));
            
            navigate(`/faculty/assignments/${assignmentId}`, { 
                state: { success: "Grade submitted successfully!" } 
            });
        } catch (err) {
            setError("Failed to submit grade.");
            console.error("Error submitting grade:", err);
        } finally {
            setGrading(false);
        }
    };

    const handleDownloadSubmission = () => {
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

    if (error || !assignment || !submission) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error || "Submission not found"}
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

    return (
        <div className="container mx-auto px-4 py-6 max-w-2xl">
            <Link to={`/faculty/assignments/${assignmentId}`} className="text-primary hover:underline mb-4 block">
                &larr; Back to Assignment Submissions
            </Link>
            
            {/* Student Header */}
            <div className="flex items-center gap-3 mb-4">
                {submission.studentProfilePictureUrl ? (
                    <img 
                        src={submission.studentProfilePictureUrl} 
                        alt={submission.studentName}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-medium text-gray-600">
                        {submission.studentName ? submission.studentName.charAt(0).toUpperCase() : '?'}
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Grading: {submission.studentName || 'Unknown Student'}</h1>
                    <p className="text-gray-600">{assignment.name} ({assignment.courseName})</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Assignment Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Assignment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Title</p>
                        <p className="text-gray-900">{assignment.name}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Course</p>
                        <p className="text-gray-900">{assignment.courseName}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Due Date</p>
                        <p className="text-gray-900">{formatDate(assignment.dueDate)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Points</p>
                        <p className="text-gray-900">{assignment.totalPoints || 'N/A'}</p>
                    </div>
                </div>
                {assignment.description && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Description</p>
                        <p className="text-gray-900">{assignment.description}</p>
                    </div>
                )}
            </div>

            {/* Submission Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Student Submission</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Student</p>
                        <p className="text-gray-900">{submission.studentName || 'Unknown Student'}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Submitted At</p>
                        <p className="text-gray-900">{formatDate(submission.submittedAt)}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Submission #</p>
                        <p className="text-gray-900">{submission.submissionNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <p className="text-gray-900">
                            {submission.isLate ? 'Late' : 'On Time'}
                            {submission.status?.includes('GRADED') && ' - Graded'}
                        </p>
                    </div>
                </div>
                
                {submission.cloudinaryUrl && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500 mb-2">Submission File</p>
                        <button
                            onClick={handleDownloadSubmission}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                            Download {submission.originalFileName || 'Submission File'}
                        </button>
                    </div>
                )}

                {submission.grade && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Current Grade</p>
                        <p className="text-gray-900">
                            {submission.grade}% ({submission.letterGrade})
                        </p>
                    </div>
                )}

                {submission.feedback && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Current Feedback</p>
                        <p className="text-gray-900">{submission.feedback}</p>
                    </div>
                )}
            </div>

            {/* Grading Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Grade Submission</h2>
                
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
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Provide feedback to the student..."
                        />
                    </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={() => navigate(`/faculty/assignments/${assignmentId}`)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                        disabled={grading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleGradeSubmit}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
                        disabled={grading}
                    >
                        {grading ? 'Submitting...' : 'Submit Grade'}
                    </button>
                </div>
            </div>
        </div>
    );
} 