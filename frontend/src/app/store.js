import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import hrReducer from "../features/hr/hrSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hr: hrReducer,
  },
});