import mongoose, { Schema, Types } from "mongoose";

const CommunicationSchema = new Schema(
  {
    sender: { 
      type: Types.ObjectId, 
      ref: "User", 
      required: true 
    },

    // For 1-to-1 chats only (optional for groups)
    receiver: { 
      type: Types.ObjectId, 
      ref: "User" 
    },

    // Every message belongs to a chat
    chat: { 
      type: Types.ObjectId, 
      ref: "Chat", 
      required: true 
    },

    messageType: { 
      type: String, 
      enum: ["text", "image", "video", "file"], 
      default: "text" 
    },

    message: { type: String }, // Text content OR file URL

    replyTo: { type: Types.ObjectId, ref: "Communication" }, // For threaded replies

    reactions: [
      {
        user: { type: Types.ObjectId, ref: "User" },
        type: { type: String }, // e.g., "like", "love", "😂"
      }
    ],

    deliveredTo: [{ type: Types.ObjectId, ref: "User" }],
    readBy: [{ type: Types.ObjectId, ref: "User" }],

    isVideoCall: { type: Boolean, default: false },
    isVoiceCall: { type: Boolean, default: false },

  // createdBy: {type: mongoose.Schema.Types.ObjectId,ref: "User",required: true,},

    status: { 
      type: String, 
      enum: ["sent", "delivered", "seen"], 
      default: "sent" 
    }
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export default mongoose.model("Communication", CommunicationSchema);
