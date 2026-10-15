import { createContext, useContext, useState, useEffect } from "react";
import { setAccessToken } from "../api/axios-instance.js";

const AuthContext = createContext();

export const AuthProvider = ({ children, initialUser, initialAccessToken }) => {
  const [user, setUser] = useState(initialUser);
  const [accessToken, setAccessTokenState] = useState(initialAccessToken);

  useEffect(() => {
    setAccessToken(accessToken);
  }, [accessToken]);

  const login = (user, token) => {
    setUser(user);
    setAccessTokenState(token);
  };

  const logout = () => {
    setUser(null);
    setAccessTokenState(null);
  };

  const updateAccessToken = (token) => {
    setAccessTokenState(token);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, updateAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
