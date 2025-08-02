import axios from 'axios';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

export const login = async (email, password, role) => {
  if (role === 'SUPERADMIN') {
    return axios.post(`${API}/api/admin/login`, {
      email,
      password
    });
  } else {
    return axios.post(`${API}/api/users/login`, {
      email,
      password,
      role
    });
  }
};

export const logout = async (role) => {
  if (role === 'SUPERADMIN') {
    return axios.post(`${API}/api/admin/logout`);
  } else {
    return axios.post(`${API}/api/users/logout`);
  }
}; 