// import dotenv from "dotenv";
// dotenv.config();
// import express from "express";
// import cors from "cors";
// import morgan from "morgan";
// import { createServer } from "http";
// import { Server } from "socket.io";
// // import socketHandler from "./socket.js";
// import { connectDB } from "./src/config/db.js";
// import { initSocket } from "./socket.js";
// import authRoutes from "./src/routes/auth.route.js";
// import userRoutes from "./src/routes/users.routes.js";
// import chatRoutes from "./src/routes/chat.routes.js";

// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use(morgan("dev"));

// // Routes
// app.get("/", (_, res) => res.json({ ok: true, name: "Solveza API" }));
// app.use("/api", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/chats", chatRoutes);

// // Create HTTP + Socket.IO server
// const server = createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173", // frontend URL
//     methods: ["GET", "POST"],
//   },
// });

// initSocket(io);
// // Socket.IO events
// // io.on("connection", (socket) => {
// //   console.log("✅ New client connected:", socket.id);
// //   // Join event
// //   socket.on("join", (userId) => {
// //     users.set(userId, socket.id);
// //     console.log(`${userId} joined`);
// //   });

// //   // Private message
// //   socket.on("privateMessage", async ({ senderId, receiverId, content }) => {
// //     const message = await Communication.create({
// //       senderId,
// //       receiverId,
// //       type: "private",
// //       content,
// //     });

// //     // send to receiver
// //     const receiverSocket = users.get(receiverId);
// //     if (receiverSocket) {
// //       io.to(receiverSocket).emit("newMessage", message);
// //     }

// //     // send back to sender (so UI updates immediately)
// //     io.to(users.get(senderId)).emit("newMessage", message);
// //   });

// //   // Group message
// //   socket.on("groupMessage", async ({ senderId, chatId, content }) => {
// //     const message = await Communication.create({
// //       senderId,
// //       chatId,
// //       type: "group",
// //       content,
// //     });

// //     // emit to all users in the group (simplified)
// //     io.to(chatId).emit("newGroupMessage", message);
// //   });

// //   // join group room
// //   socket.on("joinGroup", (chatId) => {
// //     socket.join(chatId);
// //     console.log(`User joined group ${chatId}`);
// //   });

// //   // Send reaction
// //   socket.on("sendReaction", ({ roomId, messageId, reaction }) => {
// //     io.to(roomId).emit("receiveReaction", {
// //       messageId,
// //       reaction,
// //       senderId: socket.id,
// //     });
// //   });

// //   socket.on("disconnect", () => {
// //     console.log("User disconnected:", socket.id);
// //     [...users.entries()].forEach(([uid, sid]) => {
// //       if (sid === socket.id) users.delete(uid);
// //     });
// //   });
// // });



//   // Disconnect


// const PORT = process.env.PORT ;
// connectDB().then(() => {
//   server.listen(PORT, () =>
//     console.log(`✓ Solveza API + Socket.IO running on :${PORT}`)
//   );
// });
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createServer } from "http";
import { connectDB } from "./src/config/db.js";
import { initSocket } from "./socket.js";

import authRoutes from "./src/routes/auth.route.js";
import userRoutes from "./src/routes/users.routes.js";
import chatRoutes from "./src/routes/chat.routes.js";
import messageRoutes from "./src/routes/message.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (_, res) => res.json({ ok: true, name: "Solveza API" }));
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

// Create HTTP server
const server = createServer(app);

// ✅ Initialize Socket.IO (pass server, not io instance)
initSocket(server);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  server.listen(PORT, () =>
    console.log(`✓ Solveza API + Socket.IO running on :${PORT}`)
  );
});
