import mongoose from "mongoose";
const LocationSchema = new mongoose.Schema({
  city: String,
  street: String,
  houseNumber: String,
  googleMapLink: String
},{ timestamps:true });
export default mongoose.model("Location", LocationSchema);
