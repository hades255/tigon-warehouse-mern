import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../store";
import AXIOS from "../../helpers/axios";

export const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authReducer = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      localStorage.setItem("token", action.payload.token);
      AXIOS.defaults.headers.common.Authorization = `Bearer ${action.payload.token}`;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      delete AXIOS.defaults.headers.common.Authorization;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export default authReducer.reducer;

export const login = (data) => {
  return async function () {
    try {
      dispatch(authReducer.actions.login(data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const register = (userData) => {
  return async function () {
    try {
      await AXIOS.post("/api/auth/register", userData);
    } catch (error) {
      console.log(error);
    }
  };
};

export const logout = () => () => {
  dispatch(authReducer.actions.logout());
};
