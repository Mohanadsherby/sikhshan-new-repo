import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// Quiz CRUD operations
export const createQuiz = async (quizData) => {
    const response = await axios.post(`${API_BASE_URL}/quizzes`, quizData);
    return response;
};

export const getAllQuizzes = async () => {
    const response = await axios.get(`${API_BASE_URL}/quizzes`);
    return response;
};

export const getQuizById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/quizzes/${id}`);
    return response;
};

export const getQuizForStudent = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/quizzes/${id}/student`);
    return response;
};

export const getQuizzesByCourse = async (courseId) => {
    const response = await axios.get(`${API_BASE_URL}/quizzes/course/${courseId}`);
    return response;
};

export const getActiveQuizzesByCourse = async (courseId) => {
    const response = await axios.get(`${API_BASE_URL}/quizzes/course/${courseId}/active`);
    return response;
};

export const getQuizzesByInstructor = async (instructorId) => {
    const response = await axios.get(`${API_BASE_URL}/quizzes/instructor/${instructorId}`);
    return response;
};

export const updateQuiz = async (id, quizData) => {
    const response = await axios.put(`${API_BASE_URL}/quizzes/${id}`, quizData);
    return response;
};

export const deleteQuiz = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/quizzes/${id}`);
    return response;
};

// Quiz Attempt operations
export const startQuizAttempt = async (attemptData) => {
    const response = await axios.post(`${API_BASE_URL}/quiz-attempts/start`, attemptData);
    return response;
};

export const submitQuizAttempt = async (attemptData) => {
    const response = await axios.post(`${API_BASE_URL}/quiz-attempts/submit`, attemptData);
    return response;
};

export const getAttemptById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/quiz-attempts/${id}`);
    return response;
};

export const getStudentAttemptForQuiz = async (quizId, studentId) => {
    const response = await axios.get(`${API_BASE_URL}/quiz-attempts/quiz/${quizId}/student/${studentId}`);
    return response;
};

export const getAttemptsByQuiz = async (quizId) => {
    const response = await axios.get(`${API_BASE_URL}/quiz-attempts/quiz/${quizId}`);
    return response;
};

export const getAttemptsByStudent = async (studentId) => {
    const response = await axios.get(`${API_BASE_URL}/quiz-attempts/student/${studentId}`);
    return response;
};

export const getTimeRemaining = async (quizId, studentId) => {
    const response = await axios.get(`${API_BASE_URL}/quiz-attempts/quiz/${quizId}/time-remaining/${studentId}`);
    return response;
};

export const updateQuizAttempt = async (id, attemptData) => {
    const response = await axios.put(`${API_BASE_URL}/quiz-attempts/${id}`, attemptData);
    return response;
};

// Utility functions
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export const formatTimeRemaining = (minutes) => {
    if (minutes <= 0) return 'Time expired';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${mins}m remaining`;
    } else {
        return `${mins}m remaining`;
    }
};

export const isQuizActive = (quiz) => {
    if (!quiz || !quiz.startDateTime || !quiz.durationMinutes) return false;
    
    const now = new Date();
    const startTime = new Date(quiz.startDateTime);
    const endTime = new Date(startTime.getTime() + quiz.durationMinutes * 60000);
    
    return now >= startTime && now <= endTime;
};

export const isQuizOverdue = (quiz) => {
    if (!quiz || !quiz.startDateTime || !quiz.durationMinutes) return false;
    
    const now = new Date();
    const startTime = new Date(quiz.startDateTime);
    const endTime = new Date(startTime.getTime() + quiz.durationMinutes * 60000);
    
    return now > endTime;
};

export const getQuizStatus = (quiz) => {
    if (!quiz) return 'UNKNOWN';
    
    const now = new Date();
    const startTime = new Date(quiz.startDateTime);
    const endTime = new Date(startTime.getTime() + quiz.durationMinutes * 60000);
    
    if (now < startTime) return 'NOT_STARTED';
    if (now >= startTime && now <= endTime) return 'ACTIVE';
    return 'ENDED';
};

export const calculateLetterGrade = (percentage) => {
    if (percentage >= 90.0) return "A+";
    if (percentage >= 80.0) return "A";
    if (percentage >= 70.0) return "B+";
    if (percentage >= 60.0) return "B";
    if (percentage >= 50.0) return "C+";
    if (percentage >= 40.0) return "C";
    if (percentage >= 35.0) return "D+";
    return "F";
};

export const getPerformanceDescription = (percentage) => {
    if (percentage >= 90.0) return "Outstanding";
    if (percentage >= 80.0) return "Excellent";
    if (percentage >= 70.0) return "Very Good";
    if (percentage >= 60.0) return "Good";
    if (percentage >= 50.0) return "Satisfactory";
    if (percentage >= 40.0) return "Acceptable";
    if (percentage >= 35.0) return "Basic";
    return "Fail";
}; 