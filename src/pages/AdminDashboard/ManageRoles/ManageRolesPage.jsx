// src/pages/Admin/ManageRolesPage.jsx
import React, { useEffect, useState } from 'react';
import api from '../../../axios';
import Navbar from '../../../components/Navbar';
import { toast } from 'react-toastify';
import styles from './ManageRoles.module.css';

const ManageRolesPage = () => {
  const [salesUsers, setSalesUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const salesRes = await api.get('/api/admin/sales-users');
      const adminRes = await api.get('/api/admin/admin-users');
      setSalesUsers(salesRes.data);
      setAdminUsers(adminRes.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const promoteToAdmin = async (userId) => {
    try {
      await api.put(`/api/admin/promote/${userId}`);
      toast.success('User promoted to ADMIN');
      fetchUsers();
    } catch {
      toast.error('Promotion failed');
    }
  };

  const demoteToSales = async (userId) => {
    try {
      await api.put(`/api/admin/demote/${userId}`);
      toast.success('User demoted to SALES');
      fetchUsers();
    } catch {
      toast.error('Demotion failed');
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        {/* SALES USERS COLUMN */}
        <div className={styles.column}>
          <h2>Sales Users</h2>
          {salesUsers.length === 0 ? (
            <p className={styles.empty}>No SALES users found.</p>
          ) : (
            salesUsers.map(user => (
              <div key={user.user_id} className={styles.card}>
                <p><strong>{user.full_name}</strong></p>
                <p>{user.email}</p>
                <button className={styles.promote} onClick={() => promoteToAdmin(user.user_id)}>
                  Promote to Admin
                </button>
              </div>
            ))
          )}
        </div>

        {/* ADMIN USERS COLUMN */}
        <div className={styles.column}>
          <h2>Admin Users</h2>
          {adminUsers.length === 0 ? (
            <p className={styles.empty}>No ADMIN users found.</p>
          ) : (
            adminUsers.map(user => (
              <div key={user.user_id} className={styles.card}>
                <p><strong>{user.full_name}</strong></p>
                <p>{user.email}</p>
                <button className={styles.demote} onClick={() => demoteToSales(user.user_id)}>
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

export default ManageRolesPage;
