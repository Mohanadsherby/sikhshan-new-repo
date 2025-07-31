import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SimpleChat = () => {
    const { currentUser } = useAuth();
    const [message, setMessage] = useState('');

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        console.log('Sending message:', message);
        setMessage('');
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Simple Chat</h2>
            <div className="mb-4 p-3 bg-gray-100 rounded h-32 overflow-y-auto">
                <p className="text-sm text-gray-600">Chat messages will appear here...</p>
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border rounded"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default SimpleChat; 