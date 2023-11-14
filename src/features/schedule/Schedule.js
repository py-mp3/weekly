import React, { useEffect, useRef, useState } from "react";
import convertScheduleToTimeZone from "../convertTimeZone";

import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserDataFromFirebase,
  selectUserData,
  updateSchedule,
  updateScheduleOnDatabase,
  updateTimezone,
} from "./userDataSlice";

function Schedule() {
  const userData = useSelector(selectUserData);
  const [email, setEmail] = useState("loading...");
  const [updatePending, setUpdatePending] = useState(null);

  const dispatch = useDispatch();
  const dispatchRef = useRef(dispatch);

  const timezoneOfPlace = {
    "Asia/Kolkata": "IST",
    "Europe/London": "GMT",
    "America/Los_Angeles": "PST",
    "America/Denver": "MST",
    "America/Chicago": "CST",
    "America/New_York": "EST",
  };

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

  const editSchedule = async (day, time, update) => {
    if (updatePending) {
      clearTimeout(updatePending);
    }

    dispatch(updateSchedule({ userData, day, time, update }));

    setUpdatePending(
      setTimeout(() => {
        dispatch(
          updateScheduleOnDatabase(JSON.parse(localStorage.getItem("userData")))
        );
        toast("schedule updated");
      }, 2000)
    );
  };

  const freeSlotsByDay = (givenDay) => {
    let freeSlots = 0;
    Object.keys(userData.schedule).forEach((day) => {
      if (day === givenDay) {
        for (let slot of userData.schedule[day]) {
          if (slot.label === "free") {
            freeSlots++;
          }
        }
      }
    });
    return freeSlots;
  };

  const getTotalFreeSlots = () => {
    let freeSlots = 0;
    Object.keys(userData.schedule).forEach((day) => {
      for (let slot of userData.schedule[day]) {
        if (slot.label === "free") {
          freeSlots++;
        }
      }
    });
    return freeSlots;
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
      <h2 className="text-2xl font-bold mb-4">
        Weekly Schedule
        <span className="m-2">
          {userData.lastUpdated === "updating" ? (
            <i className="bi bi-arrow-clockwise"></i>
          ) : (
            <i className="bi bi-cloud-check"></i>
          )}
        </span>
      </h2>
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

      <div className="bg-gray-300 px-2 m-2 rounded-md text-center text-2xl">
        Current Time Zone : {userData.timezone}
      </div>
      <div className="timezones bg-gray-300 m-3 p-2">
        <button
          onClick={() => {
            changeTimeZone("America/Los_Angeles");
          }}
          className="bg-gray-300 px-2 mx-2 rounded-md border-4 hover:bg-black hover:text-white"
        >
          PST - America/Los_Angeles
        </button>
        <button
          onClick={() => {
            changeTimeZone("America/Denver");
          }}
          className="bg-gray-300 px-2 mx-2 rounded-md border-4 hover:bg-black hover:text-white"
        >
          MST - America/Denver
        </button>
        <button
          onClick={() => {
            changeTimeZone("America/Chicago");
          }}
          className="bg-gray-300 px-2 mx-2 rounded-md border-4 hover:bg-black hover:text-white"
        >
          CST - America/Chicago
        </button>
        <button
          onClick={() => {
            changeTimeZone("America/New_York");
          }}
          className="bg-gray-300 px-2 mx-2 rounded-md border-4 hover:bg-black hover:text-white"
        >
          EST - America/New York
        </button>

        <button
          onClick={() => {
            changeTimeZone("Europe/London");
          }}
          className="bg-gray-300 px-2 mx-2 rounded-md border-4 hover:bg-black hover:text-white"
        >
          GMT - Europe/London
        </button>
        <button
          onClick={() => {
            changeTimeZone("Asia/Kolkata");
          }}
          className="bg-gray-300 px-2 mx-2 rounded-md border-4 hover:bg-black hover:text-white"
        >
          IST - India
        </button>
      </div>

      <div
        style={{ height: "50vh" }}
        className="text-clip border-2 border-black overflow-auto rounded-md"
      >
        <table className="table-auto w-full">
          <thead className="sticky top-0 left-0 right-0 bg-yellow-300 ">
            <tr>
              <th className="px-4 py-2 w-1/12 sticky top-0 left-0 right-0 bg-yellow-300">
                {timezoneOfPlace[userData.timezone]}
                <span className="bg-yellow-100 absolute top-0 right-0 px-2 rounded-md text-xs">
                  Total : {getTotalFreeSlots()}
                </span>
              </th>
              {days.map((day) => (
                <th key={day} className="px-4 py-2 relative">
                  {day}
                  <span className="bg-yellow-100 absolute top-0 right-0 px-2 rounded-md text-xs">
                    {freeSlotsByDay(day)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="">
            {timings.map((time) => (
              <tr key={time}>
                <td className="px-4 py-2 w-1/12 sticky top-8 left-0 right-0 bg-yellow-300">
                  {time}
                </td>
                {days.map((day) => (
                  <td
                    key={`${day}-${time}`}
                    className={`border px-4 py-2 rounded-md w-1/12 ${
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
