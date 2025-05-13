import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      setError("Group name cannot be empty.");
      return;
    }

    try {
      await axios.post(
        "https://codeb-ims.onrender.com/api/groups",
        { groupName: groupName.trim() },
        { withCredentials: true } // ✅ Required for session cookie
      );

      navigate("/groups/dashboard");
    } catch (err) {
      setError(err.response?.data || "Error adding group.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Group</h2>
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
        <button type="submit" className="btn btn-primary">Add Group</button>
      </form>
    </div>
  );
};

export default AddGroup;
