import React from 'react';
import './Home.css';
import './Dashboard' // Import the CSS file

const Footer = () => {
  return (
    <footer
      style={{
        background: "linear-gradient(to right, #4b6cb7, #182848)", // Modern gradient
        color: "#fff",
        textAlign: "center",
        padding: "10px 0",
        position: "relative",
        bottom: -100,
        width: "100%",
        fontSize: "16px",
        fontWeight: "500",
      }}
    >
      <p>&copy; 2025 Blue Hub | All Rights Reserved</p>
    </footer>
  );
};

export default Footer;
