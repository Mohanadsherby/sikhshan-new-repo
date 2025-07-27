import axios from 'axios';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

export const getAllCourses = async () => {
  return axios.get(`${API}/api/courses`);
};

export const getCourseById = async (id) => {
  return axios.get(`${API}/api/courses/${id}`);
};

export const getCoursesByInstructor = async (instructorId) => {
  return axios.get(`${API}/api/courses/instructor/${instructorId}`);
};

export const getCoursesByStudent = async (studentId) => {
  return axios.get(`${API}/api/courses/student/${studentId}`);
};

export const getAvailableCoursesForStudent = async (studentId) => {
  return axios.get(`${API}/api/courses/available/${studentId}`);
};

export const createCourse = async (data) => {
  return axios.post(`${API}/api/courses`, data);
};

export const updateCourse = async (id, data) => {
  return axios.put(`${API}/api/courses/${id}`, data);
};

export const deleteCourse = async (id) => {
  return axios.delete(`${API}/api/courses/${id}`);
};

export const unenrollFromCourse = async (courseId, studentId) => {
  return axios.delete(`${API}/api/courses/${courseId}/unenroll?studentId=${studentId}`);
};

export const enrollInCourse = async (courseId, studentId) => {
  return axios.post(`${API}/api/courses/${courseId}/enroll`, { studentId });
};

// Course Attachments APIs
export const getCourseAttachments = async (courseId) => {
  return axios.get(`${API}/api/courses/${courseId}/attachments`);
};

export const uploadCourseAttachment = async (courseId, formData) => {
  return axios.post(`${API}/api/courses/${courseId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteCourseAttachment = async (courseId, attachmentId) => {
  return axios.delete(`${API}/api/courses/${courseId}/attachments/${attachmentId}`);
};

// Course Image Upload
export const uploadCourseImage = async (courseId, formData) => {
  return axios.post(`${API}/api/courses/${courseId}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Get students enrolled in a course
export const getStudentsInCourse = async (courseId) => {
  return axios.get(`${API}/api/courses/${courseId}/students`);
}; 