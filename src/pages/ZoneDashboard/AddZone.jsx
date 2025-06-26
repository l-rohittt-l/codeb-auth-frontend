import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios";
import Navbar from "../../components/Navbar";
import styles from "./ZoneDashboardPage.module.css";
import { toast } from "react-toastify";

const AddZone = () => {
  const [zoneName, setZoneName] = useState("");
  const [brands, setBrands] = useState([]);
  const [brandId, setBrandId] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await api.get("/api/brands");
      setBrands(res.data);
    } catch (err) {
      toast.error("Failed to fetch brands");
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
      await api.post("/api/zones", {
        zoneName: zoneName.trim(),
        brandId: parseInt(brandId),
      });
      toast.success("Zone added successfully");
      navigate("/zones");
    } catch (err) {
      toast.error("Failed to add zone.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.form}>
        <h2>Add Zone</h2>
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
            {loading ? "Please wait..." : "Save Zone"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddZone;
