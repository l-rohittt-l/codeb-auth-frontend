import React, { useEffect, useState } from "react";
import axios from "axios";

const GroupDashboard = () => {
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");

  // Fetch groups
  const fetchGroups = async () => {
    try {
      const res = await axios.get("https://codeb-ims.onrender.com/api/groups");
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

    // You can check chain linkage from a backend flag or hardcode for now
    const isLinked = false;

    try {
      await axios.delete(`https://codeb-ims.onrender.com/api/groups/${id}?isLinked=${isLinked}`);
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, index) => (
            <tr key={group.id}>
              <td>{index + 1}</td>
              <td>{group.groupName}</td>
              <td>
                <a href={`/groups/edit/${group.id}`} className="btn btn-warning btn-sm me-2">Edit</a>
                <button onClick={() => handleDelete(group.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {groups.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">No groups found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GroupDashboard;
