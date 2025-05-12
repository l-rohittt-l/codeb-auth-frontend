import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://codeb-ims.onrender.com/api/login', formData);
      setMessage('Login successful');

      const userRole = response.data.role;
      console.log('Returned user role:', userRole);

      const normalizedRole = userRole?.toUpperCase().replace('ROLE_', '');

      if (normalizedRole === 'ADMIN') {
        setTimeout(() => navigate('/admin/dashboard'), 1000);
      } else if (normalizedRole === 'SALES') {
        setTimeout(() => navigate('/sales/dashboard'), 1000);
      } else {
        setMessage('Unknown user role. Cannot redirect.');
      }

    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        setMessage('Invalid email or password.');
      } else {
        setMessage('Login failed — server error or unreachable.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label><br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>Password:</label><br />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" style={{ marginTop: '15px' }}>Login</button>
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

export default LoginPage;
