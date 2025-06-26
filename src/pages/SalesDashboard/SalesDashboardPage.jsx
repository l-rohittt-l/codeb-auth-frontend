import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import styles from './SalesDashboard.module.css';
import { Users, Link2, ArrowUpCircle, MapPin, FileText } from 'lucide-react'; // 🆕 FileText for estimates icon
import api from '../../axios';

const SalesDashboardPage = () => {
  const [totalGroups, setTotalGroups] = useState(0);
  const [totalChains, setTotalChains] = useState(0);
  const [totalBrands, setTotalBrands] = useState(0);
  const [totalZones, setTotalZones] = useState(0);

  useEffect(() => {
    fetchKpis();
  }, []);

  const fetchKpis = async () => {
    try {
      const groupRes = await api.get('/api/groups/total');
      const chainRes = await api.get('/api/chains/total');
      const brandRes = await api.get('/api/brands');
      const zoneRes = await api.get('/api/zones/total');

      setTotalGroups(groupRes.data.total);
      setTotalChains(chainRes.data.total);
      setTotalBrands(brandRes.data.length);
      setTotalZones(zoneRes.data.total);
    } catch (err) {
      console.error('Failed to fetch KPIs', err);
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar role="SALES" />

      <div className={styles.dashboardWrapper} style={{ marginLeft: '240px' }}>
        <h2>Welcome, Sales Executive</h2>
        <p>You can manage brands, chains, groups, and subzones from here.</p>

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
              <Users size={36} />
            </div>
            <h4>Group Management</h4>
            <p>View and manage customer groups.</p>
            <a href="/groups/dashboard" className={styles.link}>
              Go to Groups
            </a>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <Link2 size={36} />
            </div>
            <h4>Chain Management</h4>
            <p>View and manage company chains under groups.</p>
            <a href="/chains/dashboard" className={styles.link}>
              Go to Chains
            </a>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <ArrowUpCircle size={36} color="#17a2b8" />
            </div>
            <h4>Brand Management</h4>
            <p>View and manage brands linked to companies.</p>
            <a href="/brands" className={styles.link}>
              Go to Brands
            </a>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <MapPin size={36} color="#20c997" />
            </div>
            <h4>Zone Management</h4>
            <p>View and manage subzones under each brand.</p>
            <a href="/zones" className={styles.link}>
              Go to Zones
            </a>
          </div>

          {/* 🆕 Estimate Management Card */}
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <FileText size={36} color="#6f42c1" />
            </div>
            <h4>Estimate Management</h4>
            <p>View, edit, and manage all project estimates.</p>
            <a href="/estimates" className={styles.link}>
              Go to Estimates
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesDashboardPage;
