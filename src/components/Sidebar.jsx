import React from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = ({ role }) => {
  return (
    <div className={styles.sidebar}>
      <h3 className={styles.title}>Dashboard</h3>
      <ul className={styles.menu}>
        {role === "ADMIN" && (
          <>
            <li><Link to="/admin/manage-roles">Manage Roles</Link></li>
            <li><Link to="/groups/dashboard">Groups</Link></li>
            <li><Link to="/chains/dashboard">Chains</Link></li>
            <li><Link to="/brands">Brands</Link></li>
          </>
        )}
        {role === "SALES" && (
          <>
            <li><Link to="/sales/dashboard">My Dashboard</Link></li>
            <li><Link to="/brands">Brands</Link></li>
          </>
        )}
        <li><Link to="/profile">My Profile</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
