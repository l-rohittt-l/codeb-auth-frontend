import React, { useEffect, useState } from "react";
import axios from "axios";

const ChainDashboard = () => {
  const [chains, setChains] = useState([]);
  const [error, setError] = useState("");

  const fetchChains = async () => {
    try {
      const res = await axios.get("https://codeb-ims.onrender.com/api/chains", {
        withCredentials: true,
      });
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
      await axios.delete(`https://codeb-ims.onrender.com/api/chains/${id}`, {
        withCredentials: true,
      });
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {chains.map((chain, index) => (
            <tr key={chain.id}>
              <td>{index + 1}</td>
              <td>{chain.chainName}</td>
              <td>
                <a href={`/chains/edit/${chain.id}`} className="btn btn-warning btn-sm me-2">Edit</a>
                <button onClick={() => handleDelete(chain.id)} className="btn btn-danger btn-sm">
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {chains.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">No chains found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ChainDashboard;
