import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { getQuizById, getAttemptsByQuiz } from '../../api/quizApi';
import { formatDate } from '../../api/quizApi';

const sortOptions = [
  { value: 'studentName', label: 'Student Name' },
  { value: 'submittedAt', label: 'Submission Time' },
  { value: 'pointsEarned', label: 'Score' },
];

export default function FacultyQuizView() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState('studentName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchQuizData();
  }, [quizId]);

  // Refresh data if coming from other pages
  useEffect(() => {
    if (location.state?.refresh) {
      fetchQuizData();
    }
  }, [location.state]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const [quizRes, attemptsRes] = await Promise.all([
        getQuizById(quizId),
        getAttemptsByQuiz(quizId)
      ]);
      setQuiz(quizRes.data);
      setAttempts(attemptsRes.data);
    } catch (err) {
      console.error("Error fetching quiz data:", err);
      setError("Failed to load quiz data");
    } finally {
      setLoading(false);
    }
  };

  // Sorting and filtering logic
  const filteredAttempts = attempts
    .filter(attempt => attempt.studentName?.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'submittedAt') {
        valA = new Date(valA);
        valB = new Date(valB);
      }
      if (valA === null) return 1;
      if (valB === null) return -1;
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || "Quiz not found"}
        </div>
        <button
          onClick={() => navigate('/faculty/quizzes')}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Back to Quizzes
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link to="/faculty/quizzes" className="text-primary hover:underline mb-4 block">&larr; Back to Quizzes</Link>
        <h1 className="text-3xl font-bold text-gray-800">{quiz.name}</h1>
        <p className="text-gray-600">{quiz.courseName}</p>
      </div>

      {location.state?.success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {location.state.success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Quiz Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Start Date & Time</p>
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
            <p className="text-sm font-medium text-gray-500">Total Attempts</p>
            <p className="text-gray-900">{attempts.length}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Filter by student name..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary w-full md:w-64"
        />
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="ml-1 px-2 py-1 border rounded-md text-xs bg-gray-100 hover:bg-gray-200"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Attempts Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Started At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAttempts.length > 0 ? (
              filteredAttempts.map(attempt => (
                <tr key={attempt.id} className="hover:bg-primary-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {attempt.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(attempt.startedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {attempt.submittedAt ? formatDate(attempt.submittedAt) : 'Not submitted'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {attempt.pointsEarned !== null ? (
                      <span>
                        {attempt.pointsEarned}/{attempt.totalPoints} ({attempt.percentage}%)
                      </span>
                    ) : (
                      <span className="text-gray-400">Not graded</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      attempt.status === 'SUBMITTED' ? 'bg-green-100 text-green-800' :
                      attempt.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {attempt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/faculty/quizzes/${quizId}/grade/${attempt.id}`}
                      className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-dark text-sm"
                    >
                      {attempt.status === 'SUBMITTED' ? 'View Result' : 'View Attempt'}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No attempts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 