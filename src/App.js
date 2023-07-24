import "./App.css";
import Signup from "./components/Signup";

function App() {
  return (
    <div className="App">
      <h1 className="text-pink-500 text-center font-extrabold">Weekly</h1>
      <p className="text-pink-300 text-center font-bold">
        No Dates, Just Weekdays!
      </p>
      <Signup />
    </div>
  );
}

export default App;
