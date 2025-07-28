import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// Assignment CRUD operations
export const createAssignment = async (assignmentData) => {
    const response = await axios.post(`${API_BASE_URL}/assignments`, assignmentData);
    return response;
};

export const getAllAssignments = async () => {
    const response = await axios.get(`${API_BASE_URL}/assignments`);
    return response;
};

export const getAssignmentById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/assignments/${id}`);
    return response;
};

export const getAssignmentsByCourse = async (courseId) => {
    const response = await axios.get(`${API_BASE_URL}/assignments/course/${courseId}`);
    return response;
};

export const getActiveAssignmentsByCourse = async (courseId) => {
    const response = await axios.get(`${API_BASE_URL}/assignments/course/${courseId}/active`);
    return response;
};

export const getOverdueAssignmentsByCourse = async (courseId) => {
    const response = await axios.get(`${API_BASE_URL}/assignments/course/${courseId}/overdue`);
    return response;
};

export const getAssignmentsByInstructor = async (instructorId) => {
    const response = await axios.get(`${API_BASE_URL}/assignments/instructor/${instructorId}`);
    return response;
};

export const updateAssignment = async (id, assignmentData) => {
    const response = await axios.put(`${API_BASE_URL}/assignments/${id}`, assignmentData);
    return response;
};

export const deleteAssignment = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/assignments/${id}`);
    return response;
};

// Assignment file upload
export const uploadAssignmentFile = async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/assignments/${id}/file`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes for large files
    });
    return response;
};

// Assignment submission operations
export const submitAssignment = async (submissionData) => {
    const response = await axios.post(`${API_BASE_URL}/assignment-submissions`, submissionData);
    return response;
};

export const uploadSubmissionFile = async (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axios.post(`${API_BASE_URL}/assignment-submissions/${id}/file`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes for large files
    });
    return response;
};

export const gradeSubmission = async (id, gradeData) => {
    const response = await axios.put(`${API_BASE_URL}/assignment-submissions/${id}/grade`, gradeData);
    return response;
};

export const getSubmissionById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/assignment-submissions/${id}`);
    return response;
};

export const getSubmissionsByAssignment = async (assignmentId) => {
    const response = await axios.get(`${API_BASE_URL}/assignment-submissions/assignment/${assignmentId}`);
    return response;
};

export const getSubmissionsByStudent = async (studentId) => {
    const response = await axios.get(`${API_BASE_URL}/assignment-submissions/student/${studentId}`);
    return response;
};

export const getStudentSubmissionsByCourse = async (studentId, courseId) => {
    const response = await axios.get(`${API_BASE_URL}/assignment-submissions/student/${studentId}/course/${courseId}`);
    return response;
};

export const getLatestSubmission = async (assignmentId, studentId) => {
    const response = await axios.get(`${API_BASE_URL}/assignment-submissions/assignment/${assignmentId}/student/${studentId}/latest`);
    return response;
};

export const getGradedSubmissions = async (assignmentId) => {
    const response = await axios.get(`${API_BASE_URL}/assignment-submissions/assignment/${assignmentId}/graded`);
    return response;
};

export const getLateSubmissions = async (assignmentId) => {
    const response = await axios.get(`${API_BASE_URL}/assignment-submissions/assignment/${assignmentId}/late`);
    return response;
};

export const deleteSubmission = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/assignment-submissions/${id}`);
    return response;
};

// Helper function to download files
export const downloadFile = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Helper function to get letter grade from numeric grade
export const getLetterGrade = (numericGrade) => {
    if (numericGrade >= 93) return 'A';
    if (numericGrade >= 90) return 'A-';
    if (numericGrade >= 87) return 'B+';
    if (numericGrade >= 83) return 'B';
    if (numericGrade >= 80) return 'B-';
    if (numericGrade >= 77) return 'C+';
    if (numericGrade >= 73) return 'C';
    if (numericGrade >= 70) return 'C-';
    if (numericGrade >= 67) return 'D+';
    if (numericGrade >= 63) return 'D';
    if (numericGrade >= 60) return 'D-';
    return 'F';
};

// Helper function to format date
export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Helper function to check if assignment is overdue
export const isAssignmentOverdue = (dueDate) => {
    if (!dueDate) return false;
    const now = new Date();
    const due = new Date(dueDate);
    return now > due;
};

// Helper function to get assignment status
export const getAssignmentStatus = (assignment) => {
    if (assignment.status === 'INACTIVE') return 'Inactive';
    if (assignment.status === 'DRAFT') return 'Draft';
    if (isAssignmentOverdue(assignment.dueDate)) return 'Overdue';
    return 'Active';
}; 