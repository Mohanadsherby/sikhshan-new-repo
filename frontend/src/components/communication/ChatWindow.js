import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { getMessages, sendMessage, markMessagesAsRead, getDisplayName, formatMessageTime } from '../../api/chatApi';

const ChatWindow = ({ chatRoom, currentUser, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const { isConnected, subscribe, sendMessage: sendWebSocketMessage } = useWebSocket();

    const otherUser = chatRoom.user1.id === currentUser.id ? chatRoom.user2 : chatRoom.user1;

    useEffect(() => {
        fetchMessages();
        markAsRead();
    }, [chatRoom.id]);

    useEffect(() => {
        // Subscribe to chat room messages
        if (isConnected) {
            const subscription = subscribe(`/topic/chat/${chatRoom.id}`, (message) => {
                if (message.type === 'NEW_MESSAGE') {
                    setMessages(prev => [...prev, message.data]);
                    scrollToBottom();
                } else if (message.type === 'MESSAGE_DELETED') {
                    setMessages(prev => prev.map(msg => 
                        msg.id === message.data ? { ...msg, isDeleted: true, content: 'User deleted message' } : msg
                    ));
                }
            });

            return () => {
                if (subscription) {
                    subscription.unsubscribe();
                }
            };
        }
    }, [isConnected, chatRoom.id]);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const data = await getMessages(chatRoom.id, currentUser.id);
            setMessages(data.reverse()); // Reverse to show newest first
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async () => {
        try {
            await markMessagesAsRead(chatRoom.id, currentUser.id);
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        try {
            setSending(true);
            
            // Send message via REST API (more reliable)
            const sentMessage = await sendMessage(chatRoom.id, newMessage.trim(), currentUser.id);
            
            // Add the new message to the list
            setMessages(prev => [...prev, sentMessage]);
            setNewMessage('');
            scrollToBottom();
            
            // Try to send via WebSocket as well (for real-time updates)
            if (isConnected) {
                sendWebSocketMessage('/app/chat.sendMessage', {
                    chatRoomId: chatRoom.id,
                    content: newMessage.trim(),
                    messageType: 'TEXT'
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
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
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={onBack}
                        className="p-1 text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    <div className="flex items-center space-x-3">
                        {otherUser.profilePictureUrl ? (
                            <img
                                src={otherUser.profilePictureUrl}
                                alt={getDisplayName(otherUser)}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                    {getDisplayName(otherUser).charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {getDisplayName(otherUser)}
                            </h2>
                            <div className="flex items-center">
                                <div className={`w-2 h-2 rounded-full mr-2 ${
                                    otherUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                                <span className="text-sm text-gray-500">
                                    {otherUser.isOnline ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                        <p>No messages yet</p>
                        <p className="text-sm">Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <MessageItem
                            key={message.id}
                            message={message}
                            isOwnMessage={message.sender.id === currentUser.id}
                            currentUser={currentUser}
                        />
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const MessageItem = ({ message, isOwnMessage, currentUser }) => {
    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isOwnMessage 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-800'
            }`}>
                <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">
                        {isOwnMessage ? 'You' : getDisplayName(message.sender)}
                    </span>
                    <span className={`text-xs ${
                        isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                        {formatMessageTime(message.createdAt)}
                    </span>
                </div>
                
                <p className={`text-sm ${
                    message.isDeleted ? 'italic opacity-75' : ''
                }`}>
                    {message.isDeleted ? 'User deleted message' : message.content}
                </p>
            </div>
        </div>
    );
};

export default ChatWindow; 