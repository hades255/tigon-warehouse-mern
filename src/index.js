import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

import "./index.css";
import "./assets/css/bootstrap.min.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/now-ui-kit.min.css?v=1.5.0";
import "./assets/css/scrollbar.css";
import "./assets/css/custom.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContextProvider";
import { store } from "./redux/store";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AuthContextProvider>
      <Router>
        <App />
      </Router>
    </AuthContextProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
