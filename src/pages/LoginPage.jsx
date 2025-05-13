import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 🆕 loading state

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

    setLoading(true); // 🟡 Start loading

    try {
      const response = await axios.post('https://codeb-ims.onrender.com/api/login', formData);
      toast.success('Login successful');

      const userRole = response.data.role;
      const normalizedRole = userRole?.toUpperCase().replace('ROLE_', '');

      // ✅ Store role + login state in localStorage
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
      setLoading(false); // 🔵 Stop loading
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
