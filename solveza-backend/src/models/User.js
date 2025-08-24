import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  role: { 
    type: String, 
    enum: ["student", "tutor", "plumber", "editor", "web developer", "admin"], 
    default: "student" 
  },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  city: { type: String },
  about: { 
    type: String,
    enum: [
      "Available",
      "Busy",
      "Sleeping",
      "At work",
      "In class",
      "Battery about to die",
      "Can’t talk, WhatsApp only",
      "At the gym",
      "On vacation",
      "Custom" // optional if you want them to set their own too
    ],
    default: "Available"
  },
  photo: { type: String }, // store image URL or file path
  googleId: { type: String }
}, { timestamps: true });

// Hash password before saving
UserSchema.methods.setPassword = async function(password) {
  this.passwordHash = await bcrypt.hash(password, 10);
};

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model("User", UserSchema);
