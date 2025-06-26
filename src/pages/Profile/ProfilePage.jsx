import React, { useEffect, useState } from 'react';
import api from '../../axios';
import { toast } from 'react-toastify';
import styles from './ProfilePage.module.css';
import Navbar from '../../components/Navbar';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ full_name: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/profile');
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
      await api.put('/api/profile', form);
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
    <>
      <Navbar />
      <div className={styles['profile-wrapper']}>
        <div className={styles['profile-card']}>
          <h2>My Profile</h2>

          {!user ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className={styles['profile-item']}>
                <label>Change Full Name:</label>
                {editMode ? (
                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{user.full_name}</p>
                )}
              </div>

              <div className={styles['profile-item']}>
                <label>Email:</label>
                <p>{user.email}</p>
              </div>

              <div className={styles['profile-item']}>
                <label>Role:</label>
                <p>{user.role}</p>
              </div>

              <div className={styles['profile-item']}>
                <label>Status:</label>
                <p>{user.status}</p>
              </div>

              {editMode && (
                <div className={styles['profile-item']}>
                  <label>Change Password:</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className={styles['button-group']}>
                {editMode ? (
                  <>
                    <button
                      className={styles['save-btn']}
                      onClick={handleSave}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      className={styles['cancel-btn']}
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className={styles['edit-btn']}
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
