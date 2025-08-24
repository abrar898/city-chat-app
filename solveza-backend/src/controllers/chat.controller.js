// import Chat from "../models/ChatSchema.js";
// import Communication from "../models/CommunicationSchema.js";
// import User from "../models/User.js";

// // ✅ Create or get one-to-one chat
// export const accessChat = async (req, res) => {
//   try {
//     const { userId } = req.body; // receiver userId

//     if (!userId) return res.status(400).json({ message: "UserId is required" });

//     // Check if chat already exists
//     let chat = await Chat.findOne({
//       isGroupChat: false,
//       users: { $all: [req.user._id, userId] }
//     })
//       .populate("users", "-passwordHash")
//       .populate("latestMessage");

//     if (chat) {
//       return res.status(200).json(chat);
//     }

//     // Create new 1-to-1 chat
//     chat = new Chat({
//       chatName: "Direct Chat",
//       isGroupChat: false,
//       users: [req.user._id, userId]
//     });

//     await chat.save();
//     const fullChat = await Chat.findById(chat._id).populate("users", "-passwordHash");

//     res.status(201).json(fullChat);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

// // ✅ Create group chat
// export const createGroupChat = async (req, res) => {
//   try {
//     const { chatName, users } = req.body; // users is array of userIds

//     if (!chatName || !users || users.length < 2) {
//       return res.status(400).json({ message: "At least 2 users required for a group" });
//     }

//     const groupChat = new Chat({
//       chatName,
//       isGroupChat: true,
//       users: [...users, req.user._id],
//       groupAdmin: [req.user._id]
//     });

//     await groupChat.save();
//     const fullGroupChat = await Chat.findById(groupChat._id).populate("users", "-passwordHash");

//     res.status(201).json(fullGroupChat);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

// // ✅ Send message (works for both 1-to-1 & group)
// export const sendMessage = async (req, res) => {
//   try {
//     const { chatId, message, isVideoCall, isVoiceCall } = req.body;

//     if (!chatId || (!message && !isVideoCall && !isVoiceCall)) {
//       return res.status(400).json({ message: "Message content or call info required" });
//     }

//     let newMessage = new Communication({
//       sender: req.user._id,
//       chat: chatId,
//       message,
//       isVideoCall: !!isVideoCall,
//       isVoiceCall: !!isVoiceCall
//     });

//     await newMessage.save();

//     newMessage = await newMessage.populate("sender", "username email photo");
//     newMessage = await newMessage.populate("chat");

//     // Update latest message in chat
//     await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

//     res.status(201).json(newMessage);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

// // ✅ Get all messages in a chat
// export const getMessages = async (req, res) => {
//   try {
//     const { chatId } = req.params;

//     const messages = await Communication.find({ chat: chatId })
//       .populate("sender", "username email photo")
//       .populate("chat")
//       .populate("readBy", "username");

//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

// // ✅ Mark message as read
// export const markAsRead = async (req, res) => {
//   try {
//     const { messageId } = req.params;

//     const message = await Communication.findByIdAndUpdate(
//       messageId,
//       { $addToSet: { readBy: req.user._id } }, // add only once
//       { new: true }
//     ).populate("readBy", "username");

//     if (!message) return res.status(404).json({ message: "Message not found" });

//     res.status(200).json(message);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };


// import Chat from "../models/ChatSchema.js";
// import Communication from "../models/CommunicationSchema.js";
// import User from "../models/User.js";

// export const accessChat = async (req, res) => {
//   const { userId } = req.body; // the other user's ID

//   if (!userId) {
//     return res.status(400).json({ message: "UserId param not sent with request" });
//   }

//   try {
//     // Ensure current user ID comes from auth middleware
//     const currentUserId = req.user._id;

//     // Check if 1-to-1 chat already exists
//     let chat = await Chat.findOne({
//       isGroupChat: false,
//       $and: [
//         { users: { $elemMatch: { $eq: currentUserId } } },
//         { users: { $elemMatch: { $eq: userId } } },
//       ],
//     })
//       .populate({ path: "users", select: "-password", strictPopulate: false })
//       .populate("latestMessage");

//     if (chat) {
//       return res.status(200).json(chat);
//     }

//     // Create new 1-to-1 chat
//     const newChat = await Chat.create({
//       chatName: "sender",
//       isGroupChat: false,
//       users: [currentUserId, userId],
//     });

//     const fullChat = await Chat.findById(newChat._id).populate("users", "-password");

//     return res.status(200).json(fullChat);
//   } catch (error) {
//     console.error("Error accessing chat:", error);
//     return res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // Fetch chats for logged in user
// export const fetchChats = async (req, res) => {
//   try {
//     const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
//       .populate("users", "-password")
//       .populate("latestMessage")
//       .sort({ updatedAt: -1 });

//     res.status(200).send(chats);
//   } catch (error) {
//     res.status(500).send({ message: "Server Error", error: error.message });
//   }
// };

// // Create Group Chat
// export const createGroupChat = async (req, res) => {
//   const { users, name } = req.body;

//   if (!users || !name) {
//     return res.status(400).send({ message: "Please fill all the fields" });
//   }

//   try {
//     const groupChat = await Chat.create({
//       chatName: name,
//       users: [...users, req.user._id],
//       isGroupChat: true,
//       groupAdmin: req.user._id,
//     });

//     const fullGroupChat = await Chat.findById(groupChat._id).populate("users", "-password").populate("groupAdmin", "-password") .populate({ path: "createdBy", select: "-password", strictPopulate: false }); 
    

//     res.status(200).send(fullGroupChat);
//   } catch (error) {
//     res.status(500).send({ message: "Server Error", error: error.message });
//   }
// };

// // ✅ Send message (works for both 1-to-1 & group)
// export const sendMessage = async (req, res) => {
//   try {
//     const { chatId, message, isVideoCall, isVoiceCall } = req.body;

//     if (!chatId || (!message && !isVideoCall && !isVoiceCall)) {
//       return res.status(400).json({ message: "Message content or call info required" });
//     }

//     let newMessage = new Communication({
//       sender: req.user._id,
//       chat: chatId,
//       message,
//       isVideoCall: !!isVideoCall,
//       isVoiceCall: !!isVoiceCall
//     });

//     await newMessage.save();

//     newMessage = await newMessage.populate("sender", "username email photo");
//     newMessage = await newMessage.populate("chat");

//     // Update latest message in chat
//     await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

//     res.status(201).json(newMessage);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };
// // ✅ Send or update a reaction
// export const sendReaction = async (req, res) => {
//   try {
//     const { messageId, emoji } = req.body;

//     if (!messageId || !emoji) {
//       return res.status(400).json({ message: "MessageId and emoji are required" });
//     }

//     const message = await Communication.findById(messageId);
//     if (!message) {
//       return res.status(404).json({ message: "Message not found" });
//     }

//     // Check if user already reacted
//     const existingReaction = message.reactions.find(
//       (r) => r.user.toString() === req.user._id.toString()
//     );

//     if (existingReaction) {
//       // ✅ Update existing reaction
//       existingReaction.emoji = emoji;
//     } else {
//       // ✅ Add new reaction
//       message.reactions.push({ user: req.user._id, emoji });
//     }

//     await message.save();

//     const updatedMessage = await Communication.findById(messageId)
//       .populate("sender", "username email photo")
//       .populate("chat")
//       .populate("reactions.user", "username");

//     res.status(200).json(updatedMessage);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

// // ✅ Get all messages in a chat
// export const getMessages = async (req, res) => {
//   try {
//     const { chatId } = req.params;

//     const messages = await Communication.find({ chat: chatId })
//       .populate("sender", "username email photo")
//       .populate("chat")
//       .populate("readBy", "username");

//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json({ message: "Server Error", error: err.message });
//   }
// };

import Chat from "../models/ChatSchema.js";
import Communication from "../models/CommunicationSchema.js";
import User from "../models/User.js";

// 1-to-1 Chat
// export const accessChat = async (req, res) => {
//   const { userId } = req.body; // the other user's ID

//   if (!userId) {
//     return res.status(400).json({ message: "UserId param not sent with request" });
//   }

//   try {
//     const currentUserId = req.user._id;

//     // Check if 1-to-1 chat already exists
//     let chat = await Chat.findOne({
//       isGroupChat: false,
//       $and: [
//         { users: { $elemMatch: { $eq: currentUserId } } },
//         { users: { $elemMatch: { $eq: userId } } },
//       ],
//     })
//       .populate({ path: "users", select: "-password", strictPopulate: false })
//       .populate({ path: "latestMessage", strictPopulate: false });

//     if (chat) return res.status(200).json(chat);

//     // Create new 1-to-1 chat
//     const newChat = await Chat.create({
//       chatName: "sender",
//       isGroupChat: false,
//       users: [currentUserId, userId],
//       createdBy: currentUserId,
//     });

//     const fullChat = await Chat.findById(newChat._id)
//       .populate({ path: "users", select: "-password", strictPopulate: false });

//     return res.status(200).json(fullChat);
//   } catch (error) {
//     console.error("Error accessing chat:", error);
//     return res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// Access or create 1-to-1 private chat
export const accessChat = async (req, res) => {
  try {
    // ✅ Make sure req.user is valid (from auth middleware)
    const currentUserId = req.user._id;

    const { userId } = req.body; // the other user's ID
    if (!userId) {
      return res.status(400).json({ message: "UserId param not sent with request" });
    }

    // Check if 1-to-1 chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: currentUserId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate({ path: "users", select: "-password", strictPopulate: false })
      .populate({ path: "latestMessage", strictPopulate: false });

    if (chat) {
      return res.status(200).json(chat);
    }

    // ✅ Create new 1-to-1 chat with required fields
    const newChat = await Chat.create({
      type: "private",             // required by schema
      chatName: "sender",          // placeholder name for private chat
      users: [currentUserId, userId],
      createdBy: currentUserId,    // required field
      isGroupChat: false,
    });

    const fullChat = await Chat.findById(newChat._id)
      .populate({ path: "users", select: "-password", strictPopulate: false })
      .populate({ path: "latestMessage", strictPopulate: false });

    return res.status(200).json(fullChat);
  } catch (error) {
    console.error("Error accessing chat:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Fetch chats for logged in user
export const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate({ path: "users", select: "-password", strictPopulate: false })
      .populate({ path: "latestMessage", strictPopulate: false })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Create Group Chat
export const createGroupChat = async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: [...users, req.user._id],
      isGroupChat: true,
      admins: [req.user._id],
      createdBy: req.user._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate({ path: "users", select: "-password", strictPopulate: false })
      .populate({ path: "admins", select: "-password", strictPopulate: false })
      .populate({ path: "createdBy", select: "-password", strictPopulate: false });

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.error("Error creating group chat:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Send message (1-to-1 or group)
export const sendMessage = async (req, res) => {
  try {
    const { chatId, message, isVideoCall, isVoiceCall } = req.body;

    if (!chatId || (!message && !isVideoCall && !isVoiceCall)) {
      return res.status(400).json({ message: "Message content or call info required" });
    }

    let newMessage = new Communication({
      sender: req.user._id,
      chat: chatId,
      message,
      isVideoCall: !!isVideoCall,
      isVoiceCall: !!isVoiceCall,
      createdBy: req.user._id,
    });

    await newMessage.save();

    newMessage = await newMessage
      .populate({ path: "sender", select: "username email photo", strictPopulate: false })
      .populate({ path: "chat", strictPopulate: false });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Send or update a reaction
export const sendReaction = async (req, res) => {
  try {
    const { messageId, emoji } = req.body;

    if (!messageId || !emoji) {
      return res.status(400).json({ message: "MessageId and emoji are required" });
    }

    const message = await Communication.findById(messageId);
    if (!message) return res.status(404).json({ message: "Message not found" });

    const existingReaction = message.reactions.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (existingReaction) existingReaction.emoji = emoji;
    else message.reactions.push({ user: req.user._id, emoji });

    await message.save();

    const updatedMessage = await Communication.findById(messageId)
      .populate({ path: "sender", select: "username email photo", strictPopulate: false })
      .populate({ path: "chat", strictPopulate: false })
      .populate({ path: "reactions.user", select: "username", strictPopulate: false });

    res.status(200).json(updatedMessage);
  } catch (err) {
    console.error("Error sending reaction:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// Get all messages in a chat
export const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Communication.find({ chat: chatId })
      .populate({ path: "sender", select: "username email photo", strictPopulate: false })
      .populate({ path: "chat", strictPopulate: false })
      .populate({ path: "readBy", select: "username", strictPopulate: false });

    res.status(200).json(messages);
  } catch (err) {
    console.error("Error getting messages:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
