import mongoose from "mongoose";
const PaymentSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  amount: { type:Number, required:true },
  paymentMethod: String,
  transactionId: String,
  status: { type:String, enum:["initiated","success","failed"], default:"initiated" }
},{ timestamps:true });
export default mongoose.model("Payment", PaymentSchema);
