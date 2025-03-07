import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookingList.css";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedBooking, setEditedBooking] = useState({});
  const [showTable, setShowTable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/server/config/verify_token.php", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.status !== "success") {
          alert("Unauthorized access. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      })
      .catch((error) => console.error("Error:", error));

    if (showTable ) {
      fetchBookings()
    }
  }, [showTable]);

  const fetchBookings = async () => {
    const agentEmail = localStorage.getItem("email");
    if (!agentEmail) {
      console.error("Unauthorized agent. Email not found.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/server/controllers/fetchBookings.php",
        { email: agentEmail }
      );
      if (response.data.status === "success") {
        setBookings(groupBookings(response.data.data));
      } else {
        console.warn(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to load bookings ❌");
      console.error("Error fetching bookings:", error);
    }
  };

  const groupBookings = (data) => {
    let grouped = {};
    data.forEach((booking) => {
      const key = `${booking.origin}-${booking.destination}-${booking.date}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(booking);
    });
    return Object.values(grouped);
  };

  const handleEdit = (id, booking) => {
    setEditingId(id);
    setEditedBooking({ 
        ...booking, 
        origin: booking.origin, 
        destination: booking.destination 
    });
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
          toast.success("Booking updated!", {
            duration: 3000, // Show for 4 seconds
            style: {
              background: "green",
              color: "white",
            },
          });
          
        }
        else{
          toast.error("Failed to update booking ❌");
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
          toast.success("Booking deleted! 🗑️");
      
        }
      })
      .catch((error) => console.error("Error deleting booking:", error));
  };

  return (
    <div>
             <button className="back-button" onClick={() => navigate("/")}> Back</button>
  
      {showTable && (
        <>
          <table border="1">
            <thead>
              <tr>
                <th>Origin</th>
                <th>Destination</th>
                <th>Date</th>
                <th>Passenger Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Seat Preference</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  {bookings.length > 0 ? (
    bookings.map((group) =>
      group.map((booking, index) => (
        <tr key={booking.id}>
          {index === 0 && (
            <>
              <td rowSpan={group.length}>{booking.origin}</td>
              <td rowSpan={group.length}>{booking.destination}</td>
              <td rowSpan={group.length}>{booking.date}</td>
            </>
          )}

          {/* Passenger Name */}
          <td>
            {editingId === booking.id ? (
              <input
                type="text"
                value={editedBooking.passengerName || ""}
                onChange={(e) => handleChange(e, "passengerName")}
              />
            ) : (
              booking.passengerName || "No name"
            )}
          </td>

          {/* Age */}
          <td>
            {editingId === booking.id ? (
              <input
                type="number"
                value={editedBooking.age || ""}
                onChange={(e) => handleChange(e, "age")}
              />
            ) : (
              booking.age
            )}
          </td>

          {/* Gender */}
          <td>
            {editingId === booking.id ? (
              <select
                type="text"
                value={editedBooking.gender || ""}
                onChange={(e) => handleChange(e, "gender")}
              >
                  <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              </select>

            ) : (
              booking.gender
            )}
          </td>

          {/* Seat Preference */}
          <td>
            {editingId === booking.id ? (
              <select
                type="text"
                value={editedBooking.seatPreference || ""}
                onChange={(e) => handleChange(e, "seatPreference")}
              >
                 <option value="">Seat Preference</option>
              <option value="Aisle">Aisle</option>
              <option value="Window">Window</option>
              <option value="Middle">Middle</option>
              <option value="No Preference">No Preference</option>
            </select>
            ) : (
              booking.seatPreference
            )}
          </td>

          {/* Actions */}
          <td>
            {editingId === booking.id ? (
              <button onClick={() => handleSave(booking.id)} className="save-button" >Save</button>
            ) : (
              <button onClick={() => handleEdit(booking.id, booking)} className="edit-button" >Edit</button>
            )}
            <button onClick={() => handleDelete(booking.id)}  >Delete</button>
          </td>
        </tr>
      ))
    )
  ) : (
    <tr>
      <td colSpan="8">No bookings found</td>
    </tr>
  )}
</tbody>

          </table>
        
   
        </>
      )}
    </div>
  );
};

export default BookingList;
