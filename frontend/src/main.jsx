import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { store } from "./app/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

/*
  main.jsx is the entry point of the React app.

  It connects:
  1. React app
  2. Redux store
  3. React Router
  4. Bootstrap CSS
*/

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);