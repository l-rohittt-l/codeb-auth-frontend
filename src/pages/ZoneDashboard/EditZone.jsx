import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../axios";
import Navbar from "../../components/Navbar";
import styles from "./ZoneDashboardPage.module.css";
import { toast } from "react-toastify";

const EditZone = () => {
  const { id } = useParams();
  const [zoneName, setZoneName] = useState("");
  const [brands, setBrands] = useState([]);
  const [brandId, setBrandId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchZone();
    fetchBrands();
  }, []);

  const fetchZone = async () => {
    try {
      const res = await api.get(`/api/zones/${id}`);
      setZoneName(res.data.zoneName);
      setBrandId(res.data.brand.brandId);
    } catch (err) {
      toast.error("Zone not found.");
      navigate("/zones");
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await api.get("/api/brands");
      setBrands(res.data);
    } catch (err) {
      toast.error("Failed to fetch brands.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!zoneName.trim() || !brandId) {
      toast.error("Zone name and Brand are required.");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/api/zones/${id}`, {
        zoneName: zoneName.trim(),
        brandId: parseInt(brandId),
      });
      toast.success("Zone updated successfully");
      navigate("/zones");
    } catch (err) {
      toast.error("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.form}>
        <h2>Edit Zone</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Zone Name</label>
            <input
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Select Brand</label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              required
            >
              <option value="">-- Select Brand --</option>
              {brands.map((brand) => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className={styles.addBtn} disabled={loading}>
            {loading ? "Please wait..." : "Update Zone"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditZone;
