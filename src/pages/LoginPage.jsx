import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

console.log(API_BASE_URL);
const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      toast.info('You are already logged in.');
      const role = localStorage.getItem('role');
      if (role === 'ADMIN') navigate('/admin/dashboard');
      else if (role === 'SALES') navigate('/sales/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateInput = () => {
    if (!formData.email || !formData.password) {
      return "Email and password are required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inputError = validateInput();
    if (inputError) {
      toast.error(inputError);
      return;
    }

    setLoading(true);

    try {
      // ✅ Optional: kill existing backend session just in case
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });

      const response = await axios.post(`${API_BASE_URL}/api/login`, formData, {
        withCredentials: true
      });

      toast.success('Login successful');

      const userRole = response.data.role;
      const normalizedRole = userRole?.toUpperCase().replace('ROLE_', '');

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', normalizedRole);

      if (normalizedRole === 'ADMIN') {
        setTimeout(() => navigate('/admin/dashboard'), 1000);
      } else if (normalizedRole === 'SALES') {
        setTimeout(() => navigate('/sales/dashboard'), 1000);
      } else {
        toast.error('Unknown user role. Cannot redirect.');
      }

    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        toast.error('Invalid email or password.');
      } else {
        toast.error('Login failed — server error or unreachable.');
      }
    } finally {
      setLoading(false);
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
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            /> Show Password
          </div>

          <div style={{ marginTop: '8px' }}>
            <a href="/forgot-password" style={{ fontSize: '0.9rem', color: '#007bff' }}>
              Forgot Password?
            </a>
          </div>

          <button type="submit" style={{ marginTop: '15px' }} disabled={loading}>
            {loading ? 'Please wait...' : 'Login'}
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginPage;
