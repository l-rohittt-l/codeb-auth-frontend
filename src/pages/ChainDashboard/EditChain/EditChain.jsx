import React, { useEffect, useState } from "react";
import api from "../../../axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import styles from "./EditChain.module.css";

const EditChain = () => {
  const { id } = useParams();
  const [companyName, setCompanyName] = useState("");
  const [gstn, setGstn] = useState("");
  const [groupId, setGroupId] = useState("");
  const [groups, setGroups] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      
      try {
        setIsLoading(true);
        const [groupRes, chainRes] = await Promise.all([
          api.get("/api/groups"),
          api.get(`/api/chains/${id}`),
        ]);

        console.log("Group Data:", groupRes.data);
      console.log("Chain Data:", chainRes.data);
        if (groupRes.data && chainRes.data) {
          setGroups(groupRes.data);
          setCompanyName(chainRes.data.companyName);
          setGstn(chainRes.data.gstn);
          setGroupId(chainRes.data.group?.groupId || "");
        } else {
          setError("Failed to load company or groups.");
        }
      } catch (err) {
        setError("Failed to load company or groups.");
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

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
      await api.put(`/api/chains/${id}`, {
        companyName: companyName.trim(),
        gstn: gstn.trim().toUpperCase(),
        groupId: parseInt(groupId),
      });
      navigate("/chains/dashboard");
    } catch (err) {
      setError(err.response?.data || "Error updating company.");
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className={styles.wrapper}>
          <div className={styles.card}>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h2>Edit Company</h2>
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
              <select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              >
                <option value="">-- Select Group --</option>
                {groups.map((group) => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.groupName}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Update Company
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditChain;
