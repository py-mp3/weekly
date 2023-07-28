import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import data from "./../schedule/data.json";
import moment from "moment-timezone";

import { db, auth } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function Share() {
  const { slug } = useParams();
  const [schedule, setSchedule] = useState(data.schedule);
  const [incorrectProfile, setIncorrectProfile] = useState(false);

  const days = Object.keys(data.schedule);
  const timings = data.schedule[days[0]].map((slot) => slot.timeUTC);

  const getLatestSchedule = async () => {
    const docRef = doc(db, "users/" + slug + "@gmail.com");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setSchedule(docSnap.data().schedule);
    } else {
      console.log("No such document!");
      setIncorrectProfile(true);
    }
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
      {incorrectProfile ? (
        <div className="text-red-500 text-5xl text-center font-bold">
          Wrong Profile - Please check link again
        </div>
      ) : (
        <div>
          <h1>Main profile : {slug}</h1>
          <h1>Main time {moment().format("MMMM Do YYYY, h:mm:ss a")}</h1>
          <h1>JS : {new Date().toString()}</h1>
          <h2 className="text-2xl font-bold mb-4">Weekly Schedule of {slug}</h2>

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
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Share;
