import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  convertTimezone,
  fetchSharedDataFromFirebase,
  selectSharedData,
} from "./shareSlice";

import data from "../data.json";

function Share() {
  const { slug } = useParams();
  const sharedData = useSelector(selectSharedData);

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const timings = data.schedule[days[0]].map((slot) => slot.timeSlot);

  const dispatch = useDispatch();
  const dispatchRef = useRef(dispatch);

  const changeTimeZone = (to) => {
    dispatch(
      convertTimezone({
        schedule: sharedData.schedule,
        timezone: sharedData.timezone,
        to: to,
      })
    );
  };

  const getTotalFreeSlots = () => {
    let freeSlots = 0;
    Object.keys(sharedData.schedule).forEach((day) => {
      for (let slot of sharedData.schedule[day]) {
        if (slot.label === "free") {
          freeSlots++;
        }
      }
    });
    return freeSlots;
  };

  useEffect(() => {
    const getLatestSchedule = async () => {
      dispatchRef.current(fetchSharedDataFromFirebase(`${slug}@gmail.com`));
    };
    getLatestSchedule();
  }, [slug, dispatchRef]);

  return (
    <div className="p-4">
      {sharedData.incorrectProfile ? (
        <div className="text-red-500 text-5xl text-center font-bold">
          <h1>Wrong Profile - Please check link again</h1>
          <p className="text-yellow-500 text-2xl my-6">
            {slug} not found on weekly
          </p>
        </div>
      ) : (
        <div>
          <h1>Profile : {slug}</h1>
          <h1 className="text-2xl font-bold">Weekly Schedule of {slug}</h1>
          <h1 className="text-2xl font-bold">
            Timezone : {sharedData.timezone}
          </h1>
          <h1 className="text-2xl font-bold">
            Total Free Slots : {getTotalFreeSlots()}
          </h1>
        </div>
      )}
      <div className="timezones bg-gray-300 m-3 p-2">
        <button
          onClick={() => {
            changeTimeZone("Asia/Kolkata");
          }}
          className="bg-gray-300 px-2 mx-2 rounded-md border-4 hover:bg-black hover:text-white"
        >
          IST
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
      </div>
      <div>
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
                    className={`border border-black px-4 py-2 ${
                      sharedData.schedule[day].find(
                        (slot) => slot.timeSlot === time
                      ).label === "free"
                        ? "bg-green-300"
                        : "bg-red-300"
                    }`}
                  >
                    <div className="d-flex flex justify-betweens">
                      <div className="w-full">
                        <span>
                          {
                            sharedData.schedule[day].find(
                              (slot) => slot.timeSlot === time
                            ).label
                          }
                        </span>
                      </div>
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

export default Share;
