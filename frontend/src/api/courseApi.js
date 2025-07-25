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

export const createCourse = async (data) => {
  return axios.post(`${API}/api/courses`, data);
};

export const updateCourse = async (id, data) => {
  return axios.put(`${API}/api/courses/${id}`, data);
};

export const deleteCourse = async (id) => {
  return axios.delete(`${API}/api/courses/${id}`);
};

export const unenrollFromCourse = async (courseId) => {
  return axios.delete(`${API}/api/courses/${courseId}/unenroll`);
}; 