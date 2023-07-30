import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

import Schedule from "../features/schedule/Schedule";

import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const logout = () => {
    try {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          console.log("Log out Success");
          navigate("/login");
        })
        .catch((error) => {
          // An error happened.
          console.log("error", error);
        });
    } catch (error) {
      alert("Error occured", error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("auth changed!");
        setemail(auth.currentUser.email);
      }
    });
  }, []);

  return (
    <div className="p-2">
      <span>Dashboard of {email}</span>
      <button
        className="bg-red-400 text-white px-1 rounded-md hover:bg-red-500"
        onClick={logout}
      >
        Logout
      </button>
      <Schedule />
    </div>
  );
}

export default Dashboard;
