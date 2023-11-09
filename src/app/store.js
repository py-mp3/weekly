import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "../features/schedule/userDataSlice";

export const store = configureStore({
  reducer: {
    userData: userDataReducer,
  },
});
