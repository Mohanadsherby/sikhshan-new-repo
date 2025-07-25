import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import GradingFeedback from '../../components/GradingFeedback';

// Mock quiz data with multiple submissions
const mockQuiz = {
  id: 1,
  title: 'Programming Basics Quiz',
  course: 'CS101',
  courseName: 'Introduction to Computer Science',
  totalPoints: 20,
  description: 'Test your knowledge of basic programming concepts.',
  submissions: [
    {
      id: 1,
      studentName: 'John Doe',
      submittedAt: '2024-03-19T15:00:00',
      grade: 18,
      feedback: 'Great answers!'
    },
    {
      id: 2,
      studentName: 'Jane Smith',
      submittedAt: '2024-03-19T16:30:00',
      grade: null,
      feedback: ''
    },
    {
      id: 3,
      studentName: 'Alex Lee',
      submittedAt: '2024-03-20T09:10:00',
      grade: 20,
      feedback: 'Perfect score!'
    },
  ],
};

export default function FacultyQuizGrade() {
  const { quizId, submissionId } = useParams();
  const navigate = useNavigate();
  const submission = mockQuiz.submissions.find(s => String(s.id) === String(submissionId));
  const [grade, setGrade] = useState(submission?.grade ?? '');
  const [feedback, setFeedback] = useState(submission?.feedback ?? '');

  const handleGradeSubmit = ({ grade, feedback }) => {
    setGrade(grade);
    setFeedback(feedback);
    // Here you would call the backend API
    alert(`Grade submitted: ${grade}\nFeedback: ${feedback}`);
    navigate(`/faculty/quizzes/${quizId}/view`);
  };

  if (!submission) {
    return <div className="p-8 text-center text-red-600">Submission not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <Link to={`/faculty/quizzes/${quizId}/view`} className="text-primary hover:underline mb-4 block">&larr; Back to Quiz Submissions</Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Grading: {submission.studentName}</h1>
      <p className="text-gray-600 mb-4">{mockQuiz.title} ({mockQuiz.course})</p>
      {/* Quiz Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Quiz Details</h2>
        <p className="mb-1"><strong>Title:</strong> {mockQuiz.title}</p>
        <p className="mb-1"><strong>Course:</strong> {mockQuiz.course} - {mockQuiz.courseName}</p>
        <p className="mb-1"><strong>Total Points:</strong> {mockQuiz.totalPoints}</p>
        <p className="mb-1"><strong>Description:</strong> {mockQuiz.description}</p>
      </div>
      {/* Submission Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Student Submission</h2>
        <p className="mb-1"><strong>Student:</strong> {submission.studentName}</p>
        <p className="mb-1"><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
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