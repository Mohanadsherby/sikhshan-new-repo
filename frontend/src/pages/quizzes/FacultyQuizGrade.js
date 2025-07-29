import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getQuizById, getAttemptById } from '../../api/quizApi';
import { formatDate } from '../../api/quizApi';

export default function FacultyQuizGrade() {
  const { quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [quizId, attemptId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizRes, attemptRes] = await Promise.all([
        getQuizById(quizId),
        getAttemptById(attemptId)
      ]);
      
      setQuiz(quizRes.data);
      setAttempt(attemptRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load attempt details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !quiz || !attempt) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || "Attempt not found"}
        </div>
        <button
          onClick={() => navigate(`/faculty/quizzes/${quizId}/view`)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Back to Quiz Attempts
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Link to={`/faculty/quizzes/${quizId}/view`} className="text-primary hover:underline mb-4 block">
        &larr; Back to Quiz Attempts
      </Link>
      
      {/* Student Header */}
      <div className="flex items-center gap-3 mb-4">
        {attempt.studentProfilePictureUrl ? (
          <img 
            src={attempt.studentProfilePictureUrl} 
            alt={attempt.studentName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-medium text-gray-600">
            {attempt.studentName ? attempt.studentName.charAt(0).toUpperCase() : '?'}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quiz Result: {attempt.studentName || 'Unknown Student'}</h1>
          <p className="text-gray-600">{quiz.name} ({quiz.courseName})</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Quiz Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Quiz Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Title</p>
            <p className="text-gray-900">{quiz.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Course</p>
            <p className="text-gray-900">{quiz.courseName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Start Time</p>
            <p className="text-gray-900">{formatDate(quiz.startDateTime)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Duration</p>
            <p className="text-gray-900">{quiz.durationMinutes} minutes</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Points</p>
            <p className="text-gray-900">{quiz.totalPoints}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Questions</p>
            <p className="text-gray-900">{quiz.questions?.length || 0}</p>
          </div>
        </div>
        {quiz.description && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="text-gray-900">{quiz.description}</p>
          </div>
        )}
      </div>

      {/* Student Attempt Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Student Attempt</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Student</p>
            <p className="text-gray-900">{attempt.studentName || 'Unknown Student'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Started At</p>
            <p className="text-gray-900">{formatDate(attempt.startedAt)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Submitted At</p>
            <p className="text-gray-900">{attempt.submittedAt ? formatDate(attempt.submittedAt) : 'Not submitted'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="text-gray-900">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                attempt.status === 'SUBMITTED' ? 'bg-green-100 text-green-800' : 
                attempt.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-gray-100 text-gray-800'
              }`}>
                {attempt.status === 'SUBMITTED' ? 'Completed' : 
                 attempt.status === 'IN_PROGRESS' ? 'In Progress' : 
                 attempt.status}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Automatic Grading Results */}
      {attempt.status === 'SUBMITTED' && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Automatic Grading Results</h2>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              Auto-graded
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {attempt.pointsEarned}/{attempt.totalPoints}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Percentage</p>
              <p className="text-2xl font-bold text-gray-900">
                {attempt.percentage}%
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Grade</p>
              <p className="text-2xl font-bold text-gray-900">
                {attempt.letterGrade}
              </p>
            </div>
          </div>
          
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Performance</p>
            <p className="text-lg font-semibold text-gray-900">
              {attempt.performanceDescription}
            </p>
          </div>
        </div>
      )}

      {/* Student Answers (if available) */}
      {attempt.status === 'SUBMITTED' && attempt.studentAnswers && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Student Answers</h2>
          <div className="space-y-4">
            {quiz.questions?.map((question, index) => {
              const studentAnswer = attempt.studentAnswers[question.id];
              const isCorrect = question.correctAnswer === studentAnswer;
              
              return (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">Question {index + 1}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{question.text}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-500">Student's Answer:</p>
                      <p className="text-gray-900">{studentAnswer || 'No answer'}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">Correct Answer:</p>
                      <p className="text-gray-900">{question.correctAnswer}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Points: {question.points}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={() => navigate(`/faculty/quizzes/${quizId}/view`)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Back to Quiz Attempts
        </button>
      </div>
    </div>
  );
} 