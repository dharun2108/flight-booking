// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // No token found, redirect to login
    return <Navigate to="/login" />;
  }

  // Verify token by sending a request to the backend
  axios.post("http://localhost:8000/server/verify_Token.php", {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    if (response.data.status !== "success") {
      // Token is invalid, redirect to login
      localStorage.removeItem("token");
      window.location.href = "/dashboard";
    }
  })
  .catch(() => {
    // Error verifying token, redirect to login
    localStorage.removeItem("token");
    window.location.href = "/login";
  });

  return children;
}

export default PrivateRoute;
