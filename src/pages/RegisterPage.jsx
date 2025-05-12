import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';


const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'SALES',
    status: 'active'
  });

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await axios.post('https://codeb-ims.onrender.com/api/register', formData);
      setSuccessMsg('Registration successful');
      console.log('Register success:', response.data);
    } catch (error) {
  console.error('Register failed:', error.response?.data || error.message);

  const res = error.response;

  if (!res) {
    setErrorMsg('Network error or server not reachable.');
  } else if (res.status === 401) {
    setErrorMsg('Invalid input or password does not meet requirements.');
  } else if (res.status === 400) {
    if (res.data?.errors?.length) {
      setErrorMsg(res.data.errors[0].defaultMessage); // backend validation
    } else if (res.data?.message?.includes('already exists')) {
      setErrorMsg('Email already exists. Try another.');
    } else {
      setErrorMsg('Invalid input. Please check the form.');
    }
  } else {
    setErrorMsg('Registration failed — unknown error.');
  }
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
          <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Password:</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Role:</label><br />
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="SALES">SALES</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button type="submit" style={{ marginTop: '15px' }}>Register</button>
      </form>

      {successMsg && <p style={{ marginTop: '15px', color: 'green' }}>{successMsg}</p>}
      {errorMsg && <p style={{ marginTop: '15px', color: 'crimson' }}>{errorMsg}</p>}
    </div>
    </>
  );
};

export default RegisterPage;
