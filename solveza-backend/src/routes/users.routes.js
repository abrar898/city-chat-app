// src/routes/userRoutes.js
import express from "express";
import { getAllUsers, getUserProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Routes
router.get("/",  getAllUsers); // get all users
router.get("/:id",  getUserProfile); // get single user profile

export default router;

