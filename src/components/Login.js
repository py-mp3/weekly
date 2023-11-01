import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((user) => {
        console.log(user);
        navigate("/dashboard");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div className="w-6/12 text-center m-auto">
      <h1 class="text-center">Login to Weekly</h1>
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
          Login
        </button>
        <Link
          to="/"
          className="bg-green-500 text-white rounded-md shadow-sm w-full my-2"
        >
          Don't have account? Click here to Signup or to Continue with google
        </Link>
      </form>
    </div>
  );
}

export default Login;
