import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('role');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Backend logout failed:', error.message);
    }

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const goToDashboard = () => {
    if (userRole === 'ADMIN') navigate('/admin/dashboard');
    else if (userRole === 'SALES') navigate('/sales/dashboard');
    else navigate('/dashboard');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  // 🧠 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav style={{
      background: '#222',
      padding: '10px 20px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      <div
        onClick={() => navigate('/')}
        style={{ fontSize: '24px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        CodeB
      </div>

      {isAuthenticated && (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(prev => !prev)}
            style={{ cursor: 'pointer', fontSize: '16px', userSelect: 'none' }}
          >
            Profile ▾
          </div>

          {showDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              backgroundColor: '#333',
              border: '1px solid #444',
              borderRadius: '4px',
              marginTop: '5px',
              minWidth: '160px',
              zIndex: 1000
            }}>
              <div
                onClick={goToDashboard}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #444'
                }}
              >
                Dashboard
              </div>
              <div
                onClick={goToProfile}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #444'
                }}
              >
                My Profile
              </div>
              <div
                onClick={handleLogout}
                style={{
                  padding: '8px 12px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
