import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ full_name: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        withCredentials: true
      });
      setUser(response.data);
      setForm({ full_name: response.data.full_name, newPassword: '' });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) {
      toast.error('Full name is required');
      return;
    }

    if (form.newPassword && form.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, form, {
        withCredentials: true
      });
      toast.success('Profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error('Update failed:', error.response?.data || error.message);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setForm({ full_name: user.full_name, newPassword: '' });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>My Profile</h2>

      {!user ? (
        <p>Loading...</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <div>
            <label><strong>Full Name:</strong></label><br />
            {editMode ? (
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              />
            ) : (
              <p>{user.full_name}</p>
            )}
          </div>

          <div>
            <label><strong>Email:</strong></label>
            <p>{user.email}</p>
          </div>

          <div>
            <label><strong>Role:</strong></label>
            <p>{user.role}</p>
          </div>

          <div>
            <label><strong>Status:</strong></label>
            <p>{user.status}</p>
          </div>

          {editMode && (
            <div>
              <label><strong>New Password (optional):</strong></label><br />
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
              />
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 14px', marginRight: '10px' }}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  style={{ padding: '8px 14px' }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 14px' }}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
