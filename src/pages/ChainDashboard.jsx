import React, { useEffect, useState } from "react";
import api from "../axios"; // ✅ uses centralized JWT axios

const ChainDashboard = () => {
  const [chains, setChains] = useState([]);
  const [error, setError] = useState("");

  const fetchChains = async () => {
    try {
      const res = await api.get("/api/chains");
      setChains(res.data);
    } catch (err) {
      setError("Failed to load chains.");
    }
  };

  useEffect(() => {
    fetchChains();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this chain?");
    if (!confirm) return;

    try {
      await api.delete(`/api/chains/${id}`);
      fetchChains();
    } catch (err) {
      alert(err.response?.data || "Error deleting chain.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Chain Dashboard</h2>
      <a href="/chains/add" className="btn btn-primary mb-3">Add Chain</a>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Chain Name</th>
            <th>Group</th> {/* ✅ New column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {chains.map((chain, index) => (
            <tr key={chain.chainId}>
              <td>{index + 1}</td>
              <td>{chain.chainName}</td>
              <td>{chain.group?.groupName || "—"}</td> {/* ✅ Show group name */}
              <td>
                <a href={`/chains/edit/${chain.chainId}`} className="btn btn-warning btn-sm me-2">Edit</a>
                <button onClick={() => handleDelete(chain.chainId)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {chains.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">No chains found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ChainDashboard;
