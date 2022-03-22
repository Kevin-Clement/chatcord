import './App.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { UserContext } from './UserContext';
import Login from './components/auth/Login';
import SignUp from './components/auth/Signup';
import Home from './components/home/Home';
import Chat from './components/chat/Chat';
import PrivateRoute from './PrivateRoute';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>
            <Route path="/" element={
              <PrivateRoute>
                <Home/>
              </PrivateRoute>
            }/>
          <Route path="/chat/:room_id/:room_name" element={
            <PrivateRoute>
              <Chat/>
            </PrivateRoute>
          }/>
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
