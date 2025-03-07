import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./RegistrationForm.css"; // Importing the custom CSS
import { Link, useNavigate } from "react-router-dom"; // Import at the top
import axios from "axios";
import toast from "react-hot-toast";



// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegistrationForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData) => {
    axios
      .post("http://localhost:8000/server/models/register1.php", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      .then((response) => {
        if (response.data.status === "success") {
          // Store JWT token in localStorage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("username", response.data.name);
          localStorage.setItem("email", response.data.email);
          toast.success("Registration successful! 🎉", {
            duration: 4000,
            style: { background: "green", color: "white" },
          });
          // Redirect to dashboard or login page
          navigate("/");
        } 
        else if (response.data.message === "Email already registered.") {
          toast.error("Email already exists! 📧❌", {
            duration: 3000,
            style: { background:  "white", color:"red" },
          });
        }
        
        else {
          toast.error("Registration failed. Try again! ⚠️", {
            duration: 4000,
            style: { background: "orange", color: "white" },
          });
          console.log(response.data.message);
        }
      })
      .catch((error) => {
        toast.error("Server error. Please try again later. 🚨", {
          duration: 4000,
          style: { background: "red", color: "white" },
        });
        console.error("registration Error:", error)
  });
  };


  return (
    <div className="register-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h2 className="form-title">Signup</h2>

        <div className="form-group">
          {/* <label>Name:</label> */}
          <input type="text" {...register("name")} className="form-input" placeholder="Name" />
          {errors.name && (
            <span className="error-message">{errors.name.message}</span>
          )}
        </div>

        <div className="form-group">
          {/* <label>Email:</label> */}
          <input type="email" {...register("email")} className="form-input" placeholder="Email" />
          {errors.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          {/* <label>Password:</label> */}
          <input
            type="password"
            {...register("password")}
            className="form-input"
            placeholder="Password"
          /> 
          {errors.password && (
            <span className="error-message">{errors.password.message}</span>
          )}
        </div>

        <div className="form-group">
          {/* <label>Confirm Password:</label> */}
          <input
            type="password"
            {...register("confirmPassword")}
            className="form-input"
            placeholder="confirm password"
          />
          {errors.confirmPassword && (
            <span className="error-message">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button type="submit" className="form-button">
          Signup
        </button>
        <p className="to-login" >
          Already have an account ? <Link to="/login"> login</Link>{" "}
        </p>
      </form>
    </div>
  );
};
export default RegistrationForm;
