import axios from 'axios';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

export const getAllUsers = async () => {
  return axios.get(`${API}/api/admin/users`);
};

export const getUserById = async (id) => {
  return axios.get(`${API}/api/admin/users/${id}`);
};

export const createUser = async (data) => {
  return axios.post(`${API}/api/admin/users/create`, data);
};

export const updateUser = async (id, data) => {
  return axios.put(`${API}/api/admin/users/${id}`, data);
};

export const deleteUser = async (id) => {
  return axios.delete(`${API}/api/admin/users/${id}`);
}; 