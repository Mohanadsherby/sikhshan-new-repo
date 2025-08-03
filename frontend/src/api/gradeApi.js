import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get course grade for a student
export const getCourseGrade = async (courseId, studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grades/course/${courseId}/student/${studentId}`, {
      headers: getAuthHeader()
    });
    return response;
  } catch (error) {
    console.error('Error fetching course grade:', error);
    throw error;
  }
};

// Get all grades for a student
export const getStudentGrades = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grades/student/${studentId}`, {
      headers: getAuthHeader()
    });
    return response;
  } catch (error) {
    console.error('Error fetching student grades:', error);
    throw error;
  }
};

// Get all grades for a course (for faculty)
export const getCourseGrades = async (courseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grades/course/${courseId}`, {
      headers: getAuthHeader()
    });
    return response;
  } catch (error) {
    console.error('Error fetching course grades:', error);
    throw error;
  }
};

// Update grading weights for a course
export const updateGradingWeights = async (courseId, studentId, assignmentWeight, quizWeight) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/grades/course/${courseId}/weights`, null, {
      params: {
        studentId,
        assignmentWeight,
        quizWeight
      },
      headers: getAuthHeader()
    });
    return response;
  } catch (error) {
    console.error('Error updating grading weights:', error);
    throw error;
  }
};

// Get student's overall GPA
export const getStudentGPA = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grades/student/${studentId}/gpa`, {
      headers: getAuthHeader()
    });
    return response;
  } catch (error) {
    console.error('Error fetching student GPA:', error);
    throw error;
  }
};

// Test grading system
export const testGradingSystem = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grades/test`, {
      headers: getAuthHeader()
    });
    return response;
  } catch (error) {
    console.error('Error testing grading system:', error);
    throw error;
  }
};

// Recalculate all grades for a course
export const recalculateCourseGrades = async (courseId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/grades/course/${courseId}/recalculate`, null, {
      headers: getAuthHeader()
    });
    return response;
  } catch (error) {
    console.error('Error recalculating course grades:', error);
    throw error;
  }
};

// Utility functions for grade display
export const getLetterGradeColor = (letterGrade) => {
  if (!letterGrade || letterGrade === 'N/A') return 'text-gray-500';
  
  switch (letterGrade.charAt(0)) {
    case 'A':
      return 'text-green-600';
    case 'B':
      return 'text-blue-600';
    case 'C':
      return 'text-yellow-600';
    case 'D':
      return 'text-orange-600';
    case 'E':
      return 'text-red-600';
    case 'N':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};

export const getGradePointColor = (gradePoint) => {
  if (!gradePoint) return 'text-gray-500';
  
  if (gradePoint >= 3.6) return 'text-green-600';
  if (gradePoint >= 2.8) return 'text-blue-600';
  if (gradePoint >= 2.0) return 'text-yellow-600';
  if (gradePoint >= 1.6) return 'text-orange-600';
  if (gradePoint >= 0.8) return 'text-red-600';
  return 'text-gray-500';
};

export const getPerformanceColor = (performance) => {
  if (!performance) return 'text-gray-500';
  
  const performanceLower = performance.toLowerCase();
  if (performanceLower.includes('outstanding') || performanceLower.includes('excellent')) {
    return 'text-green-600';
  }
  if (performanceLower.includes('good') || performanceLower.includes('very good')) {
    return 'text-blue-600';
  }
  if (performanceLower.includes('average') || performanceLower.includes('above avg')) {
    return 'text-yellow-600';
  }
  if (performanceLower.includes('below avg')) {
    return 'text-orange-600';
  }
  if (performanceLower.includes('insufficient') || performanceLower.includes('not graded')) {
    return 'text-red-600';
  }
  return 'text-gray-500';
};

export const formatPercentage = (percentage) => {
  if (percentage === null || percentage === undefined) return 'N/A';
  return `${percentage.toFixed(1)}%`;
};

export const formatGradePoint = (gradePoint) => {
  if (gradePoint === null || gradePoint === undefined) return 'N/A';
  return gradePoint.toFixed(2);
};

export const formatPoints = (earned, total) => {
  if (earned === null || total === null) return 'N/A';
  return `${earned}/${total}`;
}; 