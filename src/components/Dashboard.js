import React from "react";
import { auth } from "../firebase";

import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
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

  return (
    <div>
      <h3>Dashboard of {auth.currentUser.email}</h3>
      <button className="bg-red-500 text-white" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
