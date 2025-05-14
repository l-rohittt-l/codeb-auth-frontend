import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
    setError(""); // clear old error
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      const res = await axios.post(
  "https://codeb-ims.onrender.com/api/groups",
  {
    groupName: groupName.trim(),
    groupCode: groupCode.trim(),
  },
  {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}` // ✅ include JWT
    }
  }
);


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
    <div className="container mt-4">
      <h2>Add Group</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Group Name</label>
          <input
            type="text"
            className="form-control"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Group Code</label>
          <input
            type="text"
            className="form-control"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Group
        </button>
      </form>
    </div>
  );
};

export default AddGroup;
