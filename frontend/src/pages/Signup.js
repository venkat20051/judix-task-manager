import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/signup", {
        name,
        email,
        password
      });

      navigate("/login");
    } catch (err) {
      setError("User already exists or invalid data");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Create Account ✨
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Sign up to start managing your tasks
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mt-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="Full name"
            className="w-full border rounded-xl p-4 text-base focus:ring-2 focus:ring-indigo-400 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full border rounded-xl p-4 text-base focus:ring-2 focus:ring-indigo-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-xl p-4 text-base focus:ring-2 focus:ring-indigo-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl font-semibold text-lg hover:opacity-90 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
