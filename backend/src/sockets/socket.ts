import { Server } from 'socket.io';

export const attachSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    socket.join('public');

    socket.on('subscribe-order', (orderId: string) => {
      socket.join(`order:${orderId}`);
    });

    socket.on('disconnect', () => {
      // keep disconnect logic minimal and secure
    });
  });
};
