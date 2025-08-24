import mongoose from "mongoose";
const ReviewSchema = new mongoose.Schema({
  rating: { type:Number, min:1, max:5 },
  comment: String,
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  reviewedUser: { type: mongoose.Schema.Types.ObjectId, ref:"User" }
},{ timestamps:true });
export default mongoose.model("Review", ReviewSchema);
