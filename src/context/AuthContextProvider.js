import React, { createContext, useCallback, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import io from "socket.io-client";

import { dispatch } from "../redux/store";
import {
  login as loginAction,
  logout as logoutAction,
} from "../redux/reducers/authReducer";
import AXIOS from "../helpers/axios";

const socket = io("http://localhost:3000");
socket.emit("message", { type: "start" });

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const login = useCallback(({ email, password }) => {
    (async () => {
      try {
        const response = await AXIOS.post("/api/auth/login", {
          email,
          password,
        });
        dispatch(loginAction(response.data));
        socket.emit("message", { type: "login", user: response.data.user });
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const logout = useCallback(() => {
    dispatch(logoutAction());
    socket.emit("message", { type: "logout" });
  }, []);

  const verifyToken = (token) => {
    if (!token) {
      return false;
    }
    const decoded = jwtDecode(token);
    if (decoded.iat + 3600 * 24 > new Date().getTime() / 1000) return decoded;
    return false;
  };

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const user = verifyToken(token);
        if (token && user) {
          AXIOS.defaults.headers.common.Authorization = `Bearer ${token}`;
          const response = await AXIOS.get("/api/auth/me");
          if (response.data.user) {
            dispatch(loginAction({ user: response.data.user, token }));
            socket.emit("message", { type: "login", user: response.data.user });
          } else dispatch(logoutAction());
        } else {
          dispatch(logoutAction());
        }
        setTimeout(() => {
          setLoading(false);
        }, 100);
      } catch (err) {
        dispatch(logoutAction());
        setTimeout(() => {
          setLoading(false);
        }, 100);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ loading, login, logout, socket }}>
      {children}
    </AuthContext.Provider>
  );
};