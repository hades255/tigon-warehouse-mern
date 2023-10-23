import { createSlice } from "@reduxjs/toolkit";
import { dispatch } from "../store";

export const initialState = {
  list: [],
};

const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    send: (state, action) => {
      state.list = [...state.list, action.payload];
    },
    receive: (state, action) => {
      state.list = [...state.list, action.payload];
    },
    setInit: (state, action) => {
      state.list = [...action.payload];
    },
  },
});

export default chat.reducer;

export const sendMessage = (data) => {
  return async function () {
    try {
      dispatch(chat.actions.send(data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const receiveMessage = (data) => {
  return async function () {
    try {
      dispatch(chat.actions.send(data));
    } catch (error) {
      console.log(error);
    }
  };
};

export const initChat = (data) => {
  return async function () {
    try {
    //   const response = await AXIOS.get("/api/chat/package/" + id);
      dispatch(chat.actions.setInit(data));
    } catch (error) {
      console.log(error);
    }
  };
};
