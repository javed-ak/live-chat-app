import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Store messages in memory with cleanup
const messages = [];
const MESSAGE_LIFETIME = 5 * 60 * 1000; // 5 minutes in milliseconds

// Clean up expired messages periodically
setInterval(() => {
  const now = Date.now();
  const initialLength = messages.length;
  
  // Remove expired messages
  for (let i = messages.length - 1; i >= 0; i--) {
    if (now - messages[i].timestamp > MESSAGE_LIFETIME) {
      const expiredMessage = messages.splice(i, 1)[0];
      // Broadcast message deletion to all clients
      io.emit('messageExpired', expiredMessage.id);
    }
  }
}, 10000); // Check every 10 seconds

let userCount = 0;
const connectedUsers = new Map(); // Store user info by socket ID

// Generate a random guest ID
function generateGuestId() {
  const adjectives = ['Cool', 'Happy', 'Swift', 'Bright', 'Smart', 'Kind', 'Bold', 'Quick', 'Calm', 'Wise'];
  const nouns = ['Tiger', 'Eagle', 'Dolphin', 'Lion', 'Fox', 'Wolf', 'Bear', 'Hawk', 'Owl', 'Shark'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  return `${adjective}${noun}${number}`;
}

io.on('connection', (socket) => {
  userCount++;
  
  // Generate and store guest ID for this user
  const guestId = generateGuestId();
  connectedUsers.set(socket.id, { guestId, socketId: socket.id });
  
  console.log(`User connected. Total users: ${userCount}`);
  
  // Send existing messages to newly connected user
  socket.emit('existingMessages', messages);
  
  // Send the user their guest ID
  socket.emit('userInfo', { guestId });
  
  // Broadcast user count to all clients
  io.emit('userCount', userCount);
  
  // Handle new messages
  socket.on('newMessage', (messageText) => {
    const userInfo = connectedUsers.get(socket.id);
    
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text: messageText.trim(),
      timestamp: Date.now(),
      socketId: socket.id,
      guestId: userInfo?.guestId || 'Unknown'
    };
    
    if (message.text) {
      messages.push(message);
      
      // Broadcast message to all clients
      io.emit('messageReceived', message);
      
      // Schedule this specific message for deletion
      setTimeout(() => {
        const index = messages.findIndex(msg => msg.id === message.id);
        if (index !== -1) {
          messages.splice(index, 1);
          io.emit('messageExpired', message.id);
        }
      }, MESSAGE_LIFETIME);
    }
  });
  
  // Handle user disconnect
  socket.on('disconnect', () => {
    userCount--;
    connectedUsers.delete(socket.id);
    console.log(`User disconnected. Total users: ${userCount}`);
    io.emit('userCount', userCount);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});