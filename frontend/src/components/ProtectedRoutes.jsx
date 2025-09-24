import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    // Om ingen token finns, skicka användaren till login
    return <Navigate to="/login" replace />;
  }
  // Om token finns, rendera barnkomponenterna
  return children;
};

export default ProtectedRoute;
