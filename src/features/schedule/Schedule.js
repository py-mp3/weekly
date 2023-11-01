import React, { useEffect, useState } from "react";
import data from "./data.json";
import moment from "moment-timezone";
import convertScheduleToTimeZone from "./convertTimeZone";

import { db, auth } from "../../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Schedule() {
  const [updated, setupdated] = useState(0);
  const [schedule, setSchedule] = useState(data.schedule);
  const [savedChanges, setSavedChanges] = useState(true);
  const [status, setStatus] = useState("saved");
  const [email, setEmail] = useState("loading...");
  const [currentTimeZone, setCurrentTimeZone] = useState("Asia/Kolkata");

  const days = Object.keys(data.schedule);
  const timings = data.schedule[days[0]].map((slot) => slot.timeUTC);

  const saveChanges = async () => {
    setStatus("Updating schedule... please wait");
    try {
      await setDoc(doc(db, "users/" + email), {
        schedule: schedule,
      });
      setSavedChanges(true);
      setupdated(0);
      setStatus("Schedule updated ");
      toast("Changes update to weekly schedule");
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

  const copyScheduleLink = async () => {
    navigator.clipboard.writeText(
      `https://vishesh-pandey.github.io/weekly/#/share/${email.slice(
        0,
        email.length - 10
      )}`
    );
    toast("Link Copied !");
  };

  const changeTimeZone = (to) => {
    setSchedule(convertScheduleToTimeZone(schedule, currentTimeZone, to));
    setCurrentTimeZone(to);
  };

  useEffect(() => {
    const getLatestSchedule = async () => {
      const docRef = doc(db, "users/" + auth.currentUser.email);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSchedule(docSnap.data().schedule);
      } else {
        console.log("No such document!");
      }
    };
    if (auth.currentUser) {
      setEmail(auth.currentUser.email);
      getLatestSchedule();
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        getLatestSchedule();
      }
    });
  }, []);

  return (
    <div>
      <ToastContainer />
      <h3>Last Updated: {moment().format("MMMM Do YYYY, h:mm:ss a")}</h3>
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

      <div>
        Saved changes :
        {savedChanges ? (
          <span className="text-green-700 font-bold">
            Your schedule is synced with weekly
          </span>
        ) : (
          <span className="text-red-500 font-bold animate-pulse">
            Please save the changes.
          </span>
        )}
        <span> {updated} unsaved changes</span>
      </div>

      <a
        target="_blank"
        rel="noreferrer"
        href={`https://vishesh-pandey.github.io/weekly/#/share/${email.slice(
          0,
          email.length - 10
        )}`}
      >
        <button className="bg-green-100 hover:bg-green-300 p-1 rounded-md mx-2">
          Check your schedule publicly
        </button>
      </a>
      <button
        onClick={copyScheduleLink}
        className="bg-blue-100 hover:bg-blue-300 p-1 rounded-md mx-2"
      >
        Copy schedule link to share : vishesh-pandey.github.io/weekly/#/share/
        {email.slice(0, email.length - 10)}
      </button>
      <div>
        <button
          onClick={() => {
            changeTimeZone("Asia/Kolkata");
          }}
          className="bg-gray-300 px-2 mx-2 rounded-md"
        >
          IST
        </button>
        <button
          onClick={() => {
            changeTimeZone("Europe/London");
          }}
          className="bg-gray-300 px-2 mx-2 rounded-md"
        >
          British Summer Time (BST) - Europe/London
        </button>
        <button
          onClick={() => {
            changeTimeZone("Europe/Lisbon");
          }}
          className="bg-gray-300 px-2 mx-2 rounded-md"
        >
          Western European Summer Time (WEST) - Europe/Lisbon
        </button>
        <button
          onClick={() => {
            changeTimeZone("EST");
          }}
          className="bg-gray-300 px-2 mx-2 rounded-md"
        >
          EST
        </button>
      </div>
      <div>
        <h3>Current time zone : {currentTimeZone}</h3>
      </div>
      <div
        style={{ height: "50vh" }}
        className="text-clip border-2 border-black overflow-auto rounded-md"
      >
        <table className="table-auto w-full">
          <thead className="sticky top-0 left-0 right-0 bg-yellow-300 ">
            <tr>
              <th className="px-4 py-2 w-1/12 "></th>
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
                <td className="px-4 py-2 w-1/12 sticky top-0 left-0 right-0 bg-yellow-300">
                  {time}
                </td>
                {days.map((day) => (
                  <td
                    key={`${day}-${time}`}
                    className={`border px-4 py-2 rounded-md ${
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
                        {schedule[day].find((slot) => slot.timeUTC === time)
                          .label === "free" ? (
                          <button
                            onClick={() => {
                              editSchedule(day, time, "not free");
                            }}
                            className="text-white bg-red-600 px-1 rounded-md"
                          >
                            Block
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              editSchedule(day, time, "free");
                            }}
                            className="text-white bg-green-600 px-1 rounded-md"
                          >
                            Free
                          </button>
                        )}
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
