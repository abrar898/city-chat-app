import mongoose from "mongoose";
const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  planType: { type:String, enum:["free","pro","team"], default:"free" },
  expiryDate: Date
},{ timestamps:true });
export default mongoose.model("Subscription", SubscriptionSchema);
