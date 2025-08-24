import mongoose from "mongoose";
const MediaGallerySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
  mediaType: { type:String, enum:["image","video","file"], default:"image" },
  url: String,
  caption: String
},{ timestamps:true });
export default mongoose.model("MediaGallery", MediaGallerySchema);
