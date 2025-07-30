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
        <div className="h-screen flex bg-gray-50">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
                        <button
                            onClick={handleNewMessage}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                            title="New Message"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    
                    {/* Connection Status */}
                    <div className="flex items-center mt-2">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                            isConnected ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-xs text-gray-500">
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-hidden">
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
            <div className="flex-1 flex flex-col">
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
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Chat</h3>
                            <p className="text-gray-600 mb-4">Select a conversation or start a new one</p>
                            <button
                                onClick={handleNewMessage}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
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
                    <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="text-gray-700">Creating chat room...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage; 