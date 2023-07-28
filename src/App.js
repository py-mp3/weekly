import { Route, Routes } from "react-router-dom";
import "./App.css";

import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Share from "./features/share/Share";

function App() {
  return (
    <div className="App">
      <h1 className="text-pink-500 text-center font-extrabold">Weekly</h1>
      <p className="text-pink-300 text-center font-bold">
        No Dates, Just Weekdays!
      </p>
      <Routes>
        <Route exact path="/" element={<Signup />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/share/:slug" element={<Share />} />
      </Routes>
    </div>
  );
}

export default App;
