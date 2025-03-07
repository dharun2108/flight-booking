import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookingList.css";
import { useNavigate } from "react-router-dom";
const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedBooking, setEditedBooking] = useState({});
  const [showTable, setShowTable] = useState(true); // To toggle visibility
    const navigate = useNavigate();
  

  useEffect(() => {


    const token = localStorage.getItem('token');
    if (!token) {
      // alert("You must be logged in to access this page.");
      navigate('/login');
      return;
    }
     // Verify Token
     axios.get('http://localhost:8000/server/config/verify_token.php', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (response.data.status !== "success") {
        alert("Unauthorized access. Please login again.");
        localStorage.removeItem('token');
        navigate('/login');
      }
    })
    .catch(error => console.error('Error:', error));

    if (showTable) {

      fetchBookings();
    }

  }, [showTable]); //fetch the table when it is shown again
  const fetchBookings = async () => {
    const agentEmail = localStorage.getItem("email"); // Get logged-in agent's email
  
    if (!agentEmail) {
      console.error("Unauthorized agent. Email not found.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8000/server/controllers/fetchBookings.php", {
        email: agentEmail, // Send email to backend
      });
  
      console.log("Fetched Bookings:", response.data);

      if (response.data.status === "success") {
        setBookings(response.data.data); // Store data in state
      } else {
        console.warn(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  

  const handleEdit = (id, booking) => {
    setEditingId(id);
    setEditedBooking({ ...booking });
  };

  const handleChange = (e, field) => {
    setEditedBooking({ ...editedBooking, [field]: e.target.value });
  };

  const handleSave = (id) => {
    axios
      .post("http://localhost:8000/server/controllers/updateBooking.php", {
        id,
        ...editedBooking,
      })
      .then((response) => {
        if (response.data.status === "success") {
          fetchBookings();
          setEditingId(null);
        } else {
          console.error("Failed to update booking");
        }
      })
      .catch((error) => console.error("Error updating booking:", error));
  };

  const handleDelete = (id) => {
    axios
      .post("http://localhost:8000/server/controllers/deleteBooking.php", { id })
      .then((response) => {
        if (response.data.status === "success") {
          fetchBookings();
        } else {
          console.error("Failed to delete booking");
        }
      })
      .catch((error) => console.error("Error deleting booking:", error));
  };

  const handleCancel = () => {
    setShowTable(false); // Hide the table when cancel is clicked
  };

  const handleBack=()=>{
    navigate("/dashboard");
  }

return (
    <div>
      <h2>My Bookings</h2>
      <table>
        <thead>
          <tr>
            <th>Origin</th>
            <th>Destination</th>
            <th>Date</th>
            <th>Passenger(s)</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <tr key={index}>
                <td>{booking.origin}</td>
                <td>{booking.destination}</td>
                <td>{booking.date}</td>
                <td>
                  {booking.passengerDetails.map((passenger, i) => (
                    <div key={i}>
                      {passenger.name} ({passenger.age}, {passenger.gender}, Seat: {passenger.seatPreference})
                    </div>
                  ))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No bookings found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
  