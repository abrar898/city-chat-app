// api.js
import axios from "axios";

const API_URL = "http://localhost:4000";

// ---- AUTH TOKEN HANDLING ----
export const setAuthToken = (token) => {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
};

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- AUTH ----
export const signup = async (payload) => {
  const { data } = await api.post("/api/signup", payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await api.post("/api/login", payload);
  return data;
};

// ---- USERS ----
export const getUsers = async () => {
  const { data } = await api.get("/api/users");
  return data;
};

// ---- CHATS ----
// export const accessChat = async (userId) => {
//   const { data } = await api.post("/api/chats", { userId });
//   return data;
// };
// client.js
export const accessChat = async (otherUserId) => {
  const { data } = await api.post("/api/chats", { userId: otherUserId });
  return data;
};


export const createGroup = async ({ chatName, users }) => {
  const { data } = await api.post("/api/chats/group", { chatName, users });
  return data;
};

// ---- MESSAGES ----
export const getMessages = async (chatId) => {
  const { data } = await api.get(`/api/messages/${chatId}`);
  return data;
};

// export const sendMessageREST = async ({ chatId, message, messageType = "text" }) => {
//   const { data } = await api.post("/api/messages", { chatId, message, messageType });
//   return data;
// };
// export const sendMessage = async ({ chatId, message }) => {
//   const { data } = await api.post("/api/messages", { chatId, message });
//   return data;
// };
export const sendMessage = async ({ chatId, message, sender }) => {
  const { data } = await api.post("/api/messages", { chatId, message, sender });
  return data;
};

export const BASE_URL = API_URL;
