import mongoose, { Schema, model, Types } from "mongoose";

const ChatSchema = new Schema(
  {
    // Chat type: private (1-to-1) or group
    type: { type: String, enum: ["private", "group"], required: true },

    // For group chats only
    chatName: {type: String,trim: true,},
    description: { type: String },
    isGroupChat: { type: Boolean, default: false },

    // Common fields for both private & group chats
    users: [{ type: Types.ObjectId, ref: "User", required: true }],
    admins: [{ type: Types.ObjectId, ref: "User" }], // only for group management

    // Latest message preview
    latestMessage: {type: mongoose.Schema.Types.ObjectId,ref: "Communication",},

    // Pinned messages at chat-level
    pinnedMessages: [{ type: Types.ObjectId, ref: "Communication" }],

    // Users who muted this chat
    mutedBy: [{ type: Types.ObjectId, ref: "User" }],

    // Creator of group (for private chats, it's the initiator)
    // createdBy: { type: Types.ObjectId, ref: "User", required: true },
    // Reactions to messages (optional at chat-level)
    reactions: [
      {
        messageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Communication",
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        emoji: { type: String },
      },
    ],

    // Audio/Video Call attributes
    ongoingCall: {
      isActive: { type: Boolean, default: false }, // if a call is ongoing
      type: { type: String, enum: ["audio", "video"], default: null }, // call type
      startedBy: { type: Types.ObjectId, ref: "User" }, // initiator
      participants: [{ type: Types.ObjectId, ref: "User" }], // current participants
      startedAt: { type: Date },
      endedAt: { type: Date },
    },
  },
  { timestamps: true }
);

export default model("Chat", ChatSchema);
