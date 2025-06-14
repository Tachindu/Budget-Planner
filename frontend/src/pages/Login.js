import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login({ setAuth }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axiosInstance.post('/auth/login', formData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setAuth({ user, token });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>

  <div>
    <label>Username</label><br />
    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
  </div>

  <div>
    <label>Password</label><br />
    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
  </div>

  <button type="submit" style={{ padding: '6px 12px', fontSize: '14px', width: '100px' }}>Login</button>
</form>

    

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}


/*
<form onSubmit={handleSubmit}>

        <label>Username</label>
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit">Login</button>
      </form>
      */