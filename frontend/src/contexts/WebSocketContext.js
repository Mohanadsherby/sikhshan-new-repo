import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const WebSocketContext = createContext();

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};

export const WebSocketProvider = ({ children, userId }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState(null);
    const stompClient = useRef(null);
    const reconnectTimeoutRef = useRef(null);

    const connect = () => {
        if (isConnecting || isConnected) return;

        setIsConnecting(true);
        setError(null);

        try {
            // Create SockJS connection
            const socket = new SockJS('http://localhost:8081/ws');
            
            // Create STOMP client
            stompClient.current = new Client({
                webSocketFactory: () => socket,
                debug: (str) => {
                    console.log('STOMP Debug:', str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            // Connection handlers
            stompClient.current.onConnect = (frame) => {
                console.log('Connected to WebSocket:', frame);
                setIsConnected(true);
                setIsConnecting(false);
                setError(null);

                // Mark user as online
                if (userId) {
                    markUserOnline();
                }

                // Subscribe to user-specific queue for errors
                if (userId) {
                    stompClient.current.subscribe(`/user/${userId}/queue/errors`, (message) => {
                        console.error('WebSocket Error:', message.body);
                        setError(JSON.parse(message.body));
                    });
                }
            };

            stompClient.current.onStompError = (frame) => {
                console.error('STOMP Error:', frame);
                setError('WebSocket connection error');
                setIsConnected(false);
                setIsConnecting(false);
            };

            stompClient.current.onWebSocketError = (error) => {
                console.error('WebSocket Error:', error);
                setError('WebSocket connection failed');
                setIsConnected(false);
                setIsConnecting(false);
            };

            stompClient.current.onWebSocketClose = () => {
                console.log('WebSocket connection closed');
                setIsConnected(false);
                setIsConnecting(false);
                
                // Mark user as offline
                if (userId) {
                    markUserOffline();
                }

                // Attempt to reconnect after delay
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (!isConnected) {
                        connect();
                    }
                }, 5000);
            };

            // Connect to WebSocket
            stompClient.current.activate();

        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            setError('Failed to create WebSocket connection');
            setIsConnecting(false);
        }
    };

    const disconnect = () => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        if (stompClient.current) {
            stompClient.current.deactivate();
            stompClient.current = null;
        }

        setIsConnected(false);
        setIsConnecting(false);
        setError(null);
    };

    const subscribe = (destination, callback) => {
        if (!stompClient.current || !isConnected) {
            console.warn('WebSocket not connected');
            return null;
        }

        try {
            const subscription = stompClient.current.subscribe(destination, (message) => {
                try {
                    const data = JSON.parse(message.body);
                    callback(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                    callback(message.body);
                }
            });

            return subscription;
        } catch (error) {
            console.error('Error subscribing to destination:', error);
            return null;
        }
    };

    const sendMessage = (destination, message) => {
        if (!stompClient.current || !isConnected) {
            console.warn('WebSocket not connected');
            return false;
        }

        try {
            stompClient.current.publish({
                destination: destination,
                body: JSON.stringify(message),
                headers: {
                    'user-id': userId?.toString() || ''
                }
            });
            return true;
        } catch (error) {
            console.error('Error sending WebSocket message:', error);
            return false;
        }
    };

    const markUserOnline = async () => {
        try {
            await fetch(`http://localhost:8081/api/chat/users/${userId}/online`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (error) {
            console.error('Error marking user online:', error);
        }
    };

    const markUserOffline = async () => {
        try {
            await fetch(`http://localhost:8081/api/chat/users/${userId}/offline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        } catch (error) {
            console.error('Error marking user offline:', error);
        }
    };

    // Connect on mount and when userId changes
    useEffect(() => {
        if (userId) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [userId]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, []);

    const value = {
        isConnected,
        isConnecting,
        error,
        connect,
        disconnect,
        subscribe,
        sendMessage,
        markUserOnline,
        markUserOffline
    };

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
}; 