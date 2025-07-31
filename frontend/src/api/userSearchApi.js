import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// User Search API calls
export const searchUsers = async (query, role, currentUserId, page = 0, size = 20) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/search`, {
            query,
            role,
            currentUserId,
            page,
            size
        });
        return response.data;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

export const searchUsersGet = async (query, role, currentUserId, page = 0, size = 20) => {
    try {
        const params = new URLSearchParams({
            currentUserId: currentUserId.toString(),
            page: page.toString(),
            size: size.toString()
        });

        if (query) params.append('query', query);
        if (role) params.append('role', role);

        const response = await axios.get(`${API_BASE_URL}/users/search?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};

// Utility functions for user display
export const getUserDisplayName = (user) => {
    if (!user) return 'Unknown User';
    
    // Use name if available, otherwise use email
    return user.name && user.name.trim() !== '' ? user.name : user.email;
};

export const getUserInitials = (user) => {
    const displayName = getUserDisplayName(user);
    
    if (!displayName || displayName === 'Unknown User') {
        return '?';
    }
    
    // Get initials from name or email
    const parts = displayName.split(' ');
    if (parts.length > 1) {
        // Name has multiple parts, use first letter of each
        return parts.map(part => part.charAt(0).toUpperCase()).join('').substring(0, 2);
    } else {
        // Single word, use first two letters
        return displayName.substring(0, 2).toUpperCase();
    }
};

export const getUserRoleDisplay = (role) => {
    switch (role) {
        case 'STUDENT':
            return 'Student';
        case 'FACULTY':
            return 'Faculty';
        case 'ADMIN':
            return 'Admin';
        default:
            return role || 'Unknown';
    }
};

export const getOnlineStatusText = (isOnline, lastSeen) => {
    if (isOnline) {
        return 'Online';
    }
    
    if (!lastSeen) {
        return 'Offline';
    }
    
    const lastSeenDate = new Date(lastSeen);
    const now = new Date();
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
        const hours = Math.floor(diffInMinutes / 60);
        return `${hours}h ago`;
    } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `${days}d ago`;
    }
};

export const getOnlineStatusColor = (isOnline) => {
    return isOnline ? 'text-green-500' : 'text-gray-400';
};

export const getOnlineStatusDot = (isOnline) => {
    return isOnline ? 'bg-green-500' : 'bg-gray-400';
};

// Filter and sort functions
export const filterUsersByRole = (users, role) => {
    if (!role) return users;
    return users.filter(user => user.role === role);
};

export const sortUsersByOnlineStatus = (users) => {
    return [...users].sort((a, b) => {
        // Online users first
        if (a.isOnline && !b.isOnline) return -1;
        if (!a.isOnline && b.isOnline) return 1;
        
        // Then by name
        const nameA = getUserDisplayName(a).toLowerCase();
        const nameB = getUserDisplayName(b).toLowerCase();
        return nameA.localeCompare(nameB);
    });
};

export const sortUsersByName = (users) => {
    return [...users].sort((a, b) => {
        const nameA = getUserDisplayName(a).toLowerCase();
        const nameB = getUserDisplayName(b).toLowerCase();
        return nameA.localeCompare(nameB);
    });
};

// Search suggestions
export const getSearchSuggestions = (query, users) => {
    if (!query || query.trim() === '') return [];
    
    const searchTerm = query.toLowerCase().trim();
    return users.filter(user => {
        const name = (user.name || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const role = (user.role || '').toLowerCase();
        
        return name.includes(searchTerm) || 
               email.includes(searchTerm) || 
               role.includes(searchTerm);
    });
}; 