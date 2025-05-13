import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditChain = () => {
  const { id } = useParams();
  const [chainName, setChainName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChain = async () => {
      try {
        const res = await axios.get(`https://codeb-ims.onrender.com/api/chains/${id}`, {
          withCredentials: true,
        });
        setChainName(res.data.chainName);
      } catch {
        setError("Failed to load chain.");
      }
    };
    fetchChain();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!chainName.trim()) {
      setError("Chain name cannot be empty.");
      return;
    }

    try {
      await axios.put(
        `https://codeb-ims.onrender.com/api/chains/${id}`,
        { chainName: chainName.trim() },
        { withCredentials: true }
      );
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
        <button type="submit" className="btn btn-success">Update Chain</button>
      </form>
    </div>
  );
};

export default EditChain;
