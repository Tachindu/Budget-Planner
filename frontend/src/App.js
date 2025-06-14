/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

/*function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    return token && user ? { token, user } : null;
  });*/

  function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    let user = null;
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        user = JSON.parse(storedUser);
      }
    } catch (err) {
      console.error('Failed to parse user from localStorage:', err);
    }
    return token && user ? { token, user } : null;
  });

  // Protect routes for logged-in users
  const PrivateRoute = ({ children }) => {
    return auth ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

