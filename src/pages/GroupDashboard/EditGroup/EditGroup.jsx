import React, { useEffect, useState } from "react";
import api from "../../../axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import styles from "./EditGroup.module.css";

const EditGroup = () => {
  const { id } = useParams();
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await api.get(`/api/groups/${id}`);
        setGroupName(res.data.groupName);
        setGroupCode(res.data.groupCode);
      } catch {
        setError("Failed to load group.");
      }
    };
    fetchGroup();
  }, [id]);

  const validateInputs = () => {
    if (!groupName.trim()) return "Group name cannot be empty.";
    if (!groupCode.trim()) return "Group code cannot be empty.";

    const codeRegex = /^[A-Z0-9_-]+$/;
    if (!codeRegex.test(groupCode)) {
      return "Group code must be uppercase and may only contain letters, numbers, hyphens, and underscores.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await api.put(`/api/groups/${id}`, {
        groupName: groupName.trim(),
        groupCode: groupCode.trim(),
      });
      navigate("/groups/dashboard");
    } catch (err) {
      setError(err.response?.data || "Error updating group.");
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h2>Edit Group</h2>
          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Group Code</label>
              <input
                type="text"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              Update Group
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditGroup;
