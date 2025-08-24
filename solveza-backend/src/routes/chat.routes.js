// import express from "express";
// // import { authMiddleware } from "../middleware/auth.js";
// import { 
//   accessChat, 
//   createGroupChat, 
//   sendMessage, 
//   getMessages, 
//   markAsRead 
// } from "../controllers/chat.controller.js";

// const router = express.Router();

// // Chats
// router.post("/access",  accessChat);       // 1-to-1
// router.post("/group",createGroupChat);   // group chat

// // Messages
// router.post("/",  sendMessage);     // send
// router.get("/:chatId",  getMessages); // get
// router.put("/message/:messageId/read",  markAsRead); // read

// export default router;
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Chat from "../models/ChatSchema.js";
import { accessChat, fetchChats, createGroupChat,sendReaction, sendMessage } from "../controllers/chat.controller.js";
import { authRequired } from "../middleware/auth.js";
const router = express.Router();

// Access or create 1-to-1 chat
router.post("/", protect, accessChat);

// Fetch all chats of the logged-in user
router.get("/", protect, fetchChats);

// Send message
router.post("/message", protect, sendMessage);

// ✅ Send reaction
router.post("/reaction", protect, sendReaction);
// Create group chat
router.post("/group", authRequired, createGroupChat);

export default router;
