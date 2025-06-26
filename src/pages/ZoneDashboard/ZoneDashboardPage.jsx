import React, { useEffect, useState } from "react";
import api from "../../axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import styles from "./ZoneDashboardPage.module.css";
import { toast } from "react-toastify";

const ZoneDashboardPage = () => {
  const [zones, setZones] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchZones();
    fetchBrands();
  }, []);

  const fetchZones = async () => {
    try {
      const res = await api.get("/api/zones/all");
      const sorted = [...res.data].sort((a, b) => b.active - a.active);
      setZones(sorted);
    } catch (err) {
      console.error("Failed to fetch zones", err);
      toast.error("Error fetching zones from server.");
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await api.get("/api/brands");
      setBrands(res.data);
    } catch (err) {
      console.error("Failed to fetch brands", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this zone?")) return;
    try {
      await api.delete(`/api/zones/${id}`);
      toast.success("Zone deleted successfully");
      fetchZones();
    } catch (err) {
      toast.error("Failed to delete zone.");
    }
  };

  const handleReactivate = async (id) => {
    try {
      await api.put(`/api/zones/${id}/reactivate`);
      toast.success("Zone reactivated successfully");
      fetchZones();
    } catch (err) {
      toast.error("Failed to reactivate zone.");
    }
  };

  // ✅ Unique dropdown values
  const companies = [...new Set(zones.map((z) => z.companyName))];
  const groups = [...new Set(zones.map((z) => z.groupName))];

  // ✅ Filtering logic
  const filteredZones = zones.filter((zone) => {
    return (
      (selectedBrand === "" || zone.brandName === selectedBrand) &&
      (selectedCompany === "" || zone.companyName === selectedCompany) &&
      (selectedGroup === "" || zone.groupName === selectedGroup)
    );
  });

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <h2>Zone Dashboard</h2>
          <button
            className={styles.addBtn}
            onClick={() => navigate("/zones/add")}
          >
            + Add Zone
          </button>
        </div>

        <div className={styles.filters}>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">Filter by Brand</option>
            {brands.map((brand) => (
              <option key={brand.brandId} value={brand.brandName}>
                {brand.brandName}
              </option>
            ))}
          </select>

          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">Filter by Company</option>
            {companies.map((company, index) => (
              <option key={index} value={company}>
                {company}
              </option>
            ))}
          </select>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Filter by Group</option>
            {groups.map((group, index) => (
              <option key={index} value={group}>
                {group}
              </option>
            ))}
          </select>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Zone Name</th>
              <th>Brand</th>
              <th>Company</th>
              <th>Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredZones.map((zone) => (
              <tr key={zone.zoneId}>
                <td>{zone.zoneId}</td>
                <td>{zone.zoneName}</td>
                <td>{zone.brandName || "N/A"}</td>
                <td>{zone.companyName || "N/A"}</td>
                <td>{zone.groupName || "N/A"}</td>
                <td>
                  {zone.active ? (
                    <>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => navigate(`/zones/edit/${zone.zoneId}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(zone.zoneId)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleReactivate(zone.zoneId)}
                    >
                      Reactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ZoneDashboardPage;