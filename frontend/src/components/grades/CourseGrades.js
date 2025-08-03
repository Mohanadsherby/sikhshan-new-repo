import React, { useState, useEffect } from 'react';
import { getCourseGrade, getCourseGrades, updateGradingWeights, recalculateCourseGrades } from '../../api/gradeApi';
import { useAuth } from '../../contexts/AuthContext';

const CourseGrades = ({ courseId, isFaculty = false }) => {
  const { currentUser } = useAuth();
  const [courseGrade, setCourseGrade] = useState(null);
  const [courseGrades, setCourseGrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (courseId) {
      fetchGrades();
    }
  }, [courseId]);

  const fetchGrades = async () => {
    setLoading(true);
    try {
      if (isFaculty) {
        const response = await getCourseGrades(courseId);
        setCourseGrades(response.data);
      } else {
        console.log('Fetching grade for courseId:', courseId, 'studentId:', currentUser.id);
        const response = await getCourseGrade(courseId, currentUser.id);
        setCourseGrade(response.data);
      }
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      setError(`Failed to load grades: ${err.response?.data || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleWeightUpdate = async (studentId, assignmentWeight, quizWeight) => {
    try {
      await updateGradingWeights(courseId, studentId, assignmentWeight, quizWeight);
      await fetchGrades(); // Refresh grades
    } catch (err) {
      setError('Failed to update grading weights');
      console.error('Error updating weights:', err);
    }
  };

  const handleRecalculateGrades = async () => {
    try {
      await recalculateCourseGrades(courseId);
      await fetchGrades(); // Refresh grades
    } catch (err) {
      setError('Failed to recalculate grades');
      console.error('Error recalculating grades:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-500 mt-2">Loading grades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Student View
  if (!isFaculty && courseGrade) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Your Grades</h3>
        
        <div className="space-y-6">
          {/* Overall Grade Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{courseGrade.finalPercentage?.toFixed(1) || 0}%</p>
                <p className="text-sm text-gray-600">Final Grade</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${courseGrade.letterGrade ? 'text-green-600' : 'text-gray-400'}`}>
                  {courseGrade.letterGrade || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Letter Grade</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${courseGrade.gradePoint ? 'text-purple-600' : 'text-gray-400'}`}>
                  {courseGrade.gradePoint?.toFixed(1) || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">Grade Point</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{courseGrade.performanceDescription || 'N/A'}</p>
                <p className="text-sm text-gray-600">Performance</p>
              </div>
            </div>
          </div>

          {/* Assignment Grades */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Assignment Grades</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">{courseGrade.assignmentCount || 0}</p>
                  <p className="text-sm text-gray-600">Total Assignments</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">{courseGrade.assignmentPercentage?.toFixed(1) || 0}%</p>
                  <p className="text-sm text-gray-600">Assignment Average</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600">{courseGrade.assignmentWeight || 60}%</p>
                  <p className="text-sm text-gray-600">Weight in Final Grade</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Points Earned: {courseGrade.assignmentPointsEarned || 0} / {courseGrade.assignmentTotalPoints || 0}</p>
              </div>
            </div>
          </div>

          {/* Quiz Grades */}
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-4">Quiz Grades</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">{courseGrade.quizCount || 0}</p>
                  <p className="text-sm text-gray-600">Total Quizzes</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">{courseGrade.quizPercentage?.toFixed(1) || 0}%</p>
                  <p className="text-sm text-gray-600">Quiz Average</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600">{courseGrade.quizWeight || 40}%</p>
                  <p className="text-sm text-gray-600">Weight in Final Grade</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>Points Earned: {courseGrade.quizPointsEarned || 0} / {courseGrade.quizTotalPoints || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Faculty View
  if (isFaculty && courseGrades.length > 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Student Grades</h3>
          <button
            onClick={handleRecalculateGrades}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Recalculate All Grades
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Letter Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Point</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courseGrades.map((grade) => (
                <tr key={grade.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{grade.studentName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{grade.finalPercentage?.toFixed(1) || 0}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      grade.letterGrade ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {grade.letterGrade || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.gradePoint?.toFixed(1) || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {grade.performanceDescription || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleWeightUpdate(grade.studentId, 60, 40)}
                      className="text-primary hover:text-primary-dark"
                    >
                      Adjust Weights
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // No grades available
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        {isFaculty ? 'Student Grades' : 'Your Grades'}
      </h3>
      <div className="text-center py-8 text-gray-500">
        <p>No grades available yet.</p>
        <p className="text-sm mt-2">
          {isFaculty 
            ? 'Student grades will appear here once assignments and quizzes are graded.'
            : 'Your grades will appear here once assignments and quizzes are graded.'
          }
        </p>
      </div>
    </div>
  );
};

export default CourseGrades; 