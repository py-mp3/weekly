import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import app, { auth } from "../../firebase";

import data from "./data.json";

const db = getFirestore(app);

const initialState = {
  userData: data,
  bug: false,
};

export const updateTimezone = createAsyncThunk(
  "userData/updateTimezone",
  async (updatedUserData) => {
    try {
      await setDoc(doc(db, `users/${getAuth().currentUser.email}`), {
        userData: updatedUserData,
      });

      return updatedUserData;
    } catch (e) {
      console.log(e);
      return updatedUserData;
    }
  }
);

export const fetchUserDataFromFirebase = createAsyncThunk(
  "userData/fetchUserDataFromFirebase",
  async () => {
    try {
      const docRef = doc(db, "users/" + auth.currentUser.email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data().userData;
      }
    } catch (e) {
      console.log(e);
    }
  }
);

export const updateSchedule = createAsyncThunk(
  "userData/updateSchedule",
  async (data) => {
    let userData = data.userData;
    let givenday = data.day;
    let giventime = data.time;
    let update = data.update;
    try {
      let updatedSchedule = {};

      for (const day in userData.schedule) {
        let slots = [];
        for (const slot of userData.schedule[day]) {
          if (slot.timeSlot === giventime && day === givenday) {
            slots.push({ timeSlot: slot.timeSlot, label: update });
          } else {
            slots.push({ timeSlot: slot.timeSlot, label: slot.label });
          }
        }
        updatedSchedule[day] = slots;
      }

      let updatedUserData = {
        name: "user",
        primaryTimezone: "IST",
        timezone: userData.timezone,
        schedule: updatedSchedule,
      };

      await setDoc(doc(db, `users/${getAuth().currentUser.email}`), {
        userData: updatedUserData,
      });

      return updatedUserData;
    } catch (e) {
      console.log(e);
      return userData;
    }
  }
);

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateSchedule.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
    builder.addCase(fetchUserDataFromFirebase.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
    builder.addCase(updateTimezone.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
  },
});

export const selectUserData = (state) => state.userData.userData;

export default userDataSlice.reducer;
