import mongoose from "mongoose";
const ScheduleSchema = new mongoose.Schema({
  date: Date,
  time: String,
  taskDescription: String,
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  bookSlotFor: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  status: { type:String, enum:["open","booked","completed","cancelled"], default:"open" }
},{ timestamps:true });
export default mongoose.model("Schedule", ScheduleSchema);
