import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('⚡ Socket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });
  }
  return socket;
};

export const joinUserRoom = (userId) => {
  const s = getSocket();
  if (s && userId) {
    s.emit('join:user', userId);
  }
};

export const joinQueueRoom = (doctorId) => {
  const s = getSocket();
  if (s && doctorId) {
    s.emit('join:queue', doctorId);
  }
};

export const leaveQueueRoom = (doctorId) => {
  const s = getSocket();
  if (s && doctorId) {
    s.emit('leave:queue', doctorId);
  }
};

export default getSocket;
