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
  const [status, setStatus] = useState("saved");

  const days = Object.keys(data.schedule);
  const timings = data.schedule[days[0]].map((slot) => slot.timeUTC);

  const saveChanges = async () => {
    setStatus("Updating schedule... please wait");
    try {
      await setDoc(doc(db, "users/" + auth.currentUser.email), {
        schedule: schedule,
      });
      setSavedChanges(true);
      setupdated(0);
      setStatus("Schedule updated ");
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
    setStatus("Not saved");
  };

  const getLatestSchedule = async () => {
    const docRef = doc(db, "users/" + auth.currentUser.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setSchedule(docSnap.data().schedule);
    } else {
      console.log("No such document!");
    }
  };

  const copyScheduleLink = async () => {
    navigator.clipboard.writeText(
      `${
        window.location.hostname
      }/weekly/#/share/${auth.currentUser.email.slice(
        0,
        auth.currentUser.email.length - 10
      )}`
    );
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getLatestSchedule();
      }
    });
  }, []);

  return (
    <div className="p-4">
      <h3>Main time {moment().format("MMMM Do YYYY, h:mm:ss a")}</h3>
      <h2 className="text-2xl font-bold mb-4">Weekly Schedule</h2>

      <button
        className={`bg-yellow-300 p-2 rounded-md hover:bg-yellow-600 ${
          savedChanges ? "animate-none" : "animate-bounce"
        } `}
        onClick={saveChanges}
      >
        Save changes
      </button>

      <span> {status}</span>

      <h3>
        Saved changes :
        {savedChanges ? (
          <span className="text-green-700 font-bold">
            Your changes are in sync with weekly
          </span>
        ) : (
          <span className="text-red-500 font-bold animate-pulse">
            Please save the changes.
          </span>
        )}
      </h3>
      <h3>Update : {updated}</h3>
      <h3> Hostname : {window.location.hostname}</h3>
      <a
        target="_blank"
        rel="noreferrer"
        href={`${
          window.location.hostname
        }/weekly/#/share/${auth.currentUser.email.slice(
          0,
          auth.currentUser.email.length - 10
        )}`}
      >
        <button className="bg-green-100 hover:bg-green-300 p-1 rounded-md mx-2">
          Check your schedule publicly
        </button>
      </a>
      <button
        onClick={copyScheduleLink}
        className="bg-yellow-100 hover:bg-yellow-300 p-1 rounded-md mx-2"
      >
        Copy schedule link to share : {window.location.hostname}
        /weekly/#/share/
        {auth.currentUser.email.slice(0, auth.currentUser.email.length - 10)}
      </button>
      <div
        style={{ height: "50vh" }}
        className="text-clip border-4 border-black overflow-auto"
      >
        <table className="table-auto w-full">
          <thead className="sticky top-0 left-0 right-0 bg-yellow-300">
            <tr>
              <th className="px-4 py-2 w-1/12"></th>
              {days.map((day) => (
                <th key={day} className="px-4 py-2">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
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
    </div>
  );
}

export default Schedule;
