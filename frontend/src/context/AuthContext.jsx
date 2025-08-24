import { createContext, useContext, useEffect, useState } from "react";
import { login as loginAPI, signup as signupAPI, setAuthToken } from "../api/client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const signin = async (emailOrUsername, password) => {
    const data = await loginAPI({ emailOrUsername, password });
    setAuthToken(data.token);
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const register = async (payload) => {
    const data = await signupAPI(payload);
    setAuthToken(data.token);
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const signout = () => {
    setAuthToken(null);
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signin, register, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
