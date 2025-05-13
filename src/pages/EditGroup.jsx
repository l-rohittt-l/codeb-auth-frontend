import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditGroup = () => {
  const { id } = useParams();
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load group data on mount
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`https://codeb-ims.onrender.com/api/groups/${id}`, {
          withCredentials: true // ✅ include session cookie
        });
        setGroupName(res.data.groupName);
      } catch {
        setError("Failed to load group.");
      }
    };
    fetchGroup();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("Group name cannot be empty.");
      return;
    }

    try {
      await axios.put(
        `https://codeb-ims.onrender.com/api/groups/${id}`,
        { groupName: groupName.trim() },
        { withCredentials: true } // ✅ include session cookie
      );
      navigate("/groups/dashboard");
    } catch (err) {
      setError(err.response?.data || "Error updating group.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Group</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Group Name</label>
          <input
            type="text"
            className="form-control"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success">Update Group</button>
      </form>
    </div>
  );
};

export default EditGroup;
