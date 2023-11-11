import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "../features/schedule/userDataSlice";
import sharedUserDataReducer from "../features/share/shareSlice";

export const store = configureStore({
  reducer: {
    userData: userDataReducer,
    sharedUserData: sharedUserDataReducer,
  },
});
