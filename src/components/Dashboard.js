import React from "react";
import { auth } from "../firebase";

function Dashboard() {
  return <div>Dashboard of {auth.currentUser.email}</div>;
}

export default Dashboard;
