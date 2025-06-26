// src/pages/Admin/DemoteUserPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../../../../axios';
import Navbar from '../../../../components/Navbar';
import { toast } from 'react-toastify';
import styles from './DemoteUser.module.css';

const DemoteUserPage = () => {
  const [admins, setAdmins] = useState([]);

  const fetchAdminUsers = async () => {
    try {
      const response = await api.get('/api/admin/admin-users');
      setAdmins(response.data);
    } catch (error) {
      toast.error('Failed to fetch admin users');
    }
  };

  const demoteUser = async (userId) => {
    try {
      await api.put(`/api/admin/demote/${userId}`);
      toast.success('User demoted to SALES');
      fetchAdminUsers(); // Refresh list
    } catch (error) {
      toast.error('Demotion failed');
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <h2>Demote Admin Users to Sales</h2>
        <div className={styles.userList}>
          {admins.length === 0 ? (
            <p>No ADMIN users found.</p>
          ) : (
            admins.map((user) => (
              <div key={user.user_id} className={styles.userCard}>
                <p><strong>Name:</strong> {user.full_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <button onClick={() => demoteUser(user.user_id)}>
                  Demote to Sales
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default DemoteUserPage;
