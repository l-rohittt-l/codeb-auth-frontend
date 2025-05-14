import React, { useState, useEffect } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";

const AddChain = () => {
  const [chainName, setChainName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get("/api/groups");
        setGroups(res.data);
      } catch {
        setError("Failed to load groups.");
      }
    };
    fetchGroups();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chainName.trim()) return setError("Chain name cannot be empty.");
    if (!groupId) return setError("Please select a group.");

    try {
      await api.post("/api/chains", {
        chainName: chainName.trim(),
        groupId: parseInt(groupId),
      });
      navigate("/chains/dashboard");
    } catch (err) {
      setError(err.response?.data || "Error adding chain.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Chain</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Chain Name</label>
          <input
            type="text"
            className="form-control"
            value={chainName}
            onChange={(e) => setChainName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Select Group</label>
          <select
            className="form-select"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          >
            <option value="">-- Select Group --</option>
            {groups.map((group) => (
              <option key={group.groupId} value={group.groupId}>
                {group.groupName}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Add Chain</button>
      </form>
    </div>
  );
};

export default AddChain;
