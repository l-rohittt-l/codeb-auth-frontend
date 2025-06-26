import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../axios';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';
import styles from './register.module.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await api.post(`/api/otp/send?email=${email}`);
      toast.success('OTP sent to your email');

      sessionStorage.setItem('registerData', JSON.stringify(formData));
      navigate(`/verify-otp?email=${encodeURIComponent(email)}&mode=register`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles['register-page-wrapper']}>
        <div className={styles['left-form']}>
          <div className={styles['register-container']}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
              />

              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="username" 
              />

              <label htmlFor="password">Password:</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 8 characters"
                autoComplete="new-password" // ✅ fix
              />
              <div className={styles['password-toggle-container']}>
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="showPassword">Show Password</label>
              </div>

              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password" // ✅ fix
              />
              <div className={styles['password-toggle-container']}>
                <input
                  type="checkbox"
                  id="showConfirmPassword"
                  checked={showConfirmPassword}
                  onChange={() => setShowConfirmPassword(!showConfirmPassword)}
                />
                <label htmlFor="showConfirmPassword">Show Confirm Password</label>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Register'}
              </button>
            </form>

            <p className={styles['below-link']}>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
        </div>
        <div className={styles['right-image']}>
          <img src="/register-art.png" alt="Registration Illustration" />
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
