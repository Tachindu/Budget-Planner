import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

export default function Dashboard() {
  const [budgetItems, setBudgetItems] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    type: 'expense',
    date: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch budget items on load
  useEffect(() => {
    fetchBudgetItems();
  }, []);

  const fetchBudgetItems = async () => {
    try {
      const response = await axiosInstance.get('/budget');
      setBudgetItems(response.data);
    } catch (err) {
      setError('Failed to load budget items');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        category: formData.category,
        amount: Number(formData.amount),
        type: formData.type,
        date: formData.date,
      };
      const response = await axiosInstance.post('/budget', payload);
      setSuccess(response.data.message || 'Budget item added!');
      setFormData({ category: '', amount: '', type: 'expense', date: '' });
      fetchBudgetItems();
    } catch (err) {
      setError('Failed to add budget item');
    }
  };

  return (
  <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
    <h2>Dashboard</h2>

    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <div>
        <label>Category</label><br />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div>
        <label>Amount</label><br />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <div>
        <label>Type</label><br />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div>
        <label>Date</label><br />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>

      <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
        Add Budget Item
      </button>
    </form>

    {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

    <h3 style={{ marginTop: '30px' }}>Your Budget Items</h3>
    <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', marginTop: '10px' }}>
      <thead>
        <tr>
          <th>Category</th>
          <th>Amount</th>
          <th>Type</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {budgetItems.map(item => (
          <tr key={item._id}>
            <td>{item.category}</td>
            <td>{item.amount}</td>
            <td>{item.type}</td>
            <td>{new Date(item.date).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
}

/*
  return (
    <div>
      <h2>  Dashboard</h2>
      

      <form onSubmit={handleSubmit}>

      
        <label> Category   </label>
        <input type="text" name="category" value={formData.category} onChange={handleChange} required />
      
        <label>     Amount   </label>
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
      
        <label>Type   </label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <label>Date   </label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <button type="submit">Add Budget Item</button>
      </form>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>Your Budget Items</h3>
      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {budgetItems.map(item => (
            <tr key={item._id}>
              <td>{item.category}</td>
              <td>{item.amount}</td>
              <td>{item.type}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
*/