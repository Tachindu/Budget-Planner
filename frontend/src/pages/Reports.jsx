
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

// Register necessary Chart.js components
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Reports = () => {
  const [summary, setSummary] = useState(null);  // start with null

  useEffect(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    axios
      .get(`/api/budget/summary?month=${month}&year=${year}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        const { totalIncome, totalExpense } = res.data;
        setSummary({ income: totalIncome, expense: totalExpense });
      })
      .catch((err) => console.error('Failed to load summary:', err));
  }, []);

  if (summary === null) {
    return <p>Loading summary...</p>;
  }

  const data = {
    labels: ['Income', 'Expenses', 'Balance'],
    datasets: [
      {
        label: 'Budget Summary',
        data: [
          summary.income,
          summary.expense,
          summary.income - summary.expense,
        ],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3'],
      },
    ],
  };

  return (
    <div style={{ width: '80%', margin: 'auto', marginTop: '2rem' }}>
      <h2 className="text-xl font-bold mb-4">Budget Summary</h2>
      <Bar key={JSON.stringify(data)} data={data} />
    </div>
  );
};

export default Reports;
