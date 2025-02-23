import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('valid'); // Check authentication status

  return isAuthenticated ? children : <Navigate to="/adminlogin" />;
};

export default PrivateRoute;