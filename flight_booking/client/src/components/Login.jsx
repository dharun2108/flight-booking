import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "./Header";
import "./Header.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/server/models/login.php",
        {
          email,
          password,
        }
      );

      // console.log("login Response:", response.data);

      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);

        // console.log(response.data);

        toast.success(`Welcome back,! 🎉`, {
          duration: 4000,
          style: { background: "green", color: "white" },
        });
        navigate("/");
      } else {
        toast.error("Invalid credentials ❌", {
          duration: 2000,
          style: { background: "white", color: "red" },
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Server error. Please try again later. ⚠️", {
        duration: 4000,
        style: { background: "orange", color: "white" },
      });
    }
  };
  useEffect(() => {
    if (!localStorage.getItem("email")) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="login-modal">
      <Header />

      <div className="login-form">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn">
            Login
          </button>
      
          <p className="account">
            Don't have an account?{" "}
            <span
              className="register-link"
              onClick={() => navigate("/registration")}
            >
              Signup
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
