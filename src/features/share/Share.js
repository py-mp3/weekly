import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import data from "./../schedule/data.json";

import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

function Share() {
  const { slug } = useParams();
  const [schedule, setSchedule] = useState(data);
  const [incorrectProfile, setIncorrectProfile] = useState(false);

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

  useEffect(() => {
    const getLatestSchedule = async () => {
      const docRef = doc(db, "users/" + slug + "@gmail.com");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSchedule(docSnap.data().userData);
      } else {
        console.log("No such document!");
        setIncorrectProfile(true);
      }
    };
    getLatestSchedule();
  }, [slug]);

  return (
    <div className="p-4">
      {incorrectProfile ? (
        <div className="text-red-500 text-5xl text-center font-bold">
          Wrong Profile - Please check link again
        </div>
      ) : (
        <div>
          <h1>Profile : {slug}</h1>
          <h2 className="text-2xl font-bold mb-4">Weekly Schedule of {slug}</h2>
          <h1>Timezone : {schedule.timezone}</h1>
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
                        schedule.schedule[day].find(
                          (slot) => slot.timeSlot === time
                        ).label === "free"
                          ? "bg-green-300"
                          : "bg-red-300"
                      }`}
                    >
                      <div className="d-flex flex justify-between">
                        <span>
                          {
                            schedule.schedule[day].find(
                              (slot) => slot.timeSlot === time
                            ).label
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
