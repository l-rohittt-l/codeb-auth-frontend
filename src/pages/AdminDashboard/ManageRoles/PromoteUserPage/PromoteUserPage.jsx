import React, { useEffect, useState } from 'react';
import api from '../../../../axios';
import Navbar from '../../../../components/Navbar';
import { toast } from 'react-toastify';
import styles from './PromoteUser.module.css';

const PromoteUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSalesUsers = async () => {
    try {
      const response = await api.get('/api/admin/sales-users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const promoteUser = async (userId) => {
    try {
      await api.put(`/api/admin/promote/${userId}`);
      toast.success('User promoted to ADMIN');
      fetchSalesUsers(); // refresh list
    } catch (error) {
      toast.error('Promotion failed');
    }
  };

  useEffect(() => {
    fetchSalesUsers();
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <h2 className={styles.pageTitle}>Promote Sales Users to Admin</h2>
        {users.length === 0 ? (
          <p className={styles.emptyText}>No SALES users found.</p>
        ) : (
          <div className={styles.cardGrid}>
            {users.map((user) => (
              <div key={user.user_id} className={styles.userCard}>
                <p><strong>Name:</strong> {user.full_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <button onClick={() => promoteUser(user.user_id)}>
                  Promote to Admin
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PromoteUserPage;
