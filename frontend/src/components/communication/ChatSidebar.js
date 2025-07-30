import React, { useState, useEffect } from 'react';
import { getChatRooms, formatChatTime, getDisplayName } from '../../api/chatApi';

const ChatSidebar = ({ currentUserId, selectedChatRoom, onChatRoomSelect }) => {
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChatRooms();
    }, [currentUserId]);

    const fetchChatRooms = async () => {
        try {
            setLoading(true);
            const data = await getChatRooms(currentUserId);
            setChatRooms(data);
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        } finally {
            setLoading(false);
        }
    };

    const getOtherUser = (chatRoom) => {
        if (chatRoom.user1.id === currentUserId) {
            return chatRoom.user2;
        }
        return chatRoom.user1;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {chatRooms.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <p>No conversations yet</p>
                        <p className="text-sm">Start a new chat to begin messaging</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {chatRooms.map((chatRoom) => {
                        const otherUser = getOtherUser(chatRoom);
                        const isSelected = selectedChatRoom?.id === chatRoom.id;
                        
                        return (
                            <div
                                key={chatRoom.id}
                                onClick={() => onChatRoomSelect(chatRoom)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                    isSelected ? 'bg-blue-50 border-blue-200' : ''
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    {/* User Avatar */}
                                    <div className="flex-shrink-0">
                                        {otherUser.profilePictureUrl ? (
                                            <img
                                                src={otherUser.profilePictureUrl}
                                                alt={getDisplayName(otherUser)}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-600">
                                                    {getDisplayName(otherUser).charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Chat Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {getDisplayName(otherUser)}
                                            </h3>
                                            {chatRoom.lastMessageAt && (
                                                <span className="text-xs text-gray-500">
                                                    {formatChatTime(chatRoom.lastMessageAt)}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {chatRoom.lastMessage && (
                                            <p className="text-sm text-gray-500 truncate mt-1">
                                                {chatRoom.lastMessage.isDeleted 
                                                    ? 'User deleted message'
                                                    : chatRoom.lastMessage.content
                                                }
                                            </p>
                                        )}

                                        {/* Online Status */}
                                        <div className="flex items-center mt-1">
                                            <div className={`w-2 h-2 rounded-full mr-2 ${
                                                otherUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                            }`}></div>
                                            <span className="text-xs text-gray-500">
                                                {otherUser.isOnline ? 'Online' : 'Offline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ChatSidebar; 