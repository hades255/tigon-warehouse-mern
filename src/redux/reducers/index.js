// third-party
import { combineReducers } from "redux";

// project import
import authReducer from "./authReducer";
import chat from "./chat";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  auth: authReducer,
  chat,
});

export default reducers;
