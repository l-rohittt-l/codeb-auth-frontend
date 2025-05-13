import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email) {
      setMessage('Email is required.');
      return;
    }

    if (!validateEmail(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/forgot-password`, { email });
      setMessage('Reset password link sent to your email.');
    } catch (error) {
      console.error('Error sending reset link:', error.response?.data || error.message);

      if (error.response?.status === 404) {
        setMessage('Email not found.');
      } else {
        setMessage('Error sending reset link. Try again later.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Enter your email:</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '15px' }}>Send Reset Link</button>
        </form>

        {message && (
          <p style={{ marginTop: '15px', color: message.includes('sent') ? 'green' : 'crimson' }}>
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default ForgotPasswordPage;
