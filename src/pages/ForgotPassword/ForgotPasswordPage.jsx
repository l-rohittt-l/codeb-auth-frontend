// src/pages/ForgotPassword/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import api from '../../axios';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';
import styles from './forgotPassword.module.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Email is required.');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/api/forgot-password', { email });
      toast.success('Reset password link sent to your email.');
    } catch (error) {
      console.error('Error sending reset link:', error.response?.data || error.message);

      if (error.response?.status === 404) {
        toast.error('Email not found.');
      } else {
        toast.error('Error sending reset link. Try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles['forgot-wrapper']}>
        <div className={styles['forgot-container']}>
          <div className={styles['left-section']}>
            <h2>Forgot Password</h2>
            <p>Enter your registered email and we'll send a reset link</p>
            <form onSubmit={handleSubmit}>
              <label>Email Address:</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Please wait...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
          <div className={styles['right-section']}>
            <img src="/forgot-art.png" alt="Forgot Password Illustration" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
