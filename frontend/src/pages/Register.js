import React, { useState } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axiosInstance.post('/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '350px' }}>

  <div>
    <label>Username</label><br />
    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
  </div>

  <div>
    <label>Email</label><br />
    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
  </div>

  <div>
    <label>Password</label><br />
    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
  </div>

  <button type="submit" style={{ padding: '6px 12px', fontSize: '14px', width: '100px' }}>Register</button>
</form>


      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}


