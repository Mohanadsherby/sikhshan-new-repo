import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

// Chat Room API calls
export const createChatRoom = async (user1Id, user2Id) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat/rooms`, {
            user1Id,
            user2Id
        });
        return response.data;
    } catch (error) {
        console.error('Error creating chat room:', error);
        throw error;
    }
};

export const getChatRooms = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chat/rooms?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat rooms:', error);
        throw error;
    }
};

export const getChatRoom = async (chatRoomId, userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chat/rooms/${chatRoomId}?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat room:', error);
        throw error;
    }
};

export const getChatRoomByUsers = async (user1Id, user2Id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chat/rooms/users?user1Id=${user1Id}&user2Id=${user2Id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat room by users:', error);
        throw error;
    }
};

// Message API calls
export const sendMessage = async (chatRoomId, content, senderId, messageType = 'TEXT', fileUrl = null) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat/messages?senderId=${senderId}`, {
            chatRoomId,
            content,
            messageType,
            fileUrl
        });
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const getMessages = async (chatRoomId, userId, page = 0, size = 50) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chat/rooms/${chatRoomId}/messages?userId=${userId}&page=${page}&size=${size}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const deleteMessage = async (messageId, userId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/chat/messages/${messageId}?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting message:', error);
        throw error;
    }
};

export const markMessagesAsRead = async (chatRoomId, userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat/rooms/${chatRoomId}/read?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error marking messages as read:', error);
        throw error;
    }
};

export const getUnreadMessageCount = async (chatRoomId, userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/chat/rooms/${chatRoomId}/unread-count?userId=${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching unread message count:', error);
        throw error;
    }
};

// User Status API calls
export const markUserOnline = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat/users/${userId}/online`);
        return response.data;
    } catch (error) {
        console.error('Error marking user online:', error);
        throw error;
    }
};

export const markUserOffline = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat/users/${userId}/offline`);
        return response.data;
    } catch (error) {
        console.error('Error marking user offline:', error);
        throw error;
    }
};

export const updateUserLastSeen = async (userId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat/users/${userId}/last-seen`);
        return response.data;
    } catch (error) {
        console.error('Error updating user last seen:', error);
        throw error;
    }
};

// Utility functions
export const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    } else if (diffInHours < 48) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
};

export const formatChatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return diffInMinutes === 0 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
};

export const getDisplayName = (user) => {
    return user?.name || user?.email || 'Unknown User';
};

export const getDisplayContent = (message) => {
    if (message.isDeleted) {
        return 'User deleted message';
    }
    return message.content;
}; 