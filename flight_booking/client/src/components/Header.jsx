import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <header className="header">
      <div className="logo">
        <img
          src="https://d12lchh0gjjhot.cloudfront.net/qa/uploadFiles/portalLogo/414_1729072841_portal_logo.svg"
          alt="Logo"
          className="logo-img"
        />
        {/* <span className="logo-text">DRN TRAVEL AGENCY</span> */}
      </div>

      {localStorage.getItem("email") && (
        <>
      
          <div className="bookedlist-button">
            <button
              onClick={() => navigate("/bookinglist")}
              className="list-button"
            >
              Booked List
            </button>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
          <div className="user-section">
            <div className="avatar">{localStorage.getItem("email")[0]}</div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
