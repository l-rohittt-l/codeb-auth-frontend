import React, { useEffect, useState } from "react";
import api from "../../axios";
import { useNavigate } from "react-router-dom";
import styles from "./EstimateDashboard.module.css";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";

const EstimateDashboard = () => {
  const navigate = useNavigate();
  const [estimates, setEstimates] = useState([]);
  const [brands, setBrands] = useState([]);
  const [groups, setGroups] = useState([]);
  const [brandFilter, setBrandFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");

  const fetchEstimates = async () => {
    try {
      const res = await api.get("/api/estimates");
      setEstimates(res.data);
    } catch {
      toast.error("Failed to load estimates");
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await api.get("/api/brands");
      const names = res.data.map(b => b.brandName);
      setBrands(names);
    } catch {
      toast.error("Failed to load brands");
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await api.get("/api/groups");
      const names = res.data.map(g => g.groupName);
      setGroups(names);
    } catch {
      toast.error("Failed to load groups");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this estimate?")) return;
    try {
      await api.delete(`/api/estimates/${id}`);
      toast.success("Estimate deleted");
      fetchEstimates();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleReactivate = async (id) => {
    try {
      await api.put(`/api/estimates/${id}/reactivate`);
      toast.success("Estimate reactivated");
      fetchEstimates();
    } catch {
      toast.error("Failed to reactivate");
    }
  };

  const filterByBrand = async (brandName) => {
    setBrandFilter(brandName);
    setGroupFilter("");
    try {
      const res = await api.get(`/api/estimates/filter/brand/${brandName}`);
      setEstimates(res.data);
    } catch {
      toast.error("Failed to filter by brand");
    }
  };

  const filterByGroup = async (groupName) => {
    setGroupFilter(groupName);
    setBrandFilter("");
    try {
      const res = await api.get(`/api/estimates/filter/group/${groupName}`);
      setEstimates(res.data);
    } catch {
      toast.error("Failed to filter by group");
    }
  };

  const clearFilters = () => {
    setBrandFilter("");
    setGroupFilter("");
    fetchEstimates();
  };

  useEffect(() => {
    fetchEstimates();
    fetchBrands();
    fetchGroups();
  }, []);

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Estimate Management</h2>

        <div className={styles.buttonGroup}>
          <button className={styles.addBtn} onClick={() => navigate("/estimates/add")}>
            + Create Estimate
          </button>
          {(brandFilter || groupFilter) && (
            <button className={styles.clearBtn} onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>

        <div className={styles.filterContainer}>
          <select value={brandFilter} onChange={(e) => filterByBrand(e.target.value)}>
            <option value="">Filter by Brand</option>
            {brands.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>

          <select value={groupFilter} onChange={(e) => filterByGroup(e.target.value)}>
            <option value="">Filter by Group</option>
            {groups.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Group</th>
              <th>Chain ID</th>
              <th>Brand</th>
              <th>Zone</th>
              <th>Service</th>
              <th>Qty</th>
              <th>Unit ₹</th>
              <th>Total ₹</th>
              <th>Delivery Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((est, index) => (
              <tr key={est.estimatedId}>
                <td>{index + 1}</td>
                <td>{est.groupName}</td>
                <td>{est.chainId}</td>
                <td>{est.brandName}</td>
                <td>{est.zoneName}</td>
                <td>{est.service}</td>
                <td>{est.qty}</td>
                <td>{est.costPerUnit}</td>
                <td>{est.totalCost}</td>
                <td>{est.deliveryDate ? new Date(est.deliveryDate).toLocaleDateString("en-GB") : "N/A"}</td>
                <td>
                  {est.active ? (
                    <>
                      <button
                        className={styles.editBtn}
                        onClick={() => navigate(`/estimates/edit/${est.estimatedId}`)}
                      >
                        Edit
                      </button>

                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(est.estimatedId)}
                      >
                        Delete
                      </button>

                      <button
                        className={styles.generateBtn}
                        onClick={() => navigate(`/invoices/create/${est.estimatedId}`)}
                      >
                        Generate
                      </button>
                    </>
                  ) : (
                    <button
                      className={styles.reactivateBtn}
                      onClick={() => handleReactivate(est.estimatedId)}
                    >
                      Reactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {estimates.length === 0 && (
              <tr>
                <td colSpan="11" className={styles.noData}>No estimates found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EstimateDashboard;
