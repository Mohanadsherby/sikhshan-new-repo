import axios from 'axios';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

export const getProfile = async (userId) => {
  return axios.get(`${API}/api/profile/${userId}`);
};

export const updateProfile = async (userId, data) => {
  return axios.put(`${API}/api/profile/${userId}`, data);
};

export const uploadProfilePicture = async (userId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API}/api/profile/${userId}/picture`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}; 