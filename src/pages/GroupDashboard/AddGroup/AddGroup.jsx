import React, { useState } from "react";
import api from "../../../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../../components/Navbar";
import styles from "./AddGroup.module.css";

const AddGroup = () => {
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      toast.error(validationError);
      return;
    }

    try {
      const res = await api.post("/api/groups", {
        groupName: groupName.trim(),
        groupCode: groupCode.trim(),
      });

      toast.success(res.data || "Group added successfully");
      navigate("/groups/dashboard");
    } catch (err) {
      const message = err.response?.data || "Error adding group.";
      setError(message);
      toast.error(message);
      console.error("Add group error:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h2>Add Group</h2>
          {error && <div className={styles.error}>{error}</div>}

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
              Add Group
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddGroup;
