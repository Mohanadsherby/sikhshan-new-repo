import axios from 'axios';

const API = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new event
export const createEvent = async (eventData) => {
  return axios.post(`${API}/api/events`, eventData, {
    headers: getAuthHeader()
  });
};

// Get events by date
export const getEventsByDate = async (date) => {
  const formattedDate = date.toISOString().split('T')[0];
  return axios.get(`${API}/api/events/date/${formattedDate}`, {
    headers: getAuthHeader()
  });
};

// Get events by month and year
export const getEventsByMonthAndYear = async (year, month) => {
  return axios.get(`${API}/api/events/month/${year}/${month}`, {
    headers: getAuthHeader()
  });
};

// Get my events (events created by current user)
export const getMyEvents = async () => {
  return axios.get(`${API}/api/events/my-events`, {
    headers: getAuthHeader()
  });
};

// Get my events for a specific month and year
export const getMyEventsByMonthYear = async (year, month) => {
  return axios.get(`${API}/api/events/my-events/${year}/${month}`, {
    headers: getAuthHeader()
  });
};

// Get event by ID
export const getEventById = async (eventId) => {
  return axios.get(`${API}/api/events/${eventId}`, {
    headers: getAuthHeader()
  });
};

// Update event
export const updateEvent = async (eventId, eventData) => {
  return axios.put(`${API}/api/events/${eventId}`, eventData, {
    headers: getAuthHeader()
  });
};

// Delete event
export const deleteEvent = async (eventId) => {
  return axios.delete(`${API}/api/events/${eventId}`, {
    headers: getAuthHeader()
  });
};

// Utility functions
export const formatDateForAPI = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatTimeForAPI = (time) => {
  return time + ':00';
};

export const formatTimeForDisplay = (time) => {
  if (!time) return '';
  return time.substring(0, 5);
};

// Convert backend event type to frontend format
export const convertEventType = (backendType) => {
  const typeMap = {
    'ASSIGNMENT': 'assignment',
    'EXAM': 'exam',
    'MEETING': 'meeting',
    'OTHER': 'other'
  };
  return typeMap[backendType] || 'other';
};

// Convert frontend event type to backend format
export const convertToBackendEventType = (frontendType) => {
  const typeMap = {
    'assignment': 'ASSIGNMENT',
    'exam': 'EXAM',
    'meeting': 'MEETING',
    'other': 'OTHER'
  };
  return typeMap[frontendType] || 'OTHER';
}; 