import { createContext, useEffect, useMemo, useState } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("startupgig_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("startupgig_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("startupgig_token", token);
    } else {
      localStorage.removeItem("startupgig_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("startupgig_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("startupgig_user");
    }
  }, [user]);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await authAPI.register(payload);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
