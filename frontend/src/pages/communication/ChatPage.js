import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import ChatSidebar from '../../components/communication/ChatSidebar';
import UserSearch from '../../components/communication/UserSearch';
import ChatWindow from '../../components/communication/ChatWindow';
import { createChatRoom } from '../../api/chatApi';

const ChatPage = () => {
    const { currentUser } = useAuth();
    const { isConnected } = useWebSocket();
    const [selectedChatRoom, setSelectedChatRoom] = useState(null);
    const [showUserSearch, setShowUserSearch] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChatRoomSelect = (chatRoom) => {
        setSelectedChatRoom(chatRoom);
        setShowUserSearch(false);
    };

    const handleUserSelect = async (selectedUser) => {
        try {
            setLoading(true);
            
            // Create or get existing chat room
            const chatRoom = await createChatRoom(currentUser.id, selectedUser.id);
            setSelectedChatRoom(chatRoom);
            setShowUserSearch(false);
        } catch (error) {
            console.error('Error creating chat room:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToChatList = () => {
        setSelectedChatRoom(null);
        setShowUserSearch(false);
    };

    const handleBackToUserSearch = () => {
        setShowUserSearch(true);
        setSelectedChatRoom(null);
    };

    const handleNewMessage = () => {
        setShowUserSearch(true);
        setSelectedChatRoom(null);
    };

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Please log in to access chat</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full flex bg-gray-50 overflow-hidden">
            {/* Sidebar - Responsive width */}
            <div className={`${selectedChatRoom ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-72 bg-white border-r border-gray-200 flex-col overflow-hidden`}>
                {/* Header */}
                <div className="p-3 border-b border-gray-200 flex-shrink-0 bg-white">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold text-gray-800">Messages</h1>
                        <button
                            onClick={handleNewMessage}
                            className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                            title="New Message"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-hidden min-h-0">
                    {showUserSearch ? (
                        <UserSearch
                            currentUserId={currentUser.id}
                            onUserSelect={handleUserSelect}
                            onBack={handleBackToChatList}
                        />
                    ) : (
                        <ChatSidebar
                            currentUserId={currentUser.id}
                            selectedChatRoom={selectedChatRoom}
                            onChatRoomSelect={handleChatRoomSelect}
                        />
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`${selectedChatRoom ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col overflow-hidden min-h-0`}>
                {selectedChatRoom ? (
                    <ChatWindow
                        chatRoom={selectedChatRoom}
                        currentUser={currentUser}
                        onBack={handleBackToChatList}
                    />
                ) : showUserSearch ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <p>Select a user to start chatting</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                            <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-medium text-gray-900 mb-2">Welcome to Chat</h3>
                            <p className="text-sm text-gray-600 mb-3">Select a conversation or start a new one</p>
                            <button
                                onClick={handleNewMessage}
                                className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm"
                            >
                                Start New Chat
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span className="text-gray-700 text-sm">Creating chat room...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage; 