import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './home.module.css';

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
    <div className={styles['home-wrapper']}>
      <div className={styles['home-card']}>
        <img src="/logo192.png" alt="CodeB Logo" className={styles.logo} />
        <h1 className={styles.title}>CodeB</h1>
        <p className={styles.subtitle}>Welcome to CodeB's Internal Management System</p>
        <div className={styles['btn-group']}>
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
