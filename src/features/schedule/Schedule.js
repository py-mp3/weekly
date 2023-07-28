import React, { useEffect, useState } from "react";
import data from "./data.json";
import moment from "moment-timezone";

import { db, auth } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Schedule() {
  const [updated, setupdated] = useState(0);
  const [schedule, setSchedule] = useState(data.schedule);
  const [savedChanges, setSavedChanges] = useState(true);
  const days = Object.keys(data.schedule);
  const timings = data.schedule[days[0]].map((slot) => slot.timeUTC);

  const saveChanges = async () => {
    // Add a new document in collection "cities"
    try {
      await setDoc(doc(db, "users/" + auth.currentUser.email), {
        schedule: schedule,
      });
      setSavedChanges(true);
    } catch {
      alert("Unable to connect!");
    }
  };

  const editSchedule = (day, time, update) => {
    let updatedSchedule = schedule;
    updatedSchedule[day].find((slot) => slot.timeUTC === time).label = update;
    setSchedule(updatedSchedule);
    setupdated((updated) => updated + 1);
    setSavedChanges(false);
  };

  const getLatestSchedule = async () => {
    const docRef = doc(db, "users/" + auth.currentUser.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setSchedule(docSnap.data().schedule);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getLatestSchedule();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getLatestSchedule();
      }
    });
  }, []);

  return (
    <div className="p-4">
      <h1>Main time {moment().format("MMMM Do YYYY, h:mm:ss a")}</h1>
      <h1>JS : {new Date().toString()}</h1>
      <h2 className="text-2xl font-bold mb-4">Weekly Schedule</h2>
      <button className="bg-yellow-300 p-2 rounded-md" onClick={saveChanges}>
        Save changes
      </button>
      <h3>Update : {updated}</h3>
      <h3>Saved changes : {savedChanges.toString()}</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 w-1/12"></th>
            {days.map((day) => (
              <th key={day} className="px-4 py-2">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timings.map((time) => (
            <tr key={time}>
              <td className="px-4 py-2 w-1/12">{time}</td>
              {days.map((day) => (
                <td
                  key={`${day}-${time}`}
                  className={`border px-4 py-2 ${
                    schedule[day].find((slot) => slot.timeUTC === time)
                      .label === "free"
                      ? "bg-green-300"
                      : "bg-red-300"
                  }`}
                >
                  <div className="d-flex flex justify-between">
                    <span>
                      {
                        schedule[day].find((slot) => slot.timeUTC === time)
                          .label
                      }
                    </span>
                    <span>
                      <button
                        onClick={() => {
                          editSchedule(day, time, "free");
                        }}
                        className="text-white bg-green-600"
                      >
                        Free
                      </button>
                      <button
                        onClick={() => {
                          editSchedule(day, time, "not free");
                        }}
                        className="text-white bg-red-600"
                      >
                        Not
                      </button>
                    </span>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Schedule;
