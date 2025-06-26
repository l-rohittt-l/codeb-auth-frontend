import React, { useState, useEffect } from 'react';
import api from '../../axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';
import styles from './login.module.css';

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
      // Step 1: Verify credentials
      await api.post("/api/login", formData);

      // Step 2: Send OTP
      await api.post(`/api/otp/send?email=${formData.email}`);
      toast.success('OTP sent to your email');

      // Step 3: Store login data in session
      sessionStorage.setItem('loginData', JSON.stringify(formData));

      // Step 4: Redirect to OTP verification page
      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}&mode=login`);
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
      <div className={styles['login-page-wrapper']}>
        <div className={styles['left-image']}>
          <img src="/login-art.png" alt="Login Visual" />
        </div>

        <div className={styles['right-form']}>
          <div className={styles['login-container']}>
            <div className={styles['login-logo']}>
              <img src="/logo192.png" alt="CodeB Logo" />
            </div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Password:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles['checkbox-container']}>
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="showPassword">Show Password</label>
              </div>

              <div className={styles['below-link']}>
                <a href="/forgot-password">Forgot Password?</a>
              </div>

              <div className={styles['below-link']}>
                <span>Don't have an account? </span>
                <a href="/register">Create one</a>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
