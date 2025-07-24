import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext"; // ✅ Make sure path is valid
import "./index.css"; // ✅ Global styles
import { ToastContainer } from "react-toastify";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" autoClose={2000} />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error("❌ No root element found in HTML!");
}
