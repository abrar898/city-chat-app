import { Server } from "socket.io";
import Communication from "./src/models/CommunicationSchema.js";

let io;
const users = new Map();

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // frontend URL
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    socket.on("join", (userId) => {
      users.set(userId, socket.id);
      console.log(`${userId} joined with socket ${socket.id}`);
    });

    socket.on("privateMessage", async ({ senderId, receiverId, content }) => {
      const message = await Communication.create({
        senderId,
        receiverId,
        type: "private",
        content,
      });

      const receiverSocket = users.get(receiverId);
      if (receiverSocket) {
        io.to(receiverSocket).emit("newMessage", message);
      }

      const senderSocket = users.get(senderId);
      if (senderSocket) {
        io.to(senderSocket).emit("newMessage", message);
      }
    });

    socket.on("groupMessage", async ({ senderId, chatId, content }) => {
      const message = await Communication.create({
        senderId,
        chatId,
        type: "group",
        content,
      });

      io.to(chatId).emit("newGroupMessage", message);
    });

    socket.on("joinGroup", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined group ${chatId}`);
    });

    socket.on("sendReaction", ({ roomId, messageId, reaction, senderId }) => {
      io.to(roomId).emit("receiveReaction", { messageId, reaction, senderId });
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
      for (const [uid, sid] of users.entries()) {
        if (sid === socket.id) users.delete(uid);
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
