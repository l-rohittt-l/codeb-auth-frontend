import React, { useEffect, useState } from "react";
import api from "../../../axios";
import Navbar from "../../../components/Navbar";
import styles from "./ChainDashboard.module.css";
import { Filter, Plus, Edit, Trash2, RefreshCw } from "lucide-react";

const ChainDashboard = () => {
  const [chains, setChains] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchGroups = async () => {
    try {
      const res = await api.get("/api/groups");
      setGroups(res.data);
    } catch {
      setError("Failed to load groups.");
    }
  };

  const fetchChains = async (groupId = null) => {
    setIsLoading(true);
    try {
      let url = "/api/chains";
      if (groupId) {
        url += `?groupId=${groupId}`;
      }
      const res = await api.get(url);
      const sortedChains = res.data.sort((a, b) => b.active - a.active);
      setChains(sortedChains);
      setError("");
    } catch (err) {
      setError("Failed to load companies.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
    fetchChains();
  }, []);

  const handleGroupFilterChange = (groupId) => {
    setSelectedGroupId(groupId);
    fetchChains(groupId);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      await api.delete(`/api/chains/${id}`);
      fetchChains(selectedGroupId);
    } catch (err) {
      alert(err.response?.data || "Error deleting company.");
    }
  };

  const handleReactivate = async (id) => {
    try {
      await api.put(`/api/chains/${id}/reactivate`);
      fetchChains(selectedGroupId);
    } catch (err) {
      alert(err.response?.data || "Error reactivating company.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Filter size={18} />
            <h3>Filter by Group</h3>
          </div>
          <ul className={styles.groupList}>
            <li
              className={`${styles.groupItem} ${
                selectedGroupId === null ? styles.activeGroup : ""
              }`}
              onClick={() => handleGroupFilterChange(null)}
            >
              All Groups
            </li>
            {groups.map((group) => (
              <li
                key={group.groupId}
                className={`${styles.groupItem} ${
                  selectedGroupId === group.groupId ? styles.activeGroup : ""
                }`}
                onClick={() => handleGroupFilterChange(group.groupId)}
              >
                {group.groupName}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <h1>Company Dashboard</h1>
            <a href="/chains/add" className={styles.addButton}>
              <Plus size={16} />
              Add Company
            </a>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          {isLoading ? (
            <div className={styles.loadingState}>Loading companies...</div>
          ) : chains.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No companies found</p>
              <a href="/chains/add" className={styles.addButton}>
                <Plus size={16} />
                Add Your First Company
              </a>
            </div>
          ) : (
            <div className={styles.companyGrid}>
              {chains.map((chain) => (
                <div
                  key={chain.chainId}
                  className={`${styles.companyCard} ${
                    !chain.active ? styles.inactiveCard : ""
                  }`}
                >
                  <div className={styles.cardHeader}>
                    <h3>{chain.companyName}</h3>
                    <span
                      className={`${styles.statusBadge} ${
                        chain.active ? styles.activeBadge : styles.inactiveBadge
                      }`}
                    >
                      {chain.active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className={styles.cardDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Group:</span>
                      <span>{chain.group?.groupName || "—"}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>GSTN:</span>
                      <span>{chain.gstn}</span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    {chain.active ? (
                      <>
                        <a
                          href={`/chains/edit/${chain.chainId}`}
                          className={styles.actionButton}
                        >
                          <Edit size={14} />
                          Edit
                        </a>
                        <button
                          onClick={() => handleDelete(chain.chainId)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleReactivate(chain.chainId)}
                        className={`${styles.actionButton} ${styles.reactivateButton}`}
                      >
                        <RefreshCw size={14} />
                        Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChainDashboard;