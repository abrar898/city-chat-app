// import { useEffect, useMemo, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useSocket } from "../context/SocketContext";
// import { accessChat, createGroup, getMessages, getUsers } from "../api/client";
// import UserList from "../components/UserList";
// import ChatWindow from "../components/ChatWindow";
// import ThreeDotMenu from "../components/ThreeDotMenu";
// import CreateGroupModal from "../components/CreateGroupModal";
// import "../styles.css";

// export default function Chat() {
//   const { user } = useAuth();
//   const { socket } = useSocket();

//   const [users, setUsers] = useState([]);
//   const [activeChat, setActiveChat] = useState(null); // { _id, type, members, chatName }
//   const [messages, setMessages] = useState([]);
//   const [showGroupModal, setShowGroupModal] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const list = await getUsers();
//       setUsers(list.filter(u => u._id !== user._id));
//     })();
//   }, [user._id]);

//   // Socket listeners
//   useEffect(() => {
//     if (!socket) return;

//     const onNew = (msg) => {
//       // Only append if it belongs to current chat
//       if (activeChat && (msg.chat === activeChat._id || msg.chat?._id === activeChat._id)) {
//         setMessages(prev => [...prev, msg]);
//       }
//     };

//     socket.on("newMessage", onNew);
//     socket.on("newGroupMessage", onNew);

//     return () => {
//       socket.off("newMessage", onNew);
//       socket.off("newGroupMessage", onNew);
//     };
//   }, [socket, activeChat]);

// //  const openPrivateChat = async (userId) => {
// //   try {
// //     // ✅ get chat from backend
// //     const { data: chat } = await accessChat(userId);

// //     // ✅ set as active chat
// //     setActiveChat(chat);

// //     // ✅ join a socket room for this chat
// //     socket?.emit("joinGroup", chat._id);

// //     // ✅ fetch chat history
// //     const { data: history } = await getMessages(chat._id);
// //     setMessages(history);
// //   } catch (error) {
// //     console.error("Error opening private chat:", error);
// //   }
// // };
//   // Open private chat with another user
//   const openPrivateChat = async (otherUserId) => {
//     try {
//       // Get or create chat from backend
//       const chat = await accessChat(otherUserId);

//       setActiveChat(chat);

//       // Join socket room for chat
//       socket?.emit("joinGroup", chat._id);

//       // Fetch chat history
//       const history = await getMessages(chat._id);
//       setMessages(history);
//     } catch (err) {
//       console.error("Error opening private chat:", err);
//     }
//   };
//   const startGroup = async (chatName, selectedUserIds) => {
//     const chat = await createGroup({ chatName, users: selectedUserIds });
//     setShowGroupModal(false);
//     setActiveChat(chat);
//     socket?.emit("joinGroup", chat._id);
//     setMessages([]);
//   };

//   const onSelectChat = async (chat) => {
//     setActiveChat(chat);
//     socket?.emit("joinGroup", chat._id);
//     const history = await getMessages(chat._id);
//     setMessages(history);
//   };

//   return (
//     <div className="chat-layout">
//       <aside className="sidebar">
//         <div className="sidebar-head">
//           <h3>Chats</h3>
//           <ThreeDotMenu onCreateGroup={() => setShowGroupModal(true)} />
//         </div>

//         <UserList
//           users={users}
//           onUserClick={openPrivateChat}
//           activeChat={activeChat}
//         />
//       </aside>

//       <main className="mainpane">
//         {activeChat ? (
//           <ChatWindow
//             chat={activeChat}
//             messages={messages}
//             appendMessage={(m)=>setMessages(prev=>[...prev, m])}
//           />
//         ) : (
//           <div className="empty">Select a user to start chatting</div>
//         )}
//       </main>

//       {showGroupModal && (
//         <CreateGroupModal
//           users={users}
//           onClose={()=>setShowGroupModal(false)}
//           onCreate={startGroup}
//         />
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { accessChat, createGroup, getMessages, getUsers, sendMessage } from "../api/client";
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";
import ThreeDotMenu from "../components/ThreeDotMenu";
import CreateGroupModal from "../components/CreateGroupModal";
import "../styles.css";

export default function Chat() {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [users, setUsers] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);

  // Load users
  useEffect(() => {
    (async () => {
      const list = await getUsers();
      setUsers(list.filter(u => u._id !== user._id));
    })();
  }, [user._id]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg) => {
      if (activeChat && (msg.chat === activeChat._id || msg.chat?._id === activeChat._id)) {
        setMessages(prev => [...prev, msg]);
      }
    };

    socket.on("newMessage", onNewMessage);
    socket.on("newGroupMessage", onNewMessage);

    return () => {
      socket.off("newMessage", onNewMessage);
      socket.off("newGroupMessage", onNewMessage);
    };
  }, [socket, activeChat]);

  // Open or create private chat
  const openPrivateChat = async (otherUserId) => {
    try {
      const chat = await accessChat(otherUserId);
      setActiveChat(chat);
      console.log(chat)

      socket?.emit("joinGroup", chat._id);

      const history = await getMessages(chat._id);
      setMessages(history);
      console.log(history);
    } catch (err) {
      console.error("Error opening private chat:", err);
    }
  };

  // Start a group chat
  const startGroup = async (chatName, selectedUserIds) => {
    const chat = await createGroup({ chatName, users: selectedUserIds });
    setShowGroupModal(false);
    setActiveChat(chat);
    socket?.emit("joinGroup", chat._id);
    setMessages([]);
  };

  // Select existing chat
  const onSelectChat = async (chat) => {
    setActiveChat(chat);
    socket?.emit("joinGroup", chat._id);
    const history = await getMessages(chat._id);
    setMessages(history);
  };

  // Send message from input
//   const handleSendMessage = async (text) => {
//     if (!activeChat || !text?.trim()) return;

//     try {
//       const msg = await sendMessage({ chatId: activeChat._id, message: text });
//       setMessages(prev => [...prev, msg]);

//       // Emit via socket
//       if (activeChat.type === "group") {
//         socket.emit("groupMessage", msg);
//       } else {
//         const other = activeChat.users?.find(u => u._id !== user._id);
//         socket.emit("privateMessage", { ...msg, receiverId: other?._id });
//       }
//     } catch (err) {
//       console.error("Error sending message:", err);
//     }
//   };
const handleSendMessage = async (text) => {
  if (!activeChat || !text?.trim()) return;

  try {
    const msg = await sendMessage({ 
      chatId: activeChat._id, 
      message: text,
      sender: user._id // pass sender
    });

    setMessages(prev => [...prev, msg]);

    if (activeChat.type === "group") {
      socket.emit("groupMessage", msg);
    } else {
      const other = activeChat.users?.find(u => u._id !== user._id);
      socket.emit("privateMessage", { ...msg, receiverId: other?._id });
    }
  } catch (err) {
    console.error("Error sending message:", err);
  }
};

  return (
    <div className="chat-layout">
      <aside className="sidebar">
        <div className="sidebar-head">
          <h3>Chats</h3>
          <ThreeDotMenu onCreateGroup={() => setShowGroupModal(true)} />
        </div>

        <UserList
          users={users}
          onUserClick={openPrivateChat}
          activeChat={activeChat}
        />
      </aside>

      <main className="mainpane">
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            messages={messages}
            appendMessage={(m) => setMessages(prev => [...prev, m])}
            onSendMessage={handleSendMessage} // updated
          />
        ) : (
          <div className="empty">Select a user to start chatting</div>
        )}
      </main>

      {showGroupModal && (
        <CreateGroupModal
          users={users}
          onClose={() => setShowGroupModal(false)}
          onCreate={startGroup}
        />
      )}
    </div>
  );
}
