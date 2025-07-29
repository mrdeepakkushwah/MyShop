import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from './app/store';
import ErrorBoundary from "./Components/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <Provider store={store}>
            <ToastContainer position="top-right" autoClose={2000} />
            <Suspense fallback={<div>Loading...</div>}>
              <App />
            </Suspense>
          </Provider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error("❌ No root element found in HTML!");
}
