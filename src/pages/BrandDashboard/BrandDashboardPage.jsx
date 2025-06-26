import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axios";
import Navbar from "../../components/Navbar";
import styles from "./BrandDashboard.module.css";
import { toast } from "react-toastify";

const BrandDashboardPage = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [groups, setGroups] = useState([]);
  const [chains, setChains] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedChain, setSelectedChain] = useState("");

  const fetchBrands = async () => {
    try {
      const res = await api.get("/api/brands");
      setBrands(res.data.sort((a, b) => {
  // Put active brands before inactive
  return (b.active === true) - (a.active === true);
}));

    } catch (err) {
      console.error("Error fetching brands", err);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await api.get("/api/groups/all");
      setGroups(res.data);
    } catch (err) {
      console.error("Error fetching groups", err);
    }
  };

  const fetchChains = async () => {
    try {
      const res = await api.get("/api/chains");
      setChains(res.data);
    } catch (err) {
      console.error("Error fetching chains", err);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchGroups();
    fetchChains();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      await api.delete(`/api/brands/${id}`);
      toast.success("Brand deleted successfully");
      fetchBrands();
    } catch (err) {
      toast.error("Delete failed. Brand may be linked to zones.");
    }
  };

  const handleReactivate = async (id) => {
    try {
      await api.put(`/api/brands/${id}/reactivate`);
      toast.success("Brand reactivated successfully");
      fetchBrands();
    } catch (err) {
      toast.error("Reactivation failed");
    }
  };

  const filteredBrands = brands.filter((brand) => {
    const chain = chains.find((c) => c.chainId === brand.chainId);
    const groupMatch =
      !selectedGroup ||
      (chain && chain.group && chain.group.groupName === selectedGroup);
    const chainMatch =
      !selectedChain ||
      (chain && chain.companyName === selectedChain);
    return groupMatch && chainMatch;
  });

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.topBar}>
          <h2>Brand Dashboard</h2>
          <button
            className={styles.addBtn}
            onClick={() => navigate("/brands/add")}
          >
            + Add Brand
          </button>
        </div>

        <div className={styles.filters}>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Filter by Group</option>
            {groups.map((group) => (
              <option key={group.groupId} value={group.groupName}>
                {group.groupName}
              </option>
            ))}
          </select>

          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
          >
            <option value="">Filter by Company</option>
            {chains.map((chain) => (
              <option key={chain.chainId} value={chain.companyName}>
                {chain.companyName}
              </option>
            ))}
          </select>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Brand ID</th>
              <th>Brand Name</th>
              <th>Company</th>
              <th>Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => {
              const chain = chains.find((c) => c.chainId === brand.chainId);
              const groupName = chain?.group?.groupName || "N/A";

              return (
                <tr key={brand.brandId}>
                  <td>{brand.brandId}</td>
                  <td>{brand.brandName}</td>
                  <td>{chain?.companyName}</td>
                  <td>{groupName}</td>
                  <td>
                    {brand.active ? (
                      <>
                        <button
                          onClick={() => navigate(`/brands/edit/${brand.brandId}`)}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(brand.brandId)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        style={{ backgroundColor: "green", color: "white" }}
                        onClick={() => handleReactivate(brand.brandId)}
                      >
                        Reactivate
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default BrandDashboardPage;
