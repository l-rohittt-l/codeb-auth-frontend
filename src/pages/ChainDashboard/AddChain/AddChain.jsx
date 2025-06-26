import React, { useEffect, useState } from "react";
import api from "../../../axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import styles from "./AddChain.module.css";

const AddChain = () => {
  const [companyName, setCompanyName] = useState("");
  const [gstn, setGstn] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await api.get("/api/groups");
        setGroups(res.data);
      } catch {
        setError("Failed to load groups.");
      }
    };
    fetchGroups();
  }, []);

  const validateGSTN = (gstn) => {
    const gstnRegex = /^[0-9A-Z]{15}$/;
    return gstnRegex.test(gstn);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!companyName.trim()) {
      setError("Company name cannot be empty.");
      return;
    }

    if (!gstn.trim()) {
      setError("GSTN cannot be empty.");
      return;
    }

    if (!validateGSTN(gstn.trim().toUpperCase())) {
      setError("GSTN must be 15 uppercase alphanumeric characters.");
      return;
    }

    if (!groupId) {
      setError("Please select a group.");
      return;
    }

    try {
      await api.post("/api/chains", {
        companyName: companyName.trim(),
        gstn: gstn.trim().toUpperCase(),
        groupId: parseInt(groupId),
      });
      navigate("/chains/dashboard");
    } catch (err) {
      setError(err.response?.data || "Error adding company.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h2>Add Company</h2>
          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>GSTN</label>
              <input
                type="text"
                value={gstn}
                onChange={(e) => setGstn(e.target.value.toUpperCase())}
                maxLength={15}
                placeholder="15 uppercase characters"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Select Group</label>
              <select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
                <option value="">-- Select Group --</option>
                {groups.map((group) => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.groupName}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Add Company
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddChain;
