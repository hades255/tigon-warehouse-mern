// third-party
import { combineReducers } from "redux";

// project import
import authReducer from "./authReducer";

// ==============================|| COMBINE REDUCERS ||============================== //

const reducers = combineReducers({
  auth: authReducer,
});

export default reducers;
