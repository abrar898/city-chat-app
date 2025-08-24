import mongoose from "mongoose";
const ProductivityTaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  task: String,
  deadline: String,
  isComplete: { type:Boolean, default:false }
},{ timestamps:true });
export default mongoose.model("ProductivityTask", ProductivityTaskSchema);
