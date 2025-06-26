import React, { useEffect, useState } from "react";
import api from "../../axios";
import styles from "./BrandDashboard.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditBrandPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const fetchBrand = async () => {
    try {
      const res = await api.get("/api/brands");
      const brand = res.data.find((b) => b.brandId === parseInt(id));
      if (!brand) {
        toast.error("Brand not found");
        return navigate("/brands");
      }
      setBrandName(brand.brandName);
      setChainId(brand.chainId);
    } catch (err) {
      toast.error("Failed to fetch brand");
    }
  };

  useEffect(() => {
    fetchChains();
    fetchBrand();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brandName || !chainId) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/api/brands/${id}`, { brandName, chainId });
      toast.success("Brand updated successfully");
      navigate("/brands");
    } catch (err) {
      toast.error("Failed to update brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Edit Brand</h2>
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
          {loading ? "Please wait..." : "Update Brand"}
        </button>
      </form>
    </div>
  );
};

export default EditBrandPage;
