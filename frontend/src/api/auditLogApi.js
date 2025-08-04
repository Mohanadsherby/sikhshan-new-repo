import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// Get all audit logs with pagination
export const getAllAuditLogs = async (page = 0, size = 20, sortBy = 'timestamp', sortDir = 'desc') => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs`, {
      params: { page, size, sortBy, sortDir }
    });
    return response;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
};

// Get audit logs with filters
export const getAuditLogsWithFilters = async (filters = {}, page = 0, size = 20) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/filter`, {
      params: { ...filters, page, size }
    });
    return response;
  } catch (error) {
    console.error('Error fetching filtered audit logs:', error);
    throw error;
  }
};

// Get logs by user ID
export const getLogsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/user/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching user logs:', error);
    throw error;
  }
};

// Get logs by action
export const getLogsByAction = async (action) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/action/${action}`);
    return response;
  } catch (error) {
    console.error('Error fetching action logs:', error);
    throw error;
  }
};

// Get logs by status
export const getLogsByStatus = async (status) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/status/${status}`);
    return response;
  } catch (error) {
    console.error('Error fetching status logs:', error);
    throw error;
  }
};

// Get logs by date range
export const getLogsByDateRange = async (startDate, endDate) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/date-range`, {
      params: { startDate, endDate }
    });
    return response;
  } catch (error) {
    console.error('Error fetching date range logs:', error);
    throw error;
  }
};

// Get recent logs (last 24 hours)
export const getRecentLogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/recent`);
    return response;
  } catch (error) {
    console.error('Error fetching recent logs:', error);
    throw error;
  }
};

// Get error logs
export const getErrorLogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/errors`);
    return response;
  } catch (error) {
    console.error('Error fetching error logs:', error);
    throw error;
  }
};

// Get failed requests
export const getFailedRequests = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/failed-requests`);
    return response;
  } catch (error) {
    console.error('Error fetching failed requests:', error);
    throw error;
  }
};

// Get slow queries
export const getSlowQueries = async (threshold = 5000) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/slow-queries`, {
      params: { threshold }
    });
    return response;
  } catch (error) {
    console.error('Error fetching slow queries:', error);
    throw error;
  }
};

// Get logs by IP address
export const getLogsByIpAddress = async (ipAddress) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/ip/${ipAddress}`);
    return response;
  } catch (error) {
    console.error('Error fetching IP logs:', error);
    throw error;
  }
};

// Get logs by session ID
export const getLogsBySessionId = async (sessionId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/session/${sessionId}`);
    return response;
  } catch (error) {
    console.error('Error fetching session logs:', error);
    throw error;
  }
};

// Search logs by username
export const searchLogsByUsername = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/search/username`, {
      params: { username }
    });
    return response;
  } catch (error) {
    console.error('Error searching logs by username:', error);
    throw error;
  }
};

// Search logs by details
export const searchLogsByDetails = async (details) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/search/details`, {
      params: { details }
    });
    return response;
  } catch (error) {
    console.error('Error searching logs by details:', error);
    throw error;
  }
};

// Get log statistics
export const getLogStatistics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/statistics`);
    return response;
  } catch (error) {
    console.error('Error fetching log statistics:', error);
    throw error;
  }
};

// Delete old logs
export const deleteOldLogs = async (days = 90) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/audit-logs/cleanup`, {
      params: { days }
    });
    return response;
  } catch (error) {
    console.error('Error deleting old logs:', error);
    throw error;
  }
};

// Export logs
export const exportLogs = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/export`, {
      params: filters,
      responseType: 'blob'
    });
    return response;
  } catch (error) {
    console.error('Error exporting logs:', error);
    throw error;
  }
};

// Utility functions for audit log display
export const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
      return 'text-green-500';
    case 'ERROR':
      return 'text-red-500';
    case 'WARNING':
      return 'text-yellow-500';
    case 'INFO':
      return 'text-blue-500';
    default:
      return 'text-gray-500';
  }
};

export const getStatusIcon = (status) => {
  switch (status?.toUpperCase()) {
    case 'SUCCESS':
      return 'check-circle';
    case 'ERROR':
      return 'exclamation-triangle';
    case 'WARNING':
      return 'exclamation-circle';
    case 'INFO':
      return 'information-circle';
    default:
      return 'information-circle';
  }
};

export const getActionDisplay = (action) => {
  if (!action) return 'Unknown';
  
  switch (action.toUpperCase()) {
    case 'LOGIN':
      return 'User Login';
    case 'LOGOUT':
      return 'User Logout';
    case 'CREATE_USER':
      return 'Create User';
    case 'UPDATE_USER':
      return 'Update User';
    case 'DELETE_USER':
      return 'Delete User';
    case 'CREATE_COURSE':
      return 'Create Course';
    case 'UPDATE_COURSE':
      return 'Update Course';
    case 'DELETE_COURSE':
      return 'Delete Course';
    case 'CREATE_ASSIGNMENT':
      return 'Create Assignment';
    case 'UPDATE_ASSIGNMENT':
      return 'Update Assignment';
    case 'DELETE_ASSIGNMENT':
      return 'Delete Assignment';
    case 'CREATE_QUIZ':
      return 'Create Quiz';
    case 'UPDATE_QUIZ':
      return 'Update Quiz';
    case 'DELETE_QUIZ':
      return 'Delete Quiz';
    case 'SUBMIT_ASSIGNMENT':
      return 'Submit Assignment';
    case 'GRADE_ASSIGNMENT':
      return 'Grade Assignment';
    case 'TAKE_QUIZ':
      return 'Take Quiz';
    case 'GRADE_QUIZ':
      return 'Grade Quiz';
    case 'ENROLL_COURSE':
      return 'Enroll in Course';
    case 'UNENROLL_COURSE':
      return 'Unenroll from Course';
    case 'UPLOAD_FILE':
      return 'Upload File';
    case 'DELETE_FILE':
      return 'Delete File';
    case 'SYSTEM_BACKUP':
      return 'System Backup';
    case 'SYSTEM_RESTORE':
      return 'System Restore';
    case 'PASSWORD_CHANGE':
      return 'Password Change';
    case 'PROFILE_UPDATE':
      return 'Profile Update';
    default:
      return action.replace(/_/g, ' ').toLowerCase();
  }
};

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleString();
};

export const formatDuration = (executionTime) => {
  if (!executionTime) return 'N/A';
  
  if (executionTime < 1000) {
    return `${executionTime}ms`;
  } else if (executionTime < 60000) {
    return `${(executionTime / 1000).toFixed(1)}s`;
  } else {
    return `${(executionTime / 60000).toFixed(1)}m`;
  }
};

// Get audit log by ID
export const getAuditLogById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/audit-logs/${id}`);
    return response;
  } catch (error) {
    console.error('Error fetching audit log:', error);
    throw error;
  }
};



export const downloadAuditLogs = async (filters = {}) => {
  try {
    const response = await exportLogs(filters);
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading audit logs:', error);
    throw error;
  }
}; 