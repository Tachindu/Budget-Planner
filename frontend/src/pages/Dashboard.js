
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';

export default function Dashboard() {
  const [budgetItems, setBudgetItems] = useState([]);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    type: 'expense',
    date: ''
  });
  const [editId, setEditId] = useState(null); // 🔧 for editing
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');

  const navigate = useNavigate(); 

  useEffect(() => {
    fetchBudgetItems();
  }, []);

  const fetchBudgetItems = async () => {
    try {
      const response = await axiosInstance.get('/budget', {
        params: {
          month: selectedMonth || undefined,
          year: selectedYear || undefined,
          category: selectedCategoryFilter || undefined,
        },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setBudgetItems(response.data);
      setError('');
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

    const payload = {
      category: formData.category,
      amount: Number(formData.amount),
      type: formData.type,
      date: formData.date,
    };

    try {
      if (editId) {
        // 🔧 Update existing item
        const response = await axiosInstance.put(`/budget/${editId}`, payload);
        setBudgetItems(prev =>
          prev.map(item => item._id === editId ? response.data.budgetItem : item)
        );
        setSuccess('Budget item updated!');
        setEditId(null); // reset edit mode
      } else {
        // ➕ Add new item
        const response = await axiosInstance.post('/budget', payload);
        setSuccess(response.data.message || 'Budget item added!');
        fetchBudgetItems(); // refresh list
      }

      // Clear form
      setFormData({ category: '', amount: '', type: 'expense', date: '' });
    } catch (err) {
      setError('Failed to save budget item');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axiosInstance.delete(`/budget/${itemId}`);
      setBudgetItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete item');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      category: item.category,
      amount: item.amount,
      type: item.type,
      date: item.date.slice(0, 10) // yyyy-mm-dd
    });
    setEditId(item._id);
    setSuccess('');
    setError('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ category: '', amount: '', type: 'expense', date: '' });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Dashboard</h2>


      {/* ADD: Button to navigate to /reports */}
      <button
        onClick={() => navigate('/reports')}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px'
        }}
      >
        View Reports
      </button>
   
      {/* Form to Add/Edit Budget Items */}

    
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

        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: editId ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {editId ? 'Update Budget Item' : 'Add Budget Item'}
        </button>

        {editId && (
          <button
            type="button"
            onClick={cancelEdit}
            style={{
              padding: '10px',
              backgroundColor: 'gray',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* Filter Controls */}
      <div style={{ marginTop: '30px', marginBottom: '20px' }}>
        <h3>Filter Budget Items</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Month Dropdown */}
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}>
            <option value="">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>

          {/* Year Dropdown */}
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
            <option value="">All Years</option>
            {/* Change years to suit your app or dynamically generate */}
            {[2023, 2024, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          {/* Category Filter Input */}
          <input
            type="text"
            placeholder="Category"
            value={selectedCategoryFilter}
            onChange={e => setSelectedCategoryFilter(e.target.value)}
            style={{ padding: '6px' }}
          />

          {/* Apply Filters Button */}
          <button
            onClick={fetchBudgetItems}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Apply Filters
          </button>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              setSelectedMonth('');
              setSelectedYear('');
              setSelectedCategoryFilter('');
              fetchBudgetItems();
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: 'gray',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Budget Items Table */}
      <h3>Your Budget Items</h3>
      <table border="1" cellPadding="5" cellSpacing="0" style={{ width: '100%', marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {budgetItems.map(item => (
            <tr key={item._id}>
              <td>{item.category}</td>
              <td>{item.amount}</td>
              <td>{item.type}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => handleEdit(item)}
                  style={{
                    backgroundColor: 'orange',
                    color: 'white',
                    border: 'none',
                    padding: '5px 8px',
                    marginRight: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  style={{
                    backgroundColor: 'red',
                    color: 'white',
                    border: 'none',
                    padding: '5px 8px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


