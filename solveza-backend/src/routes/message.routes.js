import { Router } from "express";
import { sendMessage, sendReaction, getMessages } from "../controllers/chat.controller.js";
import { authRequired } from "../middleware/auth.js";

import express from "express";
const router = express.Router();
// Send a message
router.post("/", authRequired, sendMessage);

// Send or update a reaction
router.post("/reaction", authRequired, sendReaction);

// Get all messages in a chat
router.get("/:chatId", authRequired, getMessages);

export default router;
