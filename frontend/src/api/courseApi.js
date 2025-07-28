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

// Download course attachment
export const downloadCourseAttachment = async (courseId, attachmentId) => {
  try {
    const response = await axios.get(`${API}/api/courses/${courseId}/attachments/${attachmentId}/download`, {
      maxRedirects: 0, // Don't follow redirects automatically
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirect status codes
      }
    });
    
    // If we get a redirect response, follow it manually
    if (response.status === 302) {
      const downloadUrl = response.headers.location;
      if (downloadUrl) {
        // Open the download URL in a new tab
        window.open(downloadUrl, '_blank');
        return response;
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error downloading attachment:', error);
    throw error;
  }
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