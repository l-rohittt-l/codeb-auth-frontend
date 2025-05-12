import React from 'react';
import Navbar from '../components/Navbar';

const AdminDashboardPage = () => {
  return (
    <>
      <Navbar />
      <div style={{
        textAlign: 'center',
        padding: '60px',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h2>Welcome, Admin</h2>
        <p>This is your Admin Dashboard.</p>
        <p>Here you will manage users, view reports, and monitor system activity.</p>
      </div>
    </>
  );
};

export default AdminDashboardPage;
