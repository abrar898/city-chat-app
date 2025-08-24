// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "Not authorized, no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach decoded user info to req
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
