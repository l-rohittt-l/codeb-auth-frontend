import { toast } from 'react-toastify';

// Optional: You can import `useNavigate` in components, not in this utility

export const logout = () => {
  try {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');

    // Optional toast notification
    toast.success('Logged out successfully');

    // Redirect to login
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error.message);
  }
};
