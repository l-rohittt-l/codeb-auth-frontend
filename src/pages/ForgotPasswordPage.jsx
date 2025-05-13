import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // 🆕 loading state

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

    setLoading(true); // 🟡 Start loading

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/forgot-password`, { email });
      toast.success('Reset password link sent to your email.');
    } catch (error) {
      console.error('Error sending reset link:', error.response?.data || error.message);

      if (error.response?.status === 404) {
        toast.error('Email not found.');
      } else {
        toast.error('Error sending reset link. Try again later.');
      }
    } finally {
      setLoading(false); // 🔵 Stop loading
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
          <button type="submit" style={{ marginTop: '15px' }} disabled={loading}>
            {loading ? 'Please wait...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
