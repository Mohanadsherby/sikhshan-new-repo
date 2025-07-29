"use client"

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
    getAssignmentsByCourse,
    getLatestSubmission
} from '../../api/assignmentApi';
import { getCoursesByStudent } from '../../api/courseApi';

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
    
    // Debug logging
    console.log(`Assignment: ${assignment.name}`);
    console.log(`Due date: ${dueDate.toLocaleString()}`);
    console.log(`Current time: ${now.toLocaleString()}`);
    console.log(`Is overdue: ${isOverdue}`);
    
    if (submission) {
        if (submission.grade) {
            return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Graded</span>;
        } else if (submission.isLate) {
            return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Late Submitted</span>;
        } else {
            return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Submitted</span>;
        }
    } else if (isOverdue) {
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Overdue</span>;
    } else {
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Not Submitted</span>;
    }
};

function AssignmentListStudent() {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchData();
    }, [currentUser?.id]);

    // Refresh data when returning from submission
    useEffect(() => {
        if (location.state?.refresh) {
            fetchData();
            // Clear the refresh state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state]);

    useEffect(() => {
        if (location.pathname.includes('/student/assignments/')) {
            fetchData();
        }
    }, [location.pathname]);

    const fetchData = async () => {
        if (!currentUser?.id) return;
        
        setLoading(true);
        try {
            console.log("Fetching data for student:", currentUser.id);
            
            // Fetch enrolled courses
            const coursesRes = await getCoursesByStudent(currentUser.id);
            const courses = coursesRes.data;
            console.log("Enrolled courses:", courses);
            setEnrolledCourses(courses);

            // Fetch assignments for all enrolled courses
            const allAssignments = [];
            const allSubmissions = [];
            
            for (const course of courses) {
                try {
                    console.log(`Fetching assignments for course: ${course.id} - ${course.name}`);
                    
                    const courseAssignments = await getAssignmentsByCourse(course.id);
                    console.log(`Course ${course.id} assignments:`, courseAssignments.data);
                    
                    allAssignments.push(...courseAssignments.data);
                    
                    // Fetch submissions for each assignment
                    for (const assignment of courseAssignments.data) {
                        try {
                            const submissionRes = await getLatestSubmission(assignment.id, currentUser.id);
                            if (submissionRes.status === 200) {
                                allSubmissions.push(submissionRes.data);
                            }
                        } catch (err) {
                            // No submission exists for this assignment, which is fine
                            console.log(`No submission for assignment ${assignment.id}`);
                        }
                    }
                } catch (err) {
                    console.error(`Error fetching assignments for course ${course.id}:`, err);
                }
            }
            
            console.log("All assignments:", allAssignments);
            console.log("All submissions:", allSubmissions);
            
            setAssignments(allAssignments);
            setSubmissions(allSubmissions);
        } catch (err) {
            setError("Failed to load assignments.");
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    const getSubmissionForAssignment = (assignmentId) => {
        return submissions.find(submission => submission.assignmentId === assignmentId || submission.assignment?.id === assignmentId);
    };

    const handleViewAssignment = (assignmentId) => {
        navigate(`/student/assignments/${assignmentId}`);
    };

    const handleSubmitAssignment = (assignmentId) => {
        navigate(`/student/assignments/${assignmentId}/submit`);
    };

    const handleDownloadFile = (assignment) => {
        if (assignment.cloudinaryUrl) {
            const link = document.createElement('a');
            link.href = assignment.cloudinaryUrl;
            link.download = assignment.originalFileName || 'assignment_file';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const filterAssignments = () => {
        switch (activeTab) {
            case 'pending':
                return assignments.filter(assignment => {
                    const submission = getSubmissionForAssignment(assignment.id);
                    return !submission; // No submission exists
                });
            case 'submitted':
                return assignments.filter(assignment => {
                    const submission = getSubmissionForAssignment(assignment.id);
                    return submission; // Any submission exists (including graded)
                });
            case 'graded':
                return assignments.filter(assignment => {
                    const submission = getSubmissionForAssignment(assignment.id);
                    return submission && submission.grade; // Has submission and is graded
                });
            case 'overdue':
                return assignments.filter(assignment => {
                    const now = new Date();
                    const dueDate = new Date(assignment.dueDate);
                    const isOverdue = dueDate < now;
                    const submission = getSubmissionForAssignment(assignment.id);
                    
                    // Assignment is overdue if due date has passed and no submission exists
                    return isOverdue && !submission;
                });
            default:
                return assignments;
        }
    };

    const filteredAssignments = filterAssignments();

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
            <div className="mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Assignments</h1>
                        <p className="text-gray-600 mt-2">View and submit assignments for your enrolled courses</p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                        <span>🔄</span>
                        Refresh
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
                            onClick={() => setActiveTab('all')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'all'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            All ({assignments.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('pending')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'pending'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Pending ({assignments.filter(a => !getSubmissionForAssignment(a.id)).length})
                        </button>
                        <button
                            onClick={() => setActiveTab('submitted')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'submitted'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Submitted ({assignments.filter(a => getSubmissionForAssignment(a.id)).length})
                        </button>
                        <button
                            onClick={() => setActiveTab('graded')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'graded'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Graded ({assignments.filter(a => {
                                const submission = getSubmissionForAssignment(a.id);
                                return submission && submission.grade;
                            }).length})
                        </button>
                        <button
                            onClick={() => setActiveTab('overdue')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'overdue'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Overdue ({assignments.filter(a => {
                                const now = new Date();
                                const dueDate = new Date(a.dueDate);
                                const isOverdue = dueDate < now;
                                const submission = getSubmissionForAssignment(a.id);
                                return isOverdue && !submission;
                            }).length})
                        </button>
                    </nav>
                </div>
            </div>

            {/* Assignments List */}
            {filteredAssignments.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {activeTab === 'all' ? 'No assignments yet' : `No ${activeTab} assignments`}
                    </h3>
                    <p className="text-gray-500">
                        {activeTab === 'all' 
                            ? 'You don\'t have any assignments yet. Check back later!' 
                            : `You don't have any ${activeTab} assignments.`
                        }
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {filteredAssignments.map((assignment) => {
                        const submission = getSubmissionForAssignment(assignment.id);
                        const course = enrolledCourses.find(c => c.id === assignment.courseId);
                        
                        return (
                            <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
                                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                {assignment.name}
                                            </h3>
                                            {getStatusBadge(assignment, submission)}
                                        </div>
                                        
                                        <p className="text-gray-600 mb-3">
                                            {assignment.description || 'No description provided'}
                                        </p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-500">Course:</span>
                                                <span className="ml-2 text-gray-900">{course?.name || assignment.courseName}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-500">Due Date:</span>
                                                <span className="ml-2 text-gray-900">{formatDate(assignment.dueDate)}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-500">Total Points:</span>
                                                <span className="ml-2 text-gray-900">{assignment.totalPoints || 100}</span>
                                            </div>
                                            {submission && (
                                                <div>
                                                    <span className="font-medium text-gray-500">Submitted:</span>
                                                    <span className="ml-2 text-gray-900">{formatDate(submission.submittedAt)}</span>
                                                </div>
                                            )}
                                            {submission?.grade && (
                                                <div>
                                                    <span className="font-medium text-gray-500">Grade:</span>
                                                    <span className="ml-2 text-gray-900">
                                                        {submission.pointsEarned ? `${submission.pointsEarned} / ${assignment.totalPoints || 100} points ` : ''}
                                                        {submission.grade}% - {submission.letterGrade}
                                                        {submission.performanceDescription ? ` - ${submission.performanceDescription}` : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {submission?.feedback && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded">
                                                <span className="font-medium text-gray-500">Feedback:</span>
                                                <p className="text-gray-900 mt-1">{submission.feedback}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row gap-2">
                                        {assignment.cloudinaryUrl && (
                                            <button
                                                onClick={() => handleDownloadFile(assignment)}
                                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                            >
                                                Download Assignment
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleViewAssignment(assignment.id)}
                                            className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
                                        >
                                            View Details
                                        </button>
                                        {!submission && (
                                            <button
                                                onClick={() => handleSubmitAssignment(assignment.id)}
                                                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                Submit Assignment
                                            </button>
                                        )}
                                        {submission && (
                                            <button
                                                onClick={() => handleSubmitAssignment(assignment.id)}
                                                className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                                            >
                                                Resubmit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default AssignmentListStudent; 