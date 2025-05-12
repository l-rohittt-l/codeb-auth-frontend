import React from 'react';
import Navbar from '../components/Navbar';

const DashboardPage = () => {
  return (
    <>
      <Navbar />
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Welcome to the Dashboard</h2>
        <p>This is a placeholder dashboard after successful login.</p>
      </div>
    </>
  );
};

export default DashboardPage;
