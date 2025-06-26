import React, { useEffect, useState } from "react";
import api from "../../../axios";
import Navbar from "../../../components/Navbar"; // ✅ Add this
import styles from "./GroupDashboard.module.css";

const GroupDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

  const fetchGroups = async () => {
    try {
      const res = await api.get("/api/groups/all");
      setGroups(res.data);
    } catch {
      setError("Failed to load groups.");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this group?");
    if (!confirm) return;

    try {
      await api.delete(`/api/groups/${id}`);
      fetchGroups();
    } catch (err) {
      alert(err.response?.data || "Error deleting group.");
    }
  };

  const handleReactivate = async (id) => {
    const confirm = window.confirm("Reactivate this group?");
    if (!confirm) return;

    try {
      await api.put(`/api/groups/${id}/activate`);
      fetchGroups();
    } catch (err) {
      alert(err.response?.data || "Error reactivating group.");
    }
  };

  return (
    <>
      <Navbar /> {/* ✅ Fix: Include Navbar */}
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2>Group Dashboard</h2>
          <a href="/groups/add" className={styles.addButton}>Add Group</a>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div className={styles.grid}>
          {groups.length === 0 ? (
            <p>No groups found.</p>
          ) : (
            groups.map((group) => (
              <div key={group.groupId} className={styles.card}>
                <h4>{group.groupName}</h4>
                <p><strong>Code:</strong> {group.groupCode}</p>
                <span className={`${styles.badge} ${group.active ? styles.active : styles.inactive}`}>
                  {group.active ? "Active" : "Inactive"}
                </span>

                <div className={styles.buttonGroup}>
                  {group.active ? (
                    <>
                      <a href={`/groups/edit/${group.groupId}`} className={styles.editBtn}>Edit</a>
                      <button onClick={() => handleDelete(group.groupId)} className={styles.deleteBtn}>
                        Delete
                      </button>
                    </>
                  ) : (
                    <button onClick={() => handleReactivate(group.groupId)} className={styles.reactivateBtn}>
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default GroupDashboard;
