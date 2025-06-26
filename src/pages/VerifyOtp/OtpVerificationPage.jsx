import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../axios';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import styles from './OtpVerificationPage.module.css';

const OtpVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const emailParam = queryParams.get('email');
    const modeParam = queryParams.get('mode');

    if (!emailParam || !modeParam) {
      toast.error('Invalid verification link.');
      navigate('/login');
      return;
    }

    setEmail(emailParam);
    setMode(modeParam);

    if (modeParam === 'register') {
      const stored = sessionStorage.getItem('registerData');
      if (!stored) {
        toast.error('No registration data found. Please register again.');
        navigate('/register');
        return;
      }
      setFormData(JSON.parse(stored));
    } else if (modeParam === 'login') {
      const stored = sessionStorage.getItem('loginData');
      if (!stored) {
        toast.error('No login data found. Please login again.');
        navigate('/login');
        return;
      }
      setFormData(JSON.parse(stored));
    } else if (modeParam === 'invoice') {
      const stored = sessionStorage.getItem('invoiceData');
      if (!stored) {
        toast.error('No invoice data found. Please try again.');
        navigate('/estimates');
        return;
      }
      setFormData(JSON.parse(stored));
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/api/otp/verify', null, {
        params: { email, otp }
      });

      if (res.status === 200) {
        if (mode === 'register') {
          const body = {
            full_name: formData.fullName,
            email: formData.email,
            password: formData.password,
            role: 'SALES',
            status: 'active'
          };

          await api.post('/api/register', body);
          sessionStorage.removeItem('registerData');
          toast.success('Registration successful!');
          navigate('/login');
        }

        else if (mode === 'login') {
          const loginRes = await api.post('/api/login', {
            email: formData.email,
            password: formData.password
          });

          const { token, role } = loginRes.data;
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('isAuthenticated', 'true');

          sessionStorage.removeItem('loginData');
          toast.success('Login successful!');
          navigate(role === 'ADMIN' ? '/admin/dashboard' : '/sales/dashboard');
        }

        else if (mode === 'invoice') {
          await api.post('/api/invoices', formData);
          sessionStorage.removeItem('invoiceData');
          toast.success('Invoice created successfully!');
          navigate('/invoices');
        }

      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.formBox}>
          <h2>Verify OTP</h2>
          <p>An OTP has been sent to <strong>{email}</strong></p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.otpInput}
            />
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default OtpVerificationPage;
