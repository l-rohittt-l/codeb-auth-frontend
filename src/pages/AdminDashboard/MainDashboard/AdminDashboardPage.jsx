import React, { useEffect, useState } from 'react';
import Navbar from '../../../components/Navbar';
import Sidebar from '../../../components/Sidebar';
import styles from './adminDashboard.module.css';
import { Users, Link2, ArrowUpCircle, ShieldCheck, MapPin, FileText } from 'lucide-react'; // 🆕 Added FileText icon
import api from '../../../axios';

const AdminDashboardPage = () => {
  const [totalGroups, setTotalGroups] = useState(0);
  const [totalChains, setTotalChains] = useState(0);
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalZones, setTotalZones] = useState(0); // 🆕 Zone KPI

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      const groupRes = await api.get('/api/groups/total');
      const chainRes = await api.get('/api/chains/total');
      const brandRes = await api.get('/api/brands');
      const zoneRes = await api.get('/api/zones/total'); // 🆕

      setTotalGroups(groupRes.data.total);
      setTotalChains(chainRes.data.total);
      setTotalBrands(brandRes.data.length);
      setTotalZones(zoneRes.data.total); // 🆕
    } catch (err) {
      console.error('Failed to fetch totals', err);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar role="ADMIN" />

      <div className={styles.dashboardWrapper} style={{ marginLeft: '240px' }}>
        <h2>Welcome, Admin</h2>

        {/* ✅ KPI Cards */}
        <div className={styles.kpiRow}>
          <div className={styles.kpiCard}>
            <h4>Total Groups</h4>
            <p>{totalGroups}</p>
          </div>
          <div className={styles.kpiCard}>
            <h4>Total Chains</h4>
            <p>{totalChains}</p>
          </div>
          <div className={styles.kpiCard}>
            <h4>Total Brands</h4>
            <p>{totalBrands}</p>
          </div>
          <div className={styles.kpiCard}>
            <h4>Total Zones</h4>
            <p>{totalZones}</p>
          </div>
        </div>

        {/* ✅ Management Cards */}
        <div className={styles.cardGrid}>
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <ShieldCheck size={36} color="#ffc107" />
            </div>
            <h4>Manage Roles</h4>
            <p>Promote or demote users between Admin and Sales roles.</p>
            <a href="/admin/manage-roles" className={styles.link}>
              Manage Roles
            </a>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <Users size={36} />
            </div>
            <h4>Group Management</h4>
            <p>Add, edit, and delete customer groups from the system.</p>
            <a href="/groups/dashboard" className={styles.link}>
              Go to Groups
            </a>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <Link2 size={36} />
            </div>
            <h4>Chain Management</h4>
            <p>Add, edit, and delete customer chains from the system.</p>
            <a href="/chains/dashboard" className={styles.link}>
              Go to Chains
            </a>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <ArrowUpCircle size={36} color="#17a2b8" />
            </div>
            <h4>Brand Management</h4>
            <p>Add, edit, and delete brands linked to companies (chains).</p>
            <a href="/brands" className={styles.link}>
              Go to Brands
            </a>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <MapPin size={36} color="#20c997" />
            </div>
            <h4>Zone Management</h4>
            <p>Add, edit, and delete subzones linked to brands.</p>
            <a href="/zones" className={styles.link}>
              Go to Zones
            </a>
          </div>

          {/* 🧾 Estimate Management Card */}
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <FileText size={36} color="#6610f2" />
            </div>
            <h4>Estimate Management</h4>
            <p>Create and manage client service estimates for invoicing.</p>
            <a href="/estimates" className={styles.link}>
              Go to Estimates
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
