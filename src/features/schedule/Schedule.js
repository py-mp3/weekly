import React, { useState } from "react";
import data from "./data.json";
import moment from "moment-timezone";

import { db, auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { updateEmail } from "firebase/auth";

function Schedule() {
  const [updated, setupdated] = useState(0);
  const [schedule, setSchedule] = useState(data.schedule);
  const days = Object.keys(data.schedule);
  const timings = data.schedule[days[0]].map((slot) => slot.timeUTC);

  const saveChanges = async () => {
    // Add a new document in collection "cities"
    await setDoc(doc(db, "users/" + auth.currentUser.email), {
      schedule: schedule,
    });
  };

  const editSchedule = (day, time, update) => {
    let updatedSchedule = schedule;
    updatedSchedule[day].find((slot) => slot.timeUTC === time).label = update;
    setSchedule(updatedSchedule);
    setupdated((updated) => updated + 1);
  };

  return (
    <div className="p-4">
      <h1>Main time {moment().format("MMMM Do YYYY, h:mm:ss a")}</h1>
      <h1>JS : {new Date().toString()}</h1>
      <h2 className="text-2xl font-bold mb-4">Weekly Schedule</h2>
      <button onClick={saveChanges}>Save changes</button>
      <h3>Update : {updated}</h3>
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
                    data.schedule[day].find((slot) => slot.timeUTC === time)
                      .label === "free"
                      ? "bg-green-300"
                      : "bg-red-300"
                  }`}
                >
                  <div className="d-flex flex justify-between">
                    <span>
                      {
                        data.schedule[day].find((slot) => slot.timeUTC === time)
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
