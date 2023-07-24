import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div>
      <h1 class="text-center">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div class="my-2">
          <input
            type="email"
            className="bg-gray-100 rounded-md shadow-sm w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div class="my-2">
          <input
            type="password"
            className="bg-gray-100 rounded-md shadow-sm w-full"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p class="text-red-500 my-2">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-md shadow-sm w-full my-2"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
