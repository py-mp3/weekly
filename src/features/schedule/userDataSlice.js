import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc } from "firebase/firestore";
import app, { auth } from "../../firebase";
import data from "../data.json";

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
      } else {
        return initialState.userData;
      }
    } catch (e) {
      console.log(e);
      return initialState.userData;
    }
  }
);

export const updateScheduleOnDatabase = createAsyncThunk(
  "userData/updateScheduleOnDatabase",
  async (userData) => {
    try {
      let updatedUserData = {
        name: userData.name,
        lastUpdated: new Date().toUTCString(),
        primaryTimezone: userData.primaryTimezone,
        timezone: userData.timezone,
        schedule: userData.schedule,
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
  reducers: {
    updateSchedule: (state, action) => {
      let data = action.payload;
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
          lastUpdated: "updating",
          primaryTimezone: "IST",
          timezone: userData.timezone,
          schedule: updatedSchedule,
        };
        state.userData = updatedUserData;
        localStorage.setItem("userData", JSON.stringify(updatedUserData));
      } catch (e) {
        console.log(e);
        state.userData = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateScheduleOnDatabase.fulfilled, (state, action) => {
        state.userData = action.payload;
      })
      .addCase(updateScheduleOnDatabase.pending, (state) => {
        state.userData.lastUpdated = "updating";
      })
      .addCase(updateScheduleOnDatabase.rejected, (state) => {
        alert("Connection Issues!");
      });
    builder
      .addCase(fetchUserDataFromFirebase.fulfilled, (state, action) => {
        state.userData = action.payload;
      })
      .addCase(fetchUserDataFromFirebase.rejected, (state) => {
        state.userData = initialState;
      });
    builder.addCase(updateTimezone.fulfilled, (state, action) => {
      state.userData = action.payload;
    });
  },
});

export const { updateSchedule } = userDataSlice.actions;

export const selectUserData = (state) => state.userData.userData;

export default userDataSlice.reducer;
