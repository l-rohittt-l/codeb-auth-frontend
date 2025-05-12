import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ResetPasswordPage = () => {
  const { token } = useParams(); // read token from URL
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(`https://codeb-ims.onrender.com/api/reset-password/${token}`, {
        newPassword,
      });
      setMessage('Password reset successful. You can now login with your new password.');
    } catch (error) {
      console.error('Reset failed:', error.response?.data || error.message);
      if (error.response?.status === 400) {
        setMessage('Reset token is invalid or expired.');
      } else {
        setMessage('Failed to reset password. Try again.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>New Password:</label><br />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '15px' }}>Reset Password</button>
        </form>

        {message && (
          <p style={{ marginTop: '15px', color: message.includes('successful') ? 'green' : 'crimson' }}>
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default ResetPasswordPage;
