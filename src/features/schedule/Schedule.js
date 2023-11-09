import React, { useEffect, useRef, useState } from "react";
import convertScheduleToTimeZone from "./convertTimeZone";

import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

import moment from "moment-timezone";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDataFromFirebase,
  selectUserData,
  updateSchedule,
  updateTimezone,
} from "./userDataSlice";

function Schedule() {
  const [email, setEmail] = useState("loading...");

  const dispatch = useDispatch();
  const dispatchRef = useRef(dispatch);
  const userData = useSelector(selectUserData);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const timings = userData.schedule[days[0]].map((slot) => slot.timeSlot);

  const editSchedule = (day, time, update) => {
    dispatch(updateSchedule({ userData, day, time, update }));
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
    let convertedSchedule = convertScheduleToTimeZone(
      userData.schedule,
      userData.timezone,
      to
    );
    dispatch(
      updateTimezone({
        name: "user",
        primaryTimezone: "IST",
        timezone: to,
        schedule: convertedSchedule,
      })
    );
  };

  useEffect(() => {
    if (auth.currentUser) {
      setEmail(auth.currentUser.email);
      dispatchRef.current(fetchUserDataFromFirebase());
    }
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
        dispatchRef.current(fetchUserDataFromFirebase());
      }
    });
  }, [dispatchRef]);

  return (
    <div>
      <ToastContainer />
      <h3>Last Updated: {moment().format("MMMM Do YYYY, h:mm:ss a")}</h3>
      <h2 className="text-2xl font-bold mb-4">Weekly Schedule</h2>

      <h2 className="text-bold">Current Time Zone : {userData.timezone} </h2>

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
        Copy schedule link to share
      </button>
      <div className="timezones bg-gray-400">
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
          GMT - Europe/London
        </button>
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
                      userData.schedule[day].find(
                        (slot) => slot.timeSlot === time
                      ).label === "free"
                        ? "bg-green-300"
                        : "bg-red-300"
                    }`}
                  >
                    <div className="d-flex flex justify-between">
                      <span>
                        {
                          userData.schedule[day].find(
                            (slot) => slot.timeSlot === time
                          ).label
                        }
                      </span>
                      <span>
                        {userData.schedule[day].find(
                          (slot) => slot.timeSlot === time
                        ).label === "free" ? (
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
