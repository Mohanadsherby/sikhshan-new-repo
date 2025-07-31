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
        if (isConnected && chatRoom?.id) {
            console.log('🔌 Subscribing to chat room:', chatRoom.id);
            
            const subscription = subscribe(`/topic/chat/${chatRoom.id}`, (message) => {
                console.log('📨 Received WebSocket message:', message);
                
                if (message.type === 'NEW_MESSAGE') {
                    // Check if message is not from current user (to avoid duplicates)
                    if (message.data.sender.id !== currentUser.id) {
                        console.log('➕ Adding new message from other user:', message.data);
                        setMessages(prev => {
                            // Check if message already exists to avoid duplicates
                            const exists = prev.some(msg => msg.id === message.data.id);
                            if (!exists) {
                                return [...prev, message.data];
                            }
                            console.log('⚠️ Message already exists, skipping duplicate');
                            return prev;
                        });
                        scrollToBottom();
                    } else {
                        console.log('✅ Message from current user, skipping (already added)');
                    }
                } else if (message.type === 'MESSAGE_DELETED') {
                    console.log('🗑️ Message deleted:', message.data);
                    setMessages(prev => prev.map(msg => 
                        msg.id === message.data ? { ...msg, isDeleted: true, content: 'User deleted message' } : msg
                    ));
                } else if (message.type === 'MESSAGE_READ') {
                    console.log('👁️ Message read:', message.data);
                } else {
                    console.log('❓ Unknown message type:', message.type);
                }
            });

            return () => {
                if (subscription) {
                    console.log('🔌 Unsubscribing from chat room:', chatRoom.id);
                    subscription.unsubscribe();
                }
            };
        } else {
            console.log('❌ Cannot subscribe: isConnected=', isConnected, 'chatRoom.id=', chatRoom?.id);
        }
    }, [isConnected, chatRoom?.id, currentUser.id]);

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
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        const messageContent = newMessage.trim();
        setNewMessage(''); // Clear input immediately for better UX

        try {
            setSending(true);
            
            // Send message via REST API (more reliable)
            const sentMessage = await sendMessage(chatRoom.id, messageContent, currentUser.id);
            
            // Add the new message to the list immediately
            setMessages(prev => [...prev, sentMessage]);
            scrollToBottom();
            
            // Also send via WebSocket for real-time updates to other users
            if (isConnected) {
                sendWebSocketMessage('/app/chat.sendMessage', {
                    chatRoomId: chatRoom.id,
                    content: messageContent,
                    messageType: 'TEXT'
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Restore the message if sending failed
            setNewMessage(messageContent);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full overflow-hidden min-h-0">
            {/* Header - Fixed */}
            <div className="p-3 border-b border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={onBack}
                        className="p-1 text-gray-600 hover:text-gray-800 md:hidden"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                        {otherUser.profilePictureUrl ? (
                            <img
                                src={otherUser.profilePictureUrl}
                                alt={getDisplayName(otherUser)}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                    {getDisplayName(otherUser).charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        
                        <div>
                            <h2 className="text-sm font-semibold text-gray-800">
                                {getDisplayName(otherUser)}
                            </h2>
                            <div className="flex items-center">
                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                    otherUser.isOnline ? 'bg-green-500' : 'bg-gray-400'
                                }`}></div>
                                <span className="text-xs text-gray-500">
                                    {otherUser.isOnline ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages - Scrollable */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
                {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-6">
                        <p className="text-sm">No messages yet</p>
                        <p className="text-xs">Start the conversation!</p>
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

            {/* Message Input - Fixed */}
            <div className="p-3 border-t border-gray-200 bg-white flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary hover:border-primary"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
            <div className={`max-w-xs lg:max-w-sm px-3 py-1.5 rounded-lg ${
                isOwnMessage 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-800'
            }`}>
                <div className="flex items-center space-x-1.5 mb-0.5">
                    <span className="text-xs font-medium">
                        {isOwnMessage ? 'You' : getDisplayName(message.sender)}
                    </span>
                    <span className={`text-xs ${
                        isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                        {formatMessageTime(message.createdAt)}
                    </span>
                </div>
                
                <p className={`text-xs ${
                    message.isDeleted ? 'italic opacity-75' : ''
                }`}>
                    {message.isDeleted ? 'User deleted message' : message.content}
                </p>
            </div>
        </div>
    );
};

export default ChatWindow; 