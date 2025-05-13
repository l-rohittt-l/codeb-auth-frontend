import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddChain = () => {
  const [chainName, setChainName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chainName.trim()) {
      setError("Chain name cannot be empty.");
      return;
    }

    try {
      await axios.post(
        "https://codeb-ims.onrender.com/api/chains",
        { chainName: chainName.trim() },
        { withCredentials: true }
      );

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
        <button type="submit" className="btn btn-primary">Add Chain</button>
      </form>
    </div>
  );
};

export default AddChain;
