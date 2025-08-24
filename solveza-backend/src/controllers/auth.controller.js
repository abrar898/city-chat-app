import User from "../models/User.js";   // adjust path if needed
import jwt from "jsonwebtoken";

// generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,   // make sure you set this in .env
    { expiresIn: "7d" }
  );
};

// ================== SIGNUP ==================
export const signup = async (req, res) => {
  try {
    const { username, email, password, role, city, about, photo } = req.body;

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // create new user
    const user = new User({
      username,
      email,
      role,
      city,
      about,
      photo
    });

    // hash password
    await user.setPassword(password);

    // save user
    await user.save();

    // generate token
    const token = generateToken(user);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        city: user.city,
        about: user.about,
        photo: user.photo
      },
      token
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
};

// ================== LOGIN ==================
export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // find user by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email/username or password" });
    }

    // compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email/username or password" });
    }

    // generate token
    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        city: user.city,
        about: user.about,
        photo: user.photo
      },
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
