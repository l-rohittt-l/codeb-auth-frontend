import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout } from '../utils/logout'; // ✅ central logout utility

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('role');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const goToDashboard = () => {
    if (userRole === 'ADMIN') navigate('/admin/dashboard');
    else if (userRole === 'SALES') navigate('/sales/dashboard');
    else navigate('/dashboard');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

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
      padding: '10px 0',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}>
        <div
          onClick={() => navigate('/')}
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          CodeB
        </div>

        {isAuthenticated && (
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div
              onClick={() => setShowDropdown(prev => !prev)}
              style={{ cursor: 'pointer', fontSize: '16px', userSelect: 'none', color: 'white' }}
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
                    borderBottom: '1px solid #444',
                    color: '#fff'
                  }}
                >
                  Dashboard
                </div>
                <div
                  onClick={goToProfile}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #444',
                    color: '#fff'
                  }}
                >
                  My Profile
                </div>
                <div
                  onClick={logout}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    color: '#fff'
                  }}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
