import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketMessage {
  type: string;
  data: any;
}

interface SocketContextData {
  isConnected: boolean;
  friends: any[];
  send: (type: string, data: any) => void;
  lastMessage: SocketMessage | null;
  balance: number;
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextData>({
  isConnected: false,
  friends: [],
  send: () => {},
  lastMessage: null,
  balance: 1000,
  socket: null
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
  userId?: string;
  token?: string;
}

export const SocketProvider = ({ children, userId, token }: SocketProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [friends, setFriends] = useState<any[]>([]);
  const [lastMessage, setLastMessage] = useState<SocketMessage | null>(null);
  const [balance, setBalance] = useState(1000);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Dynamic Socket.io URL
    const getSocketUrl = () => {
      if (window.location.host.includes('localhost')) {
        return 'http://localhost:3001';
      }
      // Use same host for production (Socket.io handles the path)
      return window.location.origin;
    };

    const socketUrl = getSocketUrl();
    console.log('🔌 Connecting to VPC Socket.io:', socketUrl);
    
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'], // Fallback to polling if WebSocket fails
      auth: { userId, token },
      query: { userId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });
    
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('🚀 Connected to VPC Server via', socket.io.engine.transport.name);
    });

    socket.on('connect_error', (err) => {
      console.log('⚠️ Connection error, will retry with polling:', err.message);
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('🔌 Disconnected from VPC Server:', reason);
    });

    socket.on('game:result', (data) => {
      setLastMessage({ type: 'game:result', data });
      if (data.newBalance !== undefined) {
        setBalance(data.newBalance);
      }
    });

    socket.on('balance:update', (data) => {
      setLastMessage({ type: 'balance:update', data });
      if (data.balance !== undefined) {
        setBalance(data.balance);
      }
    });

    socket.on('friends:update', (data) => {
      setFriends(data);
      setLastMessage({ type: 'friends:update', data });
    });

    socket.on('error', (data) => {
      console.error('Socket Error:', data);
      setLastMessage({ type: 'error', data });
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, token]);

  const send = useCallback((type: string, data: any) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(type, data);
    } else {
      console.warn('Socket not connected, message queued:', type);
    }
  }, []);

  return (
    <SocketContext.Provider value={{ isConnected, friends, send, lastMessage, balance, socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
