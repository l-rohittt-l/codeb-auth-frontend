import React, { useEffect, useState } from "react";
import api from "../../axios";
import styles from "./BrandDashboard.module.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddBrandPage = () => {
  const navigate = useNavigate();

  const [brandName, setBrandName] = useState("");
  const [chainId, setChainId] = useState("");
  const [chains, setChains] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchChains = async () => {
    try {
      const res = await api.get("/api/chains");
      setChains(res.data);
    } catch (err) {
      console.error("Error fetching chains", err);
    }
  };

  useEffect(() => {
    fetchChains();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName || !chainId) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/brands", { brandName, chainId });
      toast.success("Brand added successfully");
      navigate("/brands");
    } catch (err) {
      toast.error("Failed to add brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Add New Brand</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="Enter brand name"
          />
        </div>
        <div className={styles.formGroup}>
          <label>Select Company (Chain)</label>
          <select
            value={chainId}
            onChange={(e) => setChainId(e.target.value)}
          >
            <option value="">-- Select Company --</option>
            {chains.map((chain) => (
              <option key={chain.chainId} value={chain.chainId}>
                {chain.companyName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className={styles.addBtn} disabled={loading}>
          {loading ? "Please wait..." : "Add Brand"}
        </button>
      </form>
    </div>
  );
};

export default AddBrandPage;
