import { createSlice } from "@reduxjs/toolkit";

// auth relative status
const savedUser = JSON.parse(localStorage.getItem("user")) || null;
const savedToken = localStorage.getItem("token") || null;

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!savedToken, // !! change the value to boolean
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // store user, token, isAuthenticated in Redux
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // store in browser, then will not lost after refresh  
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    // clean up the user info in Redux and localStorage
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;