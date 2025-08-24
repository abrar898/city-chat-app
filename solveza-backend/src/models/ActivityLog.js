import mongoose from "mongoose";
const ActivityLogSchema = new mongoose.Schema({
  activityId: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  action: String,
  timestamp: { type: Date, default: Date.now }
},{ timestamps:true });
export default mongoose.model("ActivityLog", ActivityLogSchema);
