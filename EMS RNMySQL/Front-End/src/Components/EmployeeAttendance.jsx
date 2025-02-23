import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EmployeeAttendance.css';  // Create a separate CSS file for styles

const EmployeeAttendance = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // To manage loading state
  const [errorMessage, setErrorMessage] = useState('');  // To display any error message

  useEffect(() => {
    // Optional: Check initial status if needed (e.g., check if already checked in)
    axios.get('http://localhost:3000/attendance/status')
      .then(response => {
        if (response.data.checkedIn) {
          setIsCheckedIn(true);
        }
      })
      .catch(error => console.error("Error fetching attendance status:", error));
  }, []);

  const handleCheckInOut = () => {
    setIsLoading(true); // Set loading state while waiting for server response
    if (!isCheckedIn) {
      // Check-in request
      axios.post('http://localhost:3000/attendance/check_in')
        .then(response => {
          setIsCheckedIn(true);
          setErrorMessage('');  // Clear any previous error message
        })
        .catch(err => {
          setErrorMessage('Error during check-in. Please try again.');
          console.error('Error during check-in:', err);
        })
        .finally(() => setIsLoading(false)); // Reset loading state
    } else {
      // Check-out request
      axios.post('http://localhost:3000/attendance/check_out')
        .then(response => {
          setIsCheckedIn(false);
          setErrorMessage('');  // Clear any previous error message
        })
        .catch(err => {
          setErrorMessage('Error during check-out. Please try again.');
          console.error('Error during check-out:', err);
        })
        .finally(() => setIsLoading(false)); // Reset loading state
    }
  };

  return (
    <div className="attendance-container">
      <h2 className="attendance-title">Employee Attendance</h2>

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <button 
        className={`attendance-button ${isCheckedIn ? 'checked-in' : 'checked-out'}`} 
        onClick={handleCheckInOut} 
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : isCheckedIn ? 'Check Out' : 'Check In'}
      </button>

      <div className="status-message">
        {isCheckedIn ? 'You are currently checked in.' : 'You are not checked in.'}
      </div>
    </div>
  );
};

export default EmployeeAttendance;
