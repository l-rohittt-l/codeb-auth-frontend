// src/utils/logout.js
import axios from 'axios';

export const logout = async () => {
  try {
    // Call Spring Boot logout endpoint
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/logout`, {}, { withCredentials: true });
  } catch (error) {
    console.error('Backend logout failed (possibly already expired):', error.message);
  }

  // Clear frontend state
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('role');
};
