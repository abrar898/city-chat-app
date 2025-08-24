import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:"User", required:true },
  message: String,
  isRead: { type:Boolean, default:false },
  timestamp: { type: Date, default: Date.now }
},{ timestamps:true });
export default mongoose.model("Notification", NotificationSchema);
