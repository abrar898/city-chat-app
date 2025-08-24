// import { useEffect, useRef } from "react";
// import { useAuth } from "../context/AuthContext";
// import MessageInput from "./MessageInput";
// import { useSocket } from "../context/SocketContext";

// export default function ChatWindow({ chat, messages, appendMessage }) {
//   const { user } = useAuth();
//   const { socket } = useSocket();
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendText = (text) => {
//     if (!text?.trim()) return;
//     if (chat.type === "group") {
//       socket.emit("groupMessage", { senderId: user._id, chatId: chat._id, content: text });
//     } else {
//       // one-to-one: use privateMessage with receiverId = other member
//       const other = chat.users?.find(u => u._id !== user._id) || chat.members?.find(u => u._id !== user._id);
//       socket.emit("privateMessage", { senderId: user._id, receiverId: other?._id, content: text });
//     }
//   };

//   // For files: emit as text for now (plug upload later)
//   const sendFile = (file) => {
//     const placeholder = `[file] ${file.name}`;
//     sendText(placeholder);
//   };

//   return (
//     <div className="chatwindow">
//       <div className="chathead">
//         <div className="title">{chat.chatName || "Direct Chat"}</div>
//         <div className="subtitle">{chat.type?.toUpperCase()}</div>
//       </div>

//       <div className="messages">
//         {messages.map((m) => {
//           const mine = m.sender === user._id || m.sender?._id === user._id || m.createdBy === user._id;
//           return (
//             <div key={m._id || m.createdAt + Math.random()} className={`bubble ${mine ? "me" : ""}`}>
//               <div className="content">{m.message || m.content}</div>
//               <div className="ts">{new Date(m.createdAt || Date.now()).toLocaleTimeString()}</div>
//             </div>
//           );
//         })}
//         <div ref={bottomRef} />
//       </div>

//       <MessageInput onSend={sendText} onFile={sendFile} />
//     </div>
//   );
// }
// import { useEffect, useRef } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useSocket } from "../context/SocketContext";
// import MessageInput from "./MessageInput";
// import { sendMessage as sendMessageAPI } from "../api/client"; // add this API function

// export default function ChatWindow({ chat, messages, appendMessage }) {
//   const { user } = useAuth();
//   const { socket } = useSocket();
//   const bottomRef = useRef(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendText = async (text) => {
//     if (!text?.trim()) return;

//     try {
//       // 1️⃣ send message to backend
//       const msg = await sendMessageAPI({
//         chatId: chat._id,
//         message: text,
//       });

//       // 2️⃣ append to local state
//       appendMessage(msg);

//       // 3️⃣ emit via socket
//       if (chat.type === "group") {
//         socket.emit("groupMessage", msg);
//       } else {
//         const other = chat.users?.find(u => u._id !== user._id);
//         socket.emit("privateMessage", { ...msg, receiverId: other?._id });
//       }
//     } catch (err) {
//       console.error("Send message error:", err);
//     }
//   };

//   const sendFile = (file) => {
//     const placeholder = `[file] ${file.name}`;
//     sendText(placeholder);
//   };

//   return (
//     <div className="chatwindow">
//       <div className="chathead">
//         <div className="title">{chat.chatName || "Direct Chat"}</div>
//         <div className="subtitle">{chat.type?.toUpperCase()}</div>
//       </div>

//       <div className="messages">
//         {messages.map((m) => {
//           const mine = m.sender === user._id || m.sender?._id === user._id;
//           return (
//             <div key={m._id || m.createdAt + Math.random()} className={`bubble ${mine ? "me" : ""}`}>
//               <div className="content">{m.message || m.content}</div>
//               <div className="ts">{new Date(m.createdAt || Date.now()).toLocaleTimeString()}</div>
//             </div>
//           );
//         })}
//         <div ref={bottomRef} />
//       </div>

//       <MessageInput onSend={sendText} onFile={sendFile} />
//     </div>
//   );
// }


// import { useEffect, useRef } from "react";
// import MessageInput from "./MessageInput";
// import "../styles.css";
// export default function ChatWindow({ chat, messages, appendMessage, onSendMessage }) {
//   const bottomRef = useRef(null);

//   // Scroll to bottom whenever messages change
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Send text message
//   const sendText = (text) => {
//     if (!text?.trim()) return;
//     onSendMessage(text);
//   };

//   // Handle file selection
//   const sendFile = (file) => {
//     const placeholder = `[file] ${file.name}`;
//     sendText(placeholder);
//   };

//   return (
//     <div className="chatwindow">
//       <div className="chathead">
//         <div className="title">{chat.chatName || "Direct Chat"}</div>
//         <div className="subtitle">{chat.type?.toUpperCase()}</div>
//       </div>

//       <div className="messages">
//         {messages.map((m) => {
//           const mine =
//             m.sender === chat._id || m.sender?._id === chat._id || m.createdBy === chat._id;

//           return (
//             <div key={m._id || m.createdAt + Math.random()} className={`bubble ${mine ? "me" : ""}`}>
//               <div className="content">{m.message || m.content}</div>
//               <div className="ts">{new Date(m.createdAt || Date.now()).toLocaleTimeString()}</div>
//             </div>
//           );
//         })}
//         <div ref={bottomRef} />
//       </div>

//       <MessageInput onSend={sendText} onFile={sendFile} />
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MessageInput from "./MessageInput";

export default function ChatWindow({ selectedChat, user }) {
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages when chat changes
  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${selectedChat._id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setMessages(data);
      } catch (err) {
        console.error("Error fetching messages", err);
      }
    };

    fetchMessages();
  }, [selectedChat, user]);

  // Send new message (API + local state update)
  const sendText = async (text) => {
    if (!text?.trim()) return;

    try {
      const { data } = await axios.post(
        `/api/messages`,
        { content: text, chatId: selectedChat._id },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setMessages((prev) => [...prev, data]); // append new message
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  // Handle file selection (placeholder for now)
  const sendFile = (file) => {
    const placeholder = `[file] ${file.name}`;
    sendText(placeholder);
  };

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={msg._id || idx}
            className={`p-2 rounded-lg max-w-xs ${
              msg.sender?._id === user._id
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start mr-auto"
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Message input */}
      {selectedChat && <MessageInput onSend={sendText} onFile={sendFile} />}
    </div>
  );
}
