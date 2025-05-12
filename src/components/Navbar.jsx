import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav style={{
      background: '#222',
      padding: '10px 20px',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div
        onClick={() => navigate('/')}
        style={{ fontSize: '24px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        CodeB
      </div>
    </nav>
  );
};

export default Navbar;
