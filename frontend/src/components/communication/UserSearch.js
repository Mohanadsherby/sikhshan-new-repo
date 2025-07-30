import React, { useState, useEffect } from 'react';
import { searchUsersGet, getUserDisplayName, getUserRoleDisplay } from '../../api/userSearchApi';

const UserSearch = ({ currentUserId, onUserSelect, onBack }) => {
    const [users, setUsers] = useState([]);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const [query, setQuery] = useState('');
    const [role, setRole] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, [currentUserId]);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await searchUsersGet(query, role, currentUserId);
            setUsers(response.users || []);
            setSuggestedUsers(response.suggestedUsers || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleUserSelect = (user) => {
        onUserSelect(user);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onBack}
                        className="p-1 text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-semibold text-gray-800">New Message</h2>
                </div>
            </div>

            {/* Search Form */}
            <div className="p-4 border-b border-gray-200">
                <form onSubmit={handleSearch} className="space-y-3">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="">All Roles</option>
                        <option value="STUDENT">Students</option>
                        <option value="FACULTY">Faculty</option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        {/* Suggested Users */}
                        {suggestedUsers.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Suggested</h3>
                                <div className="space-y-2">
                                    {suggestedUsers.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            onClick={() => handleUserSelect(user)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Search Results */}
                        {users.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Search Results</h3>
                                <div className="space-y-2">
                                    {users.map((user) => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            onClick={() => handleUserSelect(user)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {!loading && users.length === 0 && suggestedUsers.length === 0 && (
                            <div className="text-center text-gray-500">
                                <p>No users found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const UserCard = ({ user, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        >
            {/* Avatar */}
            <div className="flex-shrink-0">
                {user.profilePictureUrl ? (
                    <img
                        src={user.profilePictureUrl}
                        alt={getUserDisplayName(user)}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                            {getUserDisplayName(user).charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                    {getUserDisplayName(user)}
                </h4>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500">{getUserRoleDisplay(user.role)}</span>
                    <div className={`w-2 h-2 rounded-full ml-2 ${
                        user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                </div>
            </div>
        </div>
    );
};

export default UserSearch; 