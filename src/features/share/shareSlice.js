import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

import { doc, getFirestore, getDoc } from "firebase/firestore";
import app from "../../firebase";

import data from "../data.json";

import convertScheduleToTimeZone from "../convertTimeZone";

const db = getFirestore(app);

const initialState = {
  sharedData: data,
  incorrectProfile: false,
};

export const fetchSharedDataFromFirebase = createAsyncThunk(
  "userData/fetchSharedDataFromFirebase",
  async (email, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "users/" + email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().userData;
      } else {
        return rejectWithValue(initialState.userData);
      }
    } catch (e) {
      console.log(e);
      return rejectWithValue(initialState.userData);
    }
  }
);

export const sharedDataSlice = createSlice({
  name: "sharedData",
  initialState,
  reducers: {
    convertTimezone(state, action) {
      let convertedSchedule = convertScheduleToTimeZone(
        action.payload.schedule,
        action.payload.timezone,
        action.payload.to
      );
      let convertedSharedData = {
        ...state.sharedData,
        timezone: action.payload.to,
        schedule: convertedSchedule,
      };
      state.sharedData = convertedSharedData;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSharedDataFromFirebase.fulfilled, (state, action) => {
        state.sharedData = action.payload;
      })
      .addCase(fetchSharedDataFromFirebase.rejected, (state) => {
        state.sharedData.incorrectProfile = true;
      });
  },
});

export const { convertTimezone } = sharedDataSlice.actions;

export const selectSharedData = (state) => state.sharedUserData.sharedData;

export default sharedDataSlice.reducer;
