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

const calculateLetterGrade = (percentage) => {
    if (percentage >= 90.0) return "A+";
    if (percentage >= 80.0) return "A";
    if (percentage >= 70.0) return "B+";
    if (percentage >= 60.0) return "B";
    if (percentage >= 50.0) return "C+";
    if (percentage >= 40.0) return "C";
    if (percentage >= 35.0) return "D+";
    return "F";
};

const getPerformanceDescription = (percentage) => {
    if (percentage >= 90.0) return "Outstanding";
    if (percentage >= 80.0) return "Excellent";
    if (percentage >= 70.0) return "Very Good";
    if (percentage >= 60.0) return "Good";
    if (percentage >= 50.0) return "Satisfactory";
    if (percentage >= 40.0) return "Acceptable";
    if (percentage >= 35.0) return "Basic";
    return "Fail";
};

export default function FacultyAssignmentGrade() {
    const { assignmentId, submissionId } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [grading, setGrading] = useState(false);
    const [gradeData, setGradeData] = useState({ pointsEarned: '', grade: '', letterGrade: '', feedback: '' });
    const [isDataLoaded, setIsDataLoaded] = useState(false);

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
            
            console.log('Assignment data:', assignmentRes.data);
            console.log('Submission data:', submissionRes.data);
            
            setAssignment(assignmentRes.data);
            setSubmission(submissionRes.data);
            
            // Pre-populate grade data if submission is already graded (only once)
            if (submissionRes.data.pointsEarned && !isDataLoaded) {
                setGradeData({
                    pointsEarned: submissionRes.data.pointsEarned.toString(),
                    grade: submissionRes.data.grade?.toString() || '',
                    letterGrade: submissionRes.data.letterGrade || '',
                    feedback: submissionRes.data.feedback || ''
                });
                setIsDataLoaded(true);
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
        
        // Validate required fields
        if (!gradeData.pointsEarned || gradeData.pointsEarned.trim() === '') {
            setError("Points earned is required.");
            return;
        }
        
        const pointsEarned = parseFloat(gradeData.pointsEarned);
        const totalPoints = assignment?.totalPoints || 100;
        
        if (isNaN(pointsEarned) || pointsEarned < 0 || pointsEarned > totalPoints) {
            setError(`Points earned must be between 0 and ${totalPoints}.`);
            return;
        }
        
        setGrading(true);
        setError(""); // Clear any previous errors
        
        try {
            const gradePayload = {
                pointsEarned: parseInt(gradeData.pointsEarned),
                feedback: gradeData.feedback
            };
            
            await gradeSubmission(submission.id, gradePayload);
            
            // Update local state
            setSubmission(prev => ({
                ...prev,
                pointsEarned: parseInt(gradeData.pointsEarned),
                grade: gradeData.grade,
                letterGrade: gradeData.letterGrade,
                feedback: gradeData.feedback,
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
                        <p className="text-gray-900">{assignment.totalPoints || 100}</p>
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

                {submission.pointsEarned && (
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-500">Current Grade</p>
                        <p className="text-gray-900">
                            {submission.pointsEarned} / {assignment.totalPoints || 100} points 
                            ({submission.grade}% - {submission.letterGrade} - {submission.performanceDescription})
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
            <form onSubmit={(e) => { e.preventDefault(); handleGradeSubmit(); }} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Grade Submission</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Points Earned (out of {assignment.totalPoints || 100}) *
                        </label>
                        <input
                            type="number"
                            min="0"
                            max={assignment.totalPoints || 100}
                            step="0.1"
                            value={gradeData.pointsEarned || ''}
                            onChange={(e) => {
                                        const points = parseFloat(e.target.value) || 0;
                                        const totalPoints = assignment.totalPoints || 100;
                                        const percentage = totalPoints > 0 ? Math.round((points / totalPoints) * 100 * 10) / 10 : 0;
                                        const letterGrade = calculateLetterGrade(percentage);
                                        const performanceDescription = getPerformanceDescription(percentage);
                                        setGradeData(prev => ({ 
                                            ...prev, 
                                            pointsEarned: e.target.value,
                                            grade: percentage,
                                            letterGrade: letterGrade,
                                            performanceDescription: performanceDescription
                                        }));
                                    }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder={`0 - ${assignment.totalPoints || 100}`}
                            required
                        />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Percentage (Auto-calculated)
                            </label>
                            <input
                                type="text"
                                value={gradeData.grade ? `${gradeData.grade}%` : ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Letter Grade (Auto-calculated)
                            </label>
                            <input
                                type="text"
                                value={gradeData.letterGrade || ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Performance (Auto-calculated)
                            </label>
                            <input
                                type="text"
                                value={gradeData.grade ? getPerformanceDescription(gradeData.grade) : ''}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700"
                            />
                        </div>
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
                        type="button"
                        onClick={() => navigate(`/faculty/assignments/${assignmentId}`)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                        disabled={grading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
                        disabled={grading}
                    >
                        {grading ? 'Submitting...' : 'Submit Grade'}
                    </button>
                </div>
            </form>
        </div>
    );
} 