import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrationForm from "./components/RegistrationForm";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";

import BookingList from "./components/BookingList";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/registration" element={<RegistrationForm />} />
      <Route path="/bookinglist" element={<BookingList />} />
    </Routes>
      
  <div>
      <Toaster position="top-center" reverseOrder={false} />

    </div>

  </BrowserRouter>
);
