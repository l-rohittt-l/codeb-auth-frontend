import React, { useEffect, useState } from "react";
import api from "../axios";
import { useNavigate, useParams } from "react-router-dom";

const EditChain = () => {
  const { id } = useParams();
  const [chainName, setChainName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [groupRes, chainRes] = await Promise.all([
          api.get("/api/groups"),
          api.get(`/api/chains/${id}`),
        ]);
        setGroups(groupRes.data);
        setChainName(chainRes.data.chainName);
        setGroupId(chainRes.data.group.groupId); // assuming backend includes group object
      } catch {
        setError("Failed to load chain or groups.");
      }
    };
    fetchInitialData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chainName.trim()) return setError("Chain name cannot be empty.");
    if (!groupId) return setError("Please select a group.");

    try {
      await api.put(`/api/chains/${id}`, {
        chainName: chainName.trim(),
        groupId: parseInt(groupId),
      });
      navigate("/chains/dashboard");
    } catch (err) {
      setError(err.response?.data || "Error updating chain.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Chain</h2>
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

        <button type="submit" className="btn btn-success">Update Chain</button>
      </form>
    </div>
  );
};

export default EditChain;
