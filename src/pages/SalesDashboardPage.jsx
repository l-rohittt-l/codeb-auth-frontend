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
        <h2>Welcome, Sales Executive</h2>
        <p>This is your Sales Dashboard.</p>
        <p>Here you will create estimates, generate invoices, and manage client interactions.</p>

        {/* Placeholder for future cards */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '50px'
        }}>
          <div style={{
            border: '1px solid #ccc',
            borderRadius: '12px',
            padding: '30px',
            width: '300px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
          }}>
            <h5 style={{ marginBottom: '15px' }}>Estimate Management</h5>
            <p>Coming soon: Create and manage estimates for client orders.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesDashboardPage;
