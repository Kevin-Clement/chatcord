import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  
  const { user, setUser } = useContext(UserContext);
  return user ? children : <Navigate to="/login" />;
}
