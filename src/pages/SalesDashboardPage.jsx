import React from 'react';
import Navbar from '../components/Navbar';

const SalesDashboardPage = () => {
  return (
    <>
      <Navbar />
      <div style={{
        textAlign: 'center',
        padding: '60px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2>Welcome, Sales Team</h2>
        <p>This is your Sales Dashboard.</p>
        <p>Here you can manage estimates, create invoices, and track payments.</p>
      </div>
    </>
  );
};

export default SalesDashboardPage;
