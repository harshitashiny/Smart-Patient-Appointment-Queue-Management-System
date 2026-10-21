import { Server } from 'socket.io';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join user-specific room for targeted notifications
    socket.on('join:user', (userId) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });

    // Join doctor queue room for real-time queue updates
    socket.on('join:queue', (doctorId) => {
      socket.join(`queue:${doctorId}`);
      console.log(`Socket ${socket.id} joined queue room for doctor ${doctorId}`);
    });

    // Leave doctor queue room
    socket.on('leave:queue', (doctorId) => {
      socket.leave(`queue:${doctorId}`);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};
