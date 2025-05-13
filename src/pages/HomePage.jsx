import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('role');

    if (isAuthenticated && role) {
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'SALES') navigate('/sales/dashboard');
    }
  }, [navigate]);

  return (
    <div style={{
      textAlign: 'center',
      padding: '60px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>CodeB</h1>
      <p style={{ marginBottom: '30px' }}>
        Welcome to CodeB's Internal Management System
      </p>
      <div>
        <button
          onClick={() => navigate('/login')}
          style={{
            marginRight: '20px',
            padding: '10px 20px',
            fontSize: '16px'
          }}
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '10px 20px',
            fontSize: '16px'
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default HomePage;
