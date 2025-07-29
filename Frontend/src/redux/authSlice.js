import { createSlice } from "@reduxjs/toolkit";

// Safely parse localStorage items
let storedUser = null;
let storedToken = null;
try {
  storedUser = JSON.parse(localStorage.getItem("user"));
  storedToken =localStorage.getItem("token");
} catch (e) {
  console.error("Failed to load auth from localStorage", e);
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null,
    token: storedToken || null,
    loading: false,
  },
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", (action.payload.token));
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
