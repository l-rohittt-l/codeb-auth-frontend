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

        {/* Group Management Card */}
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
            <h4 style={{ marginBottom: '15px' }}>Group Management</h4>
            <p style={{ marginBottom: '20px' }}>
              Add, edit, and delete customer groups from the system.
            </p>
            <a href="/groups/dashboard" className="btn btn-primary">
              Go to Groups
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
