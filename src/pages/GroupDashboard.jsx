import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../axios"; // adjust path as per your file structure


const GroupDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

  // Fetch all groups (active + inactive)
  const fetchGroups = async () => {
    try {
      const res = await api.get("/api/groups/all");

      setGroups(res.data);
    } catch (err) {
      setError("Failed to load groups.");
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this group?");
    if (!confirm) return;

    const isLinked = false;

    try {
      await api.delete(`/api/groups/${id}?isLinked=${isLinked}`);

      fetchGroups(); // refresh list
    } catch (err) {
      alert(err.response?.data || "Error deleting group.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Group Dashboard</h2>
      <a href="/groups/add" className="btn btn-primary mb-3">Add Group</a>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Group Name</th>
            <th>Group Code</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, index) => (
            <tr
              key={group.groupId}
              style={{
                opacity: group.active ? 1 : 0.5,
                backgroundColor: group.active ? "#fff" : "#f9f9f9"
              }}
            >
              <td>{index + 1}</td>
              <td>{group.groupName}</td>
              <td>{group.groupCode}</td>
              <td>
                <span className={`badge ${group.active ? "bg-success" : "bg-secondary"}`}>
                  {group.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td>
                <a
                  href={`/groups/edit/${group.groupId}`}
                  className="btn btn-warning btn-sm me-2"
                  disabled={!group.active}
                  style={{ pointerEvents: group.active ? "auto" : "none", opacity: group.active ? 1 : 0.5 }}
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(group.groupId)}
                  className="btn btn-danger btn-sm"
                  disabled={!group.active}
                  style={{ pointerEvents: group.active ? "auto" : "none", opacity: group.active ? 1 : 0.5 }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {groups.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">No groups found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GroupDashboard;
