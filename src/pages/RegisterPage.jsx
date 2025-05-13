import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'SALES',
    status: 'active'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 🆕 loading state

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/;
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!regex.test(password)) {
      return "Password must contain uppercase, lowercase, number, and special character.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true); // 🟡 Start loading

    try {
      const { confirmPassword, ...requestData } = formData;

      const response = await axios.post(`${API_BASE_URL}/api/register`, requestData);
      toast.success('Registration successful');
      console.log('Register success:', response.data);

      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (error) {
      console.error('Register failed:', error.response?.data || error.message);

      const res = error.response;

      if (!res) {
        toast.error('Network error or server not reachable.');
      } else if (res.status === 401) {
        toast.error('Invalid input or password does not meet requirements.');
      } else if (res.status === 400) {
        if (res.data?.errors?.length) {
          toast.error(res.data.errors[0].defaultMessage);
        } else if (res.data?.message?.includes('already exists')) {
          toast.error('Email already exists. Try another.');
        } else {
          toast.error('Invalid input. Please check the form.');
        }
      } else {
        toast.error('Registration failed — unknown error.');
      }
    } finally {
      setLoading(false); // 🔵 Stop loading
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name:</label><br />
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ marginTop: '10px' }}>
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

          <div style={{ marginTop: '10px' }}>
            <label>Confirm Password:</label><br />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
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

          <div style={{ marginTop: '10px' }}>
            <label>Role:</label><br />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="SALES">SALES</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <button type="submit" style={{ marginTop: '15px' }} disabled={loading}>
            {loading ? 'Please wait...' : 'Register'}
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterPage;
