import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import GradingFeedback from '../../components/GradingFeedback';

// Mock assignment data with multiple submissions
const mockAssignment = {
  id: 1,
  title: 'Programming Basics Assignment',
  course: 'CS101',
  courseName: 'Introduction to Computer Science',
  totalPoints: 100,
  description: 'Complete the basic programming exercises covering variables, loops, and functions.',
  requirements: [
    'Write code for all problems',
    'Comment your code',
    'Submit as a single .zip file',
  ],
  submissions: [
    {
      id: 1,
      studentName: 'John Doe',
      file: { name: 'assignment1_john.zip', url: '#' },
      submittedAt: '2024-03-19T15:00:00',
      grade: 85,
      feedback: 'Good job! Add more comments next time.'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      file: { name: 'assignment1_jane.zip', url: '#' },
      submittedAt: '2024-03-19T16:30:00',
      grade: null,
      feedback: ''
    },
    {
      id: 3,
      studentName: 'Alex Lee',
      file: { name: 'assignment1_alex.zip', url: '#' },
      submittedAt: '2024-03-20T09:10:00',
      grade: 92,
      feedback: 'Excellent work!'
    },
  ],
};

export default function FacultyAssignmentGrade() {
  const { assignmentId, submissionId } = useParams();
  const navigate = useNavigate();
  const submission = mockAssignment.submissions.find(s => String(s.id) === String(submissionId));
  const [grade, setGrade] = useState(submission?.grade ?? '');
  const [feedback, setFeedback] = useState(submission?.feedback ?? '');

  const handleGradeSubmit = ({ grade, feedback }) => {
    setGrade(grade);
    setFeedback(feedback);
    // Here you would call the backend API
    alert(`Grade submitted: ${grade}\nFeedback: ${feedback}`);
    navigate(`/faculty/assignments/${assignmentId}/view`);
  };

  if (!submission) {
    return <div className="p-8 text-center text-red-600">Submission not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Link to={`/faculty/assignments/${assignmentId}/view`} className="text-primary hover:underline mb-4 block">&larr; Back to Assignment Submissions</Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Grading: {submission.studentName}</h1>
      <p className="text-gray-600 mb-4">{mockAssignment.title} ({mockAssignment.course})</p>
      {/* Assignment Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Assignment Details</h2>
        <p className="mb-1"><strong>Title:</strong> {mockAssignment.title}</p>
        <p className="mb-1"><strong>Course:</strong> {mockAssignment.course} - {mockAssignment.courseName}</p>
        <p className="mb-1"><strong>Total Points:</strong> {mockAssignment.totalPoints}</p>
        <p className="mb-1"><strong>Description:</strong> {mockAssignment.description}</p>
        <div className="mb-1"><strong>Requirements:</strong>
          <ul className="list-disc list-inside ml-4 text-gray-700">
            {mockAssignment.requirements.map((req, idx) => <li key={idx}>{req}</li>)}
          </ul>
        </div>
      </div>
      {/* Submission Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Student Submission</h2>
        <p className="mb-1"><strong>Student:</strong> {submission.studentName}</p>
        <p className="mb-1"><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
        <a href={submission.file.url} className="text-primary underline block mb-1">Download: {submission.file.name}</a>
        <p className="mb-1"><strong>Current Grade:</strong> {submission.grade !== null ? submission.grade : 'Not graded yet'}</p>
        <p className="mb-1"><strong>Current Feedback:</strong> {submission.feedback || 'No feedback yet'}</p>
      </div>
      {/* Grading Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <GradingFeedback
          isFaculty={true}
          grade={grade}
          feedback={feedback}
          isGraded={false}
          onSubmit={handleGradeSubmit}
        />
      </div>
    </div>
  );
} 