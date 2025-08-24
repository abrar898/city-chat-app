import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { BASE_URL } from "../api/client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const s = io(BASE_URL, {
      transports: ["websocket"],
      withCredentials: false,
    });

    s.on("connect", () => {
      s.emit("join", user._id); // map userId -> socket
    });

    setSocket(s);
    return () => s.disconnect();
  }, [user?._id]);

  const value = useMemo(() => ({ socket }), [socket]);
  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
