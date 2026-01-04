import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css';
import { AuthProvider } from "./context/AuthContext";
import { ErrorsProvider } from "./context/ErrorsContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ErrorsProvider>
          <App />
        </ErrorsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);