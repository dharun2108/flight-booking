import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [showBookings, setShowBookings] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [passengerCount, setPassengerCount] = useState();
  const [passengerForms, setPassengerForms] = useState([]);
  const [passengerDetails, setPassengerDetails] = useState([]);
  const [passengers, setPassengers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // const storedName = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    console.log("email :", storedEmail);

    setEmail(storedEmail);

    if (!token) {
      navigate("/login");
      return;
    }

    // Verify Token
    axios
      .get("http://localhost:8000/server/config/verify_token.php", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.status !== "success") {
          toast("Session expired, please login again. 🔐");
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  // Handle Main Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(passengerCount);
    if (count > 0) {
      setPassengerForms(Array.from({ length: count }, (_, i) => i + 1));
      setPassengerDetails(
        Array.from({ length: count }, () => ({
          name: "",
          age: "",
          gender: "",
          seatPreference: "",
        }))
      );
      setShowForm(true); // Show the form when searching
    } else {
      alert("Please enter a valid passenger count.");
    }
  };

  // Handle Change for Passenger Details
  const handlePassengerChange = (index, field, value) => {
    const updatedDetails = [...passengerDetails];
    updatedDetails[index][field] = value;
    setPassengerDetails(updatedDetails);
    setPassengers(updatedDetails);
  };

  const validateForm = () => {
    for (const passenger of passengerDetails) {
      if (
        !passenger.name ||
        !passenger.age ||
        !passenger.gender ||
        !passenger.seatPreference
      ) {
        toast.error(
          "Please fill out all passenger details before submitting! ⚠️"
        );
        return false;
      }
    }
    return true;
  };

  // Handle Common Submit for All Passengers
  const handleCommonSubmit = () => {
    if (!validateForm()) return;
    setShowForm(false); // Hide form after submission
    const agentEmail = localStorage.getItem("email");

    const bookingData = {
      origin,
      destination,
      date,
      passengerCount,
      agentEmail,
      passengers: passengerDetails,
    };

    axios
      .post(
        "http://localhost:8000/server/controllers/saveBooking.php",
        bookingData
      )
      .then((response) => {
        if (response.data.status === "success") {
          toast("Booking saved! 🛫", { icon: "✅" });
          setOrigin("");
          setDestination("");
          setDate("");
          setPassengerCount(1);
          setPassengerForms([]); // Clear forms
          setPassengerDetails([]);
          setPassengers([]);
        } else {
          console.log(response.data);
          toast.error("Failed to save booking ❌");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const handleCancel = () => {
    setPassengerForms([]);
    setPassengerDetails([]);
    toast("Passenger form cancelled.", { icon: "❌" });
  };



  useEffect(() => {
    if (!localStorage.getItem("email")) {
      navigate("/login");
    }
  }, []);



  return (
    <div className="dashboar-conatiner">
      {/* Main Content */}
      <main className="main-content">
        {/* Search Form */}
        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Passenger Count"
            value={passengerCount}
            onChange={(e) => setPassengerCount(e.target.value)}
            max={9}
            required
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>
      </main>

      {/* Dynamic Passenger Forms (only show when showForm is true) */}
      {showForm &&
        passengerForms.map((_, index) => (
          <form key={index} className="passenger-form">
            <h3>Passenger {index + 1}</h3>

            <input
              type="text"
              placeholder="Name"
              value={passengerDetails[index]?.name || ""}
              onChange={(e) =>
                handlePassengerChange(index, "name", e.target.value)
              }
              required
            />

            <input
              type="number"
              placeholder="Age"
              value={passengerDetails[index]?.age || ""}
              onChange={(e) =>
                handlePassengerChange(index, "age", e.target.value)
              }
              max={110}
              required
            />

            {/* Gender Dropdown */}
            <select
              value={passengerDetails[index]?.gender || ""}
              onChange={(e) =>
                handlePassengerChange(index, "gender", e.target.value)
              }
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* Seat Preference Dropdown */}
            <select
              value={passengerDetails[index]?.seatPreference || ""}
              onChange={(e) =>
                handlePassengerChange(index, "seatPreference", e.target.value)
              }
              required
            >
              <option value="">Seat Preference</option>
              <option value="Aisle">Aisle</option>
              <option value="Window">Window</option>
              <option value="Middle">Middle</option>
              <option value="No Preference">No Preference</option>
            </select>
          </form>
        ))}

      {/* Common Submit Button */}
      {showForm && passengerForms.length > 0 && <div>
        
       
       <button className="common-submit-btn" onClick={handleCommonSubmit}>
         Submit All Passengers
       </button>

       <button className="cancel-btn" onClick={handleCancel}>
           Cancel
         </button>
      </div> 
      
      }
         

      {showBookings && <BookingList />}
    </div>
  );
};

export default Dashboard;
